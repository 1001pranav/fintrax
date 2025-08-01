"use client";
import { create } from 'zustand';
import { Project, Task } from '@/constants/interfaces';


interface AppState {
    projects: Project[];
    tasks: Task[];
    selectedProject: Project | null;
    selectedTask: Task | null;
    isTaskModalOpen: boolean;
    isProjectModalOpen: boolean;
    currentView: 'kanban' | 'calendar';
    
    // Project actions
    addProject: (project: Omit<Project, 'id' | 'createdDate'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    setSelectedProject: (project: Project | null) => void;
    
    // Task actions
    addTask: (task: Omit<Task, 'id' | 'createdDate'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, newStatus: Task['status']) => void;
    setSelectedTask: (task: Task | null) => void;
    
    // UI actions
    setTaskModalOpen: (open: boolean) => void;
    setProjectModalOpen: (open: boolean) => void;
    setCurrentView: (view: 'kanban' | 'calendar') => void;
    
    // Utility functions
    getTasksByProject: (projectId: string) => Task[];
    getTasksByStatus: (projectId: string, status: Task['status']) => Task[];
}


export const useAppStore = create<AppState>((set, get) => ({
    projects: [
        {
            id: '1',
            name: 'Web Development',
            description: 'Frontend and backend development tasks',
            color: '#3B82F6',
            createdDate: new Date(),
            taskCount: 8
        },
        {
            id: '2', 
            name: 'Marketing Campaign',
            description: 'Q4 marketing initiatives and campaigns',
            color: '#10B981',
            createdDate: new Date(),
            taskCount: 5
        }
    ],
    tasks: [
        {
            id: '1',
            title: 'Design Homepage Layout',
            description: 'Create wireframes and mockups for the new homepage',
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            tags:[{
                id: '1',
                name: 'design',
                color: '#F59E0B'
            }, {
                id: '2',
                name: 'frontend',
                color: '#3B82F6'
            }
            ],
            priority: 'high',
            status: 'in-progress',
            projectId: '1',
            createdDate: new Date(),
        },
        {
            id: '2',
            title: 'Implement Authentication',
            description: 'Set up user login and registration system',
            tags: [{
                id: '1',
                name: 'backend',
                color: '#F59E0B'
            }, {
                id: '2',
                name: 'security',
                color: '#EF4444'
            }],
            priority: 'high',
            status: 'todo',
            projectId: '1', 
            createdDate: new Date()
        },
        {
            id: '3',
            title: 'Create Social Media Content',
            description: 'Develop content calendar for social platforms',
            tags: [{
                id: '3',
                name: 'marketing',
                color: '#8B5CF6'
            }, {
                id: '4',
                name: 'content',
                color: '#06B6D4'
            }],
            priority: 'medium',
            status: 'done',
            projectId: '2',
            createdDate: new Date()
        }
    ],
    selectedProject: null,
    selectedTask: null,
    isTaskModalOpen: false,
    isProjectModalOpen: false,
    currentView: 'kanban',

    addProject: (projectData) => set((state) => {
        const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
        createdDate: new Date(),
        taskCount: 0
        };
        return { projects: [...state.projects, newProject] };
    }),

    updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
        )
    })),

    deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(project => project.id !== id),
        tasks: state.tasks.filter(task => task.projectId !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject
    })),

    setSelectedProject: (project) => set({ selectedProject: project }),

    addTask: (taskData) => set((state) => {
        const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdDate: new Date()
        };
        return { tasks: [...state.tasks, newTask] };
    }),

    updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
        )
    })),

    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id && task.parentTaskId !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
    })),

    moveTask: (taskId, newStatus) => set((state) => ({
        tasks: state.tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
        )
    })),

    setSelectedTask: (task) => set({ selectedTask: task }),
    setTaskModalOpen: (open) => set({ isTaskModalOpen: open }),
    setProjectModalOpen: (open) => set({ isProjectModalOpen: open }),
    setCurrentView: (view) => set({ currentView: view }),

    getTasksByProject: (projectId) => {
        const state = get();
        return state.tasks.filter(task => task.projectId === projectId);
    },

    getTasksByStatus: (projectId, status) => {
        const state = get();
        return state.tasks.filter(task => task.projectId === projectId && task.status === status);
    }
}));
