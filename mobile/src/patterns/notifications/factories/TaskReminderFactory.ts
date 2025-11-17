/**
 * TaskReminderFactory
 * Concrete factory for creating task reminder notifications
 * Part of the Factory Pattern implementation
 */

import { NotificationFactory } from './NotificationFactory';
import { NotificationPayload, NotificationType } from '../types';

export interface TaskReminderData {
  taskId: string;
  title: string;
  dueDate: Date;
  priority?: number;
  reminderMinutesBefore?: number;
}

export class TaskReminderFactory implements NotificationFactory {
  createNotification(data: TaskReminderData): NotificationPayload {
    const { taskId, title, dueDate, priority = 1, reminderMinutesBefore = 60 } = data;

    // Calculate trigger time (remind before due date)
    const triggerDate = new Date(dueDate);
    triggerDate.setMinutes(triggerDate.getMinutes() - reminderMinutesBefore);

    // Determine priority based on task priority
    const notificationPriority = this.mapPriority(priority);

    // Create notification title and body
    const notificationTitle = '📋 Task Reminder';
    const notificationBody = `Don't forget: ${title}`;

    return {
      title: notificationTitle,
      body: notificationBody,
      data: {
        type: NotificationType.TASK_REMINDER,
        taskId,
        priority,
      },
      trigger: {
        date: triggerDate,
        repeats: false,
      },
      sound: true,
      priority: notificationPriority,
      badge: 1,
    };
  }

  getType(): NotificationType {
    return NotificationType.TASK_REMINDER;
  }

  private mapPriority(taskPriority: number): 'min' | 'low' | 'default' | 'high' | 'max' {
    if (taskPriority >= 4) return 'max';
    if (taskPriority === 3) return 'high';
    if (taskPriority === 2) return 'default';
    return 'low';
  }
}
