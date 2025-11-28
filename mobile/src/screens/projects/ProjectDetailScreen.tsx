/**
 * Project Detail Screen (US-4.6)
 * Displays project details with Kanban board view
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchProjects } from '../../store/slices/projectsSlice';
import { fetchTasks } from '../../store/slices/tasksSlice';
import { KanbanColumn } from '../../components/projects/KanbanColumn';
import { colors, spacing } from '../../theme';
import { Project, Task } from '../../constants/types';

export const ProjectDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();

  const { projectId } = route.params;
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks, isLoading } = useAppSelector((state) => state.tasks);

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    loadData();
  }, [projectId]);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId);
    setProject(foundProject || null);
  }, [projects, projectId]);

  const loadData = async () => {
    try {
      await Promise.all([dispatch(fetchProjects()).unwrap(), dispatch(fetchTasks()).unwrap()]);
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  const getProjectTasks = (): Task[] => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const getTasksByStatus = (status: string): Task[] => {
    return getProjectTasks().filter((task) => task.status === status);
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  const handleAddTask = (status: string) => {
    navigation.navigate('AddTask', { projectId, status });
  };

  const handleEditProject = () => {
    navigation.navigate('EditProject', { projectId });
  };

  if (!project) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading project...</Text>
      </View>
    );
  }

  const todoTasks = getTasksByStatus('1');
  const inProgressTasks = getTasksByStatus('2');
  const doneTasks = getTasksByStatus('6');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.colorDot, { backgroundColor: project.color }]} />
          <Text style={styles.projectName} numberOfLines={1}>
            {project.name}
          </Text>
        </View>
        <TouchableOpacity onPress={handleEditProject}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      {project.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{project.description}</Text>
        </View>
      )}

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{todoTasks.length}</Text>
          <Text style={styles.statLabel}>To Do</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{inProgressTasks.length}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{doneTasks.length}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getProjectTasks().length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Kanban Board */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kanbanContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadData} tintColor={colors.primary} />
        }
      >
        {/* To Do Column */}
        <KanbanColumn
          title="To Do"
          tasks={todoTasks}
          icon="list-outline"
          color={colors.info}
          onTaskPress={handleTaskPress}
          onAddTask={() => handleAddTask('1')}
        />

        {/* In Progress Column */}
        <KanbanColumn
          title="In Progress"
          tasks={inProgressTasks}
          icon="play-circle-outline"
          color={colors.warning}
          onTaskPress={handleTaskPress}
          onAddTask={() => handleAddTask('2')}
        />

        {/* Done Column */}
        <KanbanColumn
          title="Done"
          tasks={doneTasks}
          icon="checkmark-circle-outline"
          color={colors.success}
          onTaskPress={handleTaskPress}
          onAddTask={() => handleAddTask('6')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  projectName: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  descriptionContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  kanbanContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
