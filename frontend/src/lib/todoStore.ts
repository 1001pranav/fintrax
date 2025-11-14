'use client';

import { create } from 'zustand';
import { api, Todo, CreateTodoData } from './api';
import { Task, Tags } from '@/constants/interfaces';

/**
 * Priority mapping between frontend and backend
 * Frontend: 'low' | 'medium' | 'high'
 * Backend: 0-5 (numbers)
 */
const PRIORITY_TO_NUMBER: Record<Task['priority'], number> = {
  low: 1,
  medium: 3,
  high: 5,
};

const NUMBER_TO_PRIORITY: Record<number, Task['priority']> = {
  0: 'low',
  1: 'low',
  2: 'medium',
  3: 'medium',
  4: 'high',
  5: 'high',
};

/**
 * Status mapping between frontend and backend
 * Frontend: 'todo' | 'in-progress' | 'done'
 * Backend: 1-6 (numbers)
 * 1 = Todo, 2 = In Progress, 3 = Done, 4 = Blocked, 5 = Review, 6 = Cancelled
 */
const STATUS_TO_NUMBER: Record<Task['status'], number> = {
  todo: 1,
  'in-progress': 2,
  done: 3,
};

const NUMBER_TO_STATUS: Record<number, Task['status']> = {
  1: 'todo',
  2: 'in-progress',
  3: 'done',
  4: 'todo', // Blocked → todo
  5: 'in-progress', // Review → in-progress
  6: 'done', // Cancelled → done
};

/**
 * Convert backend Todo to frontend Task
 */
const convertTodoToTask = (todo: Todo): Task => ({
  id: todo.task_id.toString(),
  title: todo.title,
  description: todo.description,
  startDate: todo.start_date ? new Date(todo.start_date) : undefined,
  endDate: todo.end_date ? new Date(todo.end_date) : undefined,
  tags: [], // Tags will be fetched separately in US-2.7
  priority: NUMBER_TO_PRIORITY[todo.priority] || 'medium',
  status: NUMBER_TO_STATUS[todo.status] || 'todo',
  projectId: todo.project_id?.toString() || '',
  createdDate: new Date(), // Backend doesn't return created date
  parentTaskId: todo.parent_id?.toString(),
});

/**
 * Convert frontend Task to backend CreateTodoData
 */
const convertTaskToTodoData = (task: Omit<Task, 'id' | 'createdDate'> | Partial<Task>): Partial<CreateTodoData> => {
  const data: Partial<CreateTodoData> = {};

  if (task.title !== undefined) data.title = task.title;
  if (task.description !== undefined) data.description = task.description;
  if (task.priority !== undefined) data.priority = PRIORITY_TO_NUMBER[task.priority];
  if (task.status !== undefined) data.status = STATUS_TO_NUMBER[task.status];
  if (task.startDate !== undefined) data.start_date = task.startDate.toISOString().split('T')[0];
  if (task.endDate !== undefined) data.end_date = task.endDate.toISOString().split('T')[0];
  if (task.projectId !== undefined && task.projectId) data.project_id = parseInt(task.projectId);
  if (task.parentTaskId !== undefined && task.parentTaskId) data.parent_id = parseInt(task.parentTaskId);

  return data;
};

/**
 * TodoStore interface
 */
interface TodoStore {
  // State
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  selectedTask: Task | null;

  // Actions
  fetchTodos: (projectId?: number) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdDate'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: Task['status']) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;

  // Utility functions
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (projectId: string, status: Task['status']) => Task[];
  clearError: () => void;
}

/**
 * Todo Store using Zustand
 * Manages task state and syncs with backend API
 */
export const useTodoStore = create<TodoStore>((set, get) => ({
  // Initial State
  tasks: [],
  isLoading: false,
  error: null,
  selectedTask: null,

  // Fetch todos from backend
  fetchTodos: async (projectId?: number) => {
    set({ isLoading: true, error: null });
    try {
      const filters = projectId ? { project_id: projectId } : undefined;
      const response = await api.todos.getAll(filters);
      const tasks = response.data.map(convertTodoToTask);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        isLoading: false,
      });
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const todoData = convertTaskToTodoData(taskData) as CreateTodoData;

      // Ensure required fields are present
      if (!todoData.title) {
        throw new Error('Task title is required');
      }

      const response = await api.todos.create(todoData);
      const newTask = convertTodoToTask(response.data);

      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create task',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update an existing task
  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const todoData = convertTaskToTodoData(updates);
      const response = await api.todos.update(parseInt(id), todoData);
      const updatedTask = convertTodoToTask(response.data);

      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update task',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.todos.delete(parseInt(id));

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete task',
        isLoading: false,
      });
      throw error;
    }
  },

  // Move task to different status (for drag-and-drop)
  moveTask: async (taskId, newStatus) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) {
      set({ error: 'Task not found' });
      return;
    }

    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }));

    try {
      // Update backend
      const todoData = { status: STATUS_TO_NUMBER[newStatus] };
      await api.todos.update(parseInt(taskId), todoData);
    } catch (error) {
      // Revert on error
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, status: task.status } : t
        ),
        error: error instanceof Error ? error.message : 'Failed to move task',
      }));
      throw error;
    }
  },

  // Set selected task
  setSelectedTask: (task) => {
    set({ selectedTask: task });
  },

  // Get tasks by project
  getTasksByProject: (projectId) => {
    return get().tasks.filter((task) => task.projectId === projectId);
  },

  // Get tasks by project and status
  getTasksByStatus: (projectId, status) => {
    return get()
      .tasks.filter((task) => task.projectId === projectId && task.status === status);
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Export mapping functions for use in components
export { PRIORITY_TO_NUMBER, NUMBER_TO_PRIORITY, STATUS_TO_NUMBER, NUMBER_TO_STATUS };
