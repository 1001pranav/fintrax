import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Toast Message Type
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast Message Interface
 */
export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // Duration in milliseconds (default: 3000)
}

/**
 * UI State Interface
 */
export interface UIState {
  isLoading: boolean; // Global loading state
  loadingMessage: string | null; // Optional loading message
  error: string | null; // Global error message
  toasts: ToastMessage[]; // Array of toast messages
  isNetworkConnected: boolean; // Network connectivity status
  theme: 'light' | 'dark' | 'auto'; // Theme mode
}

/**
 * Initial State
 */
const initialState: UIState = {
  isLoading: false,
  loadingMessage: null,
  error: null,
  toasts: [],
  isNetworkConnected: true,
  theme: 'auto',
};

/**
 * UI Slice
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (!action.payload) {
        state.loadingMessage = null;
      }
    },

    setLoadingWithMessage: (
      state,
      action: PayloadAction<{ isLoading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || null;
    },

    // Error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Toast messages
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const toast: ToastMessage = {
        id,
        ...action.payload,
        duration: action.payload.duration || 3000,
      };
      state.toasts.push(toast);
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },

    clearAllToasts: (state) => {
      state.toasts = [];
    },

    // Convenience toast methods
    showSuccessToast: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      state.toasts.push({
        id,
        type: 'success',
        message: action.payload,
        duration: 3000,
      });
    },

    showErrorToast: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      state.toasts.push({
        id,
        type: 'error',
        message: action.payload,
        duration: 4000,
      });
    },

    showWarningToast: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      state.toasts.push({
        id,
        type: 'warning',
        message: action.payload,
        duration: 3500,
      });
    },

    showInfoToast: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      state.toasts.push({
        id,
        type: 'info',
        message: action.payload,
        duration: 3000,
      });
    },

    // Network connectivity
    setNetworkConnected: (state, action: PayloadAction<boolean>) => {
      state.isNetworkConnected = action.payload;
    },

    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
  },
});

// Export actions
export const {
  setLoading,
  setLoadingWithMessage,
  setError,
  clearError,
  addToast,
  removeToast,
  clearAllToasts,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  setNetworkConnected,
  setTheme,
} = uiSlice.actions;

// Export selectors
export const selectUI = (state: { ui: UIState }) => state.ui;
export const selectIsLoading = (state: { ui: UIState }) => state.ui.isLoading;
export const selectLoadingMessage = (state: { ui: UIState }) => state.ui.loadingMessage;
export const selectError = (state: { ui: UIState }) => state.ui.error;
export const selectToasts = (state: { ui: UIState }) => state.ui.toasts;
export const selectIsNetworkConnected = (state: { ui: UIState }) => state.ui.isNetworkConnected;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;

// Export reducer
export default uiSlice.reducer;
