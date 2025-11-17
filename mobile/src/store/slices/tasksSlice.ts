/**
 * Tasks Slice
 * Redux slice for task state management with offline support
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tasksApi } from '../../api';
import { sqliteService, offlineManager } from '../../services';
import { Task, SyncOperationType, SyncEntity, SyncStatus } from '../../constants/types';
import { v4 as uuidv4 } from 'uuid';

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

// Async Thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      // Try to fetch from server
      if (offlineManager.isConnected()) {
        const tasks = await tasksApi.getTasks();
        // Save to local database
        for (const task of tasks) {
          const existing = await sqliteService.getById<Task>('tasks', task.id);
          if (existing) {
            await sqliteService.update('tasks', task.id, task);
          } else {
            await sqliteService.insert('tasks', task);
          }
        }
        return tasks;
      } else {
        // Fetch from local database
        const tasks = await sqliteService.getAll<Task>('tasks');
        return tasks;
      }
    } catch (error: any) {
      // Fallback to local database on error
      const tasks = await sqliteService.getAll<Task>('tasks');
      return tasks;
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const localId = uuidv4();
      const task: Task = {
        id: localId,
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status!,
        priority: taskData.priority!,
        dueDate: taskData.dueDate,
        projectId: taskData.projectId,
        userId: taskData.userId!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        localId,
        syncStatus: SyncStatus.PENDING,
      };

      // Save to local database
      await sqliteService.insert('tasks', task);

      // Queue for sync
      await offlineManager.queueOperation(
        SyncOperationType.CREATE,
        SyncEntity.TASK,
        localId,
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
  async (
    { id, updates }: { id: string; updates: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      // Update local database
      await sqliteService.update('tasks', id, {
        ...updates,
        updatedAt: new Date().toISOString(),
        syncStatus: SyncStatus.PENDING,
      });

      // Queue for sync
      await offlineManager.queueOperation(
        SyncOperationType.UPDATE,
        SyncEntity.TASK,
        id,
        updates
      );

      // Get updated task
      const task = await sqliteService.getById<Task>('tasks', id);
      return task!;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      // Soft delete in local database
      await sqliteService.delete('tasks', id);

      // Queue for sync
      await offlineManager.queueOperation(
        SyncOperationType.DELETE,
        SyncEntity.TASK,
        id,
        {}
      );

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
