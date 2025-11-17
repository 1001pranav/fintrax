/**
 * BiometricStrategy - Base class for biometric authentication
 * Implements common biometric functionality
 * Part of the Strategy Pattern implementation
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { AuthResult, AuthenticationStrategy } from './AuthenticationStrategy';

export abstract class BiometricStrategy implements AuthenticationStrategy {
  protected authenticationType: number;

  constructor(authenticationType: number) {
    this.authenticationType = authenticationType;
  }

  async authenticate(): Promise<AuthResult> {
    try {
      // Check if biometrics are available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: `${this.getDisplayName()} is not available on this device`,
          authenticationType: this.getType(),
        };
      }

      // Perform biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate with ${this.getDisplayName()}`,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use password',
      });

      if (result.success) {
        return {
          success: true,
          authenticationType: this.getType(),
        };
      } else {
        return {
          success: false,
          error: result.error || 'Authentication failed',
          authenticationType: this.getType(),
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        authenticationType: this.getType(),
      };
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Check if hardware is available
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return false;
      }

      // Check if biometrics are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return false;
      }

      // Check if specific authentication type is supported
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      return supportedTypes.includes(this.authenticationType);
    } catch (error) {
      console.error(`Error checking ${this.getType()} availability:`, error);
      return false;
    }
  }

  abstract getType(): string;
  abstract getDisplayName(): string;
}
