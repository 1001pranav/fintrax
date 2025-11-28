import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as Haptics from 'expo-haptics';
import { Task, TaskPriority, TaskStatus } from '../../constants/types';
import { formatDate } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onComplete?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onComplete, onDelete }) => {
  const getPriorityColor = (priority: TaskPriority) => {
    if (priority === TaskPriority.HIGH || priority === TaskPriority.URGENT) return '#EF4444';
    if (priority === TaskPriority.MEDIUM) return '#F59E0B';
    return '#10B981';
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    if (priority === TaskPriority.HIGH || priority === TaskPriority.URGENT) return 'High';
    if (priority === TaskPriority.MEDIUM) return 'Medium';
    return 'Low';
  };

  const handleComplete = () => {
    if (onComplete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onComplete(task.id);
    }
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete && onDelete(task.id),
      },
    ]);
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.completeAction} onPress={handleComplete} activeOpacity={0.8}>
      <Ionicons name="checkmark" size={24} color="#FFFFFF" />
      <Text style={styles.actionText}>Complete</Text>
    </TouchableOpacity>
  );

  const renderLeftActions = () => (
    <TouchableOpacity style={styles.deleteAction} onPress={handleDelete} activeOpacity={0.8}>
      <Ionicons name="trash" size={24} color="#FFFFFF" />
      <Text style={styles.actionText}>Delete</Text>
    </TouchableOpacity>
  );

  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <Swipeable
      renderRightActions={onComplete ? renderRightActions : undefined}
      renderLeftActions={onDelete ? renderLeftActions : undefined}
      overshootRight={false}
      overshootLeft={false}
    >
      <TouchableOpacity
        style={[styles.container, isCompleted && styles.completedContainer]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View
                style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]}
              />
              <Text style={[styles.title, isCompleted && styles.completedText]} numberOfLines={2}>
                {task.title}
              </Text>
            </View>
            <TouchableOpacity onPress={handleComplete}>
              <Ionicons
                name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={24}
                color={isCompleted ? '#10B981' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>

          {task.description && (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.badges}>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(task.priority) + '20' },
                ]}
              >
                <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                  {getPriorityLabel(task.priority)}
                </Text>
              </View>
              {task.projectId && (
                <View style={styles.projectBadge}>
                  <Ionicons name="folder-outline" size={12} color="#6B7280" />
                  <Text style={styles.projectText}>Project</Text>
                </View>
              )}
            </View>
            {task.dueDate && <Text style={styles.dueDate}>{formatDate(task.dueDate)}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    opacity: 0.6,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    marginLeft: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  projectText: {
    fontSize: 12,
    color: '#6B7280',
  },
  dueDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  completeAction: {
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 4,
    marginRight: 16,
    borderRadius: 8,
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 4,
    marginLeft: 16,
    borderRadius: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
