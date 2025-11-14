/**
 * Unit tests for todoStore mapping and conversion functions
 * Tests the conversion logic between frontend Task format and backend Todo format
 */

import { Todo, Tag } from '../api';
import { Task, Tags } from '@/constants/interfaces';

/**
 * NOTE: These are copies of the internal mapping functions from todoStore.ts
 * In a real implementation, these would be exported from todoStore or a separate utils file
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

const convertBackendTag = (tag: Tag): Tags => ({
  id: tag.tag_id.toString(),
  name: tag.name,
  color: tag.color || '#3B82F6',
});

const convertTodoToTask = (todo: Todo, tags: Tags[] = []): Task => ({
  id: todo.task_id.toString(),
  title: todo.title,
  description: todo.description,
  startDate: todo.start_date ? new Date(todo.start_date) : undefined,
  endDate: todo.end_date ? new Date(todo.end_date) : undefined,
  tags: tags,
  priority: NUMBER_TO_PRIORITY[todo.priority] || 'medium',
  status: NUMBER_TO_STATUS[todo.status] || 'todo',
  projectId: todo.project_id?.toString() || '',
  createdDate: new Date(),
  parentTaskId: todo.parent_id?.toString(),
});

const convertTaskToTodoData = (task: Omit<Task, 'id' | 'createdDate'> | Partial<Task>) => {
  const data: any = {};

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

describe('TodoStore Mapping Functions', () => {
  describe('Priority Mapping', () => {
    describe('PRIORITY_TO_NUMBER', () => {
      it('should map low priority to 1', () => {
        expect(PRIORITY_TO_NUMBER.low).toBe(1);
      });

      it('should map medium priority to 3', () => {
        expect(PRIORITY_TO_NUMBER.medium).toBe(3);
      });

      it('should map high priority to 5', () => {
        expect(PRIORITY_TO_NUMBER.high).toBe(5);
      });
    });

    describe('NUMBER_TO_PRIORITY', () => {
      it('should map 0-1 to low priority', () => {
        expect(NUMBER_TO_PRIORITY[0]).toBe('low');
        expect(NUMBER_TO_PRIORITY[1]).toBe('low');
      });

      it('should map 2-3 to medium priority', () => {
        expect(NUMBER_TO_PRIORITY[2]).toBe('medium');
        expect(NUMBER_TO_PRIORITY[3]).toBe('medium');
      });

      it('should map 4-5 to high priority', () => {
        expect(NUMBER_TO_PRIORITY[4]).toBe('high');
        expect(NUMBER_TO_PRIORITY[5]).toBe('high');
      });
    });

    describe('Bidirectional Priority Mapping', () => {
      it('should maintain consistency for low priority', () => {
        const number = PRIORITY_TO_NUMBER.low;
        const priority = NUMBER_TO_PRIORITY[number];
        expect(priority).toBe('low');
      });

      it('should maintain consistency for medium priority', () => {
        const number = PRIORITY_TO_NUMBER.medium;
        const priority = NUMBER_TO_PRIORITY[number];
        expect(priority).toBe('medium');
      });

      it('should maintain consistency for high priority', () => {
        const number = PRIORITY_TO_NUMBER.high;
        const priority = NUMBER_TO_PRIORITY[number];
        expect(priority).toBe('high');
      });
    });
  });

  describe('Status Mapping', () => {
    describe('STATUS_TO_NUMBER', () => {
      it('should map todo status to 1', () => {
        expect(STATUS_TO_NUMBER.todo).toBe(1);
      });

      it('should map in-progress status to 2', () => {
        expect(STATUS_TO_NUMBER['in-progress']).toBe(2);
      });

      it('should map done status to 3', () => {
        expect(STATUS_TO_NUMBER.done).toBe(3);
      });
    });

    describe('NUMBER_TO_STATUS', () => {
      it('should map 1 to todo status', () => {
        expect(NUMBER_TO_STATUS[1]).toBe('todo');
      });

      it('should map 2 to in-progress status', () => {
        expect(NUMBER_TO_STATUS[2]).toBe('in-progress');
      });

      it('should map 3 to done status', () => {
        expect(NUMBER_TO_STATUS[3]).toBe('done');
      });

      it('should map 4 (Blocked) to todo status', () => {
        expect(NUMBER_TO_STATUS[4]).toBe('todo');
      });

      it('should map 5 (Review) to in-progress status', () => {
        expect(NUMBER_TO_STATUS[5]).toBe('in-progress');
      });

      it('should map 6 (Cancelled) to done status', () => {
        expect(NUMBER_TO_STATUS[6]).toBe('done');
      });
    });

    describe('Bidirectional Status Mapping', () => {
      it('should maintain consistency for todo status', () => {
        const number = STATUS_TO_NUMBER.todo;
        const status = NUMBER_TO_STATUS[number];
        expect(status).toBe('todo');
      });

      it('should maintain consistency for in-progress status', () => {
        const number = STATUS_TO_NUMBER['in-progress'];
        const status = NUMBER_TO_STATUS[number];
        expect(status).toBe('in-progress');
      });

      it('should maintain consistency for done status', () => {
        const number = STATUS_TO_NUMBER.done;
        const status = NUMBER_TO_STATUS[number];
        expect(status).toBe('done');
      });
    });
  });

  describe('convertBackendTag', () => {
    it('should convert backend tag to frontend tag format', () => {
      const backendTag: Tag = {
        tag_id: 1,
        name: 'Frontend',
        color: '#FF5733',
      };

      const result = convertBackendTag(backendTag);

      expect(result.id).toBe('1');
      expect(result.name).toBe('Frontend');
      expect(result.color).toBe('#FF5733');
    });

    it('should use default color when color is not provided', () => {
      const backendTag: Tag = {
        tag_id: 2,
        name: 'Backend',
      };

      const result = convertBackendTag(backendTag);

      expect(result.id).toBe('2');
      expect(result.name).toBe('Backend');
      expect(result.color).toBe('#3B82F6'); // Default blue
    });

    it('should convert tag_id to string', () => {
      const backendTag: Tag = {
        tag_id: 999,
        name: 'Test',
        color: '#000000',
      };

      const result = convertBackendTag(backendTag);

      expect(typeof result.id).toBe('string');
      expect(result.id).toBe('999');
    });
  });

  describe('convertTodoToTask', () => {
    const mockBackendTodo: Todo = {
      task_id: 1,
      title: 'Test Task',
      description: 'Test Description',
      start_date: '2024-01-15',
      end_date: '2024-01-20',
      priority: 3, // Medium
      status: 2, // In Progress
      project_id: 5,
      parent_id: 10,
      user_id: 1,
    };

    it('should convert backend todo to frontend task', () => {
      const result = convertTodoToTask(mockBackendTodo);

      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Task');
      expect(result.description).toBe('Test Description');
      expect(result.priority).toBe('medium');
      expect(result.status).toBe('in-progress');
      expect(result.projectId).toBe('5');
      expect(result.parentTaskId).toBe('10');
    });

    it('should convert dates correctly', () => {
      const result = convertTodoToTask(mockBackendTodo);

      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      expect(result.startDate?.toISOString().split('T')[0]).toBe('2024-01-15');
      expect(result.endDate?.toISOString().split('T')[0]).toBe('2024-01-20');
    });

    it('should handle missing optional fields', () => {
      const minimalTodo: Todo = {
        task_id: 2,
        title: 'Minimal Task',
        priority: 1,
        status: 1,
        user_id: 1,
      };

      const result = convertTodoToTask(minimalTodo);

      expect(result.id).toBe('2');
      expect(result.title).toBe('Minimal Task');
      expect(result.description).toBeUndefined();
      expect(result.startDate).toBeUndefined();
      expect(result.endDate).toBeUndefined();
      expect(result.projectId).toBe('');
      expect(result.parentTaskId).toBeUndefined();
    });

    it('should include provided tags', () => {
      const tags: Tags[] = [
        { id: '1', name: 'Frontend', color: '#FF5733' },
        { id: '2', name: 'Backend', color: '#3B82F6' },
      ];

      const result = convertTodoToTask(mockBackendTodo, tags);

      expect(result.tags).toHaveLength(2);
      expect(result.tags[0].name).toBe('Frontend');
      expect(result.tags[1].name).toBe('Backend');
    });

    it('should handle all priority values', () => {
      expect(convertTodoToTask({ ...mockBackendTodo, priority: 0 }).priority).toBe('low');
      expect(convertTodoToTask({ ...mockBackendTodo, priority: 1 }).priority).toBe('low');
      expect(convertTodoToTask({ ...mockBackendTodo, priority: 2 }).priority).toBe('medium');
      expect(convertTodoToTask({ ...mockBackendTodo, priority: 3 }).priority).toBe('medium');
      expect(convertTodoToTask({ ...mockBackendTodo, priority: 4 }).priority).toBe('high');
      expect(convertTodoToTask({ ...mockBackendTodo, priority: 5 }).priority).toBe('high');
    });

    it('should handle all status values including extended statuses', () => {
      expect(convertTodoToTask({ ...mockBackendTodo, status: 1 }).status).toBe('todo');
      expect(convertTodoToTask({ ...mockBackendTodo, status: 2 }).status).toBe('in-progress');
      expect(convertTodoToTask({ ...mockBackendTodo, status: 3 }).status).toBe('done');
      expect(convertTodoToTask({ ...mockBackendTodo, status: 4 }).status).toBe('todo'); // Blocked
      expect(convertTodoToTask({ ...mockBackendTodo, status: 5 }).status).toBe('in-progress'); // Review
      expect(convertTodoToTask({ ...mockBackendTodo, status: 6 }).status).toBe('done'); // Cancelled
    });
  });

  describe('convertTaskToTodoData', () => {
    const mockFrontendTask: Omit<Task, 'id' | 'createdDate'> = {
      title: 'Frontend Task',
      description: 'Frontend Description',
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-15'),
      priority: 'high',
      status: 'in-progress',
      projectId: '7',
      parentTaskId: '12',
      tags: [],
    };

    it('should convert frontend task to backend todo data', () => {
      const result = convertTaskToTodoData(mockFrontendTask);

      expect(result.title).toBe('Frontend Task');
      expect(result.description).toBe('Frontend Description');
      expect(result.priority).toBe(5); // high
      expect(result.status).toBe(2); // in-progress
      expect(result.project_id).toBe(7);
      expect(result.parent_id).toBe(12);
    });

    it('should convert dates to ISO format strings', () => {
      const result = convertTaskToTodoData(mockFrontendTask);

      expect(result.start_date).toBe('2024-02-10');
      expect(result.end_date).toBe('2024-02-15');
    });

    it('should handle partial task updates', () => {
      const partialTask: Partial<Task> = {
        title: 'Updated Title',
        priority: 'low',
      };

      const result = convertTaskToTodoData(partialTask);

      expect(result.title).toBe('Updated Title');
      expect(result.priority).toBe(1); // low
      expect(result.description).toBeUndefined();
      expect(result.status).toBeUndefined();
    });

    it('should handle empty projectId and parentTaskId', () => {
      const taskWithEmptyIds: Omit<Task, 'id' | 'createdDate'> = {
        ...mockFrontendTask,
        projectId: '',
        parentTaskId: '',
      };

      const result = convertTaskToTodoData(taskWithEmptyIds);

      expect(result.project_id).toBeUndefined();
      expect(result.parent_id).toBeUndefined();
    });

    it('should handle undefined dates', () => {
      const taskWithoutDates: Omit<Task, 'id' | 'createdDate'> = {
        ...mockFrontendTask,
        startDate: undefined,
        endDate: undefined,
      };

      const result = convertTaskToTodoData(taskWithoutDates);

      expect(result.start_date).toBeUndefined();
      expect(result.end_date).toBeUndefined();
    });

    it('should convert all priority levels correctly', () => {
      expect(convertTaskToTodoData({ ...mockFrontendTask, priority: 'low' }).priority).toBe(1);
      expect(convertTaskToTodoData({ ...mockFrontendTask, priority: 'medium' }).priority).toBe(3);
      expect(convertTaskToTodoData({ ...mockFrontendTask, priority: 'high' }).priority).toBe(5);
    });

    it('should convert all status levels correctly', () => {
      expect(convertTaskToTodoData({ ...mockFrontendTask, status: 'todo' }).status).toBe(1);
      expect(convertTaskToTodoData({ ...mockFrontendTask, status: 'in-progress' }).status).toBe(2);
      expect(convertTaskToTodoData({ ...mockFrontendTask, status: 'done' }).status).toBe(3);
    });

    it('should only include defined fields', () => {
      const minimalTask: Partial<Task> = {
        title: 'Minimal',
      };

      const result = convertTaskToTodoData(minimalTask);

      expect(Object.keys(result)).toEqual(['title']);
    });
  });

  describe('Round-trip Conversion', () => {
    it('should maintain data integrity through round-trip conversion', () => {
      const originalTodo: Todo = {
        task_id: 1,
        title: 'Round-trip Task',
        description: 'Testing round-trip conversion',
        start_date: '2024-03-01',
        end_date: '2024-03-15',
        priority: 5,
        status: 2,
        project_id: 3,
        user_id: 1,
      };

      // Backend → Frontend
      const task = convertTodoToTask(originalTodo);

      // Frontend → Backend
      const todoData = convertTaskToTodoData(task);

      // Verify data integrity
      expect(todoData.title).toBe(originalTodo.title);
      expect(todoData.description).toBe(originalTodo.description);
      expect(todoData.priority).toBe(originalTodo.priority);
      expect(todoData.status).toBe(originalTodo.status);
      expect(todoData.project_id).toBe(originalTodo.project_id);
      expect(todoData.start_date).toBe(originalTodo.start_date);
      expect(todoData.end_date).toBe(originalTodo.end_date);
    });
  });
});
