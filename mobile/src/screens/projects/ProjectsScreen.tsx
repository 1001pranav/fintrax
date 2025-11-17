/**
 * Projects List Screen (US-4.5)
 * Displays all projects with search and filter capabilities
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchProjects } from '../../store/slices/projectsSlice';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { SearchBar } from '../../components/common/SearchBar';
import { colors, spacing } from '../../theme';
import { Project } from '../../constants/types';

export const ProjectsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { projects, isLoading } = useAppSelector((state) => state.projects);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      await dispatch(fetchProjects()).unwrap();
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const filterProjects = (): Project[] => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter (simplified for now)
    // In a real app, you'd calculate project completion status
    if (filter !== 'all') {
      // TODO: Implement actual filtering based on project completion
    }

    return filtered;
  };

  const handleProjectPress = (project: Project) => {
    navigation.navigate('ProjectDetail', { projectId: project.id });
  };

  const handleAddProject = () => {
    navigation.navigate('AddProject');
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-outline" size={64} color={colors.text.disabled} />
      <Text style={styles.emptyTitle}>No Projects</Text>
      <Text style={styles.emptyText}>
        Create your first project to organize your tasks
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddProject}>
        <Text style={styles.emptyButtonText}>Create Project</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilter = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
        onPress={() => setFilter('all')}
      >
        <Text
          style={[
            styles.filterButtonText,
            filter === 'all' && styles.filterButtonTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filter === 'active' && styles.filterButtonActive,
        ]}
        onPress={() => setFilter('active')}
      >
        <Text
          style={[
            styles.filterButtonText,
            filter === 'active' && styles.filterButtonTextActive,
          ]}
        >
          Active
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filter === 'completed' && styles.filterButtonActive,
        ]}
        onPress={() => setFilter('completed')}
      >
        <Text
          style={[
            styles.filterButtonText,
            filter === 'completed' && styles.filterButtonTextActive,
          ]}
        >
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );

  const filteredProjects = filterProjects();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <TouchableOpacity onPress={handleAddProject}>
          <Ionicons name="add-circle" size={32} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search projects..."
        style={styles.searchBar}
      />

      {/* Filters */}
      {renderFilter()}

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => handleProjectPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadProjects}
            tintColor={colors.primary.main}
          />
        }
      />

      {/* FAB */}
      {filteredProjects.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleAddProject}>
          <Ionicons name="add" size={28} color={colors.common.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  searchBar: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.main,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  filterButtonTextActive: {
    color: colors.common.white,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  emptyButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.white,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
