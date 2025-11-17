import apiClient from './client';
import { API_ENDPOINTS } from '@constants/api';
import { ApiResponse } from '@app-types/api.types';
import { Project, ProjectRequest, Task, TaskStatistics } from '@app-types/models.types';

/**
 * Projects API Module
 * Handles all project-related API calls
 */
export const projectsApi = {
  /**
   * Get all projects
   * @param params - Optional query parameters (status, etc.)
   * @returns List of projects
   */
  getAll: async (params?: { status?: number }): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>(API_ENDPOINTS.PROJECTS.BASE, {
      params,
    });
    return response.data.data!;
  },

  /**
   * Get project by ID
   * @param id - Project ID
   * @returns Project details
   */
  getById: async (id: number): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(API_ENDPOINTS.PROJECTS.BY_ID(id));
    return response.data.data!;
  },

  /**
   * Create new project
   * @param project - Project data
   * @returns Created project
   */
  create: async (project: ProjectRequest): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS.BASE,
      project
    );
    return response.data.data!;
  },

  /**
   * Update project
   * @param id - Project ID
   * @param project - Updated project data
   * @returns Updated project
   */
  update: async (id: number, project: Partial<ProjectRequest>): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS.BY_ID(id),
      project
    );
    return response.data.data!;
  },

  /**
   * Delete project
   * @param id - Project ID
   * @returns Success message
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.PROJECTS.BY_ID(id)
    );
    return response.data.data!;
  },

  /**
   * Get tasks for a project
   * @param id - Project ID
   * @returns List of tasks in the project
   */
  getTasks: async (id: number): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(API_ENDPOINTS.PROJECTS.TASKS(id));
    return response.data.data!;
  },

  /**
   * Get project statistics
   * @param id - Project ID
   * @returns Project statistics (task counts, completion %, etc.)
   */
  getStatistics: async (
    id: number
  ): Promise<TaskStatistics & { completion_percentage: number }> => {
    const response = await apiClient.get<
      ApiResponse<TaskStatistics & { completion_percentage: number }>
    >(API_ENDPOINTS.PROJECTS.STATISTICS(id));
    return response.data.data!;
  },

  /**
   * Mark project as complete
   * @param id - Project ID
   * @returns Updated project
   */
  markComplete: async (id: number): Promise<Project> => {
    return projectsApi.update(id, { status: 2 }); // 2 = Completed
  },

  /**
   * Archive project
   * @param id - Project ID
   * @returns Updated project
   */
  archive: async (id: number): Promise<Project> => {
    return projectsApi.update(id, { status: 3 }); // 3 = Archived
  },

  /**
   * Reactivate archived project
   * @param id - Project ID
   * @returns Updated project
   */
  reactivate: async (id: number): Promise<Project> => {
    return projectsApi.update(id, { status: 1 }); // 1 = Active
  },
};

export default projectsApi;
