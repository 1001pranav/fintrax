import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@store/index';
import { loadUserFromStorage } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@hooks';
import { LoginScreen } from '@screens/auth/LoginScreen';
import { colors } from '@theme';

/**
 * App Content Component
 * This component has access to Redux store via hooks
 */
function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Load user from storage on app start
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show dashboard (placeholder for now)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Fintrax! 🚀</Text>
      <Text style={styles.subtitle}>You are logged in</Text>
      <Text style={styles.info}>Dashboard coming soon...</Text>
    </View>
  );
}

/**
 * Root App Component
 * Wraps the app with Redux Provider and PersistGate
 */
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading app...</Text>
          </View>
        }
        persistor={persistor}
      >
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    marginVertical: 5,
    color: colors.primary,
  },
});
