/**
 * LoanCard Component
 * Display individual loan item with payment information
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Loan } from '../../constants/types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface LoanCardProps {
  loan: Loan;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan }) => {
  const paidAmount = loan.amount - loan.remaining;
  const paidPercentage = loan.amount > 0 ? (paidAmount / loan.amount) * 100 : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={24} color="#F59E0B" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{loan.name}</Text>
          <Text style={styles.subtitle}>
            {formatCurrency(paidAmount)} paid of {formatCurrency(loan.amount)}
          </Text>
        </View>
        {loan.interestRate && (
          <View style={styles.rateContainer}>
            <Text style={styles.rateValue}>{loan.interestRate}%</Text>
            <Text style={styles.rateLabel}>APR</Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${Math.min(paidPercentage, 100)}%` }]} />
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Remaining</Text>
          <Text style={[styles.detailValue, { color: '#EF4444' }]}>
            {formatCurrency(loan.remaining)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Paid</Text>
          <Text style={[styles.detailValue, { color: '#10B981' }]}>
            {formatPercentage(paidPercentage)}
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
    backgroundColor: '#F59E0B20',
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
  rateContainer: {
    alignItems: 'center',
  },
  rateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  rateLabel: {
    fontSize: 11,
    color: '#9CA3AF',
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
    backgroundColor: '#10B981',
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
