/**
 * NotificationFactory Interface
 * Part of the Factory Pattern implementation
 * Defines the contract for creating notifications
 */

import { NotificationPayload, NotificationType } from '../types';

export interface NotificationFactory {
  /**
   * Create a notification payload
   * @param data - Data for the notification
   * @returns NotificationPayload
   */
  createNotification(data: any): NotificationPayload;

  /**
   * Get the notification type this factory creates
   * @returns NotificationType
   */
  getType(): NotificationType;
}
