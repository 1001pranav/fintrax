/**
 * Integration tests for todoStore
 * Tests the Zustand store with mocked API calls
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodoStore } from '../todoStore';
import * as api from '../api';
import { Task } from '@/constants/interfaces';

// Mock the API module
jest.mock('../api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('TodoStore Integration Tests', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.tasks = [];
      result.current.tags = [];
      result.current.error = null;
      result.current.tagError = null;
      result.current.isLoading = false;
      result.current.isLoadingTags = false;
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Task CRUD Operations', () => {
    describe('fetchTodos', () => {
      it('should fetch todos successfully', async () => {
        const mockTodos = [
          {
            task_id: 1,
            title: 'Test Task',
            description: 'Description',
            priority: 3,
            status: 1,
            user_id: 1,
          },
        ];

        (api.api.get as jest.Mock).mockResolvedValue({
          data: { data: mockTodos },
        });

        const { result } = renderHook(() => useTodoStore());

        await act(async () => {
          await result.current.fetchTodos();
        });

        await waitFor(() => {
          expect(result.current.tasks).toHaveLength(1);
          expect(result.current.tasks[0].title).toBe('Test Task');
          expect(result.current.isLoading).toBe(false);
        });
      });

      it('should handle fetch error', async () => {
        (api.api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useTodoStore());

        await act(async () => {
          await result.current.fetchTodos();
        });

        await waitFor(() => {
          expect(result.current.error).toContain('Failed to fetch tasks');
          expect(result.current.isLoading).toBe(false);
        });
      });

      it('should fetch todos for specific project', async () => {
        const mockTodos = [
          {
            task_id: 1,
            title: 'Project Task',
            priority: 3,
            status: 1,
            project_id: 5,
            user_id: 1,
          },
        ];

        (api.api.get as jest.Mock).mockResolvedValue({
          data: { data: mockTodos },
        });

        const { result } = renderHook(() => useTodoStore());

        await act(async () => {
          await result.current.fetchTodos(5);
        });

        await waitFor(() => {
          expect(api.api.get).toHaveBeenCalledWith('/task?project_id=5');
          expect(result.current.tasks[0].projectId).toBe('5');
        });
      });

      it('should set loading state during fetch', async () => {
        (api.api.get as jest.Mock).mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ data: { data: [] } }), 100)
            )
        );

        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.fetchTodos();
        });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });
      });
    });

    describe('createTask', () => {
      it('should create task successfully', async () => {
        const newTask: Omit<Task, 'id' | 'createdDate'> = {
          title: 'New Task',
          description: 'New Description',
          priority: 'high',
          status: 'todo',
          projectId: '1',
          tags: [],
        };

        const mockResponse = {
          task_id: 10,
          title: 'New Task',
          priority: 5,
          status: 1,
          user_id: 1,
        };

        (api.api.post as jest.Mock).mockResolvedValue({
          data: { data: mockResponse },
        });

        const { result } = renderHook(() => useTodoStore());

        await act(async () => {
          await result.current.createTask(newTask);
        });

        await waitFor(() => {
          expect(result.current.tasks).toHaveLength(1);
          expect(result.current.tasks[0].id).toBe('10');
          expect(result.current.tasks[0].title).toBe('New Task');
          expect(result.current.tasks[0].priority).toBe('high');
        });
      });

      it('should handle create error', async () => {
        const newTask: Omit<Task, 'id' | 'createdDate'> = {
          title: 'New Task',
          priority: 'high',
          status: 'todo',
          projectId: '1',
          tags: [],
        };

        (api.api.post as jest.Mock).mockRejectedValue(new Error('Create failed'));

        const { result } = renderHook(() => useTodoStore());

        await act(async () => {
          await result.current.createTask(newTask);
        });

        await waitFor(() => {
          expect(result.current.error).toContain('Failed to create task');
        });
      });
    });

    describe('updateTask', () => {
      it('should update task successfully', async () => {
        // Set initial task
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tasks = [
            {
              id: '1',
              title: 'Original Title',
              priority: 'low',
              status: 'todo',
              projectId: '1',
              tags: [],
              createdDate: new Date(),
            },
          ];
        });

        const mockResponse = {
          task_id: 1,
          title: 'Updated Title',
          priority: 5,
          status: 1,
          user_id: 1,
        };

        (api.api.put as jest.Mock).mockResolvedValue({
          data: { data: mockResponse },
        });

        await act(async () => {
          await result.current.updateTask('1', { title: 'Updated Title', priority: 'high' });
        });

        await waitFor(() => {
          expect(result.current.tasks[0].title).toBe('Updated Title');
          expect(result.current.tasks[0].priority).toBe('high');
        });
      });

      it('should handle update error', async () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tasks = [
            {
              id: '1',
              title: 'Task',
              priority: 'low',
              status: 'todo',
              projectId: '1',
              tags: [],
              createdDate: new Date(),
            },
          ];
        });

        (api.api.put as jest.Mock).mockRejectedValue(new Error('Update failed'));

        await act(async () => {
          await result.current.updateTask('1', { title: 'Updated' });
        });

        await waitFor(() => {
          expect(result.current.error).toContain('Failed to update task');
          // Task should remain unchanged on error
          expect(result.current.tasks[0].title).toBe('Task');
        });
      });
    });

    describe('deleteTask', () => {
      it('should delete task successfully', async () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tasks = [
            {
              id: '1',
              title: 'Task to Delete',
              priority: 'low',
              status: 'todo',
              projectId: '1',
              tags: [],
              createdDate: new Date(),
            },
          ];
        });

        (api.api.delete as jest.Mock).mockResolvedValue({ data: { success: true } });

        await act(async () => {
          await result.current.deleteTask('1');
        });

        await waitFor(() => {
          expect(result.current.tasks).toHaveLength(0);
        });
      });

      it('should handle delete error', async () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tasks = [
            {
              id: '1',
              title: 'Task',
              priority: 'low',
              status: 'todo',
              projectId: '1',
              tags: [],
              createdDate: new Date(),
            },
          ];
        });

        (api.api.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

        await act(async () => {
          await result.current.deleteTask('1');
        });

        await waitFor(() => {
          expect(result.current.error).toContain('Failed to delete task');
          // Task should still exist on error
          expect(result.current.tasks).toHaveLength(1);
        });
      });
    });

    describe('moveTask', () => {
      it('should move task to new status successfully', async () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tasks = [
            {
              id: '1',
              title: 'Task to Move',
              priority: 'medium',
              status: 'todo',
              projectId: '1',
              tags: [],
              createdDate: new Date(),
            },
          ];
        });

        const mockResponse = {
          task_id: 1,
          title: 'Task to Move',
          priority: 3,
          status: 2, // in-progress
          user_id: 1,
        };

        (api.api.put as jest.Mock).mockResolvedValue({
          data: { data: mockResponse },
        });

        await act(async () => {
          await result.current.moveTask('1', 'in-progress');
        });

        await waitFor(() => {
          expect(result.current.tasks[0].status).toBe('in-progress');
        });
      });

      it('should handle move error with optimistic update rollback', async () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tasks = [
            {
              id: '1',
              title: 'Task',
              priority: 'medium',
              status: 'todo',
              projectId: '1',
              tags: [],
              createdDate: new Date(),
            },
          ];
        });

        (api.api.put as jest.Mock).mockRejectedValue(new Error('Move failed'));

        await act(async () => {
          await result.current.moveTask('1', 'done');
        });

        await waitFor(() => {
          expect(result.current.error).toContain('Failed to move task');
        });
      });
    });
  });

  describe('Tag CRUD Operations', () => {
    describe('fetchTags', () => {
      it('should fetch tags successfully', async () => {
        const mockTags = [
          { tag_id: 1, name: 'Frontend', color: '#FF5733' },
          { tag_id: 2, name: 'Backend', color: '#3B82F6' },
        ];

        (api.api.get as jest.Mock).mockResolvedValue({
          data: { data: mockTags },
        });

        const { result } = renderHook(() => useTodoStore());

        await act(async () => {
          await result.current.fetchTags();
        });

        await waitFor(() => {
          expect(result.current.tags).toHaveLength(2);
          expect(result.current.tags[0].name).toBe('Frontend');
          expect(result.current.tags[1].name).toBe('Backend');
        });
      });

      it('should handle fetch tags error', async () => {
        (api.api.get as jest.Mock).mockRejectedValue(new Error('Fetch tags failed'));

        const { result } = renderHook(() => useTodoStore());

        await act(async () => {
          await result.current.fetchTags();
        });

        await waitFor(() => {
          expect(result.current.tagError).toContain('Failed to fetch tags');
        });
      });
    });

    describe('createTag', () => {
      it('should create tag successfully', async () => {
        const mockResponse = {
          tag_id: 3,
          name: 'New Tag',
          color: '#10B981',
        };

        (api.api.post as jest.Mock).mockResolvedValue({
          data: { data: mockResponse },
        });

        const { result } = renderHook(() => useTodoStore());

        await act(async () => {
          await result.current.createTag('New Tag', '#10B981');
        });

        await waitFor(() => {
          expect(result.current.tags).toHaveLength(1);
          expect(result.current.tags[0].name).toBe('New Tag');
          expect(result.current.tags[0].color).toBe('#10B981');
        });
      });

      it('should handle create tag error', async () => {
        (api.api.post as jest.Mock).mockRejectedValue(new Error('Create tag failed'));

        const { result } = renderHook(() => useTodoStore());

        await act(async () => {
          await result.current.createTag('Tag', '#FF0000');
        });

        await waitFor(() => {
          expect(result.current.tagError).toContain('Failed to create tag');
        });
      });
    });

    describe('updateTag', () => {
      it('should update tag successfully', async () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tags = [
            { id: '1', name: 'Original', color: '#FF0000' },
          ];
        });

        const mockResponse = {
          tag_id: 1,
          name: 'Updated',
          color: '#00FF00',
        };

        (api.api.put as jest.Mock).mockResolvedValue({
          data: { data: mockResponse },
        });

        await act(async () => {
          await result.current.updateTag('1', 'Updated', '#00FF00');
        });

        await waitFor(() => {
          expect(result.current.tags[0].name).toBe('Updated');
          expect(result.current.tags[0].color).toBe('#00FF00');
        });
      });

      it('should handle update tag error', async () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tags = [
            { id: '1', name: 'Tag', color: '#FF0000' },
          ];
        });

        (api.api.put as jest.Mock).mockRejectedValue(new Error('Update tag failed'));

        await act(async () => {
          await result.current.updateTag('1', 'Updated', '#00FF00');
        });

        await waitFor(() => {
          expect(result.current.tagError).toContain('Failed to update tag');
          expect(result.current.tags[0].name).toBe('Tag');
        });
      });
    });

    describe('deleteTag', () => {
      it('should delete tag successfully', async () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tags = [
            { id: '1', name: 'Tag to Delete', color: '#FF0000' },
          ];
        });

        (api.api.delete as jest.Mock).mockResolvedValue({ data: { success: true } });

        await act(async () => {
          await result.current.deleteTag('1');
        });

        await waitFor(() => {
          expect(result.current.tags).toHaveLength(0);
        });
      });

      it('should handle delete tag error', async () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tags = [
            { id: '1', name: 'Tag', color: '#FF0000' },
          ];
        });

        (api.api.delete as jest.Mock).mockRejectedValue(new Error('Delete tag failed'));

        await act(async () => {
          await result.current.deleteTag('1');
        });

        await waitFor(() => {
          expect(result.current.tagError).toContain('Failed to delete tag');
          expect(result.current.tags).toHaveLength(1);
        });
      });
    });
  });

  describe('Utility Functions', () => {
    describe('getTasksByProject', () => {
      it('should return tasks for specific project', () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tasks = [
            {
              id: '1',
              title: 'Project 1 Task',
              priority: 'low',
              status: 'todo',
              projectId: '1',
              tags: [],
              createdDate: new Date(),
            },
            {
              id: '2',
              title: 'Project 2 Task',
              priority: 'low',
              status: 'todo',
              projectId: '2',
              tags: [],
              createdDate: new Date(),
            },
          ];
        });

        const project1Tasks = result.current.getTasksByProject('1');
        expect(project1Tasks).toHaveLength(1);
        expect(project1Tasks[0].projectId).toBe('1');
      });
    });

    describe('getTasksByStatus', () => {
      it('should return tasks by project and status', () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tasks = [
            {
              id: '1',
              title: 'Todo Task',
              priority: 'low',
              status: 'todo',
              projectId: '1',
              tags: [],
              createdDate: new Date(),
            },
            {
              id: '2',
              title: 'Done Task',
              priority: 'low',
              status: 'done',
              projectId: '1',
              tags: [],
              createdDate: new Date(),
            },
          ];
        });

        const todoTasks = result.current.getTasksByStatus('1', 'todo');
        expect(todoTasks).toHaveLength(1);
        expect(todoTasks[0].status).toBe('todo');
      });
    });

    describe('clearError', () => {
      it('should clear error state', () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.error = 'Test error';
        });

        expect(result.current.error).toBe('Test error');

        act(() => {
          result.current.clearError();
        });

        expect(result.current.error).toBeNull();
      });
    });

    describe('clearTagError', () => {
      it('should clear tag error state', () => {
        const { result } = renderHook(() => useTodoStore());

        act(() => {
          result.current.tagError = 'Test tag error';
        });

        expect(result.current.tagError).toBe('Test tag error');

        act(() => {
          result.current.clearTagError();
        });

        expect(result.current.tagError).toBeNull();
      });
    });
  });
});
