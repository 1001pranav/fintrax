/**
 * Transaction Database Helper
 * Implements Repository Pattern for Transaction data access
 * Provides abstraction layer over SQLite operations
 */

import { sqliteService } from '../../services/storage';
import { Transaction } from '../../constants/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Transaction Repository Interface (Repository Pattern)
 */
export interface ITransactionRepository {
  create(
    transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction>;
  update(id: string, updates: Partial<Transaction>): Promise<Transaction>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Transaction | null>;
  getAll(includeDeleted?: boolean): Promise<Transaction[]>;
  getByType(type: string): Promise<Transaction[]>;
  getByCategory(category: string): Promise<Transaction[]>;
  getByDateRange(startDate: string, endDate: string): Promise<Transaction[]>;
  search(query: string): Promise<Transaction[]>;
  getPending(): Promise<Transaction[]>;
  calculateBalance(): Promise<number>;
}

/**
 * Transaction Repository Implementation
 */
export class TransactionRepository implements ITransactionRepository {
  private static instance: TransactionRepository;
  private readonly TABLE_NAME = 'transactions';

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TransactionRepository {
    if (!TransactionRepository.instance) {
      TransactionRepository.instance = new TransactionRepository();
    }
    return TransactionRepository.instance;
  }

  /**
   * Create a new transaction
   */
  async create(
    transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> {
    const now = new Date().toISOString();
    const transaction: Transaction = {
      ...transactionData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    const dbTransaction = this.toDbFormat(transaction);
    await sqliteService.insert(this.TABLE_NAME, dbTransaction);
    return transaction;
  }

  /**
   * Update an existing transaction
   */
  async update(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Transaction not found: ${id}`);
    }

    const updated: Transaction = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const dbTransaction = this.toDbFormat(updated);
    await sqliteService.update(this.TABLE_NAME, id, dbTransaction);
    return updated;
  }

  /**
   * Soft delete a transaction
   */
  async delete(id: string): Promise<void> {
    await sqliteService.delete(this.TABLE_NAME, id);
  }

  /**
   * Get transaction by ID
   */
  async getById(id: string): Promise<Transaction | null> {
    const result = await sqliteService.getById<any>(this.TABLE_NAME, id);
    return result ? this.fromDbFormat(result) : null;
  }

  /**
   * Get all transactions
   */
  async getAll(includeDeleted = false): Promise<Transaction[]> {
    const results = await sqliteService.getAll<any>(
      this.TABLE_NAME,
      includeDeleted
    );
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get transactions by type (income/expense)
   */
  async getByType(type: string): Promise<Transaction[]> {
    const results = await sqliteService.getWhere<any>(this.TABLE_NAME, {
      type,
    });
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get transactions by category
   */
  async getByCategory(category: string): Promise<Transaction[]> {
    const results = await sqliteService.getWhere<any>(this.TABLE_NAME, {
      category,
    });
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get transactions within date range
   */
  async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    const sql = `
      SELECT * FROM ${this.TABLE_NAME}
      WHERE isDeleted = 0
      AND date >= ?
      AND date <= ?
      ORDER BY date DESC
    `;
    const results = await sqliteService.query<any>(sql, [startDate, endDate]);
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Search transactions by description
   */
  async search(query: string): Promise<Transaction[]> {
    const sql = `
      SELECT * FROM ${this.TABLE_NAME}
      WHERE isDeleted = 0
      AND (description LIKE ? OR category LIKE ?)
      ORDER BY date DESC
    `;
    const searchTerm = `%${query}%`;
    const results = await sqliteService.query<any>(sql, [
      searchTerm,
      searchTerm,
    ]);
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Get transactions pending sync
   */
  async getPending(): Promise<Transaction[]> {
    const results = await sqliteService.getWhere<any>(this.TABLE_NAME, {
      syncStatus: 'pending',
    });
    return results.map((r) => this.fromDbFormat(r));
  }

  /**
   * Calculate total balance
   */
  async calculateBalance(): Promise<number> {
    const sql = `
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense
      FROM ${this.TABLE_NAME}
      WHERE isDeleted = 0
    `;
    const results = await sqliteService.query<any>(sql);
    const { totalIncome = 0, totalExpense = 0 } = results[0] || {};
    return totalIncome - totalExpense;
  }

  /**
   * Mark transaction as synced
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
   * Mark transaction as pending sync
   */
  async markPending(id: string): Promise<void> {
    await sqliteService.update(this.TABLE_NAME, id, {
      syncStatus: 'pending',
    });
  }

  /**
   * Convert transaction to database format
   */
  private toDbFormat(transaction: Transaction): any {
    return {
      id: transaction.id,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || null,
      type: transaction.type,
      date: transaction.date,
      userId: transaction.userId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      isDeleted: 0,
      localId: transaction.localId || null,
      syncStatus: transaction.syncStatus || 'pending',
    };
  }

  /**
   * Convert database record to transaction
   */
  private fromDbFormat(dbTransaction: any): Transaction {
    return {
      id: dbTransaction.id,
      amount: dbTransaction.amount,
      category: dbTransaction.category,
      description: dbTransaction.description,
      type: dbTransaction.type,
      date: dbTransaction.date,
      userId: dbTransaction.userId,
      createdAt: dbTransaction.createdAt,
      updatedAt: dbTransaction.updatedAt,
      localId: dbTransaction.localId,
      syncStatus: dbTransaction.syncStatus,
    };
  }
}

// Export singleton instance
export const transactionRepository = TransactionRepository.getInstance();
