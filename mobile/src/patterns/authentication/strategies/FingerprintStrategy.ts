/**
 * FingerprintStrategy - Fingerprint authentication strategy
 * Concrete implementation of BiometricStrategy for Android Fingerprint
 * Part of the Strategy Pattern implementation
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricStrategy } from './BiometricStrategy';

export class FingerprintStrategy extends BiometricStrategy {
  constructor() {
    super(LocalAuthentication.AuthenticationType.FINGERPRINT);
  }

  getType(): string {
    return 'FINGERPRINT';
  }

  getDisplayName(): string {
    return 'Fingerprint';
  }
}
