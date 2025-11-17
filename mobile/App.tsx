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

// Import services
import { sqliteService } from './src/services/storage';

// Import navigation
import { AppNavigator } from './src/navigation';

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
 * App Initialization Component
 * Handles database initialization and app setup
 */
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing Fintrax Mobile App...');

        // Initialize SQLite database
        await sqliteService.initialize();
        console.log('Database initialized successfully');

        // Add any other initialization logic here
        // e.g., load app settings, check for updates, etc.

        setIsInitialized(true);
        console.log('App initialization complete');
      } catch (error) {
        console.error('App initialization failed:', error);
        setInitError(
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
      }
    };

    initializeApp();
  }, []);

  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Initialization Error</Text>
        <Text style={styles.errorText}>{initError}</Text>
        <Text style={styles.errorSubtext}>
          Please restart the app. If the problem persists, reinstall the app.
        </Text>
      </View>
    );
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

/**
 * Main App Component
 * Implements layered architecture with:
 * - Data Persistence Layer (SQLite, AsyncStorage, SecureStore)
 * - Business Logic Layer (API Client, Auth Manager, Offline Manager)
 * - State Management Layer (Redux with slices and middleware)
 * - Presentation Layer (React Navigation and screens)
 */
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <AppInitializer>
            <StatusBar style="auto" />
            <AppNavigator />
          </AppInitializer>
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
