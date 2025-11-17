/**
 * Secure Storage Service Implementation
 * Repository pattern for secure credential storage (Singleton Pattern)
 * Uses expo-secure-store for encrypted storage of sensitive data
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export class SecureStorageService {
  private static instance: SecureStorageService;

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  /**
   * Store a secure value
   * @param key - Storage key
   * @param value - Value to store (will be stringified)
   */
  async setSecure(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Fallback for web (not secure)
        console.warn('SecureStore not available on web, using localStorage');
        localStorage.setItem(key, value);
        return;
      }

      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`SecureStore set error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve a secure value
   * @param key - Storage key
   * @returns The stored value or null
   */
  async getSecure(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Fallback for web
        return localStorage.getItem(key);
      }

      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`SecureStore get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a secure value
   * @param key - Storage key
   */
  async deleteSecure(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }

      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`SecureStore delete error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Store a JSON object securely
   * @param key - Storage key
   * @param value - Object to store
   */
  async setSecureJSON<T = any>(key: string, value: T): Promise<void> {
    try {
      const jsonString = JSON.stringify(value);
      await this.setSecure(key, jsonString);
    } catch (error) {
      console.error(`SecureStore setJSON error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve a JSON object securely
   * @param key - Storage key
   * @returns Parsed object or null
   */
  async getSecureJSON<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.getSecure(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`SecureStore getJSON error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Check if a key exists in secure storage
   * @param key - Storage key
   */
  async hasKey(key: string): Promise<boolean> {
    try {
      const value = await this.getSecure(key);
      return value !== null;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export default SecureStorageService.getInstance();
