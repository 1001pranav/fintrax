import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, UserPreferences, UpdatePreferencesData } from '@/lib/api';

// Query keys
export const preferencesKeys = {
  all: ['preferences'] as const,
  detail: () => [...preferencesKeys.all, 'detail'] as const,
};

// Hook to fetch preferences
export function usePreferences() {
  return useQuery({
    queryKey: preferencesKeys.detail(),
    queryFn: async () => {
      const response = await api.preferences.get();
      return response.data;
    },
  });
}

// Hook to update preferences
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePreferencesData) => {
      const response = await api.preferences.update(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData<UserPreferences>(preferencesKeys.detail(), data);
    },
  });
}

// Hook to reset preferences
export function useResetPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.preferences.reset();
      return response.data;
    },
    onSuccess: (data) => {
      // Update the cache with the reset data
      queryClient.setQueryData<UserPreferences>(preferencesKeys.detail(), data);
    },
  });
}

// Hook to update specific preference fields with optimistic updates
export function useUpdatePreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePreferencesData) => {
      const response = await api.preferences.update(data);
      return response.data;
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: preferencesKeys.detail() });

      // Snapshot the previous value
      const previousPreferences = queryClient.getQueryData<UserPreferences>(
        preferencesKeys.detail()
      );

      // Optimistically update to the new value
      if (previousPreferences) {
        queryClient.setQueryData<UserPreferences>(preferencesKeys.detail(), {
          ...previousPreferences,
          ...newData,
        });
      }

      // Return a context object with the snapshotted value
      return { previousPreferences };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPreferences) {
        queryClient.setQueryData<UserPreferences>(
          preferencesKeys.detail(),
          context.previousPreferences
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: preferencesKeys.detail() });
    },
  });
}
