/**
 * Chart Data Processors
 * Utilities for transforming financial data into chart-compatible formats
 */

import { Transaction, TransactionType } from '../constants/types';

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

/**
 * Get monthly income and expense data for the last N months
 */
export const getMonthlyIncomeExpenseData = (
  transactions: Transaction[],
  months: number = 6
): MonthlyData[] => {
  const monthlyData: { [key: string]: MonthlyData } = {};

  // Initialize last N months
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    monthlyData[monthKey] = {
      month: monthName,
      income: 0,
      expense: 0,
    };
  }

  // Aggregate transactions
  transactions.forEach((transaction) => {
    const monthKey = transaction.date.slice(0, 7); // YYYY-MM

    if (monthlyData[monthKey]) {
      if (transaction.type === TransactionType.INCOME) {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    }
  });

  // Convert to array and sort by date
  return Object.keys(monthlyData)
    .sort()
    .map((key) => monthlyData[key]);
};

/**
 * Get category breakdown for expenses
 */
export const getCategoryBreakdown = (
  transactions: Transaction[],
  categoryColors: { [key: string]: string }
): CategoryData[] => {
  const categoryTotals: { [key: string]: number } = {};
  let totalExpense = 0;

  // Calculate totals per category (only expenses)
  transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .forEach((transaction) => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
      totalExpense += transaction.amount;
    });

  // Convert to array and calculate percentages
  const categoryData: CategoryData[] = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      color: categoryColors[name] || '#9CA3AF',
      percentage: (amount / totalExpense) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Limit to top 5 categories + "Other"
  if (categoryData.length > 5) {
    const top5 = categoryData.slice(0, 5);
    const others = categoryData.slice(5);
    const otherTotal = others.reduce((sum, cat) => sum + cat.amount, 0);

    if (otherTotal > 0) {
      top5.push({
        name: 'Other',
        amount: otherTotal,
        color: '#64748B',
        percentage: (otherTotal / totalExpense) * 100,
      });
    }

    return top5;
  }

  return categoryData;
};

/**
 * Get balance trend over time
 */
export const getBalanceTrendData = (
  transactions: Transaction[],
  initialBalance: number = 0
): { date: string; balance: number }[] => {
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const balanceData: { date: string; balance: number }[] = [];
  let runningBalance = initialBalance;

  sortedTransactions.forEach((transaction) => {
    if (transaction.type === TransactionType.INCOME) {
      runningBalance += transaction.amount;
    } else {
      runningBalance -= transaction.amount;
    }

    balanceData.push({
      date: transaction.date,
      balance: runningBalance,
    });
  });

  return balanceData;
};

/**
 * Filter transactions by date range
 */
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  rangeInMonths: number
): Transaction[] => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - rangeInMonths);

  return transactions.filter((transaction) => new Date(transaction.date) >= cutoffDate);
};

/**
 * Calculate total income and expense for a period
 */
export const calculatePeriodTotals = (
  transactions: Transaction[]
): { income: number; expense: number; net: number } => {
  let income = 0;
  let expense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === TransactionType.INCOME) {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  return {
    income,
    expense,
    net: income - expense,
  };
};

/**
 * Get chart color based on value (positive/negative)
 */
export const getChartColor = (value: number): string => {
  return value >= 0 ? '#10B981' : '#EF4444';
};

/**
 * Format number for chart display
 */
export const formatChartValue = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};
