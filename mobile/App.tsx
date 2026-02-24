/**
 * Fintrax Mobile App
 * Main application entry point with layered architecture integration
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import store
import { store, persistor } from './src/store';

// Import navigation
import { AppNavigator } from './src/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import SQLite service
import sqliteService from './src/services/storage/SQLiteService';

/**
 * Loading Screen Component
 */
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3B82F6" />
    <Text style={styles.loadingText}>Loading Fintrax...</Text>
  </View>
);

/**
 * Main App Component
 * Implements layered architecture with:
 * - Data Persistence Layer (SQLite, AsyncStorage, SecureStore)
 * - Business Logic Layer (API Client, Auth Manager)
 * - State Management Layer (Redux with slices and middleware)
 * - Presentation Layer (React Navigation and screens)
 */
export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Clear AsyncStorage for development purposes
        await AsyncStorage.clear();

        // Initialize SQLite database
        console.log('Initializing SQLite database...');
        await sqliteService.initialize();
        console.log('SQLite database initialized successfully');

        setIsDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializeApp();
  }, []);

  // Show loading screen while database is initializing
  if (!isDbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        {dbError ? (
          <>
            <Text style={styles.errorText}>Failed to initialize database</Text>
            <Text style={styles.errorDetails}>{dbError}</Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Initializing Fintrax...</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <StatusBar style="auto" />
          <AppNavigator />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: '#DC2626',
    fontWeight: '600',
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
