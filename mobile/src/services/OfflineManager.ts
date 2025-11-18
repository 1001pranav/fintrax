/**
 * Offline Manager
 * Manages offline data synchronization using Command Pattern and Strategy Pattern
 * Singleton Pattern for single instance
 */

import { v4 as uuidv4 } from 'uuid';
import NetInfo from '@react-native-community/netinfo';
import { sqliteService, asyncStorage } from './storage';
import { apiClient } from '../api';
import {
  SyncOperation,
  SyncOperationType,
  SyncEntity,
  SyncStatus,
} from '../constants/types';
import { config } from '../constants/config';

/**
 * Sync Strategy Interface (Strategy Pattern)
 */
interface ISyncStrategy {
  execute(operation: SyncOperation): Promise<void>;
}

/**
 * Create Entity Strategy
 */
class CreateStrategy implements ISyncStrategy {
  async execute(operation: SyncOperation): Promise<void> {
    const endpoint = this.getEndpoint(operation.entity);
    await apiClient.post(endpoint, operation.payload);
  }

  private getEndpoint(entity: SyncEntity): string {
    const endpoints: Record<SyncEntity, string> = {
      [SyncEntity.TASK]: '/todo',
      [SyncEntity.PROJECT]: '/projects',
      [SyncEntity.TRANSACTION]: '/transactions',
    };
    return endpoints[entity];
  }
}

/**
 * Update Entity Strategy
 */
class UpdateStrategy implements ISyncStrategy {
  async execute(operation: SyncOperation): Promise<void> {
    const endpoint = this.getEndpoint(operation.entity, operation.entityId);
    await apiClient.patch(endpoint, operation.payload);
  }

  private getEndpoint(entity: SyncEntity, id: string): string {
    const endpoints: Record<SyncEntity, string> = {
      [SyncEntity.TASK]: `/todo/${id}`,
      [SyncEntity.PROJECT]: `/projects/${id}`,
      [SyncEntity.TRANSACTION]: `/transactions/${id}`,
    };
    return endpoints[entity];
  }
}

/**
 * Delete Entity Strategy
 */
class DeleteStrategy implements ISyncStrategy {
  async execute(operation: SyncOperation): Promise<void> {
    const endpoint = this.getEndpoint(operation.entity, operation.entityId);
    await apiClient.delete(endpoint);
  }

  private getEndpoint(entity: SyncEntity, id: string): string {
    const endpoints: Record<SyncEntity, string> = {
      [SyncEntity.TASK]: `/todo/${id}`,
      [SyncEntity.PROJECT]: `/projects/${id}`,
      [SyncEntity.TRANSACTION]: `/transactions/${id}`,
    };
    return endpoints[entity];
  }
}

/**
 * Offline Manager Class
 */
export class OfflineManager {
  private static instance: OfflineManager;
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private syncStrategies: Map<SyncOperationType, ISyncStrategy>;

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {
    // Initialize sync strategies (Strategy Pattern)
    this.syncStrategies = new Map<SyncOperationType, ISyncStrategy>([
      [SyncOperationType.CREATE, new CreateStrategy()],
      [SyncOperationType.UPDATE, new UpdateStrategy()],
      [SyncOperationType.DELETE, new DeleteStrategy()],
    ] as const);

    // Monitor network connectivity
    this.initializeNetworkMonitoring();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  /**
   * Initialize network monitoring
   */
  private initializeNetworkMonitoring(): void {
    NetInfo.addEventListener((state) => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected && state.isInternetReachable || false;

      // If we just came online, trigger sync
      if (!wasOnline && this.isOnline) {
        this.syncAll();
      }
    });
  }

  /**
   * Queue a sync operation (Command Pattern)
   */
  async queueOperation(
    type: SyncOperationType,
    entity: SyncEntity,
    entityId: string,
    payload: any
  ): Promise<void> {
    const operation: SyncOperation = {
      id: uuidv4(),
      type,
      entity,
      entityId,
      payload,
      status: SyncStatus.PENDING,
      retryCount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save to SQLite sync queue
      await sqliteService.insert('sync_queue', operation);

      // If online, try to sync immediately
      if (this.isOnline) {
        await this.syncOperation(operation);
      }
    } catch (error) {
      console.error('Error queuing operation:', error);
      throw error;
    }
  }

  /**
   * Sync a single operation with exponential backoff (US-4.2)
   */
  private async syncOperation(operation: SyncOperation): Promise<boolean> {
    const strategy = this.syncStrategies.get(operation.type);
    if (!strategy) {
      console.error(`No strategy found for operation type: ${operation.type}`);
      return false;
    }

    // Check if we should retry based on exponential backoff
    if (operation.lastAttempt && operation.retryCount > 0) {
      const backoffMs = this.calculateBackoff(operation.retryCount);
      const timeSinceLastAttempt =
        Date.now() - new Date(operation.lastAttempt).getTime();

      if (timeSinceLastAttempt < backoffMs) {
        // Too soon to retry, skip this operation
        return false;
      }
    }

    try {
      // Execute the sync strategy
      await strategy.execute(operation);

      // Mark as synced
      await sqliteService.update('sync_queue', operation.id, {
        status: SyncStatus.SYNCED,
      } as any);

      // Remove from queue (hard delete)
      await sqliteService.hardDelete('sync_queue', operation.id);

      // Update local entity sync status
      await this.updateLocalEntitySyncStatus(
        operation.entity,
        operation.entityId,
        'synced'
      );

      return true;
    } catch (error: any) {
      console.error(`Error syncing operation ${operation.id}:`, error);

      // Update retry count and status
      const newRetryCount = operation.retryCount + 1;
      const newStatus =
        newRetryCount >= config.SYNC.MAX_RETRIES
          ? SyncStatus.FAILED
          : SyncStatus.PENDING;

      await sqliteService.update('sync_queue', operation.id, {
        status: newStatus,
        retryCount: newRetryCount,
        lastAttempt: new Date().toISOString(),
        error: error.message,
      } as any);

      // Update local entity sync status
      if (newStatus === SyncStatus.FAILED) {
        await this.updateLocalEntitySyncStatus(
          operation.entity,
          operation.entityId,
          'failed'
        );
      }

      return false;
    }
  }

  /**
   * Calculate exponential backoff delay (US-4.2)
   * Returns delay in milliseconds
   */
  private calculateBackoff(retryCount: number): number {
    // Exponential backoff: 2^retryCount * base delay
    const baseDelayMs = 2000; // 2 seconds
    const maxDelayMs = 60000; // 60 seconds max
    const delayMs = Math.min(
      baseDelayMs * Math.pow(2, retryCount - 1),
      maxDelayMs
    );
    return delayMs;
  }

  /**
   * Update local entity sync status (US-4.2)
   */
  private async updateLocalEntitySyncStatus(
    entity: string,
    entityId: string,
    status: string
  ): Promise<void> {
    try {
      const table = entity.toLowerCase() + 's'; // e.g., 'task' -> 'tasks'
      await sqliteService.update(table, entityId, { syncStatus: status } as any);
    } catch (error) {
      console.error('Error updating local entity sync status:', error);
    }
  }

  /**
   * Sync all pending operations
   */
  async syncAll(): Promise<void> {
    if (this.isSyncing || !this.isOnline) {
      return;
    }

    this.isSyncing = true;

    try {
      // Get all pending operations
      const operations = await sqliteService.getWhere<SyncOperation>(
        'sync_queue',
        { status: SyncStatus.PENDING }
      );

      console.log(`Syncing ${operations.length} pending operations...`);

      // Process in batches
      const batchSize = config.SYNC.BATCH_SIZE;
      for (let i = 0; i < operations.length; i += batchSize) {
        const batch = operations.slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map((operation) => this.syncOperation(operation))
        );
      }

      // Update last sync time
      await asyncStorage.set(
        config.STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Get pending operations count
   */
  async getPendingCount(): Promise<number> {
    const operations = await sqliteService.getWhere<SyncOperation>(
      'sync_queue',
      { status: SyncStatus.PENDING }
    );
    return operations.length;
  }

  /**
   * Get failed operations
   */
  async getFailedOperations(): Promise<SyncOperation[]> {
    return await sqliteService.getWhere<SyncOperation>('sync_queue', {
      status: SyncStatus.FAILED,
    });
  }

  /**
   * Retry failed operations
   */
  async retryFailed(): Promise<void> {
    const failedOps = await this.getFailedOperations();

    for (const op of failedOps) {
      // Reset retry count and status
      await sqliteService.update('sync_queue', op.id, {
        status: SyncStatus.PENDING,
        retryCount: 0,
        error: null,
      } as any);
    }

    // Trigger sync
    await this.syncAll();
  }

  /**
   * Clear sync queue
   */
  async clearQueue(): Promise<void> {
    await sqliteService.execute('DELETE FROM sync_queue');
  }

  /**
   * Check if online
   */
  isConnected(): boolean {
    return this.isOnline;
  }

  /**
   * Get last sync time
   */
  async getLastSyncTime(): Promise<string | null> {
    return await asyncStorage.get<string>(config.STORAGE_KEYS.LAST_SYNC);
  }
}

// Export singleton instance
export default OfflineManager.getInstance();
