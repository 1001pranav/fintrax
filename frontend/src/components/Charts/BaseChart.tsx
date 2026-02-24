'use client';

import React from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_COLORS, CHART_STYLE_CONFIG } from '@/constants/chartTheme';

/**
 * Base props for all chart components
 */
export interface BaseChartProps {
  /** Chart data */
  data: unknown[];
  /** Chart height in pixels (default: 300) */
  height?: number;
  /** Whether to show grid lines (default: true) */
  showGrid?: boolean;
  /** Whether to show tooltip (default: true) */
  showTooltip?: boolean;
  /** Whether to show legend (default: true) */
  showLegend?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * Custom Tooltip Component with Fintrax styling
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
  formatter?: (value: number, name: string) => string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/95 dark:bg-black/90 border border-gray-200 dark:border-white/10 rounded-xl p-3 backdrop-blur-xl shadow-xl">
      {label && (
        <p className="text-gray-900 dark:text-white font-semibold mb-2 text-sm">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-white/80 text-xs">
                {entry.name}
              </span>
            </div>
            <span className="text-gray-900 dark:text-white font-semibold text-xs">
              {formatter ? formatter(entry.value, entry.name) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Styled CartesianGrid component
 */
export const StyledGrid: React.FC = () => (
  <CartesianGrid
    strokeDasharray={CHART_STYLE_CONFIG.grid.strokeDasharray}
    stroke={CHART_STYLE_CONFIG.grid.stroke}
    vertical={false}
  />
);

/**
 * Styled XAxis component
 */
interface StyledXAxisProps {
  dataKey: string;
  tickFormatter?: (value: string) => string;
}

export const StyledXAxis: React.FC<StyledXAxisProps> = ({ dataKey, tickFormatter }) => (
  <XAxis
    dataKey={dataKey}
    stroke={CHART_STYLE_CONFIG.axis.stroke}
    tick={{ fill: CHART_COLORS.text.secondary, fontSize: 12 }}
    tickLine={{ stroke: CHART_COLORS.axis }}
    axisLine={{ stroke: CHART_COLORS.axis }}
    tickFormatter={tickFormatter}
  />
);

/**
 * Styled YAxis component
 */
interface StyledYAxisProps {
  tickFormatter?: (value: number) => string;
  width?: number;
}

export const StyledYAxis: React.FC<StyledYAxisProps> = ({ tickFormatter, width = 60 }) => (
  <YAxis
    stroke={CHART_STYLE_CONFIG.axis.stroke}
    tick={{ fill: CHART_COLORS.text.secondary, fontSize: 12 }}
    tickLine={{ stroke: CHART_COLORS.axis }}
    axisLine={{ stroke: CHART_COLORS.axis }}
    tickFormatter={tickFormatter}
    width={width}
  />
);

/**
 * Styled Legend component
 */
interface StyledLegendProps {
  wrapperStyle?: React.CSSProperties;
}

export const StyledLegend: React.FC<StyledLegendProps> = ({ wrapperStyle }) => (
  <Legend
    iconType="circle"
    wrapperStyle={{
      paddingTop: '16px',
      fontSize: '12px',
      ...wrapperStyle,
    }}
    formatter={(value: string) => (
      <span style={{ color: CHART_COLORS.text.primary }}>
        {value}
      </span>
    )}
  />
);

/**
 * Loading skeleton for charts
 */
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div
    className="w-full bg-white/5 rounded-2xl flex items-center justify-center animate-pulse"
    style={{ height: `${height}px` }}
  >
    <div className="text-white/40 text-sm">Loading chart...</div>
  </div>
);

/**
 * Error state for charts
 */
export const ChartError: React.FC<{ error: string; height?: number }> = ({
  error,
  height = 300,
}) => (
  <div
    className="w-full bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center justify-center"
    style={{ height: `${height}px` }}
  >
    <svg
      className="w-12 h-12 text-red-400 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="text-red-400 text-sm font-medium">Error loading chart</p>
    <p className="text-red-400/60 text-xs mt-1">{error}</p>
  </div>
);

/**
 * Empty state for charts
 */
export const ChartEmpty: React.FC<{ message?: string; height?: number }> = ({
  message = 'No data available',
  height = 300,
}) => (
  <div
    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl flex flex-col items-center justify-center"
    style={{ height: `${height}px` }}
  >
    <svg
      className="w-12 h-12 text-gray-500 dark:text-white/40 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
    <p className="text-white/60 text-sm">{message}</p>
  </div>
);

/**
 * Base chart wrapper with common functionality
 * Handles loading, error, and empty states
 */
export const BaseChartWrapper: React.FC<
  BaseChartProps & { children: React.ReactNode }
> = ({
  data,
  height = 300,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  className = '',
  children,
}) => {
  // Loading state
  if (loading) {
    return <ChartSkeleton height={height} />;
  }

  // Error state
  if (error) {
    return <ChartError error={error} height={height} />;
  }

  // Empty state
  if (!data || data.length === 0) {
    return <ChartEmpty message={emptyMessage} height={height} />;
  }

  // Render chart
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Gradient definitions for area charts
 * Place these inside the chart SVG as <defs>
 */
export const ChartGradients: React.FC = () => (
  <defs>
    {/* Income gradient */}
    <linearGradient id="gradient-income" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#4ade80" stopOpacity={0.4} />
      <stop offset="100%" stopColor="#4ade80" stopOpacity={0.05} />
    </linearGradient>

    {/* Expense gradient */}
    <linearGradient id="gradient-expense" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f87171" stopOpacity={0.4} />
      <stop offset="100%" stopColor="#f87171" stopOpacity={0.05} />
    </linearGradient>

    {/* Primary gradient */}
    <linearGradient id="gradient-primary" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4} />
      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.05} />
    </linearGradient>

    {/* Success gradient */}
    <linearGradient id="gradient-success" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#4ade80" stopOpacity={0.4} />
      <stop offset="100%" stopColor="#4ade80" stopOpacity={0.05} />
    </linearGradient>

    {/* Danger gradient */}
    <linearGradient id="gradient-danger" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f87171" stopOpacity={0.4} />
      <stop offset="100%" stopColor="#f87171" stopOpacity={0.05} />
    </linearGradient>
  </defs>
);
