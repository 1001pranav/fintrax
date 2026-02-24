'use client';

import React, { useState } from 'react';

/**
 * Props for ChartContainer component
 */
export interface ChartContainerProps {
  /** Chart title */
  title: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Chart content */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show a refresh button (default: false) */
  showRefresh?: boolean;
  /** Callback when refresh is clicked */
  onRefresh?: () => void;
  /** Whether to show fullscreen button (default: false) */
  showFullscreen?: boolean;
  /** Custom actions/buttons to display in header */
  actions?: React.ReactNode;
  /** Loading state for the container */
  loading?: boolean;
}

/**
 * ChartContainer Component
 *
 * A responsive container for charts with consistent styling.
 * Provides a card-like container with title, optional subtitle,
 * and optional action buttons (refresh, fullscreen, etc.).
 *
 * @example
 * ```tsx
 * <ChartContainer
 *   title="Monthly Revenue"
 *   subtitle="Last 6 months"
 *   showRefresh
 *   onRefresh={handleRefresh}
 * >
 *   <LineChart data={data} />
 * </ChartContainer>
 * ```
 */
export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  children,
  className = '',
  showRefresh = false,
  onRefresh,
  showFullscreen = false,
  actions,
  loading = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`
        bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl
        transition-all duration-300 shadow-sm
        ${isFullscreen ? 'fixed inset-4 z-50' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
            {title}
          </h3>
          {subtitle && (
            <p className="text-gray-600 dark:text-white/60 text-sm mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Custom actions */}
          {actions}

          {/* Refresh button */}
          {showRefresh && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh chart"
              title="Refresh"
            >
              <svg
                className={`w-5 h-5 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/80 ${
                  loading ? 'animate-spin' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}

          {/* Fullscreen button */}
          {showFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors duration-200"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Chart content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

/**
 * ChartGrid Component
 *
 * A responsive grid layout for multiple charts.
 * Automatically adjusts columns based on screen size.
 *
 * @example
 * ```tsx
 * <ChartGrid>
 *   <ChartContainer title="Chart 1">...</ChartContainer>
 *   <ChartContainer title="Chart 2">...</ChartContainer>
 * </ChartGrid>
 * ```
 */
export interface ChartGridProps {
  /** Chart containers as children */
  children: React.ReactNode;
  /** Number of columns on desktop (default: 2) */
  columns?: 1 | 2 | 3 | 4;
  /** Additional CSS class names */
  className?: string;
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  children,
  columns = 2,
  className = '',
}) => {
  const gridColsClass = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }[columns];

  return (
    <div
      className={`
        grid grid-cols-1 gap-6
        ${gridColsClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * ChartHeader Component
 *
 * A standalone header component for chart pages with filters and actions.
 *
 * @example
 * ```tsx
 * <ChartHeader
 *   title="Analytics Dashboard"
 *   subtitle="Financial overview"
 * >
 *   <DateRangePicker />
 * </ChartHeader>
 * ```
 */
export interface ChartHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional children (filters, actions, etc.) */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-white/60 text-sm mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center space-x-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ChartLegendItem Component
 *
 * A custom legend item component for manual legends.
 */
export interface ChartLegendItemProps {
  /** Legend label */
  label: string;
  /** Legend color */
  color: string;
  /** Optional value to display */
  value?: string | number;
  /** Click handler */
  onClick?: () => void;
}

export const ChartLegendItem: React.FC<ChartLegendItemProps> = ({
  label,
  color,
  value,
  onClick,
}) => {
  return (
    <div
      className={`
        flex items-center justify-between space-x-2 px-3 py-2 rounded-lg
        ${onClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-gray-700 dark:text-white/80 text-sm">
          {label}
        </span>
      </div>
      {value !== undefined && (
        <span className="text-gray-900 dark:text-white font-semibold text-sm">
          {value}
        </span>
      )}
    </div>
  );
};

/**
 * ChartMetricCard Component
 *
 * A small card component to display key metrics alongside charts.
 */
export interface ChartMetricCardProps {
  /** Metric label */
  label: string;
  /** Metric value */
  value: string | number;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Optional trend indicator */
  trend?: 'up' | 'down' | 'neutral';
  /** Optional trend value */
  trendValue?: string;
  /** Additional CSS class names */
  className?: string;
}

export const ChartMetricCard: React.FC<ChartMetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendValue,
  className = '',
}) => {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-white/60',
  };

  const trendColor = trend ? trendColors[trend] : '';

  return (
    <div
      className={`
        bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-sm
        ${className}
      `}
    >
      {icon && (
        <div className="text-blue-500 dark:text-blue-400 mb-2">
          {icon}
        </div>
      )}
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-gray-600 dark:text-white/60 text-sm">
          {label}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 text-xs ${trendColor}`}>
            {trend === 'up' && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartContainer;
