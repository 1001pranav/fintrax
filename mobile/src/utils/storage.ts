import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  // Secure Storage (encrypted)
  JWT_TOKEN: 'jwt_token',
  REFRESH_TOKEN: 'refresh_token',
  BIOMETRIC_ENABLED: 'biometric_enabled',

  // AsyncStorage (non-sensitive)
  USER_ID: 'user_id',
  USER_EMAIL: 'user_email',
  USER_NAME: 'user_name',
  THEME_MODE: 'theme_mode',
  REMEMBER_ME: 'remember_me',
  LAST_SYNC_TIME: 'last_sync_time',
  LANGUAGE: 'language',
} as const;

/**
 * Secure Storage Operations (for sensitive data like tokens)
 */
export const secureStorage = {
  /**
   * Save item to secure storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error saving ${key} to secure storage:`, error);
      throw error;
    }
  },

  /**
   * Get item from secure storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error reading ${key} from secure storage:`, error);
      return null;
    }
  },

  /**
   * Remove item from secure storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing ${key} from secure storage:`, error);
      throw error;
    }
  },

  /**
   * Clear all items from secure storage
   */
  async clear(): Promise<void> {
    try {
      const secureKeys = [
        STORAGE_KEYS.JWT_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.BIOMETRIC_ENABLED,
      ];
      await Promise.all(secureKeys.map((key) => SecureStore.deleteItemAsync(key)));
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  },
};

/**
 * AsyncStorage Operations (for non-sensitive data)
 */
export const asyncStorage = {
  /**
   * Save item to async storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error saving ${key} to async storage:`, error);
      throw error;
    }
  },

  /**
   * Get item from async storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading ${key} from async storage:`, error);
      return null;
    }
  },

  /**
   * Remove item from async storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from async storage:`, error);
      throw error;
    }
  },

  /**
   * Clear all items from async storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing async storage:', error);
      throw error;
    }
  },

  /**
   * Save JSON object to async storage
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving object ${key} to async storage:`, error);
      throw error;
    }
  },

  /**
   * Get JSON object from async storage
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error reading object ${key} from async storage:`, error);
      return null;
    }
  },
};

/**
 * Token Management
 */
export const tokenStorage = {
  /**
   * Save JWT token
   */
  async saveToken(token: string): Promise<void> {
    await secureStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
  },

  /**
   * Get JWT token
   */
  async getToken(): Promise<string | null> {
    return await secureStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
  },

  /**
   * Remove JWT token
   */
  async removeToken(): Promise<void> {
    await secureStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
  },

  /**
   * Check if token exists
   */
  async hasToken(): Promise<boolean> {
    const token = await secureStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    return token !== null && token !== '';
  },
};
