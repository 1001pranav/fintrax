/**
 * TaskReminderObserver
 * Concrete observer for task reminder notifications
 * Part of the Observer Pattern implementation
 */

import { NotificationObserver } from './NotificationObserver';
import { NotificationData, NotificationType } from '../types';
import { navigationRef } from '../../../navigation/NavigationService';

export class TaskReminderObserver implements NotificationObserver {
  readonly id = 'task_reminder_observer';

  async update(notification: NotificationData): Promise<void> {
    console.log('[TaskReminderObserver] Received notification:', notification.title);

    // Log task reminder
    this.logTaskReminder(notification);

    // Additional processing can be added here
    // For example, updating local task data, showing in-app notification, etc.
  }

  async onNotificationTapped(notification: NotificationData): Promise<void> {
    console.log('[TaskReminderObserver] Notification tapped:', notification.title);

    // Navigate to task detail screen if task ID is provided
    if (notification.data?.taskId) {
      navigationRef.navigate('TaskDetail', {
        taskId: notification.data.taskId,
      });
    } else {
      // Navigate to tasks list
      navigationRef.navigate('Tasks');
    }
  }

  async onNotificationDismissed(notification: NotificationData): Promise<void> {
    console.log('[TaskReminderObserver] Notification dismissed:', notification.title);
    // Handle dismissal if needed
  }

  shouldHandle(notification: NotificationData): boolean {
    return (
      notification.type === NotificationType.TASK_REMINDER ||
      notification.type === NotificationType.TASK_DUE_SOON ||
      notification.type === NotificationType.TASK_OVERDUE
    );
  }

  private logTaskReminder(notification: NotificationData): void {
    // Log for analytics or debugging
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Task Reminder: ${notification.title}`);
  }
}
