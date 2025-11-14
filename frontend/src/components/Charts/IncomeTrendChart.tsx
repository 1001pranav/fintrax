'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useFinanceStore } from '@/lib/financeStore';
import { ChartContainer } from './ChartContainer';
import { BaseChartWrapper, ChartGradients } from './BaseChart';
import {
  processIncomeTrendData,
  TimePeriod,
  DateRange,
  formatCurrency,
  formatCompactNumber,
  getTimePeriodLabel,
  IncomeTrendData,
} from '@/utils/chartDataProcessors';
import { CHART_COLORS } from '@/constants/chartTheme';

/**
 * Props for IncomeTrendChart
 */
export interface IncomeTrendChartProps {
  /** Chart height in pixels */
  height?: number;
  /** Show/hide time filter */
  showTimeFilter?: boolean;
  /** Initial time period */
  initialPeriod?: TimePeriod;
  /** Additional CSS classes */
  className?: string;
  /** Chart type: 'line' or 'area' */
  chartType?: 'line' | 'area';
}

/**
 * Custom tooltip for income/expense trend chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className="bg-black/90 border border-white/10 rounded-xl p-4 backdrop-blur-xl"
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {label && (
        <p className="text-white font-semibold mb-3 text-sm border-b border-white/10 pb-2">
          {label}
        </p>
      )}
      <div className="space-y-2">
        {payload.map((entry, index) => {
          const isNetSavings = entry.dataKey === 'netSavings';
          const value = entry.value;
          const isNegative = value < 0;

          return (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-6">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-white/80 text-xs">
                  {entry.name === 'income' && 'Income'}
                  {entry.name === 'expense' && 'Expense'}
                  {entry.name === 'netSavings' && 'Net Savings'}
                </span>
              </div>
              <span
                className={`font-semibold text-xs ${
                  isNetSavings
                    ? isNegative
                      ? 'text-red-400'
                      : 'text-green-400'
                    : 'text-white'
                }`}
              >
                {formatCurrency(Math.abs(value))}
                {isNegative && isNetSavings && ' (loss)'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * IncomeTrendChart Component
 *
 * Displays income vs expense trends over time with net savings visualization.
 * Features:
 * - Dual-line chart showing income and expense trends
 * - Net savings area chart (income - expense)
 * - Time period filtering (6 months, 1 year, all time)
 * - Interactive tooltips with exact values
 * - Responsive design
 * - Empty state handling
 * - Missing data handling with zero-filled gaps
 */
export const IncomeTrendChart: React.FC<IncomeTrendChartProps> = ({
  height = 350,
  showTimeFilter = true,
  initialPeriod = 'last-6-months',
  className = '',
  chartType = 'line',
}) => {
  const { transactions, isLoading, error } = useFinanceStore();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(initialPeriod);
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Process income/expense trend data
  const trendData = useMemo(() => {
    return processIncomeTrendData(transactions, timePeriod, customRange);
  }, [transactions, timePeriod, customRange]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (trendData.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        totalNetSavings: 0,
        avgIncome: 0,
        avgExpense: 0,
      };
    }

    const totalIncome = trendData.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = trendData.reduce((sum, item) => sum + item.expense, 0);
    const totalNetSavings = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      totalNetSavings,
      avgIncome: totalIncome / trendData.length,
      avgExpense: totalExpense / trendData.length,
    };
  }, [trendData]);

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
    <div className="flex items-center space-x-2">
      <select
        value={timePeriod}
        onChange={(e) => handleTimePeriodChange(e.target.value as TimePeriod)}
        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
      >
        <option value="last-3-months">Last 3 Months</option>
        <option value="last-6-months">Last 6 Months</option>
        <option value="this-year">This Year</option>
        <option value="custom">Custom Range</option>
      </select>

      {showCustomDatePicker && (
        <div className="flex items-center space-x-2">
          <input
            type="date"
            onChange={(e) => {
              const endDate = customRange?.endDate || new Date().toISOString().split('T')[0];
              handleCustomDateChange(e.target.value, endDate);
            }}
            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <span className="text-white/60 text-sm">to</span>
          <input
            type="date"
            onChange={(e) => {
              const startDate =
                customRange?.startDate ||
                new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
              handleCustomDateChange(startDate, e.target.value);
            }}
            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      )}
    </div>
  );

  // Format Y-axis values
  const formatYAxis = (value: number) => {
    return formatCompactNumber(value);
  };

  return (
    <ChartContainer
      title="Income vs Expense Trend"
      subtitle={`${getTimePeriodLabel(timePeriod)} • Net Savings: ${
        summary.totalNetSavings >= 0
          ? formatCurrency(summary.totalNetSavings)
          : `-${formatCurrency(Math.abs(summary.totalNetSavings))}`
      }`}
      className={className}
      actions={showTimeFilter ? <TimePeriodSelector /> : undefined}
    >
      <BaseChartWrapper
        data={trendData}
        height={height}
        loading={isLoading}
        error={error}
        emptyMessage="No transaction data available for the selected period"
      >
        <ResponsiveContainer width="100%" height={height}>
          {chartType === 'area' ? (
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <ChartGradients />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />
              <XAxis
                dataKey="period"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text.secondary, fontSize: 12 }}
                tickLine={{ stroke: CHART_COLORS.axis }}
                axisLine={{ stroke: CHART_COLORS.axis }}
              />
              <YAxis
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text.secondary, fontSize: 12 }}
                tickLine={{ stroke: CHART_COLORS.axis }}
                axisLine={{ stroke: CHART_COLORS.axis }}
                tickFormatter={formatYAxis}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                formatter={(value: string) => (
                  <span style={{ color: CHART_COLORS.text.primary }}>
                    {value === 'income' && 'Income'}
                    {value === 'expense' && 'Expense'}
                    {value === 'netSavings' && 'Net Savings'}
                  </span>
                )}
              />
              <ReferenceLine y={0} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="income"
                stroke={CHART_COLORS.income}
                fill="url(#gradient-income)"
                strokeWidth={2}
                name="income"
                animationBegin={0}
                animationDuration={800}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke={CHART_COLORS.expense}
                fill="url(#gradient-expense)"
                strokeWidth={2}
                name="expense"
                animationBegin={100}
                animationDuration={800}
              />
              <Area
                type="monotone"
                dataKey="netSavings"
                stroke={CHART_COLORS.primary}
                fill="url(#gradient-primary)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="netSavings"
                animationBegin={200}
                animationDuration={800}
              />
            </AreaChart>
          ) : (
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />
              <XAxis
                dataKey="period"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text.secondary, fontSize: 12 }}
                tickLine={{ stroke: CHART_COLORS.axis }}
                axisLine={{ stroke: CHART_COLORS.axis }}
              />
              <YAxis
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text.secondary, fontSize: 12 }}
                tickLine={{ stroke: CHART_COLORS.axis }}
                axisLine={{ stroke: CHART_COLORS.axis }}
                tickFormatter={formatYAxis}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                formatter={(value: string) => (
                  <span style={{ color: CHART_COLORS.text.primary }}>
                    {value === 'income' && 'Income'}
                    {value === 'expense' && 'Expense'}
                    {value === 'netSavings' && 'Net Savings'}
                  </span>
                )}
              />
              <ReferenceLine y={0} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="income"
                stroke={CHART_COLORS.income}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.income, r: 4 }}
                activeDot={{ r: 6 }}
                name="income"
                animationBegin={0}
                animationDuration={800}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke={CHART_COLORS.expense}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.expense, r: 4 }}
                activeDot={{ r: 6 }}
                name="expense"
                animationBegin={100}
                animationDuration={800}
              />
              <Line
                type="monotone"
                dataKey="netSavings"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: CHART_COLORS.primary, r: 4 }}
                activeDot={{ r: 6 }}
                name="netSavings"
                animationBegin={200}
                animationDuration={800}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </BaseChartWrapper>

      {/* Summary Statistics */}
      {trendData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
            <div className="text-white/60 text-xs mb-1">Total Income</div>
            <div className="text-green-400 font-bold text-sm">
              {formatCurrency(summary.totalIncome)}
            </div>
            <div className="text-white/40 text-xs mt-1">
              Avg: {formatCurrency(summary.avgIncome)}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
            <div className="text-white/60 text-xs mb-1">Total Expense</div>
            <div className="text-red-400 font-bold text-sm">
              {formatCurrency(summary.totalExpense)}
            </div>
            <div className="text-white/40 text-xs mt-1">
              Avg: {formatCurrency(summary.avgExpense)}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
            <div className="text-white/60 text-xs mb-1">Net Savings</div>
            <div
              className={`font-bold text-sm ${
                summary.totalNetSavings >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {summary.totalNetSavings >= 0
                ? formatCurrency(summary.totalNetSavings)
                : `-${formatCurrency(Math.abs(summary.totalNetSavings))}`}
            </div>
            <div className="text-white/40 text-xs mt-1">
              {summary.totalNetSavings >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
            <div className="text-white/60 text-xs mb-1">Savings Rate</div>
            <div
              className={`font-bold text-sm ${
                summary.totalIncome > 0
                  ? (summary.totalNetSavings / summary.totalIncome) * 100 >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                  : 'text-white/60'
              }`}
            >
              {summary.totalIncome > 0
                ? `${((summary.totalNetSavings / summary.totalIncome) * 100).toFixed(1)}%`
                : 'N/A'}
            </div>
            <div className="text-white/40 text-xs mt-1">Of income</div>
          </div>
        </div>
      )}
    </ChartContainer>
  );
};

export default IncomeTrendChart;
