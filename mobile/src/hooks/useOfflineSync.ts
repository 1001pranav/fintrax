/**
 * useOfflineSync Hook
 * Custom hook for offline synchronization operations
 */

import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { offlineManager } from '../services';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected && state.isInternetReachable || false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update pending count periodically
  useEffect(() => {
    const updatePendingCount = async () => {
      const count = await offlineManager.getPendingCount();
      setPendingCount(count);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Update last sync time
  useEffect(() => {
    const updateLastSyncTime = async () => {
      const time = await offlineManager.getLastSyncTime();
      setLastSyncTime(time);
    };

    updateLastSyncTime();
  }, []);

  // Manual sync trigger
  const syncNow = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      await offlineManager.syncAll();
      const time = await offlineManager.getLastSyncTime();
      setLastSyncTime(time);
      const count = await offlineManager.getPendingCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing]);

  // Retry failed operations
  const retryFailed = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      await offlineManager.retryFailed();
      const count = await offlineManager.getPendingCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncTime,
    syncNow,
    retryFailed,
  };
};
