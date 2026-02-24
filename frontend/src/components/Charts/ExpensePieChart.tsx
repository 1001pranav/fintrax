'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinanceStore } from '@/lib/financeStore';
import { ChartContainer } from './ChartContainer';
import { BaseChartWrapper, ChartEmpty } from './BaseChart';
import {
  processExpenseDataForChart,
  TimePeriod,
  DateRange,
  formatCurrency,
  formatPercentage,
  getTimePeriodLabel,
} from '@/utils/chartDataProcessors';
import { CHART_COLORS } from '@/constants/chartTheme';

/**
 * Props for ExpensePieChart
 */
export interface ExpensePieChartProps {
  /** Chart height in pixels */
  height?: number;
  /** Show/hide time filter */
  showTimeFilter?: boolean;
  /** Initial time period */
  initialPeriod?: TimePeriod;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Custom tooltip for pie chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      category: string;
      amount: number;
      percentage: number;
      count: number;
      color: string;
    };
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white/95 dark:bg-black/90 border border-gray-200 dark:border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-xl">
      <div className="flex items-center space-x-2 mb-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <p className="text-gray-900 dark:text-white font-semibold text-sm">{data.category}</p>
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between space-x-6">
          <span className="text-gray-600 dark:text-white/60">Amount:</span>
          <span className="text-gray-900 dark:text-white font-semibold">{formatCurrency(data.amount)}</span>
        </div>
        <div className="flex justify-between space-x-6">
          <span className="text-gray-600 dark:text-white/60">Percentage:</span>
          <span className="text-gray-900 dark:text-white font-semibold">{formatPercentage(data.percentage)}</span>
        </div>
        <div className="flex justify-between space-x-6">
          <span className="text-gray-600 dark:text-white/60">Transactions:</span>
          <span className="text-gray-900 dark:text-white font-semibold">{data.count}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Custom label for pie chart
 */
const renderLabel = (entry: { percentage: number; category: string }) => {
  // Only show label if percentage is significant (> 5%)
  if (entry.percentage < 5) {
    return '';
  }
  return `${formatPercentage(entry.percentage)}`;
};

/**
 * ExpensePieChart Component
 *
 * Displays expense breakdown by category in a pie chart.
 * Features:
 * - Time period filtering (this month, last month, custom range)
 * - Interactive tooltips with category details
 * - Color-coded categories
 * - Responsive design
 * - Empty state handling
 */
export const ExpensePieChart: React.FC<ExpensePieChartProps> = ({
  height = 350,
  showTimeFilter = true,
  initialPeriod = 'this-month',
  className = '',
}) => {
  const { transactions, isLoading, error } = useFinanceStore();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(initialPeriod);
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(768); // Default to medium screen

  // Handle window resize
  useEffect(() => {
    // Set initial width on client side
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Process expense data
  const expenseData = useMemo(() => {
    return processExpenseDataForChart(transactions, timePeriod, customRange);
  }, [transactions, timePeriod, customRange]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return expenseData.reduce((sum, item) => sum + item.amount, 0);
  }, [expenseData]);

  // Handle time period change
  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
    if (period !== 'custom') {
      setShowCustomDatePicker(false);
      setCustomRange(undefined);
    } else {
      setShowCustomDatePicker(true);
    }
  };

  // Handle custom date range
  const handleCustomDateChange = (startDate: string, endDate: string) => {
    setCustomRange({ startDate, endDate });
  };

  // Time period selector
  const TimePeriodSelector = () => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <select
        value={timePeriod}
        onChange={(e) => handleTimePeriodChange(e.target.value as TimePeriod)}
        className="min-h-[44px] bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all touch-manipulation"
      >
        <option value="this-month">This Month</option>
        <option value="last-month">Last Month</option>
        <option value="last-3-months">Last 3 Months</option>
        <option value="last-6-months">Last 6 Months</option>
        <option value="this-year">This Year</option>
        <option value="custom">Custom Range</option>
      </select>

      {showCustomDatePicker && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            onChange={(e) => {
              const endDate = customRange?.endDate || new Date().toISOString().split('T')[0];
              handleCustomDateChange(e.target.value, endDate);
            }}
            className="flex-1 min-h-[44px] bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg px-2 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 touch-manipulation"
          />
          <span className="text-gray-600 dark:text-white/60 text-sm">to</span>
          <input
            type="date"
            onChange={(e) => {
              const startDate = customRange?.startDate || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
              handleCustomDateChange(startDate, e.target.value);
            }}
            className="flex-1 min-h-[44px] bg-gray-50 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg px-2 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 touch-manipulation"
          />
        </div>
      )}
    </div>
  );

  return (
    <ChartContainer
      title="Expense Breakdown by Category"
      subtitle={`${getTimePeriodLabel(timePeriod)} • Total: ${formatCurrency(totalExpenses)}`}
      className={className}
      actions={showTimeFilter ? <TimePeriodSelector /> : undefined}
    >
      <BaseChartWrapper
        data={expenseData}
        height={height}
        loading={isLoading}
        error={error}
        emptyMessage="No expenses found for the selected period"
      >
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={windowWidth < 640 ? 80 : 120}
              innerRadius={windowWidth < 640 ? 40 : 60}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
              animationBegin={0}
              animationDuration={800}
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value: string) => (
                <span style={{ color: CHART_COLORS.text.primary, fontSize: windowWidth < 640 ? '10px' : '12px' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </BaseChartWrapper>

      {/* Summary Legend */}
      {expenseData.length > 0 && (
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {expenseData.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-white/10 active:bg-gray-100 dark:active:bg-white/15 transition-all touch-manipulation shadow-sm"
            >
              <div className="flex items-center space-x-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 dark:text-white/80 text-xs font-medium truncate">{item.category}</span>
              </div>
              <div className="text-gray-900 dark:text-white font-bold text-sm">
                {formatCurrency(item.amount)}
              </div>
              <div className="text-gray-600 dark:text-white/60 text-xs">
                {formatPercentage(item.percentage)} • {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
              </div>
            </div>
          ))}
        </div>
      )}
    </ChartContainer>
  );
};

export default ExpensePieChart;
