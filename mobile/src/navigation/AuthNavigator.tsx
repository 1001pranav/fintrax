/**
 * Auth Navigator
 * Navigation stack for authentication screens
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../constants/types';

// Import screens (placeholders for now)
const LoginScreen = () => null; // TODO: Implement LoginScreen
const RegisterScreen = () => null; // TODO: Implement RegisterScreen
const ForgotPasswordScreen = () => null; // TODO: Implement ForgotPasswordScreen
const ResetPasswordScreen = () => null; // TODO: Implement ResetPasswordScreen
const VerifyEmailScreen = () => null; // TODO: Implement VerifyEmailScreen

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
};
