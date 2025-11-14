import { create } from 'zustand';
import { api, Roadmap, CreateRoadmapData } from './api';

interface RoadmapStore {
  roadmaps: Roadmap[];
  isLoading: boolean;
  error: string | null;
  selectedRoadmap: Roadmap | null;

  // Actions
  fetchRoadmaps: () => Promise<void>;
  fetchRoadmapById: (id: number) => Promise<void>;
  createRoadmap: (data: CreateRoadmapData) => Promise<Roadmap>;
  updateRoadmap: (id: number, data: Partial<CreateRoadmapData>) => Promise<void>;
  deleteRoadmap: (id: number) => Promise<void>;
  setSelectedRoadmap: (roadmap: Roadmap | null) => void;
  clearError: () => void;
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  roadmaps: [],
  isLoading: false,
  error: null,
  selectedRoadmap: null,

  fetchRoadmaps: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.roadmaps.getAll();
      set({ roadmaps: response.data, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch roadmaps';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchRoadmapById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.roadmaps.getById(id);
      set({ selectedRoadmap: response.data, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch roadmap';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createRoadmap: async (data: CreateRoadmapData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.roadmaps.create(data);
      const newRoadmap = response.data;
      set((state) => ({
        roadmaps: [...state.roadmaps, newRoadmap],
        isLoading: false,
      }));
      return newRoadmap;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create roadmap';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateRoadmap: async (id: number, data: Partial<CreateRoadmapData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.roadmaps.update(id, data);
      const updatedRoadmap = response.data;
      set((state) => ({
        roadmaps: state.roadmaps.map((roadmap) =>
          roadmap.roadmap_id === id ? updatedRoadmap : roadmap
        ),
        selectedRoadmap: state.selectedRoadmap?.roadmap_id === id ? updatedRoadmap : state.selectedRoadmap,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update roadmap';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteRoadmap: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.roadmaps.delete(id);
      set((state) => ({
        roadmaps: state.roadmaps.filter((roadmap) => roadmap.roadmap_id !== id),
        selectedRoadmap: state.selectedRoadmap?.roadmap_id === id ? null : state.selectedRoadmap,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete roadmap';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  setSelectedRoadmap: (roadmap: Roadmap | null) => {
    set({ selectedRoadmap: roadmap });
  },

  clearError: () => {
    set({ error: null });
  },
}));
