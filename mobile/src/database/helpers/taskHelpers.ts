/**
 * Task Database Helper
 * Implements Repository Pattern for Task data access
 * Provides abstraction layer over SQLite operations
 */

import { sqliteService } from '../../services/storage';
import { Task } from '../../constants/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Task Repository Interface (Repository Pattern)
 */
export interface ITaskRepository {
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  update(id: string, updates: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Task | null>;
  getAll(includeDeleted?: boolean): Promise<Task[]>;
  getByProject(projectId: string): Promise<Task[]>;
  getByStatus(status: string): Promise<Task[]>;
  search(query: string): Promise<Task[]>;
  getPending(): Promise<Task[]>;
  getSyncStatus(): Promise<{ pending: number; synced: number; failed: number }>;
}

/**
 * Task Repository Implementation
 */
export class TaskRepository implements ITaskRepository {
  private static instance: TaskRepository;
  private readonly TABLE_NAME = 'tasks';

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TaskRepository {
    if (!TaskRepository.instance) {
      TaskRepository.instance = new TaskRepository();
    }
    return TaskRepository.instance;
  }

  /**
   * Create a new task
   */
  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    // Convert task to database format
    const dbTask = this.toDbFormat(task);

    await sqliteService.insert(this.TABLE_NAME, dbTask);
    return task;
  }

  /**
   * Update an existing task
   */
  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Task not found: ${id}`);
    }

    const updated: Task = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const dbTask = this.toDbFormat(updated);
    await sqliteService.update(this.TABLE_NAME, id, dbTask);
    return updated;
  }

  /**
   * Soft delete a task
   */
  async delete(id: string): Promise<void> {
    await sqliteService.delete(this.TABLE_NAME, id);
  }

  /**
   * Get task by ID
   */
  async getById(id: string): Promise<Task | null> {
    const result = await sqliteService.getById<any>(this.TABLE_NAME, id);
    return result ? this.fromDbFormat(result) : null;
  }

  /**
   * Get all tasks
   */
  async getAll(includeDeleted = false): Promise<Task[]> {
    const results = await sqliteService.getAll<any>(this.TABLE_NAME, includeDeleted);
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get tasks by project
   */
  async getByProject(projectId: string): Promise<Task[]> {
    const results = await sqliteService.getWhere<any>(this.TABLE_NAME, {
      projectId,
    });
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get tasks by status
   */
  async getByStatus(status: string): Promise<Task[]> {
    const results = await sqliteService.getWhere<any>(this.TABLE_NAME, {
      status,
    });
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Search tasks by title or description
   */
  async search(query: string): Promise<Task[]> {
    const sql = `
      SELECT * FROM ${this.TABLE_NAME}
      WHERE isDeleted = 0
      AND (title LIKE ? OR description LIKE ?)
      ORDER BY updatedAt DESC
    `;
    const searchTerm = `%${query}%`;
    const results = await sqliteService.query<any>(sql, [searchTerm, searchTerm]);
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get tasks pending sync
   */
  async getPending(): Promise<Task[]> {
    const results = await sqliteService.getWhere<any>(this.TABLE_NAME, {
      syncStatus: 'pending',
    });
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get sync status statistics
   */
  async getSyncStatus(): Promise<{
    pending: number;
    synced: number;
    failed: number;
  }> {
    const sql = `
      SELECT
        COUNT(CASE WHEN syncStatus = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN syncStatus = 'synced' THEN 1 END) as synced,
        COUNT(CASE WHEN syncStatus = 'failed' THEN 1 END) as failed
      FROM ${this.TABLE_NAME}
      WHERE isDeleted = 0
    `;
    const results = await sqliteService.query<any>(sql);
    return results[0] || { pending: 0, synced: 0, failed: 0 };
  }

  /**
   * Mark task as synced
   */
  async markSynced(id: string, serverId?: string): Promise<void> {
    const updates: any = { syncStatus: 'synced' };
    if (serverId && id !== serverId) {
      updates.id = serverId;
      updates.localId = id;
    }
    await sqliteService.update(this.TABLE_NAME, id, updates);
  }

  /**
   * Mark task as pending sync
   */
  async markPending(id: string): Promise<void> {
    await sqliteService.update(this.TABLE_NAME, id, { syncStatus: 'pending' } as any);
  }

  /**
   * Convert task to database format
   */
  private toDbFormat(task: Task): any {
    return {
      id: task.id,
      title: task.title,
      description: task.description || null,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || null,
      projectId: task.projectId || null,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      isDeleted: 0,
      localId: task.localId || null,
      syncStatus: task.syncStatus || 'pending',
    };
  }

  /**
   * Convert database record to task
   */
  private fromDbFormat(dbTask: any): Task {
    return {
      id: dbTask.id,
      title: dbTask.title,
      description: dbTask.description,
      status: dbTask.status,
      priority: dbTask.priority,
      dueDate: dbTask.dueDate,
      projectId: dbTask.projectId,
      userId: dbTask.userId,
      createdAt: dbTask.createdAt,
      updatedAt: dbTask.updatedAt,
      localId: dbTask.localId,
      syncStatus: dbTask.syncStatus,
    };
  }
}

// Export singleton instance
export const taskRepository = TaskRepository.getInstance();
