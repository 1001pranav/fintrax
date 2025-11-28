/**
 * Authentication Manager
 * Centralized authentication logic and token management (Singleton Pattern)
 * Integrated with BiometricService using Strategy Pattern
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { secureStorage, asyncStorage } from './storage';
import { config } from '../constants/config';
import { User, AuthTokens } from '../constants/types';
import { BiometricService } from '../patterns/authentication/BiometricService';

export class AuthManager {
  private static instance: AuthManager;
  private biometricService: BiometricService;

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {
    this.biometricService = BiometricService.getInstance();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  /**
   * Save authentication tokens
   */
  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      await secureStorage.setSecure(config.STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);

      if (tokens.refreshToken) {
        await secureStorage.setSecure(config.STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      }
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await secureStorage.getSecure(config.STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await secureStorage.getSecure(config.STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Save user data
   */
  async saveUser(user: User): Promise<void> {
    try {
      await secureStorage.setSecureJSON(config.STORAGE_KEYS.USER_DATA, user);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  async getUser(): Promise<User | null> {
    try {
      return await secureStorage.getSecureJSON<User>(config.STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
  }

  /**
   * Clear all authentication data
   */
  async clearAuth(): Promise<void> {
    try {
      await secureStorage.deleteSecure(config.STORAGE_KEYS.AUTH_TOKEN);
      await secureStorage.deleteSecure(config.STORAGE_KEYS.REFRESH_TOKEN);
      await secureStorage.deleteSecure(config.STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  }

  /**
   * Check if biometric authentication is available (using Strategy Pattern)
   */
  async isBiometricAvailable(): Promise<boolean> {
    try {
      return await this.biometricService.isBiometricSupported();
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get supported biometric types
   */
  async getSupportedBiometrics(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await this.biometricService.getSupportedTypes();
    } catch (error) {
      console.error('Error getting supported biometrics:', error);
      return [];
    }
  }

  /**
   * Get biometric type name for display
   */
  async getBiometricTypeName(): Promise<string> {
    try {
      return await this.biometricService.getBiometricTypeName();
    } catch (error) {
      console.error('Error getting biometric type name:', error);
      return 'Biometric Authentication';
    }
  }

  /**
   * Authenticate with biometrics (using Strategy Pattern)
   */
  async authenticateWithBiometrics(): Promise<boolean> {
    try {
      const result = await this.biometricService.authenticate();
      return result.success;
    } catch (error) {
      console.error('Error authenticating with biometrics:', error);
      return false;
    }
  }

  /**
   * Authenticate with password (fallback method)
   */
  async authenticateWithPassword(password: string): Promise<boolean> {
    try {
      const result = await this.biometricService.authenticateWithPassword(password);
      return result.success;
    } catch (error) {
      console.error('Error authenticating with password:', error);
      return false;
    }
  }

  /**
   * Enable biometric authentication (using Strategy Pattern)
   */
  async enableBiometrics(): Promise<boolean> {
    const available = await this.isBiometricAvailable();
    if (!available) return false;

    const authenticated = await this.authenticateWithBiometrics();
    if (authenticated) {
      await this.biometricService.enableBiometric();
      return true;
    }

    return false;
  }

  /**
   * Disable biometric authentication (using Strategy Pattern)
   */
  async disableBiometrics(): Promise<void> {
    await this.biometricService.disableBiometric();
  }

  /**
   * Check if biometrics are enabled for this app (using Strategy Pattern)
   */
  async isBiometricsEnabled(): Promise<boolean> {
    try {
      return await this.biometricService.isBiometricEnabled();
    } catch (error) {
      console.error('Error checking if biometrics enabled:', error);
      return false;
    }
  }

  /**
   * Get available authentication methods (from Strategy Pattern)
   */
  async getAvailableAuthMethods(): Promise<string[]> {
    try {
      const methods = await this.biometricService.getAvailableAuthMethods();
      return methods.map((method) => method.getDisplayName());
    } catch (error) {
      console.error('Error getting available auth methods:', error);
      return [];
    }
  }

  /**
   * Get retry attempts for biometric authentication
   */
  getRetryAttempts(): number {
    return this.biometricService.getRetryAttempts();
  }

  /**
   * Get remaining retry attempts for biometric authentication
   */
  getRemainingAttempts(): number {
    return this.biometricService.getRemainingAttempts();
  }

  /**
   * Reset retry attempts
   */
  resetRetryAttempts(): void {
    this.biometricService.resetRetryAttempts();
  }
}

// Export singleton instance
export default AuthManager.getInstance();
