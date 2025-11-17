/**
 * Projects Slice
 * Redux slice for project state management with offline support
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { projectsApi } from '../../api';
import { sqliteService, offlineManager } from '../../services';
import { Project, SyncOperationType, SyncEntity, SyncStatus } from '../../constants/types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      if (offlineManager.isConnected()) {
        const projects = await projectsApi.getProjects();
        // Save to local database
        for (const project of projects) {
          const existing = await sqliteService.getById<Project>('projects', project.id);
          if (existing) {
            await sqliteService.update('projects', project.id, project);
          } else {
            await sqliteService.insert('projects', project);
          }
        }
        return projects;
      } else {
        const projects = await sqliteService.getAll<Project>('projects');
        return projects;
      }
    } catch (error: any) {
      const projects = await sqliteService.getAll<Project>('projects');
      return projects;
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Partial<Project>, { rejectWithValue }) => {
    try {
      const localId = uuidv4();
      const project: Project = {
        id: localId,
        name: projectData.name || '',
        description: projectData.description || '',
        color: projectData.color || '#3B82F6',
        userId: projectData.userId!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        localId,
        syncStatus: SyncStatus.PENDING,
      };

      await sqliteService.insert('projects', project);
      await offlineManager.queueOperation(
        SyncOperationType.CREATE,
        SyncEntity.PROJECT,
        localId,
        projectData
      );

      return project;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (
    { id, updates }: { id: string; updates: Partial<Project> },
    { rejectWithValue }
  ) => {
    try {
      await sqliteService.update('projects', id, {
        ...updates,
        updatedAt: new Date().toISOString(),
        syncStatus: SyncStatus.PENDING,
      });

      await offlineManager.queueOperation(
        SyncOperationType.UPDATE,
        SyncEntity.PROJECT,
        id,
        updates
      );

      const project = await sqliteService.getById<Project>('projects', id);
      return project!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await sqliteService.delete('projects', id);
      await offlineManager.queueOperation(
        SyncOperationType.DELETE,
        SyncEntity.PROJECT,
        id,
        {}
      );

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete project');
    }
  }
);

// Slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projects = action.payload;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(createProject.fulfilled, (state, action) => {
      state.projects.push(action.payload);
    });

    builder.addCase(updateProject.fulfilled, (state, action) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    });

    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
