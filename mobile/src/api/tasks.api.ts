/**
 * Tasks API
 * API endpoints for task management
 */

import apiClient from './client';
import { Task, ApiResponse } from '../constants/types';

export const tasksApi = {
  /**
   * Get all tasks
   */
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/todo');
    return response.data.data || [];
  },

  /**
   * Get task by ID
   */
  getTask: async (id: string): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(`/todo/${id}`);
    return response.data.data!;
  },

  /**
   * Create new task
   */
  createTask: async (task: Partial<Task>): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>('/todo', task);
    return response.data.data!;
  },

  /**
   * Update task
   */
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/todo/${id}`,
      updates
    );
    return response.data.data!;
  },

  /**
   * Delete task
   */
  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/todo/${id}`);
  },
};
