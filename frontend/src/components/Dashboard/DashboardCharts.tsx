'use client';

import React, { Suspense, lazy } from 'react';
import { ChartSkeleton } from '@/components/Charts/BaseChart';

/**
 * Lazy load chart components for better performance
 * Charts are heavy components with Recharts library, so we load them on demand
 */
const ExpensePieChart = lazy(() => import('@/components/Charts/ExpensePieChart'));
const IncomeTrendChart = lazy(() => import('@/components/Charts/IncomeTrendChart'));
const NetWorthChart = lazy(() => import('@/components/Charts/NetWorthChart'));

/**
 * Props for DashboardCharts component
 */
export interface DashboardChartsProps {
  /** Additional CSS classes */
  className?: string;
  /** Show only specific charts (defaults to all) */
  chartsToShow?: ('netWorth' | 'incomeTrend' | 'expenseBreakdown')[];
}

/**
 * DashboardCharts Component
 *
 * Displays key financial charts on the main dashboard.
 * Features:
 * - Lazy loading for performance
 * - Loading skeletons during chart load
 * - Responsive grid layout
 * - Configurable chart selection
 * - Integrated with finance store for real-time data
 *
 * Charts included:
 * 1. Net Worth Over Time - Shows financial health trend
 * 2. Income vs Expense Trend - Shows cash flow patterns
 * 3. Expense Breakdown - Shows spending by category
 */
export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  className = '',
  chartsToShow = ['netWorth', 'incomeTrend', 'expenseBreakdown'],
}) => {
  const showNetWorth = chartsToShow.includes('netWorth');
  const showIncomeTrend = chartsToShow.includes('incomeTrend');
  const showExpenseBreakdown = chartsToShow.includes('expenseBreakdown');

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
          <p className="text-white/60 text-sm mt-1">
            Key metrics and trends from your financial data
          </p>
        </div>
        <a
          href="/finance"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center space-x-1"
        >
          <span>View All</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Net Worth Chart - Primary focus */}
        {showNetWorth && (
          <Suspense
            fallback={
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="mb-4">
                  <div className="h-6 w-48 bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
                </div>
                <ChartSkeleton height={350} />
              </div>
            }
          >
            <NetWorthChart height={350} />
          </Suspense>
        )}

        {/* Two-column layout for Income Trend and Expense Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Income vs Expense Trend Chart */}
          {showIncomeTrend && (
            <Suspense
              fallback={
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="mb-4">
                    <div className="h-6 w-48 bg-white/10 rounded animate-pulse mb-2" />
                    <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
                  </div>
                  <ChartSkeleton height={300} />
                </div>
              }
            >
              <IncomeTrendChart height={300} initialPeriod="last-3-months" chartType="area" />
            </Suspense>
          )}

          {/* Expense Breakdown Chart */}
          {showExpenseBreakdown && (
            <Suspense
              fallback={
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="mb-4">
                    <div className="h-6 w-48 bg-white/10 rounded animate-pulse mb-2" />
                    <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
                  </div>
                  <ChartSkeleton height={300} />
                </div>
              }
            >
              <ExpensePieChart height={300} initialPeriod="this-month" />
            </Suspense>
          )}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/finance"
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all group"
          >
            <div className="text-green-400 mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">
              Add Transaction
            </div>
            <div className="text-white/60 text-xs mt-1">Record income/expense</div>
          </a>

          <a
            href="/finance"
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all group"
          >
            <div className="text-blue-400 mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
              View Reports
            </div>
            <div className="text-white/60 text-xs mt-1">Detailed analytics</div>
          </a>

          <a
            href="/finance"
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all group"
          >
            <div className="text-purple-400 mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors">
              Savings Goals
            </div>
            <div className="text-white/60 text-xs mt-1">Track your targets</div>
          </a>

          <a
            href="/projects"
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all group"
          >
            <div className="text-orange-400 mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors">
              Projects
            </div>
            <div className="text-white/60 text-xs mt-1">Manage tasks</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
