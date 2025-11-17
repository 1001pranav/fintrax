import apiClient from './client';
import { API_ENDPOINTS } from '@constants/api';
import { ApiResponse } from '@app-types/api.types';
import {
  Transaction,
  TransactionRequest,
  Savings,
  Loan,
  FinancialSummary,
} from '@app-types/models.types';

/**
 * Finance API Module
 * Handles all finance-related API calls (transactions, savings, loans)
 */
export const financeApi = {
  /**
   * TRANSACTIONS
   */
  transactions: {
    /**
     * Get all transactions
     * @param params - Optional query parameters (type, date_range, etc.)
     * @returns List of transactions
     */
    getAll: async (params?: {
      type?: number;
      start_date?: string;
      end_date?: string;
      category?: string;
    }): Promise<Transaction[]> => {
      const response = await apiClient.get<ApiResponse<Transaction[]>>(
        API_ENDPOINTS.TRANSACTIONS.BASE,
        { params }
      );
      return response.data.data!;
    },

    /**
     * Get transaction by ID
     * @param id - Transaction ID
     * @returns Transaction details
     */
    getById: async (id: number): Promise<Transaction> => {
      const response = await apiClient.get<ApiResponse<Transaction>>(
        API_ENDPOINTS.TRANSACTIONS.BY_ID(id)
      );
      return response.data.data!;
    },

    /**
     * Create new transaction
     * @param transaction - Transaction data
     * @returns Created transaction
     */
    create: async (transaction: TransactionRequest): Promise<Transaction> => {
      const response = await apiClient.post<ApiResponse<Transaction>>(
        API_ENDPOINTS.TRANSACTIONS.BASE,
        transaction
      );
      return response.data.data!;
    },

    /**
     * Update transaction
     * @param id - Transaction ID
     * @param transaction - Updated transaction data
     * @returns Updated transaction
     */
    update: async (id: number, transaction: Partial<TransactionRequest>): Promise<Transaction> => {
      const response = await apiClient.patch<ApiResponse<Transaction>>(
        API_ENDPOINTS.TRANSACTIONS.BY_ID(id),
        transaction
      );
      return response.data.data!;
    },

    /**
     * Delete transaction
     * @param id - Transaction ID
     * @returns Success message
     */
    delete: async (id: number): Promise<{ message: string }> => {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.TRANSACTIONS.BY_ID(id)
      );
      return response.data.data!;
    },

    /**
     * Get transactions by type
     * @param type - Transaction type (1=Income, 2=Expense)
     * @returns List of transactions
     */
    getByType: async (type: number): Promise<Transaction[]> => {
      const response = await apiClient.get<ApiResponse<Transaction[]>>(
        API_ENDPOINTS.TRANSACTIONS.BY_TYPE(type)
      );
      return response.data.data!;
    },

    /**
     * Get transactions by date range
     * @param startDate - Start date (YYYY-MM-DD)
     * @param endDate - End date (YYYY-MM-DD)
     * @returns List of transactions
     */
    getByDateRange: async (startDate: string, endDate: string): Promise<Transaction[]> => {
      const response = await apiClient.get<ApiResponse<Transaction[]>>(
        API_ENDPOINTS.TRANSACTIONS.BY_DATE_RANGE,
        {
          params: { start_date: startDate, end_date: endDate },
        }
      );
      return response.data.data!;
    },

    /**
     * Get transaction summary
     * @param params - Optional parameters (month, year)
     * @returns Financial summary
     */
    getSummary: async (params?: { month?: number; year?: number }): Promise<FinancialSummary> => {
      const response = await apiClient.get<ApiResponse<FinancialSummary>>(
        API_ENDPOINTS.TRANSACTIONS.SUMMARY,
        { params }
      );
      return response.data.data!;
    },
  },

  /**
   * SAVINGS
   */
  savings: {
    /**
     * Get all savings
     * @returns List of savings
     */
    getAll: async (): Promise<Savings[]> => {
      const response = await apiClient.get<ApiResponse<Savings[]>>(API_ENDPOINTS.SAVINGS.BASE);
      return response.data.data!;
    },

    /**
     * Get saving by ID
     * @param id - Saving ID
     * @returns Saving details
     */
    getById: async (id: number): Promise<Savings> => {
      const response = await apiClient.get<ApiResponse<Savings>>(API_ENDPOINTS.SAVINGS.BY_ID(id));
      return response.data.data!;
    },

    /**
     * Create new saving
     * @param saving - Saving data
     * @returns Created saving
     */
    create: async (
      saving: Omit<Savings, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ): Promise<Savings> => {
      const response = await apiClient.post<ApiResponse<Savings>>(
        API_ENDPOINTS.SAVINGS.BASE,
        saving
      );
      return response.data.data!;
    },

    /**
     * Update saving
     * @param id - Saving ID
     * @param saving - Updated saving data
     * @returns Updated saving
     */
    update: async (
      id: number,
      saving: Partial<Omit<Savings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
    ): Promise<Savings> => {
      const response = await apiClient.patch<ApiResponse<Savings>>(
        API_ENDPOINTS.SAVINGS.BY_ID(id),
        saving
      );
      return response.data.data!;
    },

    /**
     * Delete saving
     * @param id - Saving ID
     * @returns Success message
     */
    delete: async (id: number): Promise<{ message: string }> => {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.SAVINGS.BY_ID(id)
      );
      return response.data.data!;
    },
  },

  /**
   * LOANS
   */
  loans: {
    /**
     * Get all loans
     * @returns List of loans
     */
    getAll: async (): Promise<Loan[]> => {
      const response = await apiClient.get<ApiResponse<Loan[]>>(API_ENDPOINTS.LOANS.BASE);
      return response.data.data!;
    },

    /**
     * Get loan by ID
     * @param id - Loan ID
     * @returns Loan details
     */
    getById: async (id: number): Promise<Loan> => {
      const response = await apiClient.get<ApiResponse<Loan>>(API_ENDPOINTS.LOANS.BY_ID(id));
      return response.data.data!;
    },

    /**
     * Create new loan
     * @param loan - Loan data
     * @returns Created loan
     */
    create: async (
      loan: Omit<Loan, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ): Promise<Loan> => {
      const response = await apiClient.post<ApiResponse<Loan>>(API_ENDPOINTS.LOANS.BASE, loan);
      return response.data.data!;
    },

    /**
     * Update loan
     * @param id - Loan ID
     * @param loan - Updated loan data
     * @returns Updated loan
     */
    update: async (
      id: number,
      loan: Partial<Omit<Loan, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
    ): Promise<Loan> => {
      const response = await apiClient.patch<ApiResponse<Loan>>(
        API_ENDPOINTS.LOANS.BY_ID(id),
        loan
      );
      return response.data.data!;
    },

    /**
     * Delete loan
     * @param id - Loan ID
     * @returns Success message
     */
    delete: async (id: number): Promise<{ message: string }> => {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.LOANS.BY_ID(id)
      );
      return response.data.data!;
    },

    /**
     * Get loan payments
     * @param id - Loan ID
     * @returns List of loan payments
     */
    getPayments: async (id: number): Promise<unknown[]> => {
      const response = await apiClient.get<ApiResponse<unknown[]>>(
        API_ENDPOINTS.LOANS.PAYMENTS(id)
      );
      return response.data.data!;
    },
  },
};

export default financeApi;
