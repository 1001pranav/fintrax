/**
 * Redux Store Configuration
 * Configures Redux store with slices, middleware, and persistence
 */

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';
import projectsReducer from './slices/projectsSlice';
import financeReducer from './slices/financeSlice';
import dashboardReducer from './slices/dashboardSlice';

// Import middleware
import { syncMiddleware } from './middleware/syncMiddleware';

// Export hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Auth persist configuration - exclude transient fields
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  blacklist: ['isLoading', 'error'], // Don't persist loading and error states
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  tasks: tasksReducer,
  projects: projectsReducer,
  finance: financeReducer,
  dashboard: dashboardReducer,
});

// Root persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [], // Auth is already persisted with its own config above
  blacklist: ['tasks', 'projects', 'finance', 'dashboard'], // Don't persist these (use SQLite instead)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(syncMiddleware),
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
