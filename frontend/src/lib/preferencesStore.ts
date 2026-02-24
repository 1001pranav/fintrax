import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, UserPreferences, UpdatePreferencesData } from './api';

interface PreferencesState {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPreferences: () => Promise<void>;
  updatePreferences: (data: UpdatePreferencesData) => Promise<void>;
  resetPreferences: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  setCurrency: (currency: string) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: null,
      isLoading: false,
      error: null,

      fetchPreferences: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.preferences.get();
          set({ preferences: response.data, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch preferences',
            isLoading: false,
          });
        }
      },

      updatePreferences: async (data: UpdatePreferencesData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.preferences.update(data);
          set({ preferences: response.data, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update preferences',
            isLoading: false,
          });
          throw error;
        }
      },

      resetPreferences: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.preferences.reset();
          set({ preferences: response.data, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to reset preferences',
            isLoading: false,
          });
          throw error;
        }
      },

      setTheme: async (theme: 'light' | 'dark' | 'system') => {
        await get().updatePreferences({ theme });
      },

      setLanguage: async (language: string) => {
        await get().updatePreferences({ language });
      },

      setCurrency: async (currency: string) => {
        await get().updatePreferences({ currency });
      },
    }),
    {
      name: 'preferences-storage',
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);
