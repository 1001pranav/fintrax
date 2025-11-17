/**
 * Authentication Manager
 * Centralized authentication logic and token management (Singleton Pattern)
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { secureStorage, asyncStorage } from './storage';
import { config } from '../constants/config';
import { User, AuthTokens } from '../constants/types';

export class AuthManager {
  private static instance: AuthManager;

  /**
   * Private constructor for Singleton Pattern
   */
  private constructor() {}

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
      await secureStorage.setSecure(
        config.STORAGE_KEYS.AUTH_TOKEN,
        tokens.accessToken
      );

      if (tokens.refreshToken) {
        await secureStorage.setSecure(
          config.STORAGE_KEYS.REFRESH_TOKEN,
          tokens.refreshToken
        );
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
      return await secureStorage.getSecureJSON<User>(
        config.STORAGE_KEYS.USER_DATA
      );
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
   * Check if biometric authentication is available
   */
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) return false;

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return enrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get supported biometric types
   */
  async getSupportedBiometrics(): Promise<
    LocalAuthentication.AuthenticationType[]
  > {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported biometrics:', error);
      return [];
    }
  }

  /**
   * Authenticate with biometrics
   */
  async authenticateWithBiometrics(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: config.BIOMETRICS.PROMPT_MESSAGE,
        fallbackLabel: 'Use Password',
        cancelLabel: 'Cancel',
      });

      return result.success;
    } catch (error) {
      console.error('Error authenticating with biometrics:', error);
      return false;
    }
  }

  /**
   * Enable biometric authentication
   */
  async enableBiometrics(): Promise<boolean> {
    const available = await this.isBiometricAvailable();
    if (!available) return false;

    const authenticated = await this.authenticateWithBiometrics();
    if (authenticated) {
      await asyncStorage.set('biometrics_enabled', true);
      return true;
    }

    return false;
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometrics(): Promise<void> {
    await asyncStorage.set('biometrics_enabled', false);
  }

  /**
   * Check if biometrics are enabled for this app
   */
  async isBiometricsEnabled(): Promise<boolean> {
    const enabled = await asyncStorage.get<boolean>('biometrics_enabled');
    return enabled || false;
  }
}

// Export singleton instance
export default AuthManager.getInstance();
