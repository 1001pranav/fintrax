'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BaseChartWrapper,
  StyledGrid,
  StyledXAxis,
  StyledYAxis,
  CustomTooltip,
  StyledLegend,
  ChartGradients,
} from './BaseChart';
import { ChartContainer, ChartGrid } from './ChartContainer';
import {
  CHART_COLORS,
  formatChartCurrency,
  getColorByIndex,
} from '@/constants/chartTheme';

/**
 * Example data for demonstration
 */
const SAMPLE_LINE_DATA = [
  { month: 'Jan', income: 45000, expense: 30000 },
  { month: 'Feb', income: 52000, expense: 35000 },
  { month: 'Mar', income: 48000, expense: 32000 },
  { month: 'Apr', income: 61000, expense: 38000 },
  { month: 'May', income: 55000, expense: 40000 },
  { month: 'Jun', income: 67000, expense: 42000 },
];

const SAMPLE_PIE_DATA = [
  { name: 'Food', value: 12000 },
  { name: 'Transport', value: 8000 },
  { name: 'Bills', value: 15000 },
  { name: 'Entertainment', value: 5000 },
  { name: 'Shopping', value: 10000 },
];

/**
 * Example Line Chart
 * Demonstrates income vs expense trend over time
 */
export const ExampleLineChart: React.FC = () => {
  return (
    <ChartContainer
      title="Income vs Expense Trend"
      subtitle="Monthly comparison"
      showRefresh
      onRefresh={() => console.log('Refreshing chart...')}
    >
      <BaseChartWrapper data={SAMPLE_LINE_DATA} height={300}>
        <LineChart data={SAMPLE_LINE_DATA}>
          <StyledGrid />
          <StyledXAxis dataKey="month" />
          <StyledYAxis tickFormatter={formatChartCurrency} />
          <CustomTooltip formatter={(value) => formatChartCurrency(Number(value))} />
          <StyledLegend />
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke={CHART_COLORS.income}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.income, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke={CHART_COLORS.expense}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.expense, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </BaseChartWrapper>
    </ChartContainer>
  );
};

/**
 * Example Area Chart
 * Demonstrates area chart with gradients
 */
export const ExampleAreaChart: React.FC = () => {
  return (
    <ChartContainer
      title="Net Worth Over Time"
      subtitle="Total assets - liabilities"
    >
      <BaseChartWrapper data={SAMPLE_LINE_DATA} height={300}>
        <AreaChart data={SAMPLE_LINE_DATA}>
          <ChartGradients />
          <StyledGrid />
          <StyledXAxis dataKey="month" />
          <StyledYAxis tickFormatter={formatChartCurrency} />
          <CustomTooltip formatter={(value) => formatChartCurrency(Number(value))} />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke={CHART_COLORS.income}
            fill="url(#gradient-income)"
            strokeWidth={2}
          />
        </AreaChart>
      </BaseChartWrapper>
    </ChartContainer>
  );
};

/**
 * Example Bar Chart
 * Demonstrates monthly income and expense bars
 */
export const ExampleBarChart: React.FC = () => {
  return (
    <ChartContainer
      title="Monthly Breakdown"
      subtitle="Income and expenses by month"
    >
      <BaseChartWrapper data={SAMPLE_LINE_DATA} height={300}>
        <BarChart data={SAMPLE_LINE_DATA}>
          <StyledGrid />
          <StyledXAxis dataKey="month" />
          <StyledYAxis tickFormatter={formatChartCurrency} />
          <CustomTooltip formatter={(value) => formatChartCurrency(Number(value))} />
          <StyledLegend />
          <Bar
            dataKey="income"
            name="Income"
            fill={CHART_COLORS.income}
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="Expense"
            fill={CHART_COLORS.expense}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </BaseChartWrapper>
    </ChartContainer>
  );
};

/**
 * Example Pie Chart
 * Demonstrates expense category breakdown
 */
export const ExamplePieChart: React.FC = () => {
  return (
    <ChartContainer
      title="Expense Categories"
      subtitle="Breakdown by category"
    >
      <BaseChartWrapper data={SAMPLE_PIE_DATA} height={300}>
        <PieChart>
          <Pie
            data={SAMPLE_PIE_DATA}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {SAMPLE_PIE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorByIndex(index)} />
            ))}
          </Pie>
          <CustomTooltip formatter={(value) => formatChartCurrency(Number(value))} />
        </PieChart>
      </BaseChartWrapper>
    </ChartContainer>
  );
};

/**
 * Example Charts Grid
 * Demonstrates how to layout multiple charts
 */
export const ExampleChartsGrid: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-white text-2xl font-bold mb-4">Chart Examples</h2>

      {/* Two column grid */}
      <ChartGrid columns={2}>
        <ExampleLineChart />
        <ExampleBarChart />
      </ChartGrid>

      {/* Single column */}
      <ChartGrid columns={1}>
        <ExampleAreaChart />
      </ChartGrid>

      {/* Two column grid */}
      <ChartGrid columns={2}>
        <ExamplePieChart />
        <ChartContainer
          title="Empty Chart Example"
          subtitle="No data available"
        >
          <BaseChartWrapper data={[]} height={300}>
            <LineChart data={[]}>
              <Line dataKey="value" />
            </LineChart>
          </BaseChartWrapper>
        </ChartContainer>
      </ChartGrid>
    </div>
  );
};

export default ExampleChartsGrid;
