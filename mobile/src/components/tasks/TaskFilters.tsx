import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskStatus, TaskPriority } from '../../constants/types';

interface TaskFiltersProps {
  selectedStatus: TaskStatus | null;
  selectedPriority: TaskPriority | null;
  selectedProject: string | null;
  onStatusChange: (status: TaskStatus | null) => void;
  onPriorityChange: (priority: TaskPriority | null) => void;
  onProjectChange: (project: string | null) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedStatus,
  selectedPriority,
  selectedProject,
  onStatusChange,
  onPriorityChange,
  onProjectChange,
}) => {
  const statusOptions = [
    { value: null as null, label: 'All Status' },
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.COMPLETED, label: 'Completed' },
  ];

  const priorityOptions = [
    { value: null as null, label: 'All Priority' },
    { value: TaskPriority.HIGH, label: 'High' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.LOW, label: 'Low' },
  ];

  const hasActiveFilters = selectedStatus !== null || selectedPriority !== null || selectedProject !== null;

  const clearFilters = () => {
    onStatusChange(null);
    onPriorityChange(null);
    onProjectChange(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Filter */}
        <View style={styles.filterGroup}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value?.toString() || 'all'}
              style={[
                styles.filterChip,
                selectedStatus === option.value && styles.filterChipActive,
              ]}
              onPress={() => onStatusChange(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterLabel,
                  selectedStatus === option.value && styles.filterLabelActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Priority Filter */}
        <View style={styles.filterGroup}>
          {priorityOptions.map((option) => (
            <TouchableOpacity
              key={option.value?.toString() || 'all'}
              style={[
                styles.filterChip,
                selectedPriority === option.value && styles.filterChipActive,
              ]}
              onPress={() => onPriorityChange(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterLabel,
                  selectedPriority === option.value && styles.filterLabelActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {hasActiveFilters && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={16} color="#EF4444" />
              <Text style={styles.clearLabel}>Clear</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  clearLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
});
