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

/**
 * Income/Expense trend data point
 */
export interface IncomeTrendData {
  period: string; // formatted date label (e.g., "Jan 2024", "2024-01")
  income: number;
  expense: number;
  netSavings: number;
  date: Date; // for sorting
}

/**
 * Aggregate transactions by month for trend charts
 */
export const aggregateTransactionsByMonth = (
  transactions: Transaction[]
): IncomeTrendData[] => {
  if (transactions.length === 0) {
    return [];
  }

  // Group transactions by year-month
  const monthMap = new Map<string, { income: number; expense: number }>();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const existing = monthMap.get(yearMonth) || { income: 0, expense: 0 };

    if (transaction.type === 1) {
      // Income
      existing.income += transaction.amount;
    } else if (transaction.type === 2) {
      // Expense
      existing.expense += transaction.amount;
    }

    monthMap.set(yearMonth, existing);
  });

  // Convert to array and format
  const result: IncomeTrendData[] = Array.from(monthMap.entries()).map(
    ([yearMonth, data]) => {
      const [year, month] = yearMonth.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);

      return {
        period: formatMonthLabel(date),
        income: data.income,
        expense: data.expense,
        netSavings: data.income - data.expense,
        date,
      };
    }
  );

  // Sort by date ascending
  result.sort((a, b) => a.date.getTime() - b.date.getTime());

  return result;
};

/**
 * Format month label for display
 */
const formatMonthLabel = (date: Date): string => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Process income/expense trend data for line chart with time filtering
 */
export const processIncomeTrendData = (
  transactions: Transaction[],
  timePeriod: TimePeriod = 'last-6-months',
  customRange?: DateRange
): IncomeTrendData[] => {
  // Get date range for the period
  const dateRange = getDateRangeForPeriod(timePeriod, customRange);

  // Filter transactions by date range
  const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange);

  // Aggregate by month
  const aggregated = aggregateTransactionsByMonth(filteredTransactions);

  // Fill in missing months with zero values for continuity
  if (aggregated.length > 0) {
    return fillMissingMonths(aggregated, dateRange);
  }

  return aggregated;
};

/**
 * Fill in missing months with zero values for chart continuity
 */
const fillMissingMonths = (
  data: IncomeTrendData[],
  dateRange: DateRange
): IncomeTrendData[] => {
  if (data.length === 0) {
    return data;
  }

  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);

  const result: IncomeTrendData[] = [];
  const dataMap = new Map(
    data.map((item) => [
      `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}`,
      item,
    ])
  );

  // Iterate through each month in the range
  let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const lastDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (currentDate <= lastDate) {
    const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    const existing = dataMap.get(yearMonth);
    if (existing) {
      result.push(existing);
    } else {
      // Add zero values for missing months
      result.push({
        period: formatMonthLabel(currentDate),
        income: 0,
        expense: 0,
        netSavings: 0,
        date: new Date(currentDate),
      });
    }

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return result;
};

/**
 * Format number for compact display (e.g., 1.2K, 1.5M)
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};
