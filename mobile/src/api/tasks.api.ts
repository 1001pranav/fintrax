import apiClient from './client';
import { API_ENDPOINTS } from '@constants/api';
import { ApiResponse } from '@app-types/api.types';
import { Task, TaskRequest } from '@app-types/models.types';

/**
 * Tasks/Todos API Module
 * Handles all task-related API calls
 */
export const tasksApi = {
  /**
   * Get all tasks
   * @param params - Optional query parameters (status, project_id, etc.)
   * @returns List of tasks
   */
  getAll: async (params?: {
    status?: number;
    project_id?: number;
    priority?: number;
  }): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(API_ENDPOINTS.TASKS.BASE, {
      params,
    });
    return response.data.data!;
  },

  /**
   * Get task by ID
   * @param id - Task ID
   * @returns Task details
   */
  getById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BY_ID(id));
    return response.data.data!;
  },

  /**
   * Create new task
   * @param task - Task data
   * @returns Created task
   */
  create: async (task: TaskRequest): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BASE, task);
    return response.data.data!;
  },

  /**
   * Update task
   * @param id - Task ID
   * @param task - Updated task data
   * @returns Updated task
   */
  update: async (id: number, task: Partial<TaskRequest>): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BY_ID(id), task);
    return response.data.data!;
  },

  /**
   * Delete task (soft delete by setting status to 5)
   * @param id - Task ID
   * @returns Success message
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.TASKS.BY_ID(id)
    );
    return response.data.data!;
  },

  /**
   * Get tasks by project ID
   * @param projectId - Project ID
   * @returns List of tasks for the project
   */
  getByProject: async (projectId: number): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      API_ENDPOINTS.TASKS.BY_PROJECT(projectId)
    );
    return response.data.data!;
  },

  /**
   * Get tasks by status
   * @param status - Task status (1=To Do, 2=In Progress, 6=Completed)
   * @returns List of tasks with the specified status
   */
  getByStatus: async (status: number): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      API_ENDPOINTS.TASKS.BY_STATUS(status)
    );
    return response.data.data!;
  },

  /**
   * Bulk update tasks
   * @param tasks - Array of task IDs and their updates
   * @returns Success message
   */
  bulkUpdate: async (
    tasks: { id: number; updates: Partial<TaskRequest> }[]
  ): Promise<{ message: string; updated_count: number }> => {
    const response = await apiClient.post<ApiResponse<{ message: string; updated_count: number }>>(
      API_ENDPOINTS.TASKS.BULK_UPDATE,
      { tasks }
    );
    return response.data.data!;
  },

  /**
   * Mark task as complete
   * @param id - Task ID
   * @returns Updated task
   */
  markComplete: async (id: number): Promise<Task> => {
    return tasksApi.update(id, { status: 6 }); // 6 = Completed
  },

  /**
   * Mark task as in progress
   * @param id - Task ID
   * @returns Updated task
   */
  markInProgress: async (id: number): Promise<Task> => {
    return tasksApi.update(id, { status: 2 }); // 2 = In Progress
  },
};

export default tasksApi;
