/**
 * Finance API
 * API endpoints for financial management
 */

import apiClient from './client';
import { Transaction, Savings, Loan, FinanceSummary, ApiResponse } from '../constants/types';

export const financeApi = {
  /**
   * Get financial dashboard summary
   */
  getDashboard: async (): Promise<FinanceSummary> => {
    const response = await apiClient.get<ApiResponse<FinanceSummary>>('/dashboard');
    return response.data.data!;
  },

  /**
   * Get all transactions
   */
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/transactions');
    return response.data.data || [];
  },

  /**
   * Create new transaction
   */
  createTransaction: async (transaction: Partial<Transaction>): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<Transaction>>('/transactions', transaction);
    return response.data.data!;
  },

  /**
   * Update transaction
   */
  updateTransaction: async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
    const response = await apiClient.patch<ApiResponse<Transaction>>(
      `/transactions/${id}`,
      updates
    );
    return response.data.data!;
  },

  /**
   * Delete transaction
   */
  deleteTransaction: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  /**
   * Get all savings
   */
  getSavings: async (): Promise<Savings[]> => {
    const response = await apiClient.get<ApiResponse<Savings[]>>('/savings');
    return response.data.data || [];
  },

  /**
   * Get all loans
   */
  getLoans: async (): Promise<Loan[]> => {
    const response = await apiClient.get<ApiResponse<Loan[]>>('/loans');
    return response.data.data || [];
  },
};
