/**
 * Charts Module
 *
 * Exports all chart components, utilities, and theme configurations
 * for use throughout the Fintrax application.
 */

// Base chart components and utilities
export {
  BaseChartWrapper,
  CustomTooltip,
  StyledGrid,
  StyledXAxis,
  StyledYAxis,
  StyledLegend,
  ChartSkeleton,
  ChartError,
  ChartEmpty,
  ChartGradients,
} from './BaseChart';

export type { BaseChartProps } from './BaseChart';

// Chart containers and layout components
export {
  ChartContainer,
  ChartGrid,
  ChartHeader,
  ChartLegendItem,
  ChartMetricCard,
} from './ChartContainer';

export type {
  ChartContainerProps,
  ChartGridProps,
  ChartHeaderProps,
  ChartLegendItemProps,
  ChartMetricCardProps,
} from './ChartContainer';

// Theme and constants
export {
  CHART_COLORS,
  CHART_STYLE_CONFIG,
  CHART_BREAKPOINTS,
  CHART_DIMENSIONS,
  EXPENSE_CATEGORY_COLORS,
  INCOME_CATEGORY_COLORS,
  getColorByIndex,
  getGradientId,
  formatChartCurrency,
  formatChartPercentage,
  getCategoryColor,
} from '@/constants/chartTheme';
