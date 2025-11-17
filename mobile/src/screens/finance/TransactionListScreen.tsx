/**
 * TransactionListScreen
 * Full list of transactions with filters and search
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchTransactions,
  deleteTransaction,
} from '../../store/slices/financeSlice';
import { TransactionCard } from '../../components/finance/TransactionCard';
import { SearchBar } from '../../components/common/SearchBar';
import {
  TransactionFiltersComponent,
  TransactionFilters,
} from '../../components/finance/TransactionFilters';
import { EmptyState } from '../../components/common/EmptyState';
import { Transaction, TransactionType } from '../../constants/types';

export const TransactionListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { transactions, isLoading } = useAppSelector((state) => state.finance);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    categories: [],
    dateRange: 'all',
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    await dispatch(fetchTransactions());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const handleTransactionPress = (transactionId: string) => {
    navigation.navigate('AddTransaction', { transactionId });
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    await dispatch(deleteTransaction(transactionId));
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      categories: [],
      dateRange: 'all',
    });
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((t) =>
        filters.categories.includes(t.category)
      );
    }

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(
          (t) => new Date(t.date) >= today
        );
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(
          (t) => new Date(t.date) >= weekAgo
        );
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(
          (t) => new Date(t.date) >= monthStart
        );
        break;
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return filtered;
  }, [transactions, searchQuery, filters]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    filteredTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);

      let groupKey: string;
      if (transactionDate.getTime() === today.getTime()) {
        groupKey = 'Today';
      } else if (transactionDate.getTime() === yesterday.getTime()) {
        groupKey = 'Yesterday';
      } else if (transactionDate >= weekAgo) {
        groupKey = 'This Week';
      } else {
        groupKey = 'Older';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(transaction);
    });

    // Convert to array and sort groups
    const groupOrder = ['Today', 'Yesterday', 'This Week', 'Older'];
    return groupOrder
      .filter((key) => groups[key])
      .map((key) => ({ title: key, data: groups[key] }));
  }, [filteredTransactions]);

  const renderSectionHeader = ({ section }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>
        {section.data.length} transaction{section.data.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionCard
      transaction={item}
      onPress={() => handleTransactionPress(item.id)}
      onDelete={() => handleDeleteTransaction(item.id)}
    />
  );

  const renderFlatListData = useMemo(() => {
    const data: any[] = [];
    groupedTransactions.forEach((group) => {
      data.push({ type: 'header', title: group.title, count: group.data.length });
      group.data.forEach((transaction) => {
        data.push({ type: 'item', transaction });
      });
    });
    return data;
  }, [groupedTransactions]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <Ionicons
            name={showFilters ? 'filter' : 'filter-outline'}
            size={24}
            color="#3B82F6"
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search transactions..."
        />
      </View>

      {/* Filters */}
      {showFilters && (
        <TransactionFiltersComponent
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />
      )}

      {/* Transaction List */}
      {filteredTransactions.length > 0 ? (
        <FlatList
          data={renderFlatListData}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `header-${index}` : item.transaction.id
          }
          renderItem={({ item }) =>
            item.type === 'header' ? (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <Text style={styles.sectionCount}>
                  {item.count} transaction{item.count !== 1 ? 's' : ''}
                </Text>
              </View>
            ) : (
              <TransactionCard
                transaction={item.transaction}
                onPress={() => handleTransactionPress(item.transaction.id)}
                onDelete={() => handleDeleteTransaction(item.transaction.id)}
              />
            )
          }
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="receipt-outline"
          title="No Transactions Found"
          message={
            searchQuery || filters.type !== 'all' || filters.categories.length > 0
              ? 'Try adjusting your filters'
              : 'Start adding transactions to track your finances'
          }
        />
      )}
    </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionCount: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
