/**
 * Main Navigator
 * Bottom tab navigation for main app screens
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../constants/types';

// Import screens (placeholders for now)
const DashboardScreen = () => null; // TODO: Implement DashboardScreen
const TasksScreen = () => null; // TODO: Implement TasksScreen
const FinanceScreen = () => null; // TODO: Implement FinanceScreen
const ProjectsScreen = () => null; // TODO: Implement ProjectsScreen
const SettingsScreen = () => null; // TODO: Implement SettingsScreen

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          // tabBarIcon: // TODO: Add icon
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarLabel: 'Tasks',
          // tabBarIcon: // TODO: Add icon
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{
          tabBarLabel: 'Finance',
          // tabBarIcon: // TODO: Add icon
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarLabel: 'Projects',
          // tabBarIcon: // TODO: Add icon
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          // tabBarIcon: // TODO: Add icon
        }}
      />
    </Tab.Navigator>
  );
};
