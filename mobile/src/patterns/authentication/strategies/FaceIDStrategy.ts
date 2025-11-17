/**
 * FaceIDStrategy - Face ID authentication strategy
 * Concrete implementation of BiometricStrategy for iOS Face ID
 * Part of the Strategy Pattern implementation
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricStrategy } from './BiometricStrategy';

export class FaceIDStrategy extends BiometricStrategy {
  constructor() {
    super(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  }

  getType(): string {
    return 'FACE_ID';
  }

  getDisplayName(): string {
    return 'Face ID';
  }
}
