import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../../utils/formatters';

interface FinancialSummaryCardProps {
  balance: number;
  netWorth: number;
  loading?: boolean;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  balance,
  netWorth,
  loading = false,
}) => {
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Finance' as never)}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <View style={styles.item}>
          <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="wallet" size={20} color="#3B82F6" />
          </View>
          <Text style={styles.label}>Total Balance</Text>
          <Text style={styles.amount}>{formatCurrency(balance)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.item}>
          <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="trending-up" size={20} color="#10B981" />
          </View>
          <Text style={styles.label}>Net Worth</Text>
          <Text style={styles.amount}>{formatCurrency(netWorth)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFF0',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
});
