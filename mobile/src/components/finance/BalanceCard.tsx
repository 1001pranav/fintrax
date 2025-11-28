/**
 * BalanceCard Component
 * Displays current balance prominently
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatters';

interface BalanceCardProps {
  balance: number;
  trend?: 'up' | 'down' | 'neutral';
  trendAmount?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  trend = 'neutral',
  trendAmount,
}) => {
  const isNegative = balance < 0;
  const trendColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#6B7280';

  return (
    <View style={[styles.card, isNegative && styles.cardNegative]}>
      <Text style={styles.label}>Current Balance</Text>
      <Text style={[styles.amount, isNegative && styles.amountNegative]}>
        {formatCurrency(Math.abs(balance))}
        {isNegative && <Text style={styles.negativeIndicator}> (Negative)</Text>}
      </Text>

      {trendAmount !== undefined && trendAmount !== 0 && (
        <View style={styles.trendContainer}>
          <Ionicons
            name={trend === 'up' ? 'trending-up' : 'trending-down'}
            size={16}
            color={trendColor}
          />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {formatCurrency(Math.abs(trendAmount))} this month
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardNegative: {
    backgroundColor: '#EF4444',
  },
  label: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  amount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  amountNegative: {
    color: '#FFFFFF',
  },
  negativeIndicator: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
