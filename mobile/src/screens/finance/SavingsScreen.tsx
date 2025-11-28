/**
 * SavingsScreen
 * Display list of all savings goals
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchDashboard } from '../../store/slices/financeSlice';
import { SavingsCard } from '../../components/finance/SavingsCard';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';

export const SavingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { savings, isLoading } = useAppSelector((state) => state.finance);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSavings();
  }, []);

  const loadSavings = async () => {
    await dispatch(fetchDashboard());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSavings();
    setRefreshing(false);
  };

  const totalSavings = savings.reduce((sum, s) => sum + s.current, 0);
  const totalGoals = savings.reduce((sum, s) => sum + s.goal, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Savings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Summary */}
      {savings.length > 0 && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Saved</Text>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              {formatCurrency(totalSavings)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Goals</Text>
            <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>
              {formatCurrency(totalGoals)}
            </Text>
          </View>
        </View>
      )}

      {/* Savings List */}
      {savings.length > 0 ? (
        <FlatList
          data={savings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SavingsCard savings={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="trending-up-outline"
            title="No Savings Goals"
            message="Start saving for your future goals"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
