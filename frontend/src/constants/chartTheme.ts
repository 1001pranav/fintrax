/**
 * Chart Theme Configuration for Fintrax
 *
 * Defines color schemes and styling for all charts to match the Fintrax design system.
 * Uses Tailwind color palette with glassmorphism dark theme aesthetic.
 */

/**
 * Primary color palette for charts
 * Based on Fintrax's color scheme:
 * - Blue: Projects/Primary
 * - Purple: Tasks/Secondary
 * - Green: Income/Positive/Completed
 * - Red: Expense/Negative
 * - Yellow: Metrics/Warnings
 */
export const CHART_COLORS = {
  // Primary palette
  primary: '#60a5fa',      // blue-400
  secondary: '#c084fc',    // purple-400
  success: '#4ade80',      // green-400
  danger: '#f87171',       // red-400
  warning: '#facc15',      // yellow-400
  info: '#38bdf8',         // sky-400

  // Extended palette for multi-series charts
  palette: [
    '#60a5fa', // blue-400
    '#c084fc', // purple-400
    '#4ade80', // green-400
    '#f87171', // red-400
    '#facc15', // yellow-400
    '#38bdf8', // sky-400
    '#fb923c', // orange-400
    '#f472b6', // pink-400
    '#a78bfa', // violet-400
    '#2dd4bf', // teal-400
  ],

  // Financial colors
  income: '#4ade80',       // green-400
  expense: '#f87171',      // red-400

  // Gradients (for area charts)
  gradients: {
    income: {
      start: 'rgba(74, 222, 128, 0.4)',   // green-400 with opacity
      end: 'rgba(74, 222, 128, 0.05)',
    },
    expense: {
      start: 'rgba(248, 113, 113, 0.4)',  // red-400 with opacity
      end: 'rgba(248, 113, 113, 0.05)',
    },
    primary: {
      start: 'rgba(96, 165, 250, 0.4)',   // blue-400 with opacity
      end: 'rgba(96, 165, 250, 0.05)',
    },
  },

  // Text and grid colors (for dark theme)
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.6)',
    muted: 'rgba(255, 255, 255, 0.4)',
  },

  grid: 'rgba(255, 255, 255, 0.1)',
  axis: 'rgba(255, 255, 255, 0.2)',

  // Background colors
  background: {
    card: 'rgba(255, 255, 255, 0.05)',
    tooltip: 'rgba(0, 0, 0, 0.9)',
  },
};

/**
 * Default styling configuration for chart components
 */
export const CHART_STYLE_CONFIG = {
  // Common styles
  fontFamily: 'var(--font-family, system-ui, -apple-system, sans-serif)',
  fontSize: 12,

  // Grid configuration
  grid: {
    stroke: CHART_COLORS.grid,
    strokeDasharray: '3 3',
  },

  // Axis configuration
  axis: {
    stroke: CHART_COLORS.axis,
    fontSize: 12,
    fill: CHART_COLORS.text.secondary,
  },

  // Tooltip configuration
  tooltip: {
    contentStyle: {
      backgroundColor: CHART_COLORS.background.tooltip,
      border: `1px solid ${CHART_COLORS.grid}`,
      borderRadius: '12px',
      padding: '12px',
      backdropFilter: 'blur(12px)',
    },
    labelStyle: {
      color: CHART_COLORS.text.primary,
      fontWeight: 600,
      marginBottom: '8px',
    },
    itemStyle: {
      color: CHART_COLORS.text.secondary,
    },
    cursor: {
      stroke: CHART_COLORS.grid,
      strokeWidth: 1,
    },
  },

  // Legend configuration
  legend: {
    iconType: 'circle' as const,
    wrapperStyle: {
      paddingTop: '20px',
      fontSize: '14px',
    },
    formatter: (value: string) => (
      `<span style="color: ${CHART_COLORS.text.primary}">${value}</span>`
    ),
  },
};

/**
 * Responsive breakpoints for charts
 */
export const CHART_BREAKPOINTS = {
  mobile: 640,    // sm
  tablet: 768,    // md
  desktop: 1024,  // lg
  wide: 1280,     // xl
};

/**
 * Default chart dimensions
 */
export const CHART_DIMENSIONS = {
  height: {
    small: 200,
    medium: 300,
    large: 400,
  },
  aspectRatio: {
    standard: 16 / 9,
    wide: 21 / 9,
    square: 1,
  },
};

/**
 * Get a color from the palette by index (cycles through palette)
 */
export const getColorByIndex = (index: number): string => {
  return CHART_COLORS.palette[index % CHART_COLORS.palette.length];
};

/**
 * Get gradient definition ID for use in SVG
 */
export const getGradientId = (type: 'income' | 'expense' | 'primary'): string => {
  return `gradient-${type}`;
};

/**
 * Format currency for chart labels
 */
export const formatChartCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `₹${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toFixed(0)}`;
};

/**
 * Format percentage for chart labels
 */
export const formatChartPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Category colors for expense breakdown
 */
export const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  food: '#f87171',           // red-400
  transport: '#fb923c',      // orange-400
  bills: '#facc15',          // yellow-400
  entertainment: '#c084fc',  // purple-400
  shopping: '#f472b6',       // pink-400
  other: '#94a3b8',          // slate-400
};

/**
 * Category colors for income breakdown
 */
export const INCOME_CATEGORY_COLORS: Record<string, string> = {
  salary: '#4ade80',         // green-400
  freelance: '#2dd4bf',      // teal-400
  investment: '#38bdf8',     // sky-400
  other: '#94a3b8',          // slate-400
};

/**
 * Get color for a specific category (income or expense)
 */
export const getCategoryColor = (category: string, type: 'income' | 'expense'): string => {
  const colorMap = type === 'income' ? INCOME_CATEGORY_COLORS : EXPENSE_CATEGORY_COLORS;
  return colorMap[category.toLowerCase()] || colorMap.other;
};
