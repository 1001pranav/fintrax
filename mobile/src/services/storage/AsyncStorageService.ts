/**
 * AsyncStorage Service Implementation
 * Repository pattern implementation for AsyncStorage (Singleton Pattern)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageService } from './IStorageService';

export class AsyncStorageService implements IStorageService {
  private static instance: AsyncStorageService;

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AsyncStorageService {
    if (!AsyncStorageService.instance) {
      AsyncStorageService.instance = new AsyncStorageService();
    }
    return AsyncStorageService.instance;
  }

  /**
   * Get a value from AsyncStorage
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`AsyncStorage get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in AsyncStorage
   */
  async set<T = any>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`AsyncStorage set error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove a value from AsyncStorage
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`AsyncStorage remove error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all values from AsyncStorage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
      throw error;
    }
  }

  /**
   * Get multiple values from AsyncStorage
   */
  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};

      pairs.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('AsyncStorage multiGet error:', error);
      return {};
    }
  }

  /**
   * Set multiple values in AsyncStorage
   */
  async multiSet(keyValuePairs: Array<[string, any]>): Promise<void> {
    try {
      const serializedPairs: Array<[string, string]> = keyValuePairs.map(
        ([key, value]) => [key, JSON.stringify(value)]
      );
      await AsyncStorage.multiSet(serializedPairs);
    } catch (error) {
      console.error('AsyncStorage multiSet error:', error);
      throw error;
    }
  }

  /**
   * Remove multiple values from AsyncStorage
   */
  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('AsyncStorage multiRemove error:', error);
      throw error;
    }
  }

  /**
   * Get all keys in AsyncStorage
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('AsyncStorage getAllKeys error:', error);
      return [];
    }
  }
}

// Export singleton instance
export default AsyncStorageService.getInstance();
