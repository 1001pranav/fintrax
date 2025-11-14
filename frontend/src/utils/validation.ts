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

/**
 * Amount/currency validation (positive numbers)
 */
export const validateAmount = (
  value: number | string,
  fieldName: string = 'Amount',
  options: {
    required?: boolean;
    allowZero?: boolean;
    min?: number;
    max?: number;
  } = {}
): ValidationResult => {
  const errors: string[] = [];
  const { required = true, allowZero = false, min, max } = options;

  if (required && (value === undefined || value === null || value === '')) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  if (!required && (value === undefined || value === null || value === '')) {
    return { isValid: true, errors: [] };
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    errors.push(`${fieldName} must be a valid number`);
    return { isValid: false, errors };
  }

  if (!allowZero && numValue <= 0) {
    errors.push(`${fieldName} must be greater than zero`);
  } else if (allowZero && numValue < 0) {
    errors.push(`${fieldName} cannot be negative`);
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
 * Date validation
 */
export const validateDate = (
  value: string | Date,
  fieldName: string = 'Date',
  options: {
    required?: boolean;
    allowPast?: boolean;
    allowFuture?: boolean;
    minDate?: Date;
    maxDate?: Date;
  } = {}
): ValidationResult => {
  const errors: string[] = [];
  const { required = true, allowPast = true, allowFuture = true, minDate, maxDate } = options;

  if (required && !value) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  if (!required && !value) {
    return { isValid: true, errors: [] };
  }

  const date = typeof value === 'string' ? new Date(value) : value;

  if (isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid date`);
    return { isValid: false, errors };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);

  if (!allowPast && dateToCheck < today) {
    errors.push(`${fieldName} cannot be in the past`);
  }

  if (!allowFuture && dateToCheck > today) {
    errors.push(`${fieldName} cannot be in the future`);
  }

  if (minDate) {
    const minDateNormalized = new Date(minDate);
    minDateNormalized.setHours(0, 0, 0, 0);
    if (dateToCheck < minDateNormalized) {
      errors.push(`${fieldName} must be on or after ${minDate.toLocaleDateString()}`);
    }
  }

  if (maxDate) {
    const maxDateNormalized = new Date(maxDate);
    maxDateNormalized.setHours(0, 0, 0, 0);
    if (dateToCheck > maxDateNormalized) {
      errors.push(`${fieldName} must be on or before ${maxDate.toLocaleDateString()}`);
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Date range validation (start date must be before end date)
 */
export const validateDateRange = (
  startDate: string | Date,
  endDate: string | Date,
  options: {
    required?: boolean;
    startFieldName?: string;
    endFieldName?: string;
  } = {}
): ValidationResult => {
  const errors: string[] = [];
  const { required = true, startFieldName = 'Start date', endFieldName = 'End date' } = options;

  if (required && (!startDate || !endDate)) {
    if (!startDate) errors.push(`${startFieldName} is required`);
    if (!endDate) errors.push(`${endFieldName} is required`);
    return { isValid: false, errors };
  }

  if (!startDate || !endDate) {
    return { isValid: true, errors: [] };
  }

  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime())) {
    errors.push(`${startFieldName} must be a valid date`);
  }

  if (isNaN(end.getTime())) {
    errors.push(`${endFieldName} must be a valid date`);
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  if (start > end) {
    errors.push(`${startFieldName} must be before ${endFieldName}`);
  }

  return { isValid: errors.length === 0, errors };
};
