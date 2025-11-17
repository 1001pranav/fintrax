import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Task } from '../../types/models.types';
import { formatDate } from '../../utils/dateUtils';

interface RecentTasksWidgetProps {
  tasks: Task[];
  loading?: boolean;
}

export const RecentTasksWidget: React.FC<RecentTasksWidgetProps> = ({
  tasks,
  loading = false,
}) => {
  const navigation = useNavigation();

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return '#EF4444'; // High priority (1-2)
    if (priority <= 4) return '#F59E0B'; // Medium priority (3-4)
    return '#10B981'; // Low priority (5)
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => navigation.navigate('Tasks' as never, {
        screen: 'TaskDetail',
        params: { taskId: item.id }
      } as never)}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleRow}>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
          <Text style={styles.taskTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="checkmark-circle-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      {item.end_date && (
        <Text style={styles.dueDate}>
          Due: {formatDate(item.end_date)}
        </Text>
      )}
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-done" size={48} color="#D1D5DB" />
      <Text style={styles.emptyText}>No tasks for today</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Today's Tasks</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3B82F6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Tasks ({tasks.length})</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Tasks' as never)}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks.slice(0, 5)}
        renderItem={renderTaskItem}
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
  taskCard: {
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  dueDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 16,
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
