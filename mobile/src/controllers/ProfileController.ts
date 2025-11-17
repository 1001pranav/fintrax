/**
 * ProfileController - Controller in MVC Pattern
 * Mediates between UserProfileModel and View components
 * Part of US-5.8: Settings & Profile Screen (MVC Pattern)
 */

import { UserProfileModel, UserProfile, UserPreferences } from '../models/UserProfileModel';

export class ProfileController {
  private model: UserProfileModel;
  private listeners: Array<() => void> = [];

  constructor(model: UserProfileModel) {
    this.model = model;
  }

  /**
   * Initialize controller (load data)
   */
  async initialize(): Promise<void> {
    await Promise.all([this.model.loadProfile(), this.model.loadPreferences()]);
    this.notifyListeners();
  }

  /**
   * Get user profile
   */
  getProfile(): UserProfile | null {
    return this.model.getProfile();
  }

  /**
   * Get user preferences
   */
  getPreferences(): UserPreferences {
    return this.model.getPreferences();
  }

  /**
   * Update profile information
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    // Validate updates
    if (updates.email && !this.model.isValidEmail(updates.email)) {
      throw new Error('Invalid email format');
    }

    if (updates.phoneNumber && !this.model.isValidPhoneNumber(updates.phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    const updatedProfile = await this.model.updateProfile(updates);
    this.notifyListeners();
    return updatedProfile;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const updatedPreferences = await this.model.updatePreferences(updates);
    this.notifyListeners();
    return updatedPreferences;
  }

  /**
   * Toggle theme
   */
  async toggleTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    await this.model.updatePreferences({ theme });
    this.notifyListeners();
  }

  /**
   * Toggle biometric authentication
   */
  async toggleBiometrics(enabled: boolean): Promise<void> {
    await this.model.updatePreferences({ biometricsEnabled: enabled });
    this.notifyListeners();
  }

  /**
   * Toggle notifications
   */
  async toggleNotifications(enabled: boolean): Promise<void> {
    await this.model.updatePreferences({ notificationsEnabled: enabled });
    this.notifyListeners();
  }

  /**
   * Toggle task reminders
   */
  async toggleTaskReminders(enabled: boolean): Promise<void> {
    await this.model.updatePreferences({ taskRemindersEnabled: enabled });
    this.notifyListeners();
  }

  /**
   * Toggle finance alerts
   */
  async toggleFinanceAlerts(enabled: boolean): Promise<void> {
    await this.model.updatePreferences({ financeAlertsEnabled: enabled });
    this.notifyListeners();
  }

  /**
   * Update language
   */
  async updateLanguage(language: string): Promise<void> {
    await this.model.updatePreferences({ language });
    this.notifyListeners();
  }

  /**
   * Update currency
   */
  async updateCurrency(currency: string): Promise<void> {
    await this.model.updatePreferences({ currency });
    this.notifyListeners();
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(): string {
    return this.model.getUserInitials();
  }

  /**
   * Logout (clear profile and preferences)
   */
  async logout(): Promise<void> {
    await this.model.clearProfile();
    this.notifyListeners();
  }

  /**
   * Subscribe to profile changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.error('[ProfileController] Error in listener:', error);
      }
    });
  }

  /**
   * Validate profile data
   */
  validateProfile(profile: Partial<UserProfile>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (profile.email && !this.model.isValidEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.phoneNumber && !this.model.isValidPhoneNumber(profile.phoneNumber)) {
      errors.push('Invalid phone number format');
    }

    if (profile.fullName && profile.fullName.length < 2) {
      errors.push('Full name must be at least 2 characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
