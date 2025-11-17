/**
 * CategoryPieChart Component
 * Pie chart showing expense breakdown by category
 */

import React, { useMemo } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Transaction, TransactionType } from '../../constants/types';
import { getCategoryBreakdown } from '../../utils/chartDataProcessors';
import { getCategoryColor } from '../../constants/financeCategories';
import { formatCurrency } from '../../utils/formatters';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  transactions,
}) => {
  const screenWidth = Dimensions.get('window').width;

  const chartData = useMemo(() => {
    // Get only expense transactions
    const expenseTransactions = transactions.filter(
      (t) => t.type === TransactionType.EXPENSE
    );

    // Get category colors
    const categoryColors: { [key: string]: string } = {};
    expenseTransactions.forEach((t) => {
      if (!categoryColors[t.category]) {
        categoryColors[t.category] = getCategoryColor(t.category);
      }
    });

    const categoryData = getCategoryBreakdown(
      expenseTransactions,
      categoryColors
    );

    return categoryData.map((category) => ({
      name: category.name,
      amount: category.amount,
      color: category.color,
      legendFontColor: '#6B7280',
      legendFontSize: 14,
    }));
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expense data to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses by Category</Text>
      <PieChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
      />
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.legendAmount}>
              {formatCurrency(item.amount)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
