import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../../navigation/NavigationService';

interface QuickAction {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}

export const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      id: 'add-task',
      icon: 'add-circle',
      label: 'Add Task',
      color: '#3B82F6',
      onPress: () => navigate('Tasks', { screen: 'AddTask' }),
    },
    {
      id: 'add-transaction',
      icon: 'cash',
      label: 'Add Transaction',
      color: '#10B981',
      onPress: () => navigate('Finance'),
    },
    {
      id: 'add-project',
      icon: 'folder',
      label: 'Add Project',
      color: '#F59E0B',
      onPress: () => navigate('Projects', { screen: 'AddProject' }),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon} size={28} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
  },
});
