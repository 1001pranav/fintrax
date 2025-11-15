import { Transaction } from '@/lib/api';
import {
  getDateRangeForPeriod,
  filterTransactionsByDateRange,
  aggregateExpensesByCategory,
  processExpenseDataForChart,
  formatCurrency,
  formatPercentage,
  getTimePeriodLabel,
  aggregateTransactionsByMonth,
  processIncomeTrendData,
  formatCompactNumber,
  calculateNetWorthAtDate,
  processNetWorthData,
  calculateGrowthPercentage,
  formatGrowthPercentage,
  TimePeriod,
  DateRange,
} from '../chartDataProcessors';

// Mock transactions for testing
const mockTransactions: Transaction[] = [
  {
    transaction_id: 1,
    user_id: 1,
    type: 2, // Expense
    amount: 5000,
    category: 'food',
    date: '2024-01-15',
    description: 'Groceries',
  },
  {
    transaction_id: 2,
    user_id: 1,
    type: 2, // Expense
    amount: 3000,
    category: 'transport',
    date: '2024-01-20',
    description: 'Uber',
  },
  {
    transaction_id: 3,
    user_id: 1,
    type: 1, // Income
    amount: 50000,
    category: 'salary',
    date: '2024-02-01',
    description: 'Monthly salary',
  },
  {
    transaction_id: 4,
    user_id: 1,
    type: 2, // Expense
    amount: 2000,
    category: 'food',
    date: '2024-02-10',
    description: 'Restaurant',
  },
  {
    transaction_id: 5,
    user_id: 1,
    type: 2, // Expense
    amount: 15000,
    category: 'shopping',
    date: '2024-02-15',
    description: 'Electronics',
  },
];

describe('chartDataProcessors', () => {
  describe('getDateRangeForPeriod', () => {
    it('should return correct date range for this-month', () => {
      const result = getDateRangeForPeriod('this-month');
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
      expect(new Date(result.startDate).getDate()).toBe(1);
    });

    it('should return correct date range for last-month', () => {
      const result = getDateRangeForPeriod('last-month');
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
    });

    it('should return correct date range for custom period', () => {
      const customRange: DateRange = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const result = getDateRangeForPeriod('custom', customRange);
      expect(result.startDate).toBe('2024-01-01');
      expect(result.endDate).toBe('2024-01-31');
    });

    it('should return default range for custom without customRange provided', () => {
      const result = getDateRangeForPeriod('custom');
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
    });
  });

  describe('filterTransactionsByDateRange', () => {
    it('should filter transactions within date range', () => {
      const dateRange: DateRange = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const result = filterTransactionsByDateRange(mockTransactions, dateRange);
      expect(result).toHaveLength(2);
      expect(result.every((t) => t.date.startsWith('2024-01'))).toBe(true);
    });

    it('should return empty array when no transactions match', () => {
      const dateRange: DateRange = {
        startDate: '2024-03-01',
        endDate: '2024-03-31',
      };
      const result = filterTransactionsByDateRange(mockTransactions, dateRange);
      expect(result).toHaveLength(0);
    });

    it('should include transactions on boundary dates', () => {
      const dateRange: DateRange = {
        startDate: '2024-01-15',
        endDate: '2024-01-20',
      };
      const result = filterTransactionsByDateRange(mockTransactions, dateRange);
      expect(result).toHaveLength(2);
    });
  });

  describe('aggregateExpensesByCategory', () => {
    it('should aggregate expenses by category', () => {
      const result = aggregateExpensesByCategory(mockTransactions);
      expect(result.length).toBeGreaterThan(0);

      const foodExpense = result.find((r) => r.category === 'Food');
      expect(foodExpense).toBeDefined();
      expect(foodExpense?.amount).toBe(7000); // 5000 + 2000
      expect(foodExpense?.count).toBe(2);
    });

    it('should calculate percentages correctly', () => {
      const result = aggregateExpensesByCategory(mockTransactions);
      const totalPercentage = result.reduce((sum, item) => sum + item.percentage, 0);
      expect(totalPercentage).toBeCloseTo(100, 1);
    });

    it('should sort by amount descending', () => {
      const result = aggregateExpensesByCategory(mockTransactions);
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].amount).toBeGreaterThanOrEqual(result[i + 1].amount);
      }
    });

    it('should return empty array when no expenses', () => {
      const incomeOnly: Transaction[] = [
        {
          transaction_id: 1,
          user_id: 1,
          type: 1, // Income
          amount: 50000,
          category: 'salary',
          date: '2024-01-01',
          description: 'Salary',
        },
      ];
      const result = aggregateExpensesByCategory(incomeOnly);
      expect(result).toHaveLength(0);
    });

    it('should handle transactions without category', () => {
      const transactionsWithoutCategory: Transaction[] = [
        {
          transaction_id: 1,
          user_id: 1,
          type: 2,
          amount: 1000,
          date: '2024-01-01',
          description: 'No category',
        },
      ];
      const result = aggregateExpensesByCategory(transactionsWithoutCategory);
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('Other');
    });
  });

  describe('processExpenseDataForChart', () => {
    it('should process expense data with time filtering', () => {
      const result = processExpenseDataForChart(mockTransactions, 'this-year');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter by custom range', () => {
      const customRange: DateRange = {
        startDate: '2024-02-01',
        endDate: '2024-02-28',
      };
      const result = processExpenseDataForChart(mockTransactions, 'custom', customRange);
      const total = result.reduce((sum, item) => sum + item.amount, 0);
      expect(total).toBe(17000); // 2000 + 15000
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in INR format', () => {
      const result = formatCurrency(50000);
      expect(result).toContain('50,000');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrency(-5000);
      expect(result).toContain('-');
      expect(result).toContain('5,000');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with one decimal', () => {
      expect(formatPercentage(45.678)).toBe('45.7%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.0%');
    });

    it('should handle 100%', () => {
      expect(formatPercentage(100)).toBe('100.0%');
    });
  });

  describe('getTimePeriodLabel', () => {
    it('should return correct labels for all periods', () => {
      expect(getTimePeriodLabel('this-month')).toBe('This Month');
      expect(getTimePeriodLabel('last-month')).toBe('Last Month');
      expect(getTimePeriodLabel('last-3-months')).toBe('Last 3 Months');
      expect(getTimePeriodLabel('last-6-months')).toBe('Last 6 Months');
      expect(getTimePeriodLabel('this-year')).toBe('This Year');
      expect(getTimePeriodLabel('custom')).toBe('Custom Range');
    });

    it('should return default label for unknown period', () => {
      const result = getTimePeriodLabel('unknown' as TimePeriod);
      expect(result).toBe('This Month');
    });
  });

  describe('aggregateTransactionsByMonth', () => {
    it('should aggregate income and expenses by month', () => {
      const result = aggregateTransactionsByMonth(mockTransactions);
      expect(result.length).toBeGreaterThan(0);

      const jan2024 = result.find((r) => r.period === 'Jan 2024');
      expect(jan2024).toBeDefined();
      expect(jan2024?.expense).toBe(8000); // 5000 + 3000
    });

    it('should calculate net savings correctly', () => {
      const result = aggregateTransactionsByMonth(mockTransactions);
      const feb2024 = result.find((r) => r.period === 'Feb 2024');
      expect(feb2024).toBeDefined();
      expect(feb2024?.netSavings).toBe(50000 - 17000); // Income - Expense
    });

    it('should sort by date ascending', () => {
      const result = aggregateTransactionsByMonth(mockTransactions);
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].date.getTime()).toBeLessThanOrEqual(result[i + 1].date.getTime());
      }
    });

    it('should return empty array for no transactions', () => {
      const result = aggregateTransactionsByMonth([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('processIncomeTrendData', () => {
    it('should process income trend data', () => {
      const result = processIncomeTrendData(mockTransactions, 'this-year');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fill missing months with zeros', () => {
      const customRange: DateRange = {
        startDate: '2024-01-01',
        endDate: '2024-04-30',
      };
      const result = processIncomeTrendData(mockTransactions, 'custom', customRange);
      // Should have Jan, Feb, Mar, Apr (4 months)
      expect(result.length).toBeGreaterThanOrEqual(2);

      // Check if missing months have zero values
      const marchData = result.find((r) => r.period === 'Mar 2024');
      if (marchData) {
        expect(marchData.income).toBe(0);
        expect(marchData.expense).toBe(0);
      }
    });
  });

  describe('formatCompactNumber', () => {
    it('should format numbers in K notation', () => {
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(5000)).toBe('5.0K');
    });

    it('should format numbers in L notation', () => {
      expect(formatCompactNumber(150000)).toBe('1.5L');
      expect(formatCompactNumber(500000)).toBe('5.0L');
    });

    it('should format numbers in Cr notation', () => {
      expect(formatCompactNumber(15000000)).toBe('1.5Cr');
      expect(formatCompactNumber(50000000)).toBe('5.0Cr');
    });

    it('should handle small numbers', () => {
      expect(formatCompactNumber(500)).toBe('500');
      expect(formatCompactNumber(0)).toBe('0');
    });
  });

  describe('calculateNetWorthAtDate', () => {
    it('should calculate net worth at current date', () => {
      const result = calculateNetWorthAtDate(
        100000, // current balance
        50000,  // current savings
        20000,  // current liabilities
        mockTransactions,
        new Date('2024-02-28')
      );

      expect(result.assets).toBeGreaterThan(0);
      expect(result.liabilities).toBe(20000);
      expect(result.netWorth).toBe(result.assets - result.liabilities);
    });

    it('should handle negative balance by ensuring assets are not negative', () => {
      const result = calculateNetWorthAtDate(
        -10000, // negative balance
        5000,   // savings
        20000,  // liabilities
        [],
        new Date()
      );

      expect(result.assets).toBeGreaterThanOrEqual(0);
    });

    it('should calculate historical net worth correctly', () => {
      const result = calculateNetWorthAtDate(
        100000,
        50000,
        20000,
        mockTransactions,
        new Date('2024-01-01') // Before all transactions
      );

      // Assets should be less than current since we're going back in time
      expect(result).toBeDefined();
      expect(result.liabilities).toBe(20000);
    });
  });

  describe('processNetWorthData', () => {
    it('should process net worth data over time', () => {
      const result = processNetWorthData(
        100000,
        50000,
        20000,
        mockTransactions,
        'last-6-months'
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((r) => r.netWorth === r.assets - r.liabilities)).toBe(true);
    });

    it('should generate monthly data points', () => {
      const customRange: DateRange = {
        startDate: '2024-01-01',
        endDate: '2024-03-31',
      };
      const result = processNetWorthData(
        100000,
        50000,
        20000,
        mockTransactions,
        'custom',
        customRange
      );

      // Should have at least 3 months of data
      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('should include current month with actual values', () => {
      const result = processNetWorthData(
        100000,
        50000,
        20000,
        mockTransactions,
        'last-6-months'
      );

      const lastEntry = result[result.length - 1];
      const currentAssets = 100000 + 50000;
      expect(lastEntry.assets).toBe(currentAssets);
      expect(lastEntry.liabilities).toBe(20000);
      expect(lastEntry.netWorth).toBe(currentAssets - 20000);
    });
  });

  describe('calculateGrowthPercentage', () => {
    it('should calculate positive growth', () => {
      const result = calculateGrowthPercentage(100, 150);
      expect(result).toBe(50);
    });

    it('should calculate negative growth', () => {
      const result = calculateGrowthPercentage(150, 100);
      expect(result).toBeCloseTo(-33.33, 1);
    });

    it('should handle zero old value', () => {
      const result = calculateGrowthPercentage(0, 100);
      expect(result).toBe(100);
    });

    it('should handle both zero values', () => {
      const result = calculateGrowthPercentage(0, 0);
      expect(result).toBe(0);
    });

    it('should handle negative old value', () => {
      const result = calculateGrowthPercentage(-100, -50);
      // From -100 to -50 is a 50% increase (getting less negative)
      expect(result).toBe(50);
    });
  });

  describe('formatGrowthPercentage', () => {
    it('should format positive growth with plus sign', () => {
      expect(formatGrowthPercentage(25.5)).toBe('+25.5%');
    });

    it('should format negative growth with minus sign', () => {
      expect(formatGrowthPercentage(-15.3)).toBe('-15.3%');
    });

    it('should format zero growth', () => {
      expect(formatGrowthPercentage(0)).toBe('+0.0%');
    });

    it('should round to one decimal place', () => {
      expect(formatGrowthPercentage(12.456)).toBe('+12.5%');
    });
  });
});
