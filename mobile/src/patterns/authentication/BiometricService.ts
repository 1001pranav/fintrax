/**
 * BiometricService - Singleton service for biometric authentication
 * Manages authentication strategies and provides centralized authentication logic
 * Part of the Singleton and Strategy Pattern implementation
 */

import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import {
  AuthResult,
  AuthenticationStrategy,
} from './strategies/AuthenticationStrategy';
import { FaceIDStrategy } from './strategies/FaceIDStrategy';
import { TouchIDStrategy } from './strategies/TouchIDStrategy';
import { FingerprintStrategy } from './strategies/FingerprintStrategy';
import { IrisStrategy } from './strategies/IrisStrategy';
import { PasswordStrategy } from './strategies/PasswordStrategy';

const BIOMETRIC_ENABLED_KEY = 'biometric_auth_enabled';
const MAX_RETRY_ATTEMPTS = 3;

export class BiometricService {
  // Singleton instance
  private static instance: BiometricService;

  // Authentication strategies
  private strategies: Map<string, AuthenticationStrategy>;
  private currentStrategy: AuthenticationStrategy | null = null;
  private retryAttempts = 0;

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.strategies = new Map();
    this.initializeStrategies();
  }

  /**
   * Get the singleton instance of BiometricService
   * @returns BiometricService instance
   */
  public static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  /**
   * Initialize all available authentication strategies
   */
  private initializeStrategies(): void {
    // Initialize biometric strategies
    this.strategies.set('FACE_ID', new FaceIDStrategy());
    this.strategies.set('TOUCH_ID', new TouchIDStrategy());
    this.strategies.set('FINGERPRINT', new FingerprintStrategy());
    this.strategies.set('IRIS', new IrisStrategy());
  }

  /**
   * Set password strategy (must be set from outside with validation function)
   */
  public setPasswordStrategy(
    validatePassword: (password: string) => Promise<boolean>,
  ): void {
    this.strategies.set('PASSWORD', new PasswordStrategy(validatePassword));
  }

  /**
   * Get available authentication methods on the current device
   * @returns Promise<AuthenticationStrategy[]>
   */
  public async getAvailableAuthMethods(): Promise<AuthenticationStrategy[]> {
    const availableMethods: AuthenticationStrategy[] = [];

    for (const strategy of this.strategies.values()) {
      if (await strategy.isAvailable()) {
        availableMethods.push(strategy);
      }
    }

    return availableMethods;
  }

  /**
   * Get the best available biometric authentication method
   * @returns Promise<AuthenticationStrategy | null>
   */
  public async getBestBiometricMethod(): Promise<AuthenticationStrategy | null> {
    // Priority order: Face ID > Touch ID > Fingerprint > Iris
    const priorityOrder = ['FACE_ID', 'TOUCH_ID', 'FINGERPRINT', 'IRIS'];

    for (const type of priorityOrder) {
      const strategy = this.strategies.get(type);
      if (strategy && (await strategy.isAvailable())) {
        return strategy;
      }
    }

    return null;
  }

  /**
   * Authenticate using the best available method
   * @returns Promise<AuthResult>
   */
  public async authenticate(): Promise<AuthResult> {
    try {
      // Check if biometric auth is enabled
      const isEnabled = await this.isBiometricEnabled();
      if (!isEnabled) {
        return {
          success: false,
          error: 'Biometric authentication is not enabled',
        };
      }

      // Get the best available method
      const strategy = await this.getBestBiometricMethod();
      if (!strategy) {
        return {
          success: false,
          error: 'No biometric authentication method available',
        };
      }

      this.currentStrategy = strategy;

      // Attempt authentication
      const result = await strategy.authenticate();

      if (result.success) {
        this.retryAttempts = 0;
        return result;
      } else {
        this.retryAttempts++;

        // If max retries reached, suggest password fallback
        if (this.retryAttempts >= MAX_RETRY_ATTEMPTS) {
          return {
            ...result,
            error: 'Maximum retry attempts reached. Please use password.',
          };
        }

        return result;
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Authenticate with password (fallback method)
   * @param password - User password
   * @returns Promise<AuthResult>
   */
  public async authenticateWithPassword(
    password: string,
  ): Promise<AuthResult> {
    const passwordStrategy = this.strategies.get('PASSWORD');
    if (!passwordStrategy) {
      return {
        success: false,
        error: 'Password authentication is not configured',
      };
    }

    this.retryAttempts = 0; // Reset retry attempts
    return await passwordStrategy.authenticate(password);
  }

  /**
   * Check if device supports biometric authentication
   * @returns Promise<boolean>
   */
  public async isBiometricSupported(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return false;
    }
  }

  /**
   * Get supported biometric types
   * @returns Promise<number[]>
   */
  public async getSupportedTypes(): Promise<number[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported types:', error);
      return [];
    }
  }

  /**
   * Get user-friendly name for biometric type
   * @returns Promise<string>
   */
  public async getBiometricTypeName(): Promise<string> {
    const types = await this.getSupportedTypes();

    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    }

    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
    }

    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris Scan';
    }

    return 'Biometric Authentication';
  }

  /**
   * Enable biometric authentication
   * @returns Promise<void>
   */
  public async enableBiometric(): Promise<void> {
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
  }

  /**
   * Disable biometric authentication
   * @returns Promise<void>
   */
  public async disableBiometric(): Promise<void> {
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'false');
    this.retryAttempts = 0;
  }

  /**
   * Check if biometric authentication is enabled
   * @returns Promise<boolean>
   */
  public async isBiometricEnabled(): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking biometric enabled status:', error);
      return false;
    }
  }

  /**
   * Reset retry attempts
   */
  public resetRetryAttempts(): void {
    this.retryAttempts = 0;
  }

  /**
   * Get current retry attempts
   * @returns number
   */
  public getRetryAttempts(): number {
    return this.retryAttempts;
  }

  /**
   * Get remaining retry attempts
   * @returns number
   */
  public getRemainingAttempts(): number {
    return Math.max(0, MAX_RETRY_ATTEMPTS - this.retryAttempts);
  }
}

// Export singleton instance
export default BiometricService.getInstance();
