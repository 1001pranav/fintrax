"use client";
import { create } from 'zustand';
import { Project } from '@/constants/interfaces';
import { api, Project as ApiProject, CreateProjectData } from './api';

interface AppState {
    projects: Project[];
    selectedProject: Project | null;
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

    // UI actions
    setTaskModalOpen: (open: boolean) => void;
    setProjectModalOpen: (open: boolean) => void;
    setCurrentView: (view: 'kanban' | 'calendar') => void;
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
    selectedProject: null,
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

    // UI actions
    setTaskModalOpen: (open) => set({ isTaskModalOpen: open }),
    setProjectModalOpen: (open) => set({ isProjectModalOpen: open }),
    setCurrentView: (view) => set({ currentView: view })
}));
