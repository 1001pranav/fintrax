/**
 * FinanceAlertFactory
 * Concrete factory for creating finance alert notifications
 * Part of the Factory Pattern implementation
 */

import { NotificationFactory } from './NotificationFactory';
import { NotificationPayload, NotificationType } from '../types';

export interface FinanceAlertData {
  alertType: 'budget_limit' | 'savings_goal' | 'loan_payment' | 'general';
  title: string;
  message: string;
  amount?: number;
  category?: string;
}

export class FinanceAlertFactory implements NotificationFactory {
  createNotification(data: FinanceAlertData): NotificationPayload {
    const { alertType, title, message, amount, category } = data;

    const icon = this.getIconForAlertType(alertType);
    const notificationTitle = `${icon} ${title}`;

    return {
      title: notificationTitle,
      body: message,
      data: {
        type: this.mapAlertTypeToNotificationType(alertType),
        alertType,
        amount,
        category,
      },
      trigger: null, // Immediate notification
      sound: true,
      priority: alertType === 'budget_limit' ? 'high' : 'default',
      badge: 1,
    };
  }

  getType(): NotificationType {
    return NotificationType.FINANCE_ALERT;
  }

  private getIconForAlertType(alertType: string): string {
    switch (alertType) {
      case 'budget_limit':
        return '⚠️';
      case 'savings_goal':
        return '🎯';
      case 'loan_payment':
        return '💳';
      default:
        return '💰';
    }
  }

  private mapAlertTypeToNotificationType(alertType: string): NotificationType {
    switch (alertType) {
      case 'budget_limit':
        return NotificationType.BUDGET_LIMIT;
      case 'savings_goal':
        return NotificationType.SAVINGS_GOAL;
      case 'loan_payment':
        return NotificationType.LOAN_PAYMENT;
      default:
        return NotificationType.FINANCE_ALERT;
    }
  }
}
