/**
 * TaskOverdueFactory
 * Concrete factory for creating task overdue notifications
 * Part of the Factory Pattern implementation
 */

import { NotificationFactory } from './NotificationFactory';
import { NotificationPayload, NotificationType } from '../types';

export interface TaskOverdueData {
  taskId: string;
  title: string;
  dueDate: Date;
  priority?: number;
}

export class TaskOverdueFactory implements NotificationFactory {
  createNotification(data: TaskOverdueData): NotificationPayload {
    const { taskId, title, dueDate, priority = 1 } = data;

    // Calculate how long overdue
    const now = new Date();
    const overdueDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    const notificationTitle = '🚨 Task Overdue';
    const notificationBody =
      overdueDays > 0
        ? `${title} is ${overdueDays} day${overdueDays > 1 ? 's' : ''} overdue`
        : `${title} is overdue`;

    return {
      title: notificationTitle,
      body: notificationBody,
      data: {
        type: NotificationType.TASK_OVERDUE,
        taskId,
        priority,
        overdueDays,
      },
      trigger: null, // Immediate notification
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250],
      badge: 1,
    };
  }

  getType(): NotificationType {
    return NotificationType.TASK_OVERDUE;
  }
}
