/**
 * IrisStrategy - Iris authentication strategy
 * Concrete implementation of BiometricStrategy for Iris scanning
 * Part of the Strategy Pattern implementation
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricStrategy } from './BiometricStrategy';

export class IrisStrategy extends BiometricStrategy {
  constructor() {
    super(LocalAuthentication.AuthenticationType.IRIS);
  }

  getType(): string {
    return 'IRIS';
  }

  getDisplayName(): string {
    return 'Iris Scan';
  }
}
