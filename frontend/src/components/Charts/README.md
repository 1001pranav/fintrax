# Fintrax Charts Library

A comprehensive charting solution for Fintrax built on Recharts with a custom theme matching the application's dark glassmorphism design.

## 🎨 Features

- **Pre-configured Charts**: Line, Area, Bar, and Pie charts with Fintrax styling
- **Responsive Design**: All charts are mobile-friendly and responsive
- **Dark Theme**: Matches Fintrax's dark glassmorphism aesthetic
- **Loading States**: Built-in loading, error, and empty states
- **Reusable Components**: Modular design for easy composition
- **TypeScript**: Full TypeScript support with proper typing
- **Accessibility**: ARIA labels and keyboard navigation support

## 📦 Installation

The Recharts library is already installed. To use the charts:

```tsx
import {
  ChartContainer,
  ChartGrid,
  BaseChartWrapper,
  StyledGrid,
  StyledXAxis,
  StyledYAxis,
  CustomTooltip,
  CHART_COLORS,
} from '@/components/Charts';
```

## 🚀 Quick Start

### Basic Line Chart

```tsx
import { LineChart, Line } from 'recharts';
import {
  ChartContainer,
  BaseChartWrapper,
  StyledGrid,
  StyledXAxis,
  StyledYAxis,
  CustomTooltip,
} from '@/components/Charts';

const data = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3000 },
  { month: 'Mar', value: 5000 },
];

export default function MyChart() {
  return (
    <ChartContainer title="Monthly Revenue" subtitle="Last 3 months">
      <BaseChartWrapper data={data} height={300}>
        <LineChart data={data}>
          <StyledGrid />
          <StyledXAxis dataKey="month" />
          <StyledYAxis />
          <CustomTooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#60a5fa"
            strokeWidth={2}
          />
        </LineChart>
      </BaseChartWrapper>
    </ChartContainer>
  );
}
```

### Multiple Charts in Grid

```tsx
import { ChartGrid } from '@/components/Charts';

export default function Dashboard() {
  return (
    <ChartGrid columns={2}>
      <ChartContainer title="Chart 1">
        {/* Chart 1 content */}
      </ChartContainer>
      <ChartContainer title="Chart 2">
        {/* Chart 2 content */}
      </ChartContainer>
    </ChartGrid>
  );
}
```

## 🎨 Theme Colors

The chart theme includes predefined colors matching Fintrax's design:

```tsx
import { CHART_COLORS } from '@/components/Charts';

// Primary colors
CHART_COLORS.primary    // #60a5fa (blue-400)
CHART_COLORS.secondary  // #c084fc (purple-400)
CHART_COLORS.success    // #4ade80 (green-400)
CHART_COLORS.danger     // #f87171 (red-400)
CHART_COLORS.warning    // #facc15 (yellow-400)

// Financial colors
CHART_COLORS.income     // #4ade80 (green-400)
CHART_COLORS.expense    // #f87171 (red-400)

// Extended palette (10 colors for multi-series charts)
CHART_COLORS.palette    // Array of 10 colors
```

## 📊 Available Components

### ChartContainer

A responsive card container for charts with title, subtitle, and actions.

**Props:**
- `title` (string): Chart title
- `subtitle?` (string): Optional subtitle
- `showRefresh?` (boolean): Show refresh button
- `onRefresh?` (function): Refresh callback
- `showFullscreen?` (boolean): Show fullscreen toggle
- `actions?` (ReactNode): Custom action buttons
- `loading?` (boolean): Loading state

### BaseChartWrapper

Handles loading, error, and empty states for charts.

**Props:**
- `data` (array): Chart data
- `height?` (number): Chart height in pixels (default: 300)
- `loading?` (boolean): Loading state
- `error?` (string): Error message
- `emptyMessage?` (string): Empty state message

### ChartGrid

Responsive grid layout for multiple charts.

**Props:**
- `columns?` (1|2|3|4): Number of columns on desktop (default: 2)
- `className?` (string): Additional CSS classes

### Styled Components

Pre-styled components matching Fintrax theme:

- `StyledGrid`: Cartesian grid with theme colors
- `StyledXAxis`: X-axis with theme styling
- `StyledYAxis`: Y-axis with theme styling
- `CustomTooltip`: Custom tooltip with glassmorphism
- `StyledLegend`: Legend with theme colors
- `ChartGradients`: Gradient definitions for area charts

### Utility Components

- `ChartSkeleton`: Loading skeleton
- `ChartError`: Error state display
- `ChartEmpty`: Empty state display
- `ChartMetricCard`: Metric card for key numbers
- `ChartLegendItem`: Custom legend item

## 🎯 Common Patterns

### Income vs Expense Line Chart

```tsx
<ChartContainer title="Income vs Expense">
  <BaseChartWrapper data={data} height={300}>
    <LineChart data={data}>
      <StyledGrid />
      <StyledXAxis dataKey="month" />
      <StyledYAxis tickFormatter={formatChartCurrency} />
      <CustomTooltip formatter={(val) => formatChartCurrency(Number(val))} />
      <Line
        dataKey="income"
        stroke={CHART_COLORS.income}
        strokeWidth={2}
      />
      <Line
        dataKey="expense"
        stroke={CHART_COLORS.expense}
        strokeWidth={2}
      />
    </LineChart>
  </BaseChartWrapper>
</ChartContainer>
```

### Area Chart with Gradient

```tsx
import { ChartGradients } from '@/components/Charts';

<ChartContainer title="Net Worth">
  <BaseChartWrapper data={data} height={300}>
    <AreaChart data={data}>
      <ChartGradients />
      <StyledGrid />
      <StyledXAxis dataKey="month" />
      <StyledYAxis />
      <Area
        dataKey="netWorth"
        stroke={CHART_COLORS.success}
        fill="url(#gradient-income)"
        strokeWidth={2}
      />
    </AreaChart>
  </BaseChartWrapper>
</ChartContainer>
```

### Expense Category Pie Chart

```tsx
import { PieChart, Pie, Cell } from 'recharts';
import { getCategoryColor } from '@/components/Charts';

const data = [
  { name: 'Food', value: 12000 },
  { name: 'Transport', value: 8000 },
  // ... more categories
];

<ChartContainer title="Expense Breakdown">
  <BaseChartWrapper data={data} height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={100}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={getCategoryColor(entry.name, 'expense')}
          />
        ))}
      </Pie>
      <CustomTooltip />
    </PieChart>
  </BaseChartWrapper>
</ChartContainer>
```

## 🔧 Utility Functions

### formatChartCurrency(value: number): string

Format numbers as currency with K/M suffixes.

```tsx
formatChartCurrency(1500)      // "₹1.5K"
formatChartCurrency(1500000)   // "₹1.5M"
```

### formatChartPercentage(value: number): string

Format numbers as percentages.

```tsx
formatChartPercentage(45.678)  // "45.7%"
```

### getColorByIndex(index: number): string

Get a color from the palette by index (cycles through).

```tsx
getColorByIndex(0)  // "#60a5fa" (blue)
getColorByIndex(1)  // "#c084fc" (purple)
```

### getCategoryColor(category: string, type: 'income' | 'expense'): string

Get color for a specific transaction category.

```tsx
getCategoryColor('food', 'expense')      // red
getCategoryColor('salary', 'income')     // green
```

## 📱 Responsive Behavior

All charts are responsive by default:

- **Mobile (< 640px)**: Single column layout, smaller charts
- **Tablet (640-1024px)**: Adaptive grid based on columns prop
- **Desktop (> 1024px)**: Full multi-column grid layout

## 🎨 Customization

### Custom Colors

```tsx
<Line dataKey="value" stroke="#custom-color" strokeWidth={2} />
```

### Custom Height

```tsx
<BaseChartWrapper data={data} height={400}>
  {/* Chart content */}
</BaseChartWrapper>
```

### Custom Tooltip Formatter

```tsx
<CustomTooltip
  formatter={(value, name) => [
    `${name}: $${value}`,
    name
  ]}
/>
```

## 📝 Best Practices

1. **Always use BaseChartWrapper**: It handles loading, error, and empty states
2. **Use ChartContainer**: Provides consistent styling and layout
3. **Format axis values**: Use formatChartCurrency or custom formatters
4. **Provide meaningful labels**: Always include chart titles and axis labels
5. **Test responsiveness**: Verify charts work on all screen sizes
6. **Use theme colors**: Stick to CHART_COLORS for consistency

## 🔍 Examples

See `ExampleChart.tsx` for complete working examples of all chart types.

## 🐛 Troubleshooting

**Chart not rendering:**
- Ensure data is not empty
- Check that data structure matches dataKey props
- Verify Recharts components are imported correctly

**Styling issues:**
- Verify Tailwind CSS is configured
- Check that theme colors are imported from chartTheme.ts
- Ensure glassmorphism classes are available

**TypeScript errors:**
- Import types from '@/components/Charts'
- Ensure data structure matches expected interface

## 📚 Resources

- [Recharts Documentation](https://recharts.org/)
- [Fintrax Design System](../../constants/chartTheme.ts)
- [Example Charts](./ExampleChart.tsx)
