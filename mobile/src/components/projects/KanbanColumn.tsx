/**
 * Kanban Column Component (US-4.6)
 * Displays a column in the Kanban board (To Do, In Progress, Done)
 */

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring, interpolateColor } from 'react-native-reanimated';
import { Task, TaskPriority } from '../../constants/types';
import { colors, spacing } from '../../theme';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onTaskPress: (task: Task) => void;
  onAddTask: () => void;
  style?: ViewStyle;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  icon,
  color,
  onTaskPress,
  onAddTask,
  style,
}) => {
  const renderTaskCard = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[styles.taskCard, { borderLeftColor: color }]}
      onPress={() => onTaskPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.taskTitle} numberOfLines={2}>
        {item.title}
      </Text>
      {item.description && (
        <Text style={styles.taskDescription} numberOfLines={1}>
          {item.description}
        </Text>
      )}
      <View style={styles.taskFooter}>
        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor:
                item.priority === TaskPriority.HIGH || item.priority === TaskPriority.URGENT
                  ? colors.errorLight
                  : item.priority === TaskPriority.MEDIUM
                    ? colors.warningLight
                    : colors.successLight,
            },
          ]}
        >
          <Text style={styles.priorityText}>
            {item.priority === TaskPriority.HIGH || item.priority === TaskPriority.URGENT
              ? 'High'
              : item.priority === TaskPriority.MEDIUM
                ? 'Med'
                : 'Low'}
          </Text>
        </View>
        {item.dueDate && (
          <View style={styles.dueDate}>
            <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.dueDateText}>
              {new Date(item.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Column Header */}
      <View style={[styles.header, { backgroundColor: color + '20' }]}>
        <View style={styles.headerLeft}>
          <Ionicons name={icon} size={20} color={color} />
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{tasks.length}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onAddTask}>
          <Ionicons name="add-circle-outline" size={22} color={color} />
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <FlatList
        data={tasks}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    marginRight: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  list: {
    padding: spacing.md,
  },
  taskCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  taskDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
  },
});
