import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { useAppStore } from '../store';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      projects: [],
      tasks: [],
      selectedProject: null,
      selectedTask: null,
      isTaskModalOpen: false,
      isProjectModalOpen: false,
      currentView: 'kanban',
      isLoading: false,
      error: null,
    });
  });

  describe('Project Management', () => {
    it('should set selected project', () => {
      const testProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        color: '#FF0000',
        createdDate: new Date(),
        taskCount: 0,
        status: 'active' as const,
      };

      useAppStore.getState().setSelectedProject(testProject);
      const selectedProject = useAppStore.getState().selectedProject;

      assert.strictEqual(selectedProject?.id, testProject.id);
      assert.strictEqual(selectedProject?.name, testProject.name);
    });

    it('should clear selected project when set to null', () => {
      const testProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test',
        color: '#FF0000',
        createdDate: new Date(),
        taskCount: 0,
        status: 'active' as const,
      };

      useAppStore.getState().setSelectedProject(testProject);
      assert.notStrictEqual(useAppStore.getState().selectedProject, null);

      useAppStore.getState().setSelectedProject(null);
      assert.strictEqual(useAppStore.getState().selectedProject, null);
    });
  });

  describe('Task Management', () => {
    it('should add a new task', () => {
      const initialTaskCount = useAppStore.getState().tasks.length;

      useAppStore.getState().addTask({
        title: 'New Task',
        description: 'Task Description',
        priority: 'medium',
        status: 'todo',
        projectId: '1',
        tags: [],
        notes: '',
      });

      const tasks = useAppStore.getState().tasks;
      assert.strictEqual(tasks.length, initialTaskCount + 1);
      assert.strictEqual(tasks[tasks.length - 1].title, 'New Task');
    });

    it('should update an existing task', () => {
      // Add a task first
      useAppStore.getState().addTask({
        title: 'Original Title',
        description: 'Original Description',
        priority: 'low',
        status: 'todo',
        projectId: '1',
        tags: [],
        notes: '',
      });

      const tasks = useAppStore.getState().tasks;
      const taskId = tasks[tasks.length - 1].id;

      // Update the task
      useAppStore.getState().updateTask(taskId, {
        title: 'Updated Title',
        priority: 'high',
      });

      const updatedTask = useAppStore.getState().tasks.find(t => t.id === taskId);
      assert.strictEqual(updatedTask?.title, 'Updated Title');
      assert.strictEqual(updatedTask?.priority, 'high');
      assert.strictEqual(updatedTask?.description, 'Original Description'); // Should preserve other fields
    });

    it('should delete a task', () => {
      // Add a task first
      useAppStore.getState().addTask({
        title: 'Task to Delete',
        description: 'Will be deleted',
        priority: 'medium',
        status: 'todo',
        projectId: '1',
        tags: [],
        notes: '',
      });

      const tasks = useAppStore.getState().tasks;
      const taskId = tasks[tasks.length - 1].id;
      const initialCount = tasks.length;

      // Delete the task
      useAppStore.getState().deleteTask(taskId);

      const newTasks = useAppStore.getState().tasks;
      assert.strictEqual(newTasks.length, initialCount - 1);
      assert.strictEqual(newTasks.find(t => t.id === taskId), undefined);
    });

    it('should delete subtasks when parent task is deleted', () => {
      // Add a parent task
      useAppStore.getState().addTask({
        title: 'Parent Task',
        description: 'Parent',
        priority: 'medium',
        status: 'todo',
        projectId: '1',
        tags: [],
        notes: '',
      });

      const parentId = useAppStore.getState().tasks[useAppStore.getState().tasks.length - 1].id;

      // Add a subtask
      useAppStore.getState().addTask({
        title: 'Subtask',
        description: 'Child',
        priority: 'medium',
        status: 'todo',
        projectId: '1',
        tags: [],
        notes: '',
        parentTaskId: parentId,
      });

      const initialCount = useAppStore.getState().tasks.length;
      assert.strictEqual(initialCount, 2); // Parent + subtask

      // Delete parent task
      useAppStore.getState().deleteTask(parentId);

      const remainingTasks = useAppStore.getState().tasks;
      assert.strictEqual(remainingTasks.length, 0); // Both should be deleted
    });

    it('should move task to different status', () => {
      // Add a task
      useAppStore.getState().addTask({
        title: 'Task to Move',
        description: 'Will be moved',
        priority: 'medium',
        status: 'todo',
        projectId: '1',
        tags: [],
        notes: '',
      });

      const taskId = useAppStore.getState().tasks[useAppStore.getState().tasks.length - 1].id;

      // Move task
      useAppStore.getState().moveTask(taskId, 'in-progress');

      const movedTask = useAppStore.getState().tasks.find(t => t.id === taskId);
      assert.strictEqual(movedTask?.status, 'in-progress');
    });

    it('should set selected task', () => {
      const testTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test',
        priority: 'medium' as const,
        status: 'todo' as const,
        projectId: '1',
        createdDate: new Date(),
        tags: [],
        notes: '',
      };

      useAppStore.getState().setSelectedTask(testTask);
      assert.strictEqual(useAppStore.getState().selectedTask?.id, testTask.id);
    });

    it('should clear selected task when deleted', () => {
      // Add and select a task
      useAppStore.getState().addTask({
        title: 'Selected Task',
        description: 'Will be deleted',
        priority: 'medium',
        status: 'todo',
        projectId: '1',
        tags: [],
        notes: '',
      });

      const taskId = useAppStore.getState().tasks[useAppStore.getState().tasks.length - 1].id;
      const task = useAppStore.getState().tasks.find(t => t.id === taskId);
      useAppStore.getState().setSelectedTask(task!);

      assert.notStrictEqual(useAppStore.getState().selectedTask, null);

      // Delete the task
      useAppStore.getState().deleteTask(taskId);

      // Selected task should be cleared
      assert.strictEqual(useAppStore.getState().selectedTask, null);
    });
  });

  describe('UI State Management', () => {
    it('should open task modal', () => {
      useAppStore.getState().setTaskModalOpen(true);
      assert.strictEqual(useAppStore.getState().isTaskModalOpen, true);
    });

    it('should close task modal', () => {
      useAppStore.getState().setTaskModalOpen(true);
      useAppStore.getState().setTaskModalOpen(false);
      assert.strictEqual(useAppStore.getState().isTaskModalOpen, false);
    });

    it('should open project modal', () => {
      useAppStore.getState().setProjectModalOpen(true);
      assert.strictEqual(useAppStore.getState().isProjectModalOpen, true);
    });

    it('should close project modal', () => {
      useAppStore.getState().setProjectModalOpen(true);
      useAppStore.getState().setProjectModalOpen(false);
      assert.strictEqual(useAppStore.getState().isProjectModalOpen, false);
    });

    it('should change current view', () => {
      assert.strictEqual(useAppStore.getState().currentView, 'kanban');

      useAppStore.getState().setCurrentView('calendar');
      assert.strictEqual(useAppStore.getState().currentView, 'calendar');

      useAppStore.getState().setCurrentView('kanban');
      assert.strictEqual(useAppStore.getState().currentView, 'kanban');
    });
  });

  describe('Utility Functions', () => {
    beforeEach(() => {
      // Add some test tasks
      useAppStore.setState({
        tasks: [
          {
            id: '1',
            title: 'Task 1',
            description: '',
            priority: 'medium',
            status: 'todo',
            projectId: 'project1',
            createdDate: new Date(),
            tags: [],
            notes: '',
          },
          {
            id: '2',
            title: 'Task 2',
            description: '',
            priority: 'high',
            status: 'in-progress',
            projectId: 'project1',
            createdDate: new Date(),
            tags: [],
            notes: '',
          },
          {
            id: '3',
            title: 'Task 3',
            description: '',
            priority: 'low',
            status: 'done',
            projectId: 'project2',
            createdDate: new Date(),
            tags: [],
            notes: '',
          },
        ],
      });
    });

    it('should get tasks by project', () => {
      const project1Tasks = useAppStore.getState().getTasksByProject('project1');
      assert.strictEqual(project1Tasks.length, 2);
      assert.strictEqual(project1Tasks[0].projectId, 'project1');
      assert.strictEqual(project1Tasks[1].projectId, 'project1');

      const project2Tasks = useAppStore.getState().getTasksByProject('project2');
      assert.strictEqual(project2Tasks.length, 1);
      assert.strictEqual(project2Tasks[0].projectId, 'project2');
    });

    it('should get tasks by status', () => {
      const todoTasks = useAppStore.getState().getTasksByStatus('project1', 'todo');
      assert.strictEqual(todoTasks.length, 1);
      assert.strictEqual(todoTasks[0].status, 'todo');

      const inProgressTasks = useAppStore.getState().getTasksByStatus('project1', 'in-progress');
      assert.strictEqual(inProgressTasks.length, 1);
      assert.strictEqual(inProgressTasks[0].status, 'in-progress');

      const doneTasks = useAppStore.getState().getTasksByStatus('project1', 'done');
      assert.strictEqual(doneTasks.length, 0);
    });

    it('should return empty array for non-existent project', () => {
      const tasks = useAppStore.getState().getTasksByProject('non-existent');
      assert.strictEqual(tasks.length, 0);
    });
  });
});
