/**
 * StateRenderer Component
 * Renders appropriate UI based on loading state
 * Part of US-5.6: Pull-to-Refresh & Loading States (State Pattern)
 */

import React, { ReactNode } from 'react';
import { View, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { UseLoadingStateReturn } from '../../hooks/useLoadingState';
import { ListSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

interface StateRendererProps {
  loadingState: UseLoadingStateReturn;
  onRefresh?: () => void;
  children: ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  skeletonCount?: number;
  showEmpty?: boolean;
  scrollable?: boolean;
}

export const StateRenderer: React.FC<StateRendererProps> = ({
  loadingState,
  onRefresh,
  children,
  emptyTitle = 'No Data',
  emptyMessage = 'There is no data to display',
  emptyIcon = 'package-variant',
  emptyActionLabel,
  onEmptyAction,
  skeletonCount = 5,
  showEmpty = false,
  scrollable = true,
}) => {
  const { isLoading, isRefreshing, isError, stateData, setRefreshing, setSuccess, setError } =
    loadingState;

  // Handle refresh
  const handleRefresh = async () => {
    if (onRefresh && loadingState.canRefresh) {
      setRefreshing();
      try {
        await onRefresh();
        setSuccess();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Refresh failed');
      }
    }
  };

  // Handle retry
  const handleRetry = async () => {
    if (onRefresh) {
      loadingState.setLoading('Retrying...');
      try {
        await onRefresh();
        setSuccess();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Retry failed');
      }
    }
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ListSkeleton count={skeletonCount} />
      </View>
    );
  }

  // Render error state
  if (isError) {
    return <ErrorState error={stateData.error || 'An error occurred'} onRetry={handleRetry} />;
  }

  // Render empty state
  if (showEmpty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  // Render content with pull-to-refresh
  if (scrollable) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#4F46E5']}
              tintColor="#4F46E5"
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    );
  }

  // Render content without scrolling
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
