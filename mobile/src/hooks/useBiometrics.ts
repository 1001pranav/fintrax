/**
 * useBiometrics Hook
 * Custom hook for biometric authentication
 */

import { useState, useEffect, useCallback } from 'react';
import { authManager } from '../services';
import * as LocalAuthentication from 'expo-local-authentication';

export const useBiometrics = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState<
    LocalAuthentication.AuthenticationType[]
  >([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      const available = await authManager.isBiometricAvailable();
      setIsAvailable(available);

      const enabled = await authManager.isBiometricsEnabled();
      setIsEnabled(enabled);

      const types = await authManager.getSupportedBiometrics();
      setSupportedTypes(types);
    };

    checkAvailability();
  }, []);

  // Authenticate with biometrics
  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) return false;

    setIsAuthenticating(true);
    try {
      const success = await authManager.authenticateWithBiometrics();
      return success;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [isAvailable]);

  // Enable biometrics
  const enable = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) return false;

    const success = await authManager.enableBiometrics();
    setIsEnabled(success);
    return success;
  }, [isAvailable]);

  // Disable biometrics
  const disable = useCallback(async () => {
    await authManager.disableBiometrics();
    setIsEnabled(false);
  }, []);

  // Get biometric type name for display
  const getBiometricTypeName = useCallback((): string => {
    if (!isAvailable) return 'None';

    if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      )
    ) {
      return 'Face ID';
    }

    if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ) {
      return 'Touch ID / Fingerprint';
    }

    if (
      supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
    ) {
      return 'Iris';
    }

    return 'Biometric';
  }, [supportedTypes, isAvailable]);

  return {
    isAvailable,
    isEnabled,
    supportedTypes,
    isAuthenticating,
    authenticate,
    enable,
    disable,
    getBiometricTypeName,
  };
};
