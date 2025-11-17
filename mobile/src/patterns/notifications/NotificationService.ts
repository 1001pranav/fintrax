/**
 * NotificationService - Singleton with Observer Pattern
 * Central notification management service
 * Manages notification observers and handles notification delivery
 * Part of Sprint 5 - US-5.2: Push Notifications
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationObserver } from './observers/NotificationObserver';
import { TaskReminderObserver } from './observers/TaskReminderObserver';
import { FinanceAlertObserver } from './observers/FinanceAlertObserver';
import { SystemNotificationObserver } from './observers/SystemNotificationObserver';
import {
  NotificationData,
  NotificationPayload,
  NotificationResponse,
  NotificationType,
  NotificationPriority,
} from './types';

const PUSH_TOKEN_KEY = 'expo_push_token';
const NOTIFICATION_PERMISSION_KEY = 'notification_permission_requested';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  // Singleton instance
  private static instance: NotificationService;

  // Observer management
  private observers: Map<string, NotificationObserver> = new Map();
  private listeners: Notifications.Subscription[] = [];

  // Notification state
  private pushToken: string | null = null;
  private isInitialized = false;

  // Private constructor for Singleton pattern
  private constructor() {
    this.registerDefaultObservers();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[NotificationService] Already initialized');
      return;
    }

    try {
      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('[NotificationService] Notification permissions denied');
        return;
      }

      // Get push token
      this.pushToken = await this.registerForPushNotifications();
      if (this.pushToken) {
        await AsyncStorage.setItem(PUSH_TOKEN_KEY, this.pushToken);
        console.log('[NotificationService] Push token:', this.pushToken);
      }

      // Set up listeners
      this.setupNotificationListeners();

      this.isInitialized = true;
      console.log('[NotificationService] Initialized successfully');
    } catch (error) {
      console.error('[NotificationService] Initialization error:', error);
      throw error;
    }
  }

  /**
   * Register default observers
   */
  private registerDefaultObservers(): void {
    this.attach(new TaskReminderObserver());
    this.attach(new FinanceAlertObserver());
    this.attach(new SystemNotificationObserver());
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<boolean> {
    try {
      // Check if already requested
      const alreadyRequested = await AsyncStorage.getItem(
        NOTIFICATION_PERMISSION_KEY
      );

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request if not already determined
      if (existingStatus !== 'granted' && !alreadyRequested) {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true');
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('[NotificationService] Permission request error:', error);
      return false;
    }
  }

  /**
   * Register for push notifications
   */
  private async registerForPushNotifications(): Promise<string | null> {
    try {
      // Physical device required for push notifications
      if (!Device.isDevice) {
        console.warn('[NotificationService] Push notifications require physical device');
        return null;
      }

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // TODO: Replace with actual project ID
      });

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4F46E5',
        });
      }

      return token.data;
    } catch (error) {
      console.error('[NotificationService] Token registration error:', error);
      return null;
    }
  }

  /**
   * Set up notification listeners
   */
  private setupNotificationListeners(): void {
    // Notification received while app is in foreground
    this.listeners.push(
      Notifications.addNotificationReceivedListener((notification) => {
        this.handleNotificationReceived(notification);
      })
    );

    // Notification tapped
    this.listeners.push(
      Notifications.addNotificationResponseReceivedListener((response) => {
        this.handleNotificationTapped(response);
      })
    );
  }

  /**
   * Handle notification received
   */
  private async handleNotificationReceived(
    notification: Notifications.Notification
  ): Promise<void> {
    const notificationData: NotificationData = {
      id: notification.request.identifier,
      type: (notification.request.content.data?.type as NotificationType) ||
        NotificationType.SYSTEM,
      title: notification.request.content.title || '',
      body: notification.request.content.body || '',
      data: notification.request.content.data,
    };

    await this.notifyObservers(notificationData);
  }

  /**
   * Handle notification tapped
   */
  private async handleNotificationTapped(
    response: Notifications.NotificationResponse
  ): Promise<void> {
    const notificationData: NotificationData = {
      id: response.notification.request.identifier,
      type: (response.notification.request.content.data?.type as NotificationType) ||
        NotificationType.SYSTEM,
      title: response.notification.request.content.title || '',
      body: response.notification.request.content.body || '',
      data: response.notification.request.content.data,
    };

    // Notify observers about tap
    for (const observer of this.observers.values()) {
      if (observer.shouldHandle(notificationData) && observer.onNotificationTapped) {
        await observer.onNotificationTapped(notificationData);
      }
    }
  }

  /**
   * Attach an observer
   */
  public attach(observer: NotificationObserver): void {
    this.observers.set(observer.id, observer);
    console.log('[NotificationService] Observer attached:', observer.id);
  }

  /**
   * Detach an observer
   */
  public detach(observerId: string): void {
    this.observers.delete(observerId);
    console.log('[NotificationService] Observer detached:', observerId);
  }

  /**
   * Notify all relevant observers
   */
  private async notifyObservers(notification: NotificationData): Promise<void> {
    for (const observer of this.observers.values()) {
      if (observer.shouldHandle(notification)) {
        try {
          await observer.update(notification);
        } catch (error) {
          console.error(
            `[NotificationService] Observer ${observer.id} error:`,
            error
          );
        }
      }
    }
  }

  /**
   * Schedule a local notification
   */
  public async scheduleNotification(
    payload: NotificationPayload
  ): Promise<NotificationResponse> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          sound: payload.sound !== false,
          priority: this.mapPriority(payload.priority),
          vibrate: payload.vibrate,
          badge: payload.badge,
        },
        trigger: payload.trigger || null,
      });

      return {
        success: true,
        notificationId,
      };
    } catch (error) {
      console.error('[NotificationService] Schedule error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Cancel a scheduled notification
   */
  public async cancelNotification(notificationId: string): Promise<boolean> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return true;
    } catch (error) {
      console.error('[NotificationService] Cancel error:', error);
      return false;
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  public async cancelAllNotifications(): Promise<boolean> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return true;
    } catch (error) {
      console.error('[NotificationService] Cancel all error:', error);
      return false;
    }
  }

  /**
   * Get all scheduled notifications
   */
  public async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('[NotificationService] Get scheduled error:', error);
      return [];
    }
  }

  /**
   * Get push token
   */
  public getPushToken(): string | null {
    return this.pushToken;
  }

  /**
   * Check if initialized
   */
  public isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Map notification priority
   */
  private mapPriority(
    priority?: 'min' | 'low' | 'default' | 'high' | 'max'
  ): Notifications.AndroidNotificationPriority {
    switch (priority) {
      case 'min':
        return Notifications.AndroidImportance.MIN;
      case 'low':
        return Notifications.AndroidImportance.LOW;
      case 'high':
        return Notifications.AndroidImportance.HIGH;
      case 'max':
        return Notifications.AndroidImportance.MAX;
      default:
        return Notifications.AndroidImportance.DEFAULT;
    }
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    // Remove listeners
    this.listeners.forEach((listener) => listener.remove());
    this.listeners = [];

    // Clear observers
    this.observers.clear();

    this.isInitialized = false;
    console.log('[NotificationService] Cleaned up');
  }
}

// Export singleton instance
export default NotificationService.getInstance();
