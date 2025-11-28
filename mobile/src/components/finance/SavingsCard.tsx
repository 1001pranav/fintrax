/**
 * SavingsCard Component
 * Display individual savings item with progress bar
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Savings } from '../../constants/types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface SavingsCardProps {
  savings: Savings;
}

export const SavingsCard: React.FC<SavingsCardProps> = ({ savings }) => {
  const progress = savings.goal > 0 ? (savings.current / savings.goal) * 100 : 0;
  const remaining = savings.goal - savings.current;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="trending-up" size={24} color="#10B981" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{savings.name}</Text>
          <Text style={styles.subtitle}>
            {formatCurrency(savings.current)} of {formatCurrency(savings.goal)}
          </Text>
        </View>
        <Text style={styles.percentage}>{formatPercentage(progress)}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor:
                  progress >= 100 ? '#10B981' : progress >= 50 ? '#3B82F6' : '#F59E0B',
              },
            ]}
          />
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Remaining</Text>
          <Text style={[styles.detailValue, { color: remaining > 0 ? '#EF4444' : '#10B981' }]}>
            {remaining > 0 ? formatCurrency(remaining) : 'Goal Reached!'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  percentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});
