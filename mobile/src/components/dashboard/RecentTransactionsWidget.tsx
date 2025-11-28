import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Transaction } from '../../types/models.types';
import { formatCurrency } from '../../utils/formatters';
import { formatRelativeTime } from '../../utils/dateUtils';

interface RecentTransactionsWidgetProps {
  transactions: Transaction[];
  loading?: boolean;
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({
  transactions,
  loading = false,
}) => {
  const navigation = useNavigation();

  const getCategoryIcon = (category?: string): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      Food: 'fast-food',
      Transport: 'car',
      Shopping: 'cart',
      Income: 'cash',
    };
    return icons[category || 'default'] || 'wallet';
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 1;
    const amountColor = isIncome ? '#10B981' : '#EF4444';

    return (
      <TouchableOpacity style={styles.transactionCard} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
          <Ionicons name={getCategoryIcon(item.category)} size={24} color="#3B82F6" />
        </View>

        <View style={styles.transactionDetails}>
          <Text style={styles.source} numberOfLines={1}>
            {item.source}
          </Text>
          <Text style={styles.time}>{formatRelativeTime(item.date)}</Text>
        </View>

        <Text style={[styles.amount, { color: amountColor }]}>
          {isIncome ? '+' : '-'}
          {formatCurrency(item.amount)}
        </Text>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
      <Text style={styles.emptyText}>No recent transactions</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Transactions</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3B82F6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Finance' as never)}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions.slice(0, 5)}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={EmptyState}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  viewAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  source: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});
