/**
 * Validation Utilities
 * Helper functions for input validation
 */

import { ERROR_MESSAGES } from '../constants/config';

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate email and return error message
 */
export const getEmailError = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
  }
  if (!validateEmail(email)) {
    return ERROR_MESSAGES.VALIDATION.INVALID_EMAIL;
  }
  return null;
};

/**
 * Validate password (minimum 6 characters)
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate password and return error message
 */
export const getPasswordError = (password: string): string | null => {
  if (!password || password.trim() === '') {
    return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
  }
  if (password.length < 6) {
    return ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT;
  }
  return null;
};

/**
 * Validate password strength
 */
export const getPasswordStrength = (
  password: string
): 'weak' | 'medium' | 'strong' | 'very-strong' => {
  if (password.length < 6) return 'weak';

  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Complexity checks
  if (/[a-z]/.test(password)) strength++; // lowercase
  if (/[A-Z]/.test(password)) strength++; // uppercase
  if (/[0-9]/.test(password)) strength++; // numbers
  if (/[^a-zA-Z0-9]/.test(password)) strength++; // special characters

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  if (strength <= 5) return 'strong';
  return 'very-strong';
};

/**
 * Validate username (alphanumeric, 3-20 characters)
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate username and return error message
 */
export const getUsernameError = (username: string): string | null => {
  if (!username || username.trim() === '') {
    return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
  }
  if (username.length < 3) {
    return ERROR_MESSAGES.VALIDATION.USERNAME_TOO_SHORT;
  }
  if (username.length > 20) {
    return ERROR_MESSAGES.VALIDATION.USERNAME_TOO_LONG;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return ERROR_MESSAGES.VALIDATION.INVALID_USERNAME;
  }
  return null;
};

/**
 * Validate required field
 */
export const validateRequired = (value: string): boolean => {
  return value.trim() !== '';
};

/**
 * Validate required field and return error message
 */
export const getRequiredError = (value: string, fieldName: string): string | null => {
  if (!validateRequired(value)) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate OTP (4-6 digits)
 */
export const validateOTP = (otp: string): boolean => {
  const otpRegex = /^\d{4,6}$/;
  return otpRegex.test(otp);
};

/**
 * Validate OTP and return error message
 */
export const getOTPError = (otp: string): string | null => {
  if (!otp || otp.trim() === '') {
    return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
  }
  if (!validateOTP(otp)) {
    return ERROR_MESSAGES.VALIDATION.INVALID_OTP;
  }
  return null;
};

/**
 * Validate passwords match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.VALIDATION.PASSWORDS_DONT_MATCH;
  }
  return null;
};
