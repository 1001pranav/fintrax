/**
 * Project Card Component (US-4.5)
 * Displays project information with progress indicator
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../../constants/types';
import { projectRepository } from '../../database/helpers';
import { colors, spacing } from '../../theme';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  style?: ViewStyle;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  style,
}) => {
  const [stats, setStats] = useState({ total: 0, completed: 0, percentage: 0 });

  useEffect(() => {
    loadStats();
  }, [project.id]);

  const loadStats = async () => {
    try {
      const projectStats = await projectRepository.getProjectStats(project.id);
      setStats(projectStats);
    } catch (error) {
      console.error('Error loading project stats:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: project.color }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.colorDot, { backgroundColor: project.color }]} />
        <Text style={styles.name} numberOfLines={1}>
          {project.name}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </View>

      {/* Description */}
      {project.description && (
        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
      )}

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${stats.percentage}%`,
                backgroundColor: project.color,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{stats.percentage}%</Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons
            name="list-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.statText}>
            {stats.total} {stats.total === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name="checkmark-circle-outline"
            size={16}
            color={colors.success}
          />
          <Text style={styles.statText}>
            {stats.completed} completed
          </Text>
        </View>
      </View>

      {/* Sync Status Indicator */}
      {project.syncStatus === 'pending' && (
        <View style={styles.syncBadge}>
          <Ionicons name="cloud-upload-outline" size={12} color={colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    minWidth: 35,
    textAlign: 'right',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  syncBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
  },
});
