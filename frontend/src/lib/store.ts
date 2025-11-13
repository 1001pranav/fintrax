"use client";
import { create } from 'zustand';
import { Project, Task } from '@/constants/interfaces';
import { api, Project as ApiProject, CreateProjectData } from './api';

interface AppState {
    projects: Project[];
    tasks: Task[];
    selectedProject: Project | null;
    selectedTask: Task | null;
    isTaskModalOpen: boolean;
    isProjectModalOpen: boolean;
    currentView: 'kanban' | 'calendar';
    isLoading: boolean;
    error: string | null;

    // Project actions
    fetchProjects: () => Promise<void>;
    addProject: (project: Omit<Project, 'id' | 'createdDate'>) => Promise<void>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
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

// Helper function to convert API project to frontend project format
const convertApiProject = (apiProject: ApiProject): Project => ({
    id: apiProject.project_id.toString(),
    name: apiProject.name,
    description: apiProject.description,
    color: apiProject.color,
    createdDate: new Date(apiProject.created_at),
    coverImage: apiProject.cover_image,
    taskCount: apiProject.task_count,
    status: apiProject.status === 1 ? 'active' : apiProject.status === 2 ? 'archived' : 'deleted'
});

export const useAppStore = create<AppState>((set, get) => ({
    projects: [],
    tasks: [
        // Keep mock tasks for now - these will be managed through the todo API separately
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
    isLoading: false,
    error: null,

    // Fetch projects from backend
    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.projects.getAll();
            const projects = response.data.map(convertApiProject);
            set({ projects, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch projects',
                isLoading: false
            });
        }
    },

    // Add project with backend API
    addProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
            const createData: CreateProjectData = {
                name: projectData.name,
                description: projectData.description,
                color: projectData.color,
                cover_image: projectData.coverImage,
            };
            const response = await api.projects.create(createData);
            const newProject = convertApiProject(response.data);
            set((state) => ({
                projects: [...state.projects, newProject],
                isLoading: false
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to add project',
                isLoading: false
            });
            throw error;
        }
    },

    // Update project with backend API
    updateProject: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const updateData: Partial<CreateProjectData> = {
                ...(updates.name && { name: updates.name }),
                ...(updates.description && { description: updates.description }),
                ...(updates.color && { color: updates.color }),
                ...(updates.coverImage && { cover_image: updates.coverImage }),
            };
            const response = await api.projects.update(parseInt(id), updateData);
            const updatedProject = convertApiProject(response.data);
            set((state) => ({
                projects: state.projects.map(project =>
                    project.id === id ? updatedProject : project
                ),
                isLoading: false
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update project',
                isLoading: false
            });
            throw error;
        }
    },

    // Delete project with backend API
    deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.projects.delete(parseInt(id));
            set((state) => ({
                projects: state.projects.filter(project => project.id !== id),
                tasks: state.tasks.filter(task => task.projectId !== id),
                selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
                isLoading: false
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete project',
                isLoading: false
            });
            throw error;
        }
    },

    setSelectedProject: (project) => set({ selectedProject: project }),

    // Task actions (keeping mock implementation for now - will be connected to todo API separately)
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
