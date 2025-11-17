/**
 * BalanceTrendChart Component
 * Area chart showing balance trend over time
 */

import React, { useMemo } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Transaction } from '../../constants/types';
import { getBalanceTrendData } from '../../utils/chartDataProcessors';

interface BalanceTrendChartProps {
  transactions: Transaction[];
  initialBalance?: number;
}

export const BalanceTrendChart: React.FC<BalanceTrendChartProps> = ({
  transactions,
  initialBalance = 0,
}) => {
  const screenWidth = Dimensions.get('window').width;

  const chartData = useMemo(() => {
    const balanceData = getBalanceTrendData(transactions, initialBalance);

    // Take last 30 data points for better visualization
    const recentData = balanceData.slice(-30);

    if (recentData.length === 0) {
      return null;
    }

    // Format labels (show dates for every 5th point)
    const labels = recentData.map((_, index) => {
      if (index % 5 === 0) {
        const date = new Date(recentData[index].date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }
      return '';
    });

    const balances = recentData.map((d) => d.balance);
    const minBalance = Math.min(...balances);
    const isPositive = minBalance >= 0;

    return {
      labels,
      datasets: [
        {
          data: balances,
          color: () => (isPositive ? '#10B981' : '#EF4444'),
          strokeWidth: 3,
        },
      ],
    };
  }, [transactions, initialBalance]);

  if (!chartData || transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No balance data to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Balance Trend</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.6})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '0',
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#E5E7EB',
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines
        withVerticalLabels
        withHorizontalLabels
        withShadow
      />
      <Text style={styles.subtitle}>Last 30 transactions</Text>
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
  chart: {
    borderRadius: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
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
