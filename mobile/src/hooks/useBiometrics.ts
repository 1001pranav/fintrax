/**
 * useBiometrics Hook
 * Custom hook for biometric authentication
 */

import { useState, useEffect, useCallback } from 'react';
import { authManager } from '../services';
import * as LocalAuthentication from 'expo-local-authentication';

interface AuthResult {
  success: boolean;
  error?: string;
}

const MAX_RETRY_ATTEMPTS = 3;

export const useBiometrics = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState<
    LocalAuthentication.AuthenticationType[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [biometricType, setBiometricType] = useState('Biometric');

  // Check availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      setIsLoading(true);
      try {
        const available = await authManager.isBiometricAvailable();
        setIsSupported(available);

        const enabled = await authManager.isBiometricsEnabled();
        setIsEnabled(enabled);

        const types = await authManager.getSupportedBiometrics();
        setSupportedTypes(types);

        // Determine biometric type name
        if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          setBiometricType('Face ID');
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          setBiometricType('Touch ID / Fingerprint');
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.IRIS)
        ) {
          setBiometricType('Iris');
        } else {
          setBiometricType('Biometric');
        }
      } catch (error) {
        console.error('Error checking biometric availability:', error);
        setIsSupported(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, []);

  // Authenticate with biometrics
  const authenticate = useCallback(async (): Promise<AuthResult> => {
    if (!isSupported) {
      return {
        success: false,
        error: 'Biometric authentication is not available',
      };
    }

    try {
      const success = await authManager.authenticateWithBiometrics();

      if (success) {
        setRetryAttempts(0);
        return { success: true };
      } else {
        setRetryAttempts((prev) => prev + 1);
        const remaining = MAX_RETRY_ATTEMPTS - (retryAttempts + 1);

        if (remaining <= 0) {
          return {
            success: false,
            error: 'Maximum retry attempts reached. Please use password.',
          };
        }

        return {
          success: false,
          error: `Authentication failed. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
        };
      }
    } catch (error) {
      setRetryAttempts((prev) => prev + 1);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }, [isSupported, retryAttempts]);

  // Enable biometrics
  const enableBiometric = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      throw new Error('Biometric authentication is not available');
    }

    const success = await authManager.enableBiometrics();
    setIsEnabled(success);
    setRetryAttempts(0);
  }, [isSupported]);

  // Disable biometrics
  const disableBiometric = useCallback(async (): Promise<void> => {
    await authManager.disableBiometrics();
    setIsEnabled(false);
    setRetryAttempts(0);
  }, []);

  // Calculate remaining attempts
  const remainingAttempts = Math.max(0, MAX_RETRY_ATTEMPTS - retryAttempts);

  return {
    isSupported,
    isEnabled,
    supportedTypes,
    isLoading,
    biometricType,
    retryAttempts,
    remainingAttempts,
    authenticate,
    enableBiometric,
    disableBiometric,
  };
};
