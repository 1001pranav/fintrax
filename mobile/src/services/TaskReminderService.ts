/**
 * TaskReminderService
 * Service for scheduling task reminder notifications using Factory Pattern
 * Part of Sprint 5 - US-5.3: Task Reminders
 */

import { NotificationService } from '../patterns/notifications/NotificationService';
import {
  TaskReminderFactory,
  TaskReminderData,
} from '../patterns/notifications/factories/TaskReminderFactory';
import {
  TaskDueSoonFactory,
  TaskDueSoonData,
} from '../patterns/notifications/factories/TaskDueSoonFactory';
import {
  TaskOverdueFactory,
  TaskOverdueData,
} from '../patterns/notifications/factories/TaskOverdueFactory';
import { NotificationResponse } from '../patterns/notifications/types';

export class TaskReminderService {
  private static instance: TaskReminderService;

  private notificationService: NotificationService;
  private taskReminderFactory: TaskReminderFactory;
  private taskDueSoonFactory: TaskDueSoonFactory;
  private taskOverdueFactory: TaskOverdueFactory;

  // Store notification IDs for each task
  private taskNotifications: Map<string, string[]> = new Map();

  private constructor() {
    this.notificationService = NotificationService.getInstance();
    this.taskReminderFactory = new TaskReminderFactory();
    this.taskDueSoonFactory = new TaskDueSoonFactory();
    this.taskOverdueFactory = new TaskOverdueFactory();
  }

  public static getInstance(): TaskReminderService {
    if (!TaskReminderService.instance) {
      TaskReminderService.instance = new TaskReminderService();
    }
    return TaskReminderService.instance;
  }

  /**
   * Schedule reminder notifications for a task
   * @param data - Task reminder data
   * @returns Promise<NotificationResponse[]>
   */
  public async scheduleTaskReminders(data: TaskReminderData): Promise<NotificationResponse[]> {
    const responses: NotificationResponse[] = [];

    try {
      // Cancel existing notifications for this task
      await this.cancelTaskReminders(data.taskId);

      const now = new Date();
      const dueDate = new Date(data.dueDate);

      // Only schedule if due date is in the future
      if (dueDate <= now) {
        console.log('[TaskReminderService] Task is already due or overdue');
        return responses;
      }

      const notificationIds: string[] = [];

      // 1. Schedule main reminder (default 1 hour before)
      const reminderPayload = this.taskReminderFactory.createNotification(data);
      const reminderResponse = await this.notificationService.scheduleNotification(reminderPayload);
      responses.push(reminderResponse);
      if (reminderResponse.success && reminderResponse.notificationId) {
        notificationIds.push(reminderResponse.notificationId);
      }

      // 2. Schedule "due soon" notification (3 hours before)
      const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (hoursUntilDue > 3) {
        const dueSoonData: TaskDueSoonData = {
          taskId: data.taskId,
          title: data.title,
          dueDate,
          priority: data.priority,
          hoursUntilDue: 3,
        };

        const dueSoonPayload = this.taskDueSoonFactory.createNotification(dueSoonData);
        const dueSoonResponse = await this.notificationService.scheduleNotification(dueSoonPayload);
        responses.push(dueSoonResponse);
        if (dueSoonResponse.success && dueSoonResponse.notificationId) {
          notificationIds.push(dueSoonResponse.notificationId);
        }
      }

      // Store notification IDs
      this.taskNotifications.set(data.taskId, notificationIds);

      console.log(
        `[TaskReminderService] Scheduled ${notificationIds.length} reminders for task ${data.taskId}`
      );

      return responses;
    } catch (error) {
      console.error('[TaskReminderService] Error scheduling reminders:', error);
      return responses;
    }
  }

  /**
   * Schedule overdue notification for a task
   * @param data - Task overdue data
   * @returns Promise<NotificationResponse>
   */
  public async scheduleOverdueNotification(data: TaskOverdueData): Promise<NotificationResponse> {
    try {
      const payload = this.taskOverdueFactory.createNotification(data);
      const response = await this.notificationService.scheduleNotification(payload);

      if (response.success && response.notificationId) {
        const existingIds = this.taskNotifications.get(data.taskId) || [];
        existingIds.push(response.notificationId);
        this.taskNotifications.set(data.taskId, existingIds);
      }

      return response;
    } catch (error) {
      console.error('[TaskReminderService] Error scheduling overdue notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Cancel all reminder notifications for a task
   * @param taskId - Task ID
   * @returns Promise<boolean>
   */
  public async cancelTaskReminders(taskId: string): Promise<boolean> {
    try {
      const notificationIds = this.taskNotifications.get(taskId);

      if (!notificationIds || notificationIds.length === 0) {
        return true;
      }

      // Cancel all notifications for this task
      for (const notificationId of notificationIds) {
        await this.notificationService.cancelNotification(notificationId);
      }

      // Remove from map
      this.taskNotifications.delete(taskId);

      console.log(`[TaskReminderService] Cancelled reminders for task ${taskId}`);

      return true;
    } catch (error) {
      console.error('[TaskReminderService] Error cancelling reminders:', error);
      return false;
    }
  }

  /**
   * Update task reminders when task is updated
   * @param data - Updated task reminder data
   * @returns Promise<NotificationResponse[]>
   */
  public async updateTaskReminders(data: TaskReminderData): Promise<NotificationResponse[]> {
    return await this.scheduleTaskReminders(data);
  }

  /**
   * Get scheduled notification count for a task
   * @param taskId - Task ID
   * @returns number
   */
  public getScheduledCount(taskId: string): number {
    return this.taskNotifications.get(taskId)?.length || 0;
  }

  /**
   * Check if task has scheduled reminders
   * @param taskId - Task ID
   * @returns boolean
   */
  public hasScheduledReminders(taskId: string): boolean {
    return this.getScheduledCount(taskId) > 0;
  }
}

// Export singleton instance
export default TaskReminderService.getInstance();
