/**
 * FinanceAlertObserver
 * Concrete observer for finance alert notifications
 * Part of the Observer Pattern implementation
 */

import { NotificationObserver } from './NotificationObserver';
import { NotificationData, NotificationType } from '../types';
import { navigationRef } from '../../../navigation/NavigationService';

export class FinanceAlertObserver implements NotificationObserver {
  readonly id = 'finance_alert_observer';

  async update(notification: NotificationData): Promise<void> {
    console.log('[FinanceAlertObserver] Received notification:', notification.title);

    // Log finance alert
    this.logFinanceAlert(notification);

    // Process based on type
    switch (notification.type) {
      case NotificationType.BUDGET_LIMIT:
        this.handleBudgetLimit(notification);
        break;
      case NotificationType.SAVINGS_GOAL:
        this.handleSavingsGoal(notification);
        break;
      case NotificationType.LOAN_PAYMENT:
        this.handleLoanPayment(notification);
        break;
      default:
        console.log('[FinanceAlertObserver] General finance alert');
    }
  }

  async onNotificationTapped(notification: NotificationData): Promise<void> {
    console.log('[FinanceAlertObserver] Notification tapped:', notification.title);

    // Navigate based on notification type
    switch (notification.type) {
      case NotificationType.BUDGET_LIMIT:
      case NotificationType.FINANCE_ALERT:
        navigationRef.navigate('Finance');
        break;
      case NotificationType.SAVINGS_GOAL:
        navigationRef.navigate('Savings');
        break;
      case NotificationType.LOAN_PAYMENT:
        navigationRef.navigate('Loans');
        break;
      default:
        navigationRef.navigate('Finance');
    }
  }

  async onNotificationDismissed(notification: NotificationData): Promise<void> {
    console.log('[FinanceAlertObserver] Notification dismissed:', notification.title);
  }

  shouldHandle(notification: NotificationData): boolean {
    return (
      notification.type === NotificationType.FINANCE_ALERT ||
      notification.type === NotificationType.BUDGET_LIMIT ||
      notification.type === NotificationType.SAVINGS_GOAL ||
      notification.type === NotificationType.LOAN_PAYMENT
    );
  }

  private logFinanceAlert(notification: NotificationData): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Finance Alert: ${notification.title}`);
  }

  private handleBudgetLimit(notification: NotificationData): void {
    console.log('[FinanceAlertObserver] Budget limit alert:', notification.data);
    // Additional budget limit handling
  }

  private handleSavingsGoal(notification: NotificationData): void {
    console.log('[FinanceAlertObserver] Savings goal alert:', notification.data);
    // Additional savings goal handling
  }

  private handleLoanPayment(notification: NotificationData): void {
    console.log('[FinanceAlertObserver] Loan payment alert:', notification.data);
    // Additional loan payment handling
  }
}
