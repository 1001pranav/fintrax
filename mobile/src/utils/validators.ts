/**
 * Validation Utilities
 * Helper functions for input validation
 */

import { ERROR_MESSAGES } from '../constants/config';

/**
 * Validate email address
 */
export const validateEmail = (email: string): string | null => {
  if (!email) return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ERROR_MESSAGES.VALIDATION.INVALID_EMAIL;
  }

  return null;
};

/**
 * Validate password
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;

  if (password.length < 8) {
    return ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT;
  }

  return null;
};

/**
 * Validate required field
 */
export const validateRequired = (value: string): string | null => {
  if (!value || value.trim() === '') {
    return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
  }
  return null;
};

/**
 * Validate passwords match
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | null => {
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.VALIDATION.PASSWORDS_DONT_MATCH;
  }
  return null;
};

/**
 * Validate number
 */
export const validateNumber = (value: string): string | null => {
  if (!value) return ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;

  if (isNaN(Number(value))) {
    return 'Please enter a valid number';
  }

  return null;
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value: string): string | null => {
  const numberError = validateNumber(value);
  if (numberError) return numberError;

  if (Number(value) <= 0) {
    return 'Please enter a positive number';
  }

  return null;
};
