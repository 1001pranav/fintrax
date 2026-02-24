# TanStack Query Integration

This document explains the TanStack Query (React Query) integration in the Fintrax frontend application.

## Overview

TanStack Query has been integrated to provide:
- **Automatic caching** - Data is cached and reused across components
- **Background refetching** - Data stays fresh automatically
- **Optimistic updates** - UI updates immediately, rolls back on error
- **Loading & error states** - Built-in state management
- **Request deduplication** - Multiple components requesting same data = single network request
- **DevTools** - Visual debugging of queries and mutations

## Architecture

### 1. Query Client Setup
**File**: `src/lib/queryClient.ts`

The QueryClient is configured with sensible defaults:
```typescript
staleTime: 5 minutes    // Data is fresh for 5 minutes
gcTime: 10 minutes      // Cache persists for 10 minutes
retry: 1                // Retry failed requests once
refetchOnWindowFocus: false  // Don't refetch when window regains focus
```

### 2. Query Provider
**File**: `src/components/QueryProvider.tsx`

Wraps the app in `QueryClientProvider` and includes DevTools for development.

**Integrated in**: `src/app/layout.tsx`

### 3. Preferences Hooks
**File**: `src/hooks/usePreferences.ts`

Four custom hooks for preferences management:

#### `usePreferences()`
Fetches user preferences with automatic caching.

```typescript
const { data, isLoading, error } = usePreferences();
```

#### `useUpdatePreference()`
Updates preferences with optimistic updates. UI updates immediately, rolls back on error.

```typescript
const updateMutation = useUpdatePreference();
await updateMutation.mutateAsync({ theme: 'dark' });
```

#### `useUpdatePreferences()`
Updates preferences without optimistic updates (server confirmation required).

```typescript
const updateMutation = useUpdatePreferences();
await updateMutation.mutateAsync({ theme: 'dark' });
```

#### `useResetPreferences()`
Resets all preferences to defaults.

```typescript
const resetMutation = useResetPreferences();
await resetMutation.mutateAsync();
```

## Usage Examples

### Settings Page
**File**: `src/app/settings/page.tsx`

```typescript
export default function SettingsPage() {
  // Fetch preferences
  const { data: preferences, isLoading, error } = usePreferences();

  // Mutations
  const updateMutation = useUpdatePreference();
  const resetMutation = useResetPreferences();

  const handleSave = async (data: any) => {
    await updateMutation.mutateAsync(data);
  };

  // Access mutation state
  const isSaving = updateMutation.isPending;
  const hasError = updateMutation.error;
}
```

### Theme Hook
**File**: `src/hooks/useTheme.ts`

The theme hook automatically subscribes to preferences changes:

```typescript
export function useTheme() {
  const { data: preferences } = usePreferences();

  useEffect(() => {
    // Apply theme to DOM
    applyTheme(preferences?.theme);
  }, [preferences?.theme]);
}
```

## Benefits Over Zustand

| Feature | TanStack Query | Zustand |
|---------|---------------|---------|
| Server state management | ✅ Built-in | ❌ Manual |
| Automatic caching | ✅ Yes | ❌ No |
| Background refetching | ✅ Yes | ❌ No |
| Optimistic updates | ✅ Built-in | ⚠️ Manual |
| Request deduplication | ✅ Automatic | ❌ No |
| Loading states | ✅ Built-in | ⚠️ Manual |
| Error handling | ✅ Built-in | ⚠️ Manual |
| DevTools | ✅ Yes | ⚠️ Limited |
| Offline support | ✅ Built-in | ❌ No |

**Note**: Zustand is still useful for **client-side state** (UI state, form state, etc.). TanStack Query is for **server state** (API data).

## Query Keys

Query keys are used for cache management and invalidation:

```typescript
export const preferencesKeys = {
  all: ['preferences'],
  detail: () => ['preferences', 'detail'],
};
```

### Invalidating Queries

To force a refetch:
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { preferencesKeys } from '@/hooks/usePreferences';

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: preferencesKeys.detail() });
```

## DevTools

The React Query DevTools are available in development mode:
- Press the **TanStack Query icon** in the bottom-right corner
- View all queries and their states
- Inspect cache data
- Trigger refetches manually
- Monitor network activity

## Best Practices

### 1. Use Optimistic Updates for Better UX
```typescript
const updateMutation = useUpdatePreference();
// UI updates immediately, rolls back on error
await updateMutation.mutateAsync({ theme: 'dark' });
```

### 2. Handle Loading States
```typescript
const { data, isLoading, error } = usePreferences();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <Settings data={data} />;
```

### 3. Use Mutation States
```typescript
const mutation = useUpdatePreference();

<button disabled={mutation.isPending}>
  {mutation.isPending ? 'Saving...' : 'Save'}
</button>
```

### 4. Don't Fetch in useEffect
❌ Bad:
```typescript
useEffect(() => {
  fetchPreferences();
}, []);
```

✅ Good:
```typescript
const { data } = usePreferences();
// Data is automatically fetched
```

## Migration from Zustand

The old Zustand store (`src/lib/preferencesStore.ts`) can still be used for:
- Client-side persistence
- Fallback data when offline
- Local-only preferences

But for server-synced preferences, use TanStack Query hooks instead.

## Future Enhancements

Consider integrating TanStack Query for other API resources:
- Projects (`useProjects`, `useCreateProject`, `useUpdateProject`)
- Tasks (`useTasks`, `useCreateTask`, `useUpdateTask`)
- Finance (`useFinance`, `useTransactions`)
- Roadmaps (`useRoadmaps`)

This would provide consistent data management across the entire app.

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Tutorial](https://tanstack.com/query/latest/docs/react/quick-start)
- [Best Practices](https://tkdodo.eu/blog/practical-react-query)
