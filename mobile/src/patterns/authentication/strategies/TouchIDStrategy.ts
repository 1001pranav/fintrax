/**
 * TouchIDStrategy - Touch ID authentication strategy
 * Concrete implementation of BiometricStrategy for iOS Touch ID
 * Part of the Strategy Pattern implementation
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricStrategy } from './BiometricStrategy';

export class TouchIDStrategy extends BiometricStrategy {
  constructor() {
    super(LocalAuthentication.AuthenticationType.FINGERPRINT);
  }

  getType(): string {
    return 'TOUCH_ID';
  }

  getDisplayName(): string {
    return 'Touch ID';
  }
}
