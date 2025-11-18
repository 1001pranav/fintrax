import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchTasks, updateTask, deleteTask } from '../../store/slices/tasksSlice';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskFilters } from '../../components/tasks/TaskFilters';
import { SearchBar } from '../../components/common/SearchBar';
import { EmptyState } from '../../components/common/EmptyState';
import { TaskPriority, TaskStatus } from '../../constants/types';

export const TaskListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { tasks, isLoading } = useAppSelector((state) => state.tasks);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | null>(null);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | null>(null);
  const [filterProject, setFilterProject] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchTasks());
    setRefreshing(false);
  }, [dispatch]);

  // Filter tasks based on criteria
  const filteredTasks = tasks.filter((task) => {
    // Exclude archived tasks
    if (task.status === TaskStatus.ARCHIVED) return false;

    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filterStatus !== null && task.status !== filterStatus) {
      return false;
    }

    // Priority filter
    if (filterPriority !== null && task.priority !== filterPriority) {
      return false;
    }

    // Project filter
    if (filterProject !== null && task.projectId !== filterProject) {
      return false;
    }

    return true;
  });

  // Group tasks by priority
  const groupedTasks = {
    high: filteredTasks.filter((t) => t.priority === TaskPriority.HIGH || t.priority === TaskPriority.URGENT),
    medium: filteredTasks.filter((t) => t.priority === TaskPriority.MEDIUM),
    low: filteredTasks.filter((t) => t.priority === TaskPriority.LOW),
  };

  const handleTaskPress = (taskId: string) => {
    (navigation.navigate as any)('TaskDetail', { taskId });
  };

  const handleComplete = async (taskId: string) => {
    await dispatch(updateTask({ id: taskId, updates: { status: TaskStatus.COMPLETED } }));
  };

  const handleDelete = async (taskId: string) => {
    await dispatch(deleteTask(taskId));
  };

  const handleAddTask = () => {
    navigation.navigate('AddTask' as never);
  };

  const renderSectionHeader = (title: string, count: number, color: string) => {
    if (count === 0) return null;

    return (
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: color }]} />
        <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading && !refreshing && tasks.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      );
    }

    if (filteredTasks.length === 0) {
      return (
        <EmptyState
          icon="checkmark-done-circle-outline"
          title="No tasks found"
          message={searchQuery ? "Try a different search term" : "Create your first task!"}
          actionLabel={!searchQuery ? "Add Task" : undefined}
          onAction={!searchQuery ? handleAddTask : undefined}
        />
      );
    }

    return (
      <View>
        {groupedTasks.high.length > 0 && (
          <View>
            {renderSectionHeader('High Priority', groupedTasks.high.length, '#EF4444')}
            {groupedTasks.high.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task.id)}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}

        {groupedTasks.medium.length > 0 && (
          <View>
            {renderSectionHeader('Medium Priority', groupedTasks.medium.length, '#F59E0B')}
            {groupedTasks.medium.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task.id)}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}

        {groupedTasks.low.length > 0 && (
          <View>
            {renderSectionHeader('Low Priority', groupedTasks.low.length, '#10B981')}
            {groupedTasks.low.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task.id)}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity onPress={handleAddTask}>
          <Ionicons name="add-circle" size={32} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search tasks..."
      />

      <TaskFilters
        selectedStatus={filterStatus}
        selectedPriority={filterPriority}
        selectedProject={filterProject}
        onStatusChange={setFilterStatus}
        onPriorityChange={setFilterPriority}
        onProjectChange={setFilterProject}
      />

      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => renderContent()}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTask}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  listContent: {
    paddingBottom: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    marginTop: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
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
