/**
 * Storage Service Interface
 * Abstract interface for storage operations (Repository Pattern)
 */

export interface IStorageService {
  /**
   * Get a value from storage
   * @param key - Storage key
   * @returns Promise resolving to the value or null
   */
  get<T = any>(key: string): Promise<T | null>;

  /**
   * Set a value in storage
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T = any>(key: string, value: T): Promise<void>;

  /**
   * Remove a value from storage
   * @param key - Storage key
   */
  remove(key: string): Promise<void>;

  /**
   * Clear all values from storage
   */
  clear(): Promise<void>;

  /**
   * Get multiple values from storage
   * @param keys - Array of storage keys
   */
  multiGet(keys: string[]): Promise<Record<string, any>>;

  /**
   * Set multiple values in storage
   * @param keyValuePairs - Array of [key, value] pairs
   */
  multiSet(keyValuePairs: Array<[string, any]>): Promise<void>;

  /**
   * Remove multiple values from storage
   * @param keys - Array of storage keys
   */
  multiRemove(keys: string[]): Promise<void>;

  /**
   * Get all keys in storage
   */
  getAllKeys(): Promise<string[]>;
}
