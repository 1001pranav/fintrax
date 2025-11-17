/**
 * Tasks Navigator
 * Stack navigator for task-related screens
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { TaskDetailScreen } from '../screens/tasks/TaskDetailScreen';
import { AddTaskScreen } from '../screens/tasks/AddTaskScreen';

export type TasksStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: number };
  AddTask: { projectId?: number };
};

const Stack = createStackNavigator<TasksStackParamList>();

export const TasksNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
