/**
 * SQLite Database Service
 * Repository pattern for offline data storage (Singleton Pattern)
 * Uses expo-sqlite for local database operations
 */

import * as SQLite from 'expo-sqlite';
import { Task, Project, Transaction, SyncOperation } from '../../constants/types';

export class SQLiteService {
  private static instance: SQLiteService;
  private db: SQLite.SQLiteDatabase | null = null;
  private readonly DB_NAME = 'fintrax.db';

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService();
    }
    return SQLiteService.instance;
  }

  /**
   * Initialize database and create tables
   */
  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(this.DB_NAME);
      await this.createTables();
      console.log('SQLite database initialized successfully');
    } catch (error) {
      console.error('SQLite initialization error:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        dueDate TEXT,
        projectId TEXT,
        userId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0,
        localId TEXT,
        syncStatus TEXT DEFAULT 'synced'
      );
    `;

    const createProjectsTable = `
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT NOT NULL,
        userId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0,
        localId TEXT,
        syncStatus TEXT DEFAULT 'synced'
      );
    `;

    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        userId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0,
        localId TEXT,
        syncStatus TEXT DEFAULT 'synced'
      );
    `;

    const createSyncQueueTable = `
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        entity TEXT NOT NULL,
        entityId TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL,
        retryCount INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        lastAttempt TEXT,
        error TEXT
      );
    `;

    try {
      await this.db.execAsync(createTasksTable);
      await this.db.execAsync(createProjectsTable);
      await this.db.execAsync(createTransactionsTable);
      await this.db.execAsync(createSyncQueueTable);
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  /**
   * Execute a raw SQL query
   */
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.getAllAsync(sql, params);
      return result as T[];
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  /**
   * Execute a raw SQL command (INSERT, UPDATE, DELETE)
   */
  async execute(sql: string, params?: any[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync(sql, params);
    } catch (error) {
      console.error('Execute error:', error);
      throw error;
    }
  }

  /**
   * Insert a record
   */
  async insert<T extends { id: string }>(
    table: string,
    record: T
  ): Promise<void> {
    const keys = Object.keys(record);
    const values = Object.values(record).map((v) =>
      typeof v === 'object' ? JSON.stringify(v) : v
    );
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    await this.execute(sql, values);
  }

  /**
   * Update a record
   */
  async update<T extends { id: string }>(
    table: string,
    id: string,
    updates: Partial<T>
  ): Promise<void> {
    const keys = Object.keys(updates).filter((k) => k !== 'id');
    const values = keys.map((k) => {
      const value = updates[k as keyof T];
      return typeof value === 'object' ? JSON.stringify(value) : value;
    });
    const setClause = keys.map((k) => `${k} = ?`).join(', ');

    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    await this.execute(sql, [...values, id]);
  }

  /**
   * Delete a record (soft delete)
   */
  async delete(table: string, id: string): Promise<void> {
    const sql = `UPDATE ${table} SET isDeleted = 1 WHERE id = ?`;
    await this.execute(sql, [id]);
  }

  /**
   * Hard delete a record
   */
  async hardDelete(table: string, id: string): Promise<void> {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    await this.execute(sql, [id]);
  }

  /**
   * Get all records from a table
   */
  async getAll<T>(table: string, includeDeleted = false): Promise<T[]> {
    const sql = includeDeleted
      ? `SELECT * FROM ${table}`
      : `SELECT * FROM ${table} WHERE isDeleted = 0`;
    return this.query<T>(sql);
  }

  /**
   * Get a record by ID
   */
  async getById<T>(table: string, id: string): Promise<T | null> {
    const sql = `SELECT * FROM ${table} WHERE id = ? AND isDeleted = 0`;
    const results = await this.query<T>(sql, [id]);
    return results[0] || null;
  }

  /**
   * Get records by criteria
   */
  async getWhere<T>(
    table: string,
    where: Record<string, any>
  ): Promise<T[]> {
    const keys = Object.keys(where);
    const values = Object.values(where);
    const whereClause = keys.map((k) => `${k} = ?`).join(' AND ');

    const sql = `SELECT * FROM ${table} WHERE ${whereClause} AND isDeleted = 0`;
    return this.query<T>(sql, values);
  }

  /**
   * Clear all data from database (for logout)
   */
  async clearAll(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.execAsync('DELETE FROM tasks');
      await this.db.execAsync('DELETE FROM projects');
      await this.db.execAsync('DELETE FROM transactions');
      await this.db.execAsync('DELETE FROM sync_queue');
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

// Export singleton instance
export default SQLiteService.getInstance();
