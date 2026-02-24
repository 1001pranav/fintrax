/**
 * Main Navigator
 * Bottom tab navigation for authenticated users
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { TasksNavigator } from './TasksNavigator';
import { FinanceNavigator } from './FinanceNavigator';
import { ProjectsNavigator } from './ProjectsNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screens (will be implemented in Sprint 5)

const MoreScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>More Screen</Text>
    <Text style={styles.placeholderSubtext}>Settings & Profile</Text>
  </View>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
});
