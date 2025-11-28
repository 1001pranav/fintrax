/**
 * FinanceScreen
 * Main finance dashboard showing balance, summary, and recent transactions
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchDashboard, fetchTransactions } from '../../store/slices/financeSlice';
import { BalanceCard } from '../../components/finance/BalanceCard';
import { MonthlySummary } from '../../components/finance/MonthlySummary';
import { TransactionCard } from '../../components/finance/TransactionCard';
import { EmptyState } from '../../components/common/EmptyState';

export const FinanceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { summary, transactions, isLoading } = useAppSelector((state) => state.finance);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([dispatch(fetchDashboard()), dispatch(fetchTransactions())]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction');
  };

  const handleViewAllTransactions = () => {
    navigation.navigate('TransactionList');
  };

  const handleTransactionPress = (transactionId: string) => {
    navigation.navigate('AddTransaction', { transactionId });
  };

  const recentTransactions = transactions.slice(0, 10);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finance</Text>
        </View>

        {/* Balance Card */}
        <BalanceCard
          balance={summary?.balance || 0}
          trend={summary && summary.totalIncome > summary.totalExpense ? 'up' : 'down'}
          trendAmount={summary ? summary.totalIncome - summary.totalExpense : 0}
        />

        {/* Monthly Summary */}
        <MonthlySummary income={summary?.totalIncome || 0} expense={summary?.totalExpense || 0} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickActionButton
            icon="add-circle"
            label="Add Transaction"
            color="#3B82F6"
            onPress={handleAddTransaction}
          />
          <QuickActionButton
            icon="list"
            label="All Transactions"
            color="#8B5CF6"
            onPress={handleViewAllTransactions}
          />
          <QuickActionButton
            icon="trending-up"
            label="Savings"
            color="#10B981"
            onPress={() => navigation.navigate('Savings')}
          />
          <QuickActionButton
            icon="cash"
            label="Loans"
            color="#F59E0B"
            onPress={() => navigation.navigate('Loans')}
          />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.length > 10 && (
              <TouchableOpacity onPress={handleViewAllTransactions}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction.id)}
              />
            ))
          ) : (
            <EmptyState
              icon="wallet-outline"
              title="No Transactions"
              message="Start tracking your income and expenses"
            />
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTransaction} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

interface QuickActionButtonProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, color, onPress }) => {
  return (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
