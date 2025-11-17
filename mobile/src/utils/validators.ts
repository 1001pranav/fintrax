/**
 * Form Validation Utilities
 */

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
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
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
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
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
    return 'Username is required';
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
  if (username.length > 20) {
    return 'Username must be less than 20 characters';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
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
    return 'OTP is required';
  }
  if (!validateOTP(otp)) {
    return 'OTP must be 4-6 digits';
  }
  return null;
};
