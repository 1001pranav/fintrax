/**
 * UserProfileModel - Model in MVC Pattern
 * Represents user profile data and business logic
 * Part of US-5.8: Settings & Profile Screen (MVC Pattern)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  biometricsEnabled: boolean;
  notificationsEnabled: boolean;
  taskRemindersEnabled: boolean;
  financeAlertsEnabled: boolean;
  language: string;
  currency: string;
}

const USER_PROFILE_KEY = 'user_profile';
const USER_PREFERENCES_KEY = 'user_preferences';

export class UserProfileModel {
  private profile: UserProfile | null = null;
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.getDefaultPreferences();
  }

  /**
   * Load user profile from storage
   */
  async loadProfile(): Promise<UserProfile | null> {
    try {
      const profileJson = await SecureStore.getItemAsync(USER_PROFILE_KEY);
      if (profileJson) {
        this.profile = JSON.parse(profileJson);
        return this.profile;
      }
      return null;
    } catch (error) {
      console.error('[UserProfileModel] Error loading profile:', error);
      return null;
    }
  }

  /**
   * Save user profile to storage
   */
  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      this.profile = profile;
      await SecureStore.setItemAsync(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('[UserProfileModel] Error saving profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.profile) {
      throw new Error('No profile loaded');
    }

    const updatedProfile = {
      ...this.profile,
      ...updates,
      updatedAt: new Date(),
    };

    await this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  /**
   * Get current profile
   */
  getProfile(): UserProfile | null {
    return this.profile;
  }

  /**
   * Clear profile (logout)
   */
  async clearProfile(): Promise<void> {
    try {
      this.profile = null;
      await SecureStore.deleteItemAsync(USER_PROFILE_KEY);
    } catch (error) {
      console.error('[UserProfileModel] Error clearing profile:', error);
      throw error;
    }
  }

  /**
   * Load user preferences from storage
   */
  async loadPreferences(): Promise<UserPreferences> {
    try {
      const prefsJson = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      if (prefsJson) {
        this.preferences = JSON.parse(prefsJson);
      }
      return this.preferences;
    } catch (error) {
      console.error('[UserProfileModel] Error loading preferences:', error);
      return this.preferences;
    }
  }

  /**
   * Save user preferences to storage
   */
  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      this.preferences = preferences;
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('[UserProfileModel] Error saving preferences:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const updatedPreferences = {
      ...this.preferences,
      ...updates,
    };

    await this.savePreferences(updatedPreferences);
    return updatedPreferences;
  }

  /**
   * Get current preferences
   */
  getPreferences(): UserPreferences {
    return this.preferences;
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      biometricsEnabled: false,
      notificationsEnabled: true,
      taskRemindersEnabled: true,
      financeAlertsEnabled: true,
      language: 'en',
      currency: 'USD',
    };
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(): string {
    if (!this.profile) return '?';

    if (this.profile.fullName) {
      const names = this.profile.fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }

    if (this.profile.username) {
      return this.profile.username[0].toUpperCase();
    }

    return '?';
  }
}
