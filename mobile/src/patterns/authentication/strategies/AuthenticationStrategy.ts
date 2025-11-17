/**
 * AuthenticationStrategy Interface
 * Defines the contract for all authentication strategies
 * Part of the Strategy Pattern implementation
 */

export interface AuthResult {
  success: boolean;
  error?: string;
  authenticationType?: string;
}

export interface AuthenticationStrategy {
  /**
   * Perform authentication using this strategy
   * @returns Promise with authentication result
   */
  authenticate(): Promise<AuthResult>;

  /**
   * Check if this authentication method is available on the device
   * @returns Promise<boolean>
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get the type/name of this authentication strategy
   * @returns string
   */
  getType(): string;

  /**
   * Get a user-friendly display name for this authentication type
   * @returns string
   */
  getDisplayName(): string;
}
