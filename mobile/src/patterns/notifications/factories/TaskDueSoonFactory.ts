/**
 * TaskDueSoonFactory
 * Concrete factory for creating task due soon notifications
 * Part of the Factory Pattern implementation
 */

import { NotificationFactory } from './NotificationFactory';
import { NotificationPayload, NotificationType } from '../types';

export interface TaskDueSoonData {
  taskId: string;
  title: string;
  dueDate: Date;
  priority?: number;
  hoursUntilDue?: number;
}

export class TaskDueSoonFactory implements NotificationFactory {
  createNotification(data: TaskDueSoonData): NotificationPayload {
    const { taskId, title, dueDate, priority = 1, hoursUntilDue = 3 } = data;

    // Calculate trigger time (e.g., 3 hours before due)
    const triggerDate = new Date(dueDate);
    triggerDate.setHours(triggerDate.getHours() - hoursUntilDue);

    const notificationTitle = '⏰ Task Due Soon';
    const notificationBody = `${title} is due in ${hoursUntilDue} hours`;

    return {
      title: notificationTitle,
      body: notificationBody,
      data: {
        type: NotificationType.TASK_DUE_SOON,
        taskId,
        priority,
        hoursUntilDue,
      },
      trigger: {
        date: triggerDate,
        repeats: false,
      },
      sound: true,
      priority: 'high',
      badge: 1,
    };
  }

  getType(): NotificationType {
    return NotificationType.TASK_DUE_SOON;
  }
}
