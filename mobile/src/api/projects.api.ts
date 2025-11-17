/**
 * Projects API
 * API endpoints for project management
 */

import apiClient from './client';
import { Project, ApiResponse } from '../constants/types';

export const projectsApi = {
  /**
   * Get all projects
   */
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return response.data.data || [];
  },

  /**
   * Get project by ID
   */
  getProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(
      `/projects/${id}`
    );
    return response.data.data!;
  },

  /**
   * Create new project
   */
  createProject: async (project: Partial<Project>): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(
      '/projects',
      project
    );
    return response.data.data!;
  },

  /**
   * Update project
   */
  updateProject: async (
    id: string,
    updates: Partial<Project>
  ): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(
      `/projects/${id}`,
      updates
    );
    return response.data.data!;
  },

  /**
   * Delete project
   */
  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};
