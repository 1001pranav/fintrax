'use client';

import { create } from 'zustand';
import { api, Todo, CreateTodoData, Tag } from './api';
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
 * Convert backend Tag to frontend Tags
 */
const convertBackendTag = (tag: Tag): Tags => ({
  id: tag.tag_id.toString(),
  name: tag.name,
  color: tag.color || '#3B82F6', // Default blue color
});

/**
 * Convert backend Todo to frontend Task
 */
const convertTodoToTask = (todo: Todo, tags: Tags[] = []): Task => ({
  id: todo.task_id.toString(),
  title: todo.title,
  description: todo.description,
  startDate: todo.start_date ? new Date(todo.start_date) : undefined,
  endDate: todo.end_date ? new Date(todo.end_date) : undefined,
  tags: tags, // Tags passed from store or fetched separately
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
  // Task State
  tasks: Task[];
  todos: Task[]; // Alias for compatibility
  isLoading: boolean;
  error: string | null;
  selectedTask: Task | null;

  // Tag State
  tags: Tags[];
  isLoadingTags: boolean;
  tagError: string | null;

  // Task Actions
  fetchTodos: (projectId?: number) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdDate'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: Task['status']) => Promise<void>;
  setSelectedTask: (task: Task | null) => void;

  // Tag Actions
  fetchTags: () => Promise<void>;
  createTag: (name: string, color: string) => Promise<void>;
  updateTag: (id: string, name: string, color: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  assignTagToTask: (taskId: string, tagId: string) => Promise<void>;
  removeTagFromTask: (taskId: string, tagId: string) => Promise<void>;
  fetchTaskTags: (taskId: string) => Promise<void>;

  // Utility functions
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (projectId: string, status: Task['status']) => Task[];
  clearError: () => void;
  clearTagError: () => void;
}

/**
 * Todo Store using Zustand
 * Manages task state and syncs with backend API
 */
export const useTodoStore = create<TodoStore>((set, get) => ({
  // Initial Task State
  tasks: [],
  todos: [], // Alias for compatibility
  isLoading: false,
  error: null,
  selectedTask: null,

  // Initial Tag State
  tags: [],
  isLoadingTags: false,
  tagError: null,

  // Fetch todos from backend
  fetchTodos: async (projectId?: number) => {
    set({ isLoading: true, error: null });
    try {
      const filters = projectId ? { project_id: projectId } : undefined;
      const response = await api.todos.getAll(filters);

      // Fetch tags for each task
      const tasksWithTags = await Promise.all(
        response.data.map(async (todo) => {
          try {
            const tagsResponse = await api.tags.getTodoTags(todo.task_id);
            const tags = tagsResponse.data.map(convertBackendTag);
            return convertTodoToTask(todo, tags);
          } catch {
            // If tags fail to load, return task without tags
            return convertTodoToTask(todo, []);
          }
        })
      );

      set({ tasks: tasksWithTags, todos: tasksWithTags, isLoading: false });
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
      const newTask = convertTodoToTask(response.data, taskData.tags || []);

      // If task has tags, assign them to the task
      if (taskData.tags && taskData.tags.length > 0) {
        await Promise.all(
          taskData.tags.map((tag) =>
            api.tags.assignToTodo(response.data.task_id, parseInt(tag.id))
          )
        );
      }

      set((state) => ({
        tasks: [...state.tasks, newTask],
        todos: [...state.todos, newTask],
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

      // Keep existing tags or use updated tags
      const existingTask = get().tasks.find((t) => t.id === id);
      const tags = updates.tags !== undefined ? updates.tags : existingTask?.tags || [];
      const updatedTask = convertTodoToTask(response.data, tags);

      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        todos: state.todos.map((task) => (task.id === id ? updatedTask : task)),
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
        todos: state.todos.filter((task) => task.id !== id),
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
      todos: state.todos.map((t) =>
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
        todos: state.todos.map((t) =>
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

  // Clear tag error
  clearTagError: () => {
    set({ tagError: null });
  },

  // ============================================
  // Tag Management Actions
  // ============================================

  // Fetch all tags
  fetchTags: async () => {
    set({ isLoadingTags: true, tagError: null });
    try {
      const response = await api.tags.getAll();
      const tags = response.data.map(convertBackendTag);
      set({ tags, isLoadingTags: false });
    } catch (error) {
      set({
        tagError: error instanceof Error ? error.message : 'Failed to fetch tags',
        isLoadingTags: false,
      });
      throw error;
    }
  },

  // Create a new tag
  createTag: async (name, color) => {
    set({ isLoadingTags: true, tagError: null });
    try {
      const response = await api.tags.create({ name, color });
      const newTag = convertBackendTag(response.data);
      set((state) => ({
        tags: [...state.tags, newTag],
        isLoadingTags: false,
      }));
    } catch (error) {
      set({
        tagError: error instanceof Error ? error.message : 'Failed to create tag',
        isLoadingTags: false,
      });
      throw error;
    }
  },

  // Update an existing tag
  updateTag: async (id, name, color) => {
    set({ isLoadingTags: true, tagError: null });
    try {
      const response = await api.tags.update(parseInt(id), { name, color });
      const updatedTag = convertBackendTag(response.data);
      set((state) => ({
        tags: state.tags.map((tag) => (tag.id === id ? updatedTag : tag)),
        isLoadingTags: false,
      }));

      // Update tags in tasks that have this tag
      set((state) => ({
        tasks: state.tasks.map((task) => ({
          ...task,
          tags: task.tags.map((tag) => (tag.id === id ? updatedTag : tag)),
        })),
        todos: state.todos.map((task) => ({
          ...task,
          tags: task.tags.map((tag) => (tag.id === id ? updatedTag : tag)),
        })),
      }));
    } catch (error) {
      set({
        tagError: error instanceof Error ? error.message : 'Failed to update tag',
        isLoadingTags: false,
      });
      throw error;
    }
  },

  // Delete a tag
  deleteTag: async (id) => {
    set({ isLoadingTags: true, tagError: null });
    try {
      await api.tags.delete(parseInt(id));
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        isLoadingTags: false,
      }));

      // Remove tag from all tasks
      set((state) => ({
        tasks: state.tasks.map((task) => ({
          ...task,
          tags: task.tags.filter((tag) => tag.id !== id),
        })),
        todos: state.todos.map((task) => ({
          ...task,
          tags: task.tags.filter((tag) => tag.id !== id),
        })),
      }));
    } catch (error) {
      set({
        tagError: error instanceof Error ? error.message : 'Failed to delete tag',
        isLoadingTags: false,
      });
      throw error;
    }
  },

  // Assign a tag to a task
  assignTagToTask: async (taskId, tagId) => {
    try {
      await api.tags.assignToTodo(parseInt(taskId), parseInt(tagId));

      // Find the tag in the store
      const tag = get().tags.find((t) => t.id === tagId);
      if (!tag) {
        throw new Error('Tag not found');
      }

      // Update task with new tag
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId && !task.tags.some((t) => t.id === tagId)
            ? { ...task, tags: [...task.tags, tag] }
            : task
        ),
        todos: state.todos.map((task) =>
          task.id === taskId && !task.tags.some((t) => t.id === tagId)
            ? { ...task, tags: [...task.tags, tag] }
            : task
        ),
      }));
    } catch (error) {
      set({
        tagError: error instanceof Error ? error.message : 'Failed to assign tag',
      });
      throw error;
    }
  },

  // Remove a tag from a task
  removeTagFromTask: async (taskId, tagId) => {
    try {
      await api.tags.removeFromTodo(parseInt(taskId), parseInt(tagId));

      // Update task by removing tag
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? { ...task, tags: task.tags.filter((t) => t.id !== tagId) }
            : task
        ),
        todos: state.todos.map((task) =>
          task.id === taskId
            ? { ...task, tags: task.tags.filter((t) => t.id !== tagId) }
            : task
        ),
      }));
    } catch (error) {
      set({
        tagError: error instanceof Error ? error.message : 'Failed to remove tag',
      });
      throw error;
    }
  },

  // Fetch tags for a specific task
  fetchTaskTags: async (taskId) => {
    try {
      const response = await api.tags.getTodoTags(parseInt(taskId));
      const tags = response.data.map(convertBackendTag);

      // Update the task with fetched tags
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, tags } : task)),
        todos: state.todos.map((task) => (task.id === taskId ? { ...task, tags } : task)),
      }));
    } catch (error) {
      set({
        tagError: error instanceof Error ? error.message : 'Failed to fetch task tags',
      });
      throw error;
    }
  },
}));

// Export mapping functions for use in components
export { PRIORITY_TO_NUMBER, NUMBER_TO_PRIORITY, STATUS_TO_NUMBER, NUMBER_TO_STATUS };
