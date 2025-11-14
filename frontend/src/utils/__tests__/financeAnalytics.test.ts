import { describe, it, expect } from 'vitest';
import {
  calculateMonthlyTrends,
  calculateCategoryBreakdown,
  generateSpendingInsights,
} from '../financeAnalytics';
import { Transaction } from '@/lib/api';
import moment from 'moment';

describe('Finance Analytics', () => {
  describe('calculateMonthlyTrends', () => {
    it('should calculate monthly trends correctly', () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          source: 'Salary',
          amount: 5000,
          type: 1, // income
          transaction_type: 1,
          category: 'Salary',
          date: moment().subtract(1, 'month').format('YYYY-MM-DD'),
          status: 1,
        },
        {
          id: 2,
          source: 'Groceries',
          amount: 200,
          type: 2, // expense
          transaction_type: 1,
          category: 'Food',
          date: moment().subtract(1, 'month').format('YYYY-MM-DD'),
          status: 1,
        },
      ];

      const trends = calculateMonthlyTrends(transactions, 2);

      expect(trends).toHaveLength(2);
      expect(trends[1].income).toBe(5000);
      expect(trends[1].expense).toBe(200);
      expect(trends[1].net).toBe(4800);
    });

    it('should return empty values for months with no transactions', () => {
      const transactions: Transaction[] = [];

      const trends = calculateMonthlyTrends(transactions, 3);

      expect(trends).toHaveLength(3);
      trends.forEach((trend) => {
        expect(trend.income).toBe(0);
        expect(trend.expense).toBe(0);
        expect(trend.net).toBe(0);
      });
    });
  });

  describe('calculateCategoryBreakdown', () => {
    it('should break down expenses by category', () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          source: 'Groceries',
          amount: 200,
          type: 2,
          transaction_type: 1,
          category: 'Food',
          date: '2025-01-15',
          status: 1,
        },
        {
          id: 2,
          source: 'Restaurant',
          amount: 100,
          type: 2,
          transaction_type: 1,
          category: 'Food',
          date: '2025-01-16',
          status: 1,
        },
        {
          id: 3,
          source: 'Uber',
          amount: 50,
          type: 2,
          transaction_type: 1,
          category: 'Transport',
          date: '2025-01-17',
          status: 1,
        },
      ];

      const breakdown = calculateCategoryBreakdown(transactions, 2);

      expect(breakdown).toHaveLength(2);
      expect(breakdown[0].category).toBe('Food');
      expect(breakdown[0].amount).toBe(300);
      expect(breakdown[0].percentage).toBeCloseTo(85.71, 1);
      expect(breakdown[0].count).toBe(2);

      expect(breakdown[1].category).toBe('Transport');
      expect(breakdown[1].amount).toBe(50);
      expect(breakdown[1].percentage).toBeCloseTo(14.29, 1);
      expect(breakdown[1].count).toBe(1);
    });

    it('should handle uncategorized transactions', () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          source: 'Unknown',
          amount: 100,
          type: 2,
          transaction_type: 1,
          category: '',
          date: '2025-01-15',
          status: 1,
        },
      ];

      const breakdown = calculateCategoryBreakdown(transactions, 2);

      expect(breakdown).toHaveLength(1);
      expect(breakdown[0].category).toBe('Uncategorized');
      expect(breakdown[0].amount).toBe(100);
      expect(breakdown[0].percentage).toBe(100);
    });

    it('should only include transactions of specified type', () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          source: 'Salary',
          amount: 5000,
          type: 1, // income
          transaction_type: 1,
          category: 'Salary',
          date: '2025-01-15',
          status: 1,
        },
        {
          id: 2,
          source: 'Groceries',
          amount: 200,
          type: 2, // expense
          transaction_type: 1,
          category: 'Food',
          date: '2025-01-16',
          status: 1,
        },
      ];

      const expenseBreakdown = calculateCategoryBreakdown(transactions, 2);
      expect(expenseBreakdown).toHaveLength(1);
      expect(expenseBreakdown[0].category).toBe('Food');

      const incomeBreakdown = calculateCategoryBreakdown(transactions, 1);
      expect(incomeBreakdown).toHaveLength(1);
      expect(incomeBreakdown[0].category).toBe('Salary');
    });
  });

  describe('generateSpendingInsights', () => {
    it('should generate warning for high spending', () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          source: 'Salary',
          amount: 1000,
          type: 1,
          transaction_type: 1,
          category: 'Salary',
          date: '2025-01-15',
          status: 1,
        },
        {
          id: 2,
          source: 'Expenses',
          amount: 950,
          type: 2,
          transaction_type: 1,
          category: 'Various',
          date: '2025-01-16',
          status: 1,
        },
      ];

      const insights = generateSpendingInsights(transactions);

      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some((i) => i.type === 'warning' && i.title.includes('High Spending'))).toBe(true);
    });

    it('should generate success insight for good savings', () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          source: 'Salary',
          amount: 5000,
          type: 1,
          transaction_type: 1,
          category: 'Salary',
          date: '2025-01-15',
          status: 1,
        },
        {
          id: 2,
          source: 'Expenses',
          amount: 2000,
          type: 2,
          transaction_type: 1,
          category: 'Various',
          date: '2025-01-16',
          status: 1,
        },
      ];

      const insights = generateSpendingInsights(transactions);

      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some((i) => i.type === 'success' && i.title.includes('Great Savings'))).toBe(true);
    });

    it('should return empty array for no transactions', () => {
      const insights = generateSpendingInsights([]);

      expect(insights).toEqual([]);
    });

    it('should identify top spending category', () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          source: 'Salary',
          amount: 1000,
          type: 1,
          transaction_type: 1,
          category: 'Salary',
          date: '2025-01-15',
          status: 1,
        },
        {
          id: 2,
          source: 'Food',
          amount: 500,
          type: 2,
          transaction_type: 1,
          category: 'Food',
          date: '2025-01-16',
          status: 1,
        },
        {
          id: 3,
          source: 'Transport',
          amount: 100,
          type: 2,
          transaction_type: 1,
          category: 'Transport',
          date: '2025-01-17',
          status: 1,
        },
      ];

      const insights = generateSpendingInsights(transactions);

      expect(insights.some((i) => i.description.includes('Food'))).toBe(true);
    });
  });
});
