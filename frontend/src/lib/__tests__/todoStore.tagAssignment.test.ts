/**
 * Integration tests for tag assignment in todoStore
 * Tests tag-task relationship operations
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodoStore } from '../todoStore';
import * as api from '../api';

// Mock the API module
jest.mock('../api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    tags: {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      assignToTodo: jest.fn(),
      removeFromTodo: jest.fn(),
      getTodoTags: jest.fn(),
    },
  },
}));

describe('TodoStore Tag Assignment Integration Tests', () => {
  beforeEach(() => {
    // Reset store state
    const { result } = renderHook(() => useTodoStore());
    act(() => {
      result.current.tasks = [];
      result.current.tags = [];
      result.current.error = null;
      result.current.tagError = null;
    });

    jest.clearAllMocks();
  });

  describe('assignTagToTask', () => {
    it('should assign tag to task successfully', async () => {
      const { result } = renderHook(() => useTodoStore());

      // Setup initial state with a task and a tag
      act(() => {
        result.current.tasks = [
          {
            id: '1',
            title: 'Test Task',
            priority: 'medium',
            status: 'todo',
            projectId: '1',
            tags: [],
            createdDate: new Date(),
          },
        ];

        result.current.tags = [
          { id: '5', name: 'Frontend', color: '#FF5733' },
        ];
      });

      // Mock successful tag assignment
      (api.api.tags.assignToTodo as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      // Mock fetchTaskTags to return the assigned tag
      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValue({
        data: [{ tag_id: 5, name: 'Frontend', color: '#FF5733' }],
      });

      await act(async () => {
        await result.current.assignTagToTask('1', '5');
      });

      await waitFor(() => {
        expect(api.api.tags.assignToTodo).toHaveBeenCalledWith(1, 5);
        expect(result.current.tasks[0].tags).toHaveLength(1);
        expect(result.current.tasks[0].tags[0].name).toBe('Frontend');
      });
    });

    it('should handle assign tag error', async () => {
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

      (api.api.tags.assignToTodo as jest.Mock).mockRejectedValue(new Error('Assignment failed'));

      await act(async () => {
        try {
          await result.current.assignTagToTask('1', '5');
        } catch (error) {
          // Error is expected and re-thrown by the store
        }
      });

      await waitFor(() => {
        expect(result.current.tagError).toContain('Assignment failed');
        expect(result.current.tasks[0].tags).toHaveLength(0);
      });
    });

    it('should not duplicate tags when assigning same tag twice', async () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.tasks = [
          {
            id: '1',
            title: 'Task',
            priority: 'medium',
            status: 'todo',
            projectId: '1',
            tags: [{ id: '5', name: 'Frontend', color: '#FF5733' }],
            createdDate: new Date(),
          },
        ];

        result.current.tags = [
          { id: '5', name: 'Frontend', color: '#FF5733' },
        ];
      });

      (api.api.tags.assignToTodo as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValue({
        data: [{ tag_id: 5, name: 'Frontend', color: '#FF5733' }],
      });

      await act(async () => {
        await result.current.assignTagToTask('1', '5');
      });

      await waitFor(() => {
        // Task should still have only one Frontend tag
        expect(result.current.tasks[0].tags).toHaveLength(1);
      });
    });

    it('should handle assigning multiple tags to same task', async () => {
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

        result.current.tags = [
          { id: '1', name: 'Frontend', color: '#FF5733' },
          { id: '2', name: 'Backend', color: '#3B82F6' },
        ];
      });

      (api.api.tags.assignToTodo as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      // First tag assignment
      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValueOnce({
        data: {
          data: [{ tag_id: 1, name: 'Frontend', color: '#FF5733' }],
        },
      });

      await act(async () => {
        await result.current.assignTagToTask('1', '1');
      });

      // Second tag assignment
      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValueOnce({
        data: {
          data: [
            { tag_id: 1, name: 'Frontend', color: '#FF5733' },
            { tag_id: 2, name: 'Backend', color: '#3B82F6' },
          ],
        },
      });

      await act(async () => {
        await result.current.assignTagToTask('1', '2');
      });

      await waitFor(() => {
        expect(result.current.tasks[0].tags).toHaveLength(2);
        expect(result.current.tasks[0].tags.map((t) => t.name)).toEqual([
          'Frontend',
          'Backend',
        ]);
      });
    });
  });

  describe('removeTagFromTask', () => {
    it('should remove tag from task successfully', async () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.tasks = [
          {
            id: '1',
            title: 'Task',
            priority: 'medium',
            status: 'todo',
            projectId: '1',
            tags: [
              { id: '5', name: 'Frontend', color: '#FF5733' },
              { id: '6', name: 'Backend', color: '#3B82F6' },
            ],
            createdDate: new Date(),
          },
        ];
      });

      (api.api.tags.removeFromTodo as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValue({
        data: [{ tag_id: 6, name: 'Backend', color: '#3B82F6' }],
      });

      await act(async () => {
        await result.current.removeTagFromTask('1', '5');
      });

      await waitFor(() => {
        expect(api.api.tags.removeFromTodo).toHaveBeenCalledWith(1, 5);
        expect(result.current.tasks[0].tags).toHaveLength(1);
        expect(result.current.tasks[0].tags[0].name).toBe('Backend');
      });
    });

    it('should handle remove tag error', async () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.tasks = [
          {
            id: '1',
            title: 'Task',
            priority: 'medium',
            status: 'todo',
            projectId: '1',
            tags: [{ id: '5', name: 'Frontend', color: '#FF5733' }],
            createdDate: new Date(),
          },
        ];
      });

      (api.api.tags.removeFromTodo as jest.Mock).mockRejectedValue(new Error('Remove failed'));

      await act(async () => {
        try {
          await result.current.removeTagFromTask('1', '5');
        } catch (error) {
          // Error is expected and re-thrown by the store
        }
      });

      await waitFor(() => {
        expect(result.current.tagError).toContain('Remove failed');
        // Tag should still be present on error
        expect(result.current.tasks[0].tags).toHaveLength(1);
      });
    });

    it('should handle removing last tag from task', async () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.tasks = [
          {
            id: '1',
            title: 'Task',
            priority: 'medium',
            status: 'todo',
            projectId: '1',
            tags: [{ id: '5', name: 'Frontend', color: '#FF5733' }],
            createdDate: new Date(),
          },
        ];
      });

      (api.api.tags.removeFromTodo as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValue({
        data: [] ,
      });

      await act(async () => {
        await result.current.removeTagFromTask('1', '5');
      });

      await waitFor(() => {
        expect(result.current.tasks[0].tags).toHaveLength(0);
      });
    });

    it('should handle removing non-existent tag gracefully', async () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.tasks = [
          {
            id: '1',
            title: 'Task',
            priority: 'medium',
            status: 'todo',
            projectId: '1',
            tags: [{ id: '5', name: 'Frontend', color: '#FF5733' }],
            createdDate: new Date(),
          },
        ];
      });

      (api.api.tags.removeFromTodo as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValue({
        data: [{ tag_id: 5, name: 'Frontend', color: '#FF5733' }],
      });

      await act(async () => {
        await result.current.removeTagFromTask('1', '999'); // Non-existent tag
      });

      await waitFor(() => {
        // Should still call API but task tags remain unchanged
        expect(api.api.tags.removeFromTodo).toHaveBeenCalled();
      });
    });
  });

  describe('fetchTaskTags', () => {
    it('should fetch tags for specific task', async () => {
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

      const mockTaskTags = [
        { tag_id: 1, name: 'Frontend', color: '#FF5733' },
        { tag_id: 2, name: 'Bug', color: '#EF4444' },
      ];

      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValue({
        data: mockTaskTags,
      });

      await act(async () => {
        await result.current.fetchTaskTags('1');
      });

      await waitFor(() => {
        expect(api.api.tags.getTodoTags).toHaveBeenCalledWith(1);
        expect(result.current.tasks[0].tags).toHaveLength(2);
        expect(result.current.tasks[0].tags.map((t) => t.name)).toEqual([
          'Frontend',
          'Bug',
        ]);
      });
    });

    it('should handle fetch task tags error', async () => {
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

      (api.api.tags.getTodoTags as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      await act(async () => {
        await result.current.fetchTaskTags('1');
      });

      await waitFor(() => {
        expect(result.current.tagError).toContain('Failed to fetch task tags');
      });
    });

    it('should handle task not found when fetching tags', async () => {
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

      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValue({
        data: [] ,
      });

      await act(async () => {
        await result.current.fetchTaskTags('999'); // Non-existent task
      });

      // Should not throw error, but task won't be found to update
      expect(result.current.tasks[0].tags).toHaveLength(0);
    });
  });

  describe('Complex Tag Assignment Scenarios', () => {
    it('should maintain tag consistency across multiple operations', async () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.tasks = [
          {
            id: '1',
            title: 'Task 1',
            priority: 'medium',
            status: 'todo',
            projectId: '1',
            tags: [],
            createdDate: new Date(),
          },
          {
            id: '2',
            title: 'Task 2',
            priority: 'high',
            status: 'in-progress',
            projectId: '1',
            tags: [],
            createdDate: new Date(),
          },
        ];

        result.current.tags = [
          { id: '1', name: 'Frontend', color: '#FF5733' },
          { id: '2', name: 'Backend', color: '#3B82F6' },
        ];
      });

      (api.api.tags.assignToTodo as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      // Assign Frontend tag to Task 1
      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValueOnce({
        data: {
          data: [{ tag_id: 1, name: 'Frontend', color: '#FF5733' }],
        },
      });

      await act(async () => {
        await result.current.assignTagToTask('1', '1');
      });

      // Assign Backend tag to Task 2
      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValueOnce({
        data: {
          data: [{ tag_id: 2, name: 'Backend', color: '#3B82F6' }],
        },
      });

      await act(async () => {
        await result.current.assignTagToTask('2', '2');
      });

      await waitFor(() => {
        expect(result.current.tasks[0].tags[0].name).toBe('Frontend');
        expect(result.current.tasks[1].tags[0].name).toBe('Backend');
      });
    });

    it('should handle rapid tag assignment/removal', async () => {
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

        result.current.tags = [
          { id: '1', name: 'Frontend', color: '#FF5733' },
        ];
      });

      (api.api.tags.assignToTodo as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      (api.api.tags.removeFromTodo as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      // Assign tag
      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValueOnce({
        data: {
          data: [{ tag_id: 1, name: 'Frontend', color: '#FF5733' }],
        },
      });

      await act(async () => {
        await result.current.assignTagToTask('1', '1');
      });

      // Remove tag
      (api.api.tags.getTodoTags as jest.Mock).mockResolvedValueOnce({
        data: [] ,
      });

      await act(async () => {
        await result.current.removeTagFromTask('1', '1');
      });

      await waitFor(() => {
        expect(result.current.tasks[0].tags).toHaveLength(0);
      });
    });

    it('should update tags when deleting a tag that is assigned to tasks', async () => {
      const { result } = renderHook(() => useTodoStore());

      act(() => {
        result.current.tasks = [
          {
            id: '1',
            title: 'Task',
            priority: 'medium',
            status: 'todo',
            projectId: '1',
            tags: [{ id: '5', name: 'ToDelete', color: '#FF0000' }],
            createdDate: new Date(),
          },
        ];

        result.current.tags = [
          { id: '5', name: 'ToDelete', color: '#FF0000' },
        ];
      });

      (api.api.tags.delete as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      await act(async () => {
        await result.current.deleteTag('5');
      });

      await waitFor(() => {
        // Tag should be removed from global tags list
        expect(result.current.tags).toHaveLength(0);
        // Note: In real implementation, backend should handle removing tag from all tasks
        // or frontend should manually update all tasks
      });
    });
  });
});
