import { describe, it, expect } from '@jest/globals';
import { useAppStore } from '../store';

describe('useAppStore - Basic Tests', () => {
  it('should have initial state', () => {
    const state = useAppStore.getState();
    expect(state).toBeDefined();
    expect(state.projects).toBeDefined();
    expect(Array.isArray(state.projects)).toBe(true);
    expect(state.tasks).toBeDefined();
    expect(Array.isArray(state.tasks)).toBe(true);
  });

  it('should have UI state properties', () => {
    const state = useAppStore.getState();
    expect(state.isTaskModalOpen).toBe(false);
    expect(state.isProjectModalOpen).toBe(false);
    expect(state.currentView).toBe('kanban');
  });
});
