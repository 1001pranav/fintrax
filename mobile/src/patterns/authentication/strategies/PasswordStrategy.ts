/**
 * PasswordStrategy - Password authentication strategy
 * Fallback authentication method when biometrics fail or are unavailable
 * Part of the Strategy Pattern implementation
 */

import { AuthResult, AuthenticationStrategy } from './AuthenticationStrategy';

export class PasswordStrategy implements AuthenticationStrategy {
  private validatePassword: (password: string) => Promise<boolean>;

  constructor(validatePassword: (password: string) => Promise<boolean>) {
    this.validatePassword = validatePassword;
  }

  async authenticate(password?: string): Promise<AuthResult> {
    try {
      if (!password) {
        return {
          success: false,
          error: 'Password is required',
          authenticationType: this.getType(),
        };
      }

      const isValid = await this.validatePassword(password);

      if (isValid) {
        return {
          success: true,
          authenticationType: this.getType(),
        };
      } else {
        return {
          success: false,
          error: 'Invalid password',
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
    // Password authentication is always available
    return true;
  }

  getType(): string {
    return 'PASSWORD';
  }

  getDisplayName(): string {
    return 'Password';
  }
}
