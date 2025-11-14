import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useRoadmapStore } from '../roadmapStore';
import { api } from '../api';

// Mock the API
vi.mock('../api', () => ({
  api: {
    roadmaps: {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('RoadmapStore', () => {
  beforeEach(() => {
    // Reset store state
    useRoadmapStore.setState({
      roadmaps: [],
      isLoading: false,
      error: null,
      selectedRoadmap: null,
    });
    vi.clearAllMocks();
  });

  it('should fetch roadmaps successfully', async () => {
    const mockRoadmaps = [
      {
        roadmap_id: 1,
        name: 'Test Roadmap',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        progress: 50,
        status: 1,
        todo_count: 5,
      },
    ];

    vi.mocked(api.roadmaps.getAll).mockResolvedValue({ data: mockRoadmaps });

    await useRoadmapStore.getState().fetchRoadmaps();

    expect(useRoadmapStore.getState().roadmaps).toEqual(mockRoadmaps);
    expect(useRoadmapStore.getState().isLoading).toBe(false);
    expect(useRoadmapStore.getState().error).toBeNull();
  });

  it('should create a new roadmap', async () => {
    const newRoadmap = {
      roadmap_id: 2,
      name: 'New Roadmap',
      start_date: '2025-02-01',
      end_date: '2025-12-31',
      progress: 0,
      status: 1,
      todo_count: 0,
    };

    vi.mocked(api.roadmaps.create).mockResolvedValue({ data: newRoadmap });

    const result = await useRoadmapStore.getState().createRoadmap({
      name: 'New Roadmap',
      start_date: '2025-02-01',
      end_date: '2025-12-31',
      progress: 0,
    });

    expect(result).toEqual(newRoadmap);
    expect(useRoadmapStore.getState().roadmaps).toContainEqual(newRoadmap);
  });

  it('should update a roadmap', async () => {
    const existingRoadmap = {
      roadmap_id: 1,
      name: 'Old Name',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      progress: 50,
      status: 1,
      todo_count: 5,
    };

    useRoadmapStore.setState({ roadmaps: [existingRoadmap] });

    const updatedRoadmap = { ...existingRoadmap, name: 'Updated Name', progress: 75 };
    vi.mocked(api.roadmaps.update).mockResolvedValue({ data: updatedRoadmap });

    await useRoadmapStore.getState().updateRoadmap(1, { name: 'Updated Name', progress: 75 });

    expect(useRoadmapStore.getState().roadmaps[0]).toEqual(updatedRoadmap);
  });

  it('should delete a roadmap', async () => {
    const roadmap = {
      roadmap_id: 1,
      name: 'Test Roadmap',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      progress: 50,
      status: 1,
      todo_count: 5,
    };

    useRoadmapStore.setState({ roadmaps: [roadmap] });

    vi.mocked(api.roadmaps.delete).mockResolvedValue({});

    await useRoadmapStore.getState().deleteRoadmap(1);

    expect(useRoadmapStore.getState().roadmaps).toHaveLength(0);
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch roadmaps';
    vi.mocked(api.roadmaps.getAll).mockRejectedValue(new Error(errorMessage));

    await expect(useRoadmapStore.getState().fetchRoadmaps()).rejects.toThrow(errorMessage);

    expect(useRoadmapStore.getState().error).toBe(errorMessage);
    expect(useRoadmapStore.getState().isLoading).toBe(false);
  });

  it('should set selected roadmap', () => {
    const roadmap = {
      roadmap_id: 1,
      name: 'Test Roadmap',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      progress: 50,
      status: 1,
      todo_count: 5,
    };

    useRoadmapStore.getState().setSelectedRoadmap(roadmap);

    expect(useRoadmapStore.getState().selectedRoadmap).toEqual(roadmap);
  });

  it('should clear error', () => {
    useRoadmapStore.setState({ error: 'Some error' });

    useRoadmapStore.getState().clearError();

    expect(useRoadmapStore.getState().error).toBeNull();
  });
});
