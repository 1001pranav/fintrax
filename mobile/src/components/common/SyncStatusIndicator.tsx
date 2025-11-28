/**
 * Sync Status Indicator Component
 * Displays sync status in the app bar (US-4.2 - Observer Pattern)
 * Shows syncing, synced, or error states
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { offlineManager } from '../../services';
import { colors } from '../../theme';

interface SyncStatusProps {
  onPress?: () => void;
}

export const SyncStatusIndicator: React.FC<SyncStatusProps> = ({ onPress }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    checkSyncStatus();

    // Poll sync status every 5 seconds
    const interval = setInterval(checkSyncStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkSyncStatus = async () => {
    try {
      const online = offlineManager.isConnected();
      const count = await offlineManager.getPendingCount();
      const lastSync = await offlineManager.getLastSyncTime();

      setIsOnline(online);
      setPendingCount(count);
      setLastSyncTime(lastSync);
      setIsSyncing(count > 0 && online);
    } catch (error) {
      console.error('Error checking sync status:', error);
    }
  };

  const handleManualSync = async () => {
    if (onPress) {
      onPress();
    } else {
      try {
        await offlineManager.syncAll();
        await checkSyncStatus();
      } catch (error) {
        console.error('Manual sync failed:', error);
      }
    }
  };

  const getStatusIcon = () => {
    if (!isOnline) {
      return <Ionicons name="cloud-offline" size={18} color={colors.textSecondary} />;
    }

    if (isSyncing || pendingCount > 0) {
      return <ActivityIndicator size="small" color={colors.primary} />;
    }

    return <Ionicons name="cloud-done" size={18} color={colors.success} />;
  };

  const getStatusText = () => {
    if (!isOnline) {
      return 'Offline';
    }

    if (isSyncing) {
      return `Syncing ${pendingCount}...`;
    }

    if (pendingCount > 0) {
      return `${pendingCount} pending`;
    }

    if (lastSyncTime) {
      const time = new Date(lastSyncTime);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}h ago`;
    }

    return 'Synced';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleManualSync} activeOpacity={0.7}>
      <View style={styles.content}>
        {getStatusIcon()}
        <Text style={styles.text}>{getStatusText()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
