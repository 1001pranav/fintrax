/**
 * MonthlySummary Component
 * Displays income vs expense summary for current month
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatters';

interface MonthlySummaryProps {
  income: number;
  expense: number;
  month?: string;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  income,
  expense,
  month = 'This Month',
}) => {
  const net = income - expense;
  const isPositive = net >= 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{month}</Text>

      <View style={styles.row}>
        <SummaryItem icon="arrow-down-circle" iconColor="#10B981" label="Income" amount={income} />
        <SummaryItem icon="arrow-up-circle" iconColor="#EF4444" label="Expenses" amount={expense} />
      </View>

      <View style={styles.divider} />

      <View style={styles.netRow}>
        <Text style={styles.netLabel}>Net</Text>
        <Text style={[styles.netAmount, { color: isPositive ? '#10B981' : '#EF4444' }]}>
          {isPositive ? '+' : '-'}
          {formatCurrency(Math.abs(net))}
        </Text>
      </View>
    </View>
  );
};

interface SummaryItemProps {
  icon: string;
  iconColor: string;
  label: string;
  amount: number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ icon, iconColor, label, amount }) => {
  return (
    <View style={styles.summaryItem}>
      <View style={[styles.iconCircle, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon as any} size={24} color={iconColor} />
      </View>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryAmount, { color: iconColor }]}>{formatCurrency(amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  netAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
