/**
 * Notification Types and Interfaces
 * Defines types for the notification system
 */

export enum NotificationType {
  TASK_REMINDER = 'task_reminder',
  TASK_DUE_SOON = 'task_due_soon',
  TASK_OVERDUE = 'task_overdue',
  FINANCE_ALERT = 'finance_alert',
  BUDGET_LIMIT = 'budget_limit',
  SAVINGS_GOAL = 'savings_goal',
  LOAN_PAYMENT = 'loan_payment',
  SYSTEM = 'system',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  priority?: NotificationPriority;
  sound?: boolean;
  vibrate?: boolean;
  badge?: number;
  scheduledTime?: Date;
  repeatInterval?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger?: {
    seconds?: number;
    repeats?: boolean;
    date?: Date;
  } | null;
  sound?: boolean;
  priority?: 'min' | 'low' | 'default' | 'high' | 'max';
  vibrate?: number[];
  badge?: number;
}

export interface NotificationResponse {
  success: boolean;
  notificationId?: string;
  error?: string;
}
