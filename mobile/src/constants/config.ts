/**
 * Application Configuration
 * Central configuration for environment variables and app constants
 */

import Constants from 'expo-constants';

// ============================================================================
// Environment Variables
// ============================================================================

export const config = {
  // API Configuration
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api',
  API_TIMEOUT: 30000, // 30 seconds

  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: '@fintrax:auth_token',
    REFRESH_TOKEN: '@fintrax:refresh_token',
    USER_DATA: '@fintrax:user_data',
    REMEMBER_ME: '@fintrax:remember_me',
    APP_SETTINGS: '@fintrax:app_settings',
    SYNC_QUEUE: '@fintrax:sync_queue',
    LAST_SYNC: '@fintrax:last_sync',
  },

  // Sync Configuration
  SYNC: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000, // 5 seconds
    BATCH_SIZE: 20,
    AUTO_SYNC_INTERVAL: 60000, // 1 minute
  },

  // Security
  BIOMETRICS: {
    ENABLED_BY_DEFAULT: true,
    PROMPT_MESSAGE: 'Authenticate to access Fintrax',
  },

  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    DEFAULT_PAGE_SIZE: 20,
  },

  // Feature Flags
  FEATURES: {
    OFFLINE_MODE: true,
    BIOMETRIC_AUTH: true,
    PUSH_NOTIFICATIONS: true,
    VOICE_INPUT: false, // Future feature
    RECEIPT_SCANNING: false, // Future feature
  },
} as const;

// ============================================================================
// App Metadata
// ============================================================================

export const APP_INFO = {
  NAME: 'Fintrax',
  VERSION: Constants.expoConfig?.version || '1.0.0',
  BUILD_NUMBER:
    Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  NETWORK: {
    NO_CONNECTION: 'No internet connection. Changes will sync when online.',
    REQUEST_FAILED: 'Request failed. Please try again.',
    TIMEOUT: 'Request timed out. Please check your connection.',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    TOKEN_EXPIRED: 'Your session has expired. Please login again.',
    BIOMETRIC_FAILED: 'Biometric authentication failed.',
    BIOMETRIC_NOT_AVAILABLE: 'Biometric authentication is not available on this device.',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.',
    INVALID_OTP: 'OTP must be 4-6 digits.',
    INVALID_USERNAME: 'Username can only contain letters, numbers, and underscores.',
    USERNAME_TOO_SHORT: 'Username must be at least 3 characters.',
    USERNAME_TOO_LONG: 'Username must be less than 20 characters.',
  },
  SYNC: {
    FAILED: 'Sync failed. Changes will retry automatically.',
    CONFLICT: 'Data conflict detected. Please refresh and try again.',
  },
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Welcome back!',
    REGISTER_SUCCESS: 'Account created successfully! Please verify your email.',
    LOGOUT_SUCCESS: 'Logged out successfully.',
    PASSWORD_RESET: 'Password reset successfully.',
    EMAIL_VERIFIED: 'Email verified successfully!',
    OTP_SENT: 'Verification code sent to your email.',
  },
  TASK: {
    CREATED: 'Task created successfully.',
    UPDATED: 'Task updated successfully.',
    DELETED: 'Task deleted successfully.',
  },
  PROJECT: {
    CREATED: 'Project created successfully.',
    UPDATED: 'Project updated successfully.',
    DELETED: 'Project deleted successfully.',
  },
  TRANSACTION: {
    CREATED: 'Transaction added successfully.',
    UPDATED: 'Transaction updated successfully.',
    DELETED: 'Transaction deleted successfully.',
  },
  SYNC: {
    SUCCESS: 'All changes synced successfully.',
  },
} as const;
