/**
 * App Navigator
 * Root navigation container with authentication flow
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useAppSelector, useAppDispatch } from '../hooks';
import { loadUserFromStorage } from '../store/slices/authSlice';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check authentication status on app start
    dispatch(loadUserFromStorage()).finally(() => {
      setIsInitializing(false);
    });
  }, [dispatch]);

  if (isLoading || isInitializing) {
    // Loading state is handled by PersistGate in App.tsx
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
