/**
 * Projects Navigator
 * Stack navigator for project-related screens
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProjectsScreen } from '../screens/projects/ProjectsScreen';
import { ProjectDetailScreen } from '../screens/projects/ProjectDetailScreen';
import { AddProjectScreen } from '../screens/projects/AddProjectScreen';

export type ProjectsStackParamList = {
  ProjectList: undefined;
  ProjectDetail: { projectId: string };
  AddProject: undefined;
};

const Stack = createStackNavigator<ProjectsStackParamList>();

export const ProjectsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProjectList" component={ProjectsScreen} />
      <Stack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="AddProject"
        component={AddProjectScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
