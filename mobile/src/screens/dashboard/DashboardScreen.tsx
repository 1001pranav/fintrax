import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchDashboardData } from '../../store/slices/dashboardSlice';
import { WelcomeHeader } from '../../components/dashboard/WelcomeHeader';
import { FinancialSummaryCard } from '../../components/dashboard/FinancialSummaryCard';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { RecentTasksWidget } from '../../components/dashboard/RecentTasksWidget';
import { RecentTransactionsWidget } from '../../components/dashboard/RecentTransactionsWidget';

export const DashboardScreen = () => {
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { balance, netWorth, recentTasks, recentTransactions, loading } =
    useAppSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch dashboard data on mount
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchDashboardData());
    setRefreshing(false);
  }, [dispatch]);

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen
    console.log('Notification pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
      >
        <WelcomeHeader
          userName={user?.firstName || 'User'}
          onNotificationPress={handleNotificationPress}
        />

        <FinancialSummaryCard
          balance={balance}
          netWorth={netWorth}
          loading={loading}
        />

        <QuickActions />

        <RecentTasksWidget
          tasks={recentTasks}
          loading={loading}
        />

        <RecentTransactionsWidget
          transactions={recentTransactions}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
