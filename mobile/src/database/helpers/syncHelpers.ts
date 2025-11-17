/**
 * Sync Queue Database Helper
 * Implements Repository Pattern for Sync Queue operations
 * Manages offline sync operations with Command Pattern
 */

import { sqliteService } from '../../services/storage';
import { SyncOperation, SyncStatus, SyncOperationType } from '../../constants/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Sync Repository Interface (Repository Pattern)
 */
export interface ISyncRepository {
  enqueue(
    type: SyncOperationType,
    entity: string,
    entityId: string,
    payload: any
  ): Promise<SyncOperation>;
  dequeue(id: string): Promise<void>;
  update(id: string, updates: Partial<SyncOperation>): Promise<void>;
  getPending(): Promise<SyncOperation[]>;
  getFailed(): Promise<SyncOperation[]>;
  getAll(): Promise<SyncOperation[]>;
  clearCompleted(): Promise<void>;
  clearAll(): Promise<void>;
  getQueueStats(): Promise<{
    pending: number;
    synced: number;
    failed: number;
    total: number;
  }>;
}

/**
 * Sync Repository Implementation
 */
export class SyncRepository implements ISyncRepository {
  private static instance: SyncRepository;
  private readonly TABLE_NAME = 'sync_queue';

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): SyncRepository {
    if (!SyncRepository.instance) {
      SyncRepository.instance = new SyncRepository();
    }
    return SyncRepository.instance;
  }

  /**
   * Enqueue a sync operation (Command Pattern)
   */
  async enqueue(
    type: SyncOperationType,
    entity: string,
    entityId: string,
    payload: any
  ): Promise<SyncOperation> {
    const operation: SyncOperation = {
      id: uuidv4(),
      type,
      entity,
      entityId,
      payload: JSON.stringify(payload),
      status: SyncStatus.PENDING,
      retryCount: 0,
      createdAt: new Date().toISOString(),
    };

    await sqliteService.insert(this.TABLE_NAME, operation);
    return operation;
  }

  /**
   * Dequeue (remove) a sync operation
   */
  async dequeue(id: string): Promise<void> {
    await sqliteService.hardDelete(this.TABLE_NAME, id);
  }

  /**
   * Update sync operation
   */
  async update(id: string, updates: Partial<SyncOperation>): Promise<void> {
    await sqliteService.update(this.TABLE_NAME, id, updates);
  }

  /**
   * Get all pending operations
   */
  async getPending(): Promise<SyncOperation[]> {
    const sql = `
      SELECT * FROM ${this.TABLE_NAME}
      WHERE status = ?
      ORDER BY createdAt ASC
    `;
    const results = await sqliteService.query<any>(sql, [SyncStatus.PENDING]);
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get all failed operations
   */
  async getFailed(): Promise<SyncOperation[]> {
    const sql = `
      SELECT * FROM ${this.TABLE_NAME}
      WHERE status = ?
      ORDER BY createdAt DESC
    `;
    const results = await sqliteService.query<any>(sql, [SyncStatus.FAILED]);
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get all operations
   */
  async getAll(): Promise<SyncOperation[]> {
    const sql = `SELECT * FROM ${this.TABLE_NAME} ORDER BY createdAt DESC`;
    const results = await sqliteService.query<any>(sql);
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Clear completed operations
   */
  async clearCompleted(): Promise<void> {
    const sql = `DELETE FROM ${this.TABLE_NAME} WHERE status = ?`;
    await sqliteService.execute(sql, [SyncStatus.SYNCED]);
  }

  /**
   * Clear all operations
   */
  async clearAll(): Promise<void> {
    await sqliteService.execute(`DELETE FROM ${this.TABLE_NAME}`);
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<{
    pending: number;
    synced: number;
    failed: number;
    total: number;
  }> {
    const sql = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = ? THEN 1 END) as pending,
        COUNT(CASE WHEN status = ? THEN 1 END) as synced,
        COUNT(CASE WHEN status = ? THEN 1 END) as failed
      FROM ${this.TABLE_NAME}
    `;
    const results = await sqliteService.query<any>(sql, [
      SyncStatus.PENDING,
      SyncStatus.SYNCED,
      SyncStatus.FAILED,
    ]);
    return (
      results[0] || { pending: 0, synced: 0, failed: 0, total: 0 }
    );
  }

  /**
   * Mark operation as synced
   */
  async markSynced(id: string): Promise<void> {
    await this.update(id, { status: SyncStatus.SYNCED });
  }

  /**
   * Mark operation as failed
   */
  async markFailed(id: string, error: string): Promise<void> {
    await this.update(id, {
      status: SyncStatus.FAILED,
      error,
      lastAttempt: new Date().toISOString(),
    });
  }

  /**
   * Increment retry count
   */
  async incrementRetry(id: string): Promise<number> {
    const operation = await this.getById(id);
    if (!operation) throw new Error(`Sync operation not found: ${id}`);

    const newRetryCount = (operation.retryCount || 0) + 1;
    await this.update(id, {
      retryCount: newRetryCount,
      lastAttempt: new Date().toISOString(),
    });
    return newRetryCount;
  }

  /**
   * Get operation by ID
   */
  private async getById(id: string): Promise<SyncOperation | null> {
    const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE id = ?`;
    const results = await sqliteService.query<any>(sql, [id]);
    return results[0] ? this.fromDbFormat(results[0]) : null;
  }

  /**
   * Convert database record to sync operation
   */
  private fromDbFormat(dbOperation: any): SyncOperation {
    return {
      id: dbOperation.id,
      type: dbOperation.type,
      entity: dbOperation.entity,
      entityId: dbOperation.entityId,
      payload: dbOperation.payload,
      status: dbOperation.status,
      retryCount: dbOperation.retryCount || 0,
      createdAt: dbOperation.createdAt,
      lastAttempt: dbOperation.lastAttempt,
      error: dbOperation.error,
    };
  }
}

// Export singleton instance
export const syncRepository = SyncRepository.getInstance();
