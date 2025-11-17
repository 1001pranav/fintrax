import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@store/index';
import { loadUserFromStorage } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@hooks';

/**
 * App Content Component
 * This component has access to Redux store via hooks
 */
function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  // Load user from storage on app start
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Fintrax Mobile! 🚀</Text>
      <Text style={styles.subtitle}>
        {isAuthenticated ? 'You are logged in!' : 'Please log in to continue'}
      </Text>
      <Text style={styles.info}>Redux Store: ✅ Configured</Text>
      <Text style={styles.info}>Redux Persist: ✅ Enabled</Text>
      <Text style={styles.info}>Theme: {theme}</Text>
      <StatusBar style="auto" />
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
            <ActivityIndicator size="large" color="#3B82F6" />
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#6B7280',
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    marginVertical: 5,
    color: '#3B82F6',
  },
});
