'use client';

import React, { useState, useMemo } from 'react';
import {
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
  processNetWorthData,
  TimePeriod,
  DateRange,
  formatCurrency,
  formatCompactNumber,
  getTimePeriodLabel,
  calculateGrowthPercentage,
  formatGrowthPercentage,
  NetWorthData,
} from '@/utils/chartDataProcessors';
import { CHART_COLORS } from '@/constants/chartTheme';

/**
 * Props for NetWorthChart
 */
export interface NetWorthChartProps {
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
 * Custom tooltip for net worth chart
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

  // Find the net worth value to determine color
  const netWorthEntry = payload.find((entry) => entry.dataKey === 'netWorth');
  const isPositive = netWorthEntry ? netWorthEntry.value >= 0 : true;

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
          const isNetWorth = entry.dataKey === 'netWorth';

          return (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-6">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-white/80 text-xs">
                  {entry.name === 'assets' && 'Assets'}
                  {entry.name === 'liabilities' && 'Liabilities'}
                  {entry.name === 'netWorth' && 'Net Worth'}
                </span>
              </div>
              <span
                className={`font-semibold text-xs ${
                  isNetWorth ? (isPositive ? 'text-green-400' : 'text-red-400') : 'text-white'
                }`}
              >
                {formatCurrency(entry.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * NetWorthChart Component
 *
 * Displays net worth growth over time with assets and liabilities breakdown.
 * Features:
 * - Area chart showing net worth trend
 * - Separate visualization for assets and liabilities
 * - Growth percentage indicators with color coding
 * - Time period filtering
 * - Interactive tooltips
 * - Milestone markers (optional)
 * - Responsive design
 */
export const NetWorthChart: React.FC<NetWorthChartProps> = ({
  height = 350,
  showTimeFilter = true,
  initialPeriod = 'last-6-months',
  className = '',
}) => {
  const {
    balance,
    financialData,
    transactions,
    isLoading,
    error,
  } = useFinanceStore();

  const [timePeriod, setTimePeriod] = useState<TimePeriod>(initialPeriod);
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Calculate current values
  const currentSavings = financialData.savings.total;
  const currentLiabilities = financialData.debts.total;
  const currentAssets = balance + currentSavings;
  const currentNetWorth = currentAssets - currentLiabilities;

  // Process net worth data over time
  const netWorthData = useMemo(() => {
    return processNetWorthData(
      balance,
      currentSavings,
      currentLiabilities,
      transactions,
      timePeriod,
      customRange
    );
  }, [balance, currentSavings, currentLiabilities, transactions, timePeriod, customRange]);

  // Calculate growth metrics
  const growthMetrics = useMemo(() => {
    if (netWorthData.length < 2) {
      return {
        netWorthGrowth: 0,
        assetsGrowth: 0,
        liabilitiesGrowth: 0,
        startNetWorth: 0,
        endNetWorth: 0,
      };
    }

    const startData = netWorthData[0];
    const endData = netWorthData[netWorthData.length - 1];

    return {
      netWorthGrowth: calculateGrowthPercentage(startData.netWorth, endData.netWorth),
      assetsGrowth: calculateGrowthPercentage(startData.assets, endData.assets),
      liabilitiesGrowth: calculateGrowthPercentage(startData.liabilities, endData.liabilities),
      startNetWorth: startData.netWorth,
      endNetWorth: endData.netWorth,
    };
  }, [netWorthData]);

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
      title="Net Worth Over Time"
      subtitle={`${getTimePeriodLabel(timePeriod)} • Current: ${
        currentNetWorth >= 0
          ? formatCurrency(currentNetWorth)
          : `-${formatCurrency(Math.abs(currentNetWorth))}`
      } • Growth: ${
        growthMetrics.netWorthGrowth >= 0
          ? formatGrowthPercentage(growthMetrics.netWorthGrowth)
          : formatGrowthPercentage(growthMetrics.netWorthGrowth)
      }`}
      className={className}
      actions={showTimeFilter ? <TimePeriodSelector /> : undefined}
    >
      <BaseChartWrapper
        data={netWorthData}
        height={height}
        loading={isLoading}
        error={error}
        emptyMessage="No financial data available for the selected period"
      >
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={netWorthData}
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
                  {value === 'assets' && 'Assets'}
                  {value === 'liabilities' && 'Liabilities'}
                  {value === 'netWorth' && 'Net Worth'}
                </span>
              )}
            />
            <ReferenceLine y={0} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />

            {/* Assets Area */}
            <Area
              type="monotone"
              dataKey="assets"
              stackId="1"
              stroke={CHART_COLORS.success}
              fill="url(#gradient-success)"
              strokeWidth={2}
              name="assets"
              animationBegin={0}
              animationDuration={800}
            />

            {/* Liabilities Area */}
            <Area
              type="monotone"
              dataKey="liabilities"
              stackId="2"
              stroke={CHART_COLORS.danger}
              fill="url(#gradient-danger)"
              strokeWidth={2}
              name="liabilities"
              animationBegin={100}
              animationDuration={800}
            />

            {/* Net Worth Area (main focus) */}
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke={CHART_COLORS.primary}
              fill="url(#gradient-primary)"
              strokeWidth={3}
              name="netWorth"
              animationBegin={200}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </BaseChartWrapper>

      {/* Summary Metrics */}
      {netWorthData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Current Net Worth */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
            <div className="text-white/60 text-xs mb-1">Net Worth</div>
            <div
              className={`font-bold text-sm ${
                currentNetWorth >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {currentNetWorth >= 0
                ? formatCurrency(currentNetWorth)
                : `-${formatCurrency(Math.abs(currentNetWorth))}`}
            </div>
            <div
              className={`text-xs mt-1 flex items-center space-x-1 ${
                growthMetrics.netWorthGrowth >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {growthMetrics.netWorthGrowth >= 0 ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{formatGrowthPercentage(growthMetrics.netWorthGrowth)}</span>
            </div>
          </div>

          {/* Total Assets */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
            <div className="text-white/60 text-xs mb-1">Total Assets</div>
            <div className="text-green-400 font-bold text-sm">
              {formatCurrency(currentAssets)}
            </div>
            <div className="text-white/40 text-xs mt-1">
              Balance + Savings
            </div>
          </div>

          {/* Total Liabilities */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
            <div className="text-white/60 text-xs mb-1">Total Liabilities</div>
            <div className="text-red-400 font-bold text-sm">
              {formatCurrency(currentLiabilities)}
            </div>
            <div className="text-white/40 text-xs mt-1">
              Debts + Loans
            </div>
          </div>

          {/* Growth Rate */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all">
            <div className="text-white/60 text-xs mb-1">Period Growth</div>
            <div
              className={`font-bold text-sm ${
                growthMetrics.netWorthGrowth >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatGrowthPercentage(growthMetrics.netWorthGrowth)}
            </div>
            <div className="text-white/40 text-xs mt-1">
              {growthMetrics.endNetWorth >= growthMetrics.startNetWorth
                ? 'Increasing'
                : 'Decreasing'}
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Details */}
      {netWorthData.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Assets Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold text-sm">Assets Breakdown</h4>
              <span className="text-green-400 font-bold text-sm">
                {formatCurrency(currentAssets)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">Balance</span>
                <span className="text-white text-xs font-medium">
                  {formatCurrency(balance)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">Savings</span>
                <span className="text-white text-xs font-medium">
                  {formatCurrency(currentSavings)}
                </span>
              </div>
            </div>
          </div>

          {/* Liabilities Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold text-sm">Liabilities Breakdown</h4>
              <span className="text-red-400 font-bold text-sm">
                {formatCurrency(currentLiabilities)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">Debts</span>
                <span className="text-white text-xs font-medium">
                  {formatCurrency(financialData.debts.total)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">Loans</span>
                <span className="text-white text-xs font-medium">
                  {formatCurrency(financialData.debts.total - financialData.debts.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ChartContainer>
  );
};

export default NetWorthChart;
