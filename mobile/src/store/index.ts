import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

/**
 * Redux Persist Configuration
 */
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth slice
  blacklist: ['ui'], // Don't persist UI slice (loading states, toasts, etc.)
};

/**
 * Root Reducer
 */
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
});

/**
 * Persisted Reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Custom Logging Middleware (Development Only)
 */
const loggingMiddleware: Middleware = (store) => (next) => (action: any) => {
  if (__DEV__) {
    console.group(`🔄 Redux Action: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    const result = next(action);
    console.log('Next State:', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

/**
 * Configure Store
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(__DEV__ ? [loggingMiddleware] : []),
  devTools: __DEV__, // Enable Redux DevTools in development
});

/**
 * Persistor
 */
export const persistor = persistStore(store);

/**
 * Type Exports
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Export for testing/debugging
 */
export const resetStore = () => {
  persistor.purge();
  store.dispatch({ type: 'RESET' } as any);
};
