import { Transaction } from '@/lib/api';
import { EXPENSE_CATEGORY_COLORS, getCategoryColor } from '@/constants/chartTheme';

/**
 * Time period for filtering transactions
 */
export type TimePeriod = 'this-month' | 'last-month' | 'last-3-months' | 'last-6-months' | 'this-year' | 'custom';

/**
 * Custom date range for filtering
 */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Processed expense category data for pie chart
 */
export interface ExpenseCategoryData {
  category: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

/**
 * Get start and end dates for a time period
 */
export const getDateRangeForPeriod = (period: TimePeriod, customRange?: DateRange): DateRange => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (period) {
    case 'this-month': {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    }

    case 'last-month': {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    }

    case 'last-3-months': {
      const startDate = new Date(year, month - 3, 1);
      const endDate = new Date(year, month + 1, 0);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    }

    case 'last-6-months': {
      const startDate = new Date(year, month - 6, 1);
      const endDate = new Date(year, month + 1, 0);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    }

    case 'this-year': {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    }

    case 'custom':
      return customRange || {
        startDate: new Date(year, 0, 1).toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
      };

    default:
      return getDateRangeForPeriod('this-month');
  }
};

/**
 * Filter transactions by date range
 */
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  dateRange: DateRange
): Transaction[] => {
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  // Set end date to end of day
  endDate.setHours(23, 59, 59, 999);

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

/**
 * Aggregate expense transactions by category
 */
export const aggregateExpensesByCategory = (
  transactions: Transaction[]
): ExpenseCategoryData[] => {
  // Filter only expenses (type = 2)
  const expenses = transactions.filter((t) => t.type === 2);

  if (expenses.length === 0) {
    return [];
  }

  // Group by category
  const categoryMap = new Map<string, { amount: number; count: number }>();

  expenses.forEach((transaction) => {
    const category = (transaction.category || 'other').toLowerCase();
    const existing = categoryMap.get(category) || { amount: 0, count: 0 };
    categoryMap.set(category, {
      amount: existing.amount + transaction.amount,
      count: existing.count + 1,
    });
  });

  // Calculate total for percentages
  const total = Array.from(categoryMap.values()).reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Convert to array with percentages and colors
  const result: ExpenseCategoryData[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category: formatCategoryLabel(category),
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
      count: data.count,
      color: getCategoryColor(category, 'expense'),
    })
  );

  // Sort by amount descending
  result.sort((a, b) => b.amount - a.amount);

  return result;
};

/**
 * Format category label for display
 */
const formatCategoryLabel = (category: string): string => {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Process expense data for pie chart with time filtering
 */
export const processExpenseDataForChart = (
  transactions: Transaction[],
  timePeriod: TimePeriod = 'this-month',
  customRange?: DateRange
): ExpenseCategoryData[] => {
  // Get date range for the period
  const dateRange = getDateRangeForPeriod(timePeriod, customRange);

  // Filter transactions by date range
  const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange);

  // Aggregate by category
  return aggregateExpensesByCategory(filteredTransactions);
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

/**
 * Get label for time period
 */
export const getTimePeriodLabel = (period: TimePeriod): string => {
  switch (period) {
    case 'this-month':
      return 'This Month';
    case 'last-month':
      return 'Last Month';
    case 'last-3-months':
      return 'Last 3 Months';
    case 'last-6-months':
      return 'Last 6 Months';
    case 'this-year':
      return 'This Year';
    case 'custom':
      return 'Custom Range';
    default:
      return 'This Month';
  }
};
