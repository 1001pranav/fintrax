/**
 * useNotifications Hook
 * Custom React hook for notification management
 * Provides easy access to NotificationService in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '../patterns/notifications/NotificationService';
import { NotificationPayload, NotificationResponse } from '../patterns/notifications/types';
import * as Notifications from 'expo-notifications';

export interface UseNotificationsReturn {
  isInitialized: boolean;
  pushToken: string | null;
  hasPermission: boolean;
  scheduledNotifications: Notifications.NotificationRequest[];
  scheduleNotification: (payload: NotificationPayload) => Promise<NotificationResponse>;
  cancelNotification: (notificationId: string) => Promise<boolean>;
  cancelAllNotifications: () => Promise<boolean>;
  refreshScheduledNotifications: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState<
    Notifications.NotificationRequest[]
  >([]);

  const notificationService = NotificationService.getInstance();

  /**
   * Check permissions
   */
  const checkPermissions = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === 'granted');
  }, []);

  /**
   * Request permissions
   */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    return granted;
  }, []);

  /**
   * Initialize service
   */
  useEffect(() => {
    const initializeService = async () => {
      try {
        await notificationService.initialize();
        setIsInitialized(notificationService.isServiceInitialized());
        setPushToken(notificationService.getPushToken());
        await checkPermissions();
        await refreshScheduledNotifications();
      } catch (error) {
        console.error('[useNotifications] Initialization error:', error);
      }
    };

    initializeService();
  }, [notificationService, checkPermissions]);

  /**
   * Refresh scheduled notifications
   */
  const refreshScheduledNotifications = useCallback(async () => {
    const notifications = await notificationService.getScheduledNotifications();
    setScheduledNotifications(notifications);
  }, [notificationService]);

  /**
   * Schedule a notification
   */
  const scheduleNotification = useCallback(
    async (payload: NotificationPayload): Promise<NotificationResponse> => {
      const result = await notificationService.scheduleNotification(payload);
      if (result.success) {
        await refreshScheduledNotifications();
      }
      return result;
    },
    [notificationService, refreshScheduledNotifications]
  );

  /**
   * Cancel a notification
   */
  const cancelNotification = useCallback(
    async (notificationId: string): Promise<boolean> => {
      const result = await notificationService.cancelNotification(notificationId);
      if (result) {
        await refreshScheduledNotifications();
      }
      return result;
    },
    [notificationService, refreshScheduledNotifications]
  );

  /**
   * Cancel all notifications
   */
  const cancelAllNotifications = useCallback(async (): Promise<boolean> => {
    const result = await notificationService.cancelAllNotifications();
    if (result) {
      await refreshScheduledNotifications();
    }
    return result;
  }, [notificationService, refreshScheduledNotifications]);

  return {
    isInitialized,
    pushToken,
    hasPermission,
    scheduledNotifications,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    refreshScheduledNotifications,
    requestPermissions,
  };
};
