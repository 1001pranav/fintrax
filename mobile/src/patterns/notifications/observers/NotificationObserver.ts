/**
 * NotificationObserver Interface
 * Part of the Observer Pattern implementation
 * Defines the contract for notification observers
 */

import { NotificationData } from '../types';

export interface NotificationObserver {
  /**
   * Unique identifier for this observer
   */
  readonly id: string;

  /**
   * Update method called when notification is received
   * @param notification - Notification data
   */
  update(notification: NotificationData): Promise<void>;

  /**
   * Called when a notification is tapped
   * @param notification - Notification data
   */
  onNotificationTapped?(notification: NotificationData): Promise<void>;

  /**
   * Called when a notification is dismissed
   * @param notification - Notification data
   */
  onNotificationDismissed?(notification: NotificationData): Promise<void>;

  /**
   * Filter to determine if this observer should handle a notification
   * @param notification - Notification data
   * @returns boolean - true if observer should handle this notification
   */
  shouldHandle(notification: NotificationData): boolean;
}
