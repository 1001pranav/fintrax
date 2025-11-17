import apiClient from './client';
import { API_ENDPOINTS } from '@constants/api';
import { ApiResponse } from '@app-types/api.types';
import { DashboardSummary, Task, Transaction } from '@app-types/models.types';

/**
 * Dashboard API Module
 * Handles dashboard-related API calls
 */
export const dashboardApi = {
  /**
   * Get dashboard summary
   * @returns Dashboard data with financial and task summaries
   */
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>(
      API_ENDPOINTS.DASHBOARD.SUMMARY
    );
    return response.data.data!;
  },

  /**
   * Get recent tasks
   * @param limit - Number of tasks to retrieve (default: 5)
   * @returns List of recent tasks
   */
  getRecentTasks: async (limit: number = 5): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      API_ENDPOINTS.DASHBOARD.RECENT_TASKS,
      {
        params: { limit },
      }
    );
    return response.data.data!;
  },

  /**
   * Get recent transactions
   * @param limit - Number of transactions to retrieve (default: 5)
   * @returns List of recent transactions
   */
  getRecentTransactions: async (limit: number = 5): Promise<Transaction[]> => {
    const response = await apiClient.get<ApiResponse<Transaction[]>>(
      API_ENDPOINTS.DASHBOARD.RECENT_TRANSACTIONS,
      {
        params: { limit },
      }
    );
    return response.data.data!;
  },
};

export default dashboardApi;
