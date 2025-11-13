/**
 * Validation utility functions for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Email validation with RFC 5322 compliant regex
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address');
  }

  if (email.length > 254) {
    errors.push('Email address is too long');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Password validation with security requirements
 */
export const validatePassword = (password: string, isStrict: boolean = true): ValidationResult => {
  const errors: string[] = [];

  if (!password || password.trim() === '') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password is too long (max 128 characters)');
  }

  if (isStrict) {
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }

  // Check for common weak passwords
  const weakPasswords = ['password', '12345678', 'qwerty', 'abc123', 'letmein', 'welcome'];
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common, please choose a stronger password');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Username validation
 */
export const validateUsername = (username: string): ValidationResult => {
  const errors: string[] = [];

  if (!username || username.trim() === '') {
    errors.push('Username is required');
    return { isValid: false, errors };
  }

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 30) {
    errors.push('Username is too long (max 30 characters)');
  }

  // Allow alphanumeric, underscore, and hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }

  // Must start with a letter
  if (!/^[a-zA-Z]/.test(username)) {
    errors.push('Username must start with a letter');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Generic text field validation
 */
export const validateTextField = (
  value: string,
  fieldName: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    patternMessage?: string;
  } = {}
): ValidationResult => {
  const errors: string[] = [];
  const { required = true, minLength, maxLength, pattern, patternMessage } = options;

  if (required && (!value || value.trim() === '')) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  if (!required && !value) {
    return { isValid: true, errors: [] };
  }

  if (minLength && value.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters long`);
  }

  if (maxLength && value.length > maxLength) {
    errors.push(`${fieldName} must not exceed ${maxLength} characters`);
  }

  if (pattern && !pattern.test(value)) {
    errors.push(patternMessage || `${fieldName} format is invalid`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Number validation
 */
export const validateNumber = (
  value: number | string,
  fieldName: string,
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): ValidationResult => {
  const errors: string[] = [];
  const { required = true, min, max, integer = false } = options;

  if (required && (value === undefined || value === null || value === '')) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    errors.push(`${fieldName} must be a valid number`);
    return { isValid: false, errors };
  }

  if (integer && !Number.isInteger(numValue)) {
    errors.push(`${fieldName} must be a whole number`);
  }

  if (min !== undefined && numValue < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  }

  if (max !== undefined && numValue > max) {
    errors.push(`${fieldName} must not exceed ${max}`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Escape special characters
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  sanitized = sanitized.replace(/[&<>"'/]/g, (char) => map[char] || char);

  return sanitized.trim();
};

/**
 * Sanitize HTML content while preserving safe tags
 */
export const sanitizeHTML = (html: string, allowedTags: string[] = []): string => {
  if (!html) return '';

  // Default allowed tags for rich text
  const defaultAllowedTags = ['b', 'i', 'u', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'];
  const allowed = allowedTags.length > 0 ? allowedTags : defaultAllowedTags;

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Remove all tags except allowed ones
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  sanitized = sanitized.replace(tagRegex, (match, tagName) => {
    return allowed.includes(tagName.toLowerCase()) ? match : '';
  });

  return sanitized;
};

/**
 * Validate and sanitize form data
 */
export const validateAndSanitizeForm = <T extends Record<string, any>>(
  formData: T,
  validators: { [K in keyof T]?: (value: T[K]) => ValidationResult }
): { isValid: boolean; errors: { [K in keyof T]?: string[] }; sanitizedData: T } => {
  const allErrors: { [K in keyof T]?: string[] } = {};
  const sanitizedData = { ...formData };

  // Validate and sanitize each field
  for (const key in formData) {
    if (validators[key]) {
      const result = validators[key]!(formData[key]);
      if (!result.isValid) {
        allErrors[key] = result.errors;
      }
    }

    // Sanitize string fields
    if (typeof formData[key] === 'string') {
      sanitizedData[key] = sanitizeInput(formData[key]) as T[Extract<keyof T, string>];
    }
  }

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
    sanitizedData,
  };
};

/**
 * OTP validation
 */
export const validateOTP = (otp: string): ValidationResult => {
  const errors: string[] = [];

  if (!otp || otp.trim() === '') {
    errors.push('OTP is required');
    return { isValid: false, errors };
  }

  if (!/^\d+$/.test(otp)) {
    errors.push('OTP must contain only numbers');
  }

  if (otp.length < 4 || otp.length > 8) {
    errors.push('OTP must be between 4 and 8 digits');
  }

  return { isValid: errors.length === 0, errors };
};
