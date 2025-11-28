/**
 * Tasks Slice (US-4.3)
 * Redux slice for task state management with offline support
 * Uses Repository Pattern for data access abstraction
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tasksApi } from '../../api';
import { offlineManager } from '../../services';
import { taskRepository } from '../../database/helpers';
import { Task, SyncOperationType, SyncEntity, SyncStatus } from '../../constants/types';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
}

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
  lastSync: null,
};

// Async Thunks (US-4.3 - Enhanced with Repository Pattern)
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    // Always load from local database first (offline-first)
    const localTasks = await taskRepository.getAll();

    // If online, fetch from server and update local database
    if (offlineManager.isConnected()) {
      try {
        const serverTasks = await tasksApi.getTasks();

        // Update local database with server data
        for (const serverTask of serverTasks) {
          const existing = await taskRepository.getById(serverTask.id);
          if (existing) {
            await taskRepository.update(serverTask.id, {
              ...serverTask,
              syncStatus: SyncStatus.SYNCED,
            });
          } else {
            // Insert new task from server
            await taskRepository.create({
              ...serverTask,
              syncStatus: SyncStatus.SYNCED,
            });
          }
        }

        // Return updated local tasks
        return await taskRepository.getAll();
      } catch (serverError) {
        console.warn('Server fetch failed, using local data:', serverError);
        // Return local tasks if server fetch fails
        return localTasks;
      }
    }

    // Return local tasks if offline
    return localTasks;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch tasks');
  }
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      // Create task using repository (US-4.3)
      const task = await taskRepository.create({
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status!,
        priority: taskData.priority!,
        dueDate: taskData.dueDate,
        projectId: taskData.projectId,
        userId: taskData.userId!,
        syncStatus: SyncStatus.PENDING,
      });

      // Queue for sync
      await offlineManager.queueOperation(
        SyncOperationType.CREATE,
        SyncEntity.TASK,
        task.id,
        taskData
      );

      return task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }, { rejectWithValue }) => {
    try {
      // Update using repository (US-4.3)
      const task = await taskRepository.update(id, {
        ...updates,
        syncStatus: SyncStatus.PENDING,
      });

      // Queue for sync
      await offlineManager.queueOperation(SyncOperationType.UPDATE, SyncEntity.TASK, id, updates);

      return task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      // Soft delete using repository (US-4.3)
      await taskRepository.delete(id);

      // Queue for sync
      await offlineManager.queueOperation(SyncOperationType.DELETE, SyncEntity.TASK, id, {});

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks = action.payload;
      state.lastSync = new Date().toISOString();
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Task
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    });

    // Update Task
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });

    // Delete Task
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    });
  },
});

export const { clearError, addTask, removeTask, setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
