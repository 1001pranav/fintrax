/**
 * SystemNotificationObserver
 * Concrete observer for system notifications
 * Part of the Observer Pattern implementation
 */

import { NotificationObserver } from './NotificationObserver';
import { NotificationData, NotificationType } from '../types';

export class SystemNotificationObserver implements NotificationObserver {
  readonly id = 'system_notification_observer';

  async update(notification: NotificationData): Promise<void> {
    console.log('[SystemNotificationObserver] Received notification:', notification.title);

    // Log system notification
    this.logSystemNotification(notification);
  }

  async onNotificationTapped(notification: NotificationData): Promise<void> {
    console.log('[SystemNotificationObserver] Notification tapped:', notification.title);
    // Handle based on notification data
    if (notification.data?.action) {
      this.handleAction(notification.data.action);
    }
  }

  async onNotificationDismissed(notification: NotificationData): Promise<void> {
    console.log(
      '[SystemNotificationObserver] Notification dismissed:',
      notification.title
    );
  }

  shouldHandle(notification: NotificationData): boolean {
    return notification.type === NotificationType.SYSTEM;
  }

  private logSystemNotification(notification: NotificationData): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] System Notification: ${notification.title}`);
  }

  private handleAction(action: string): void {
    console.log('[SystemNotificationObserver] Handling action:', action);
    // Handle specific system actions
  }
}
