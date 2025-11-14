import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateTextField,
  validateNumber,
  validateAmount,
  validateDate,
  validateDateRange,
  validateOTP,
  sanitizeInput,
  sanitizeHTML,
} from '../validation';

describe('validateEmail', () => {
  it('should validate a correct email', () => {
    const result = validateEmail('test@example.com');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it('should reject empty email', () => {
    const result = validateEmail('');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.includes('Email is required'));
  });

  it('should reject invalid email format', () => {
    const result = validateEmail('invalid-email');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('valid email')));
  });

  it('should reject email without @', () => {
    const result = validateEmail('testexample.com');
    assert.strictEqual(result.isValid, false);
  });

  it('should reject email that is too long', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    const result = validateEmail(longEmail);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('too long')));
  });
});

describe('validatePassword', () => {
  it('should validate a strong password', () => {
    const result = validatePassword('MyP@ssw0rd123', true);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it('should reject empty password', () => {
    const result = validatePassword('');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.includes('Password is required'));
  });

  it('should reject password that is too short', () => {
    const result = validatePassword('Short1!');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('at least 8 characters')));
  });

  it('should reject password without uppercase in strict mode', () => {
    const result = validatePassword('mypassword123!', true);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('uppercase')));
  });

  it('should reject password without lowercase in strict mode', () => {
    const result = validatePassword('MYPASSWORD123!', true);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('lowercase')));
  });

  it('should reject password without number in strict mode', () => {
    const result = validatePassword('MyPassword!', true);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('number')));
  });

  it('should reject password without special character in strict mode', () => {
    const result = validatePassword('MyPassword123', true);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('special character')));
  });

  it('should reject common weak passwords', () => {
    const result = validatePassword('password', false);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('too common')));
  });

  it('should accept simpler password in non-strict mode', () => {
    const result = validatePassword('mypassword123', false);
    assert.strictEqual(result.isValid, true);
  });
});

describe('validateUsername', () => {
  it('should validate a correct username', () => {
    const result = validateUsername('john_doe');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it('should reject empty username', () => {
    const result = validateUsername('');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.includes('Username is required'));
  });

  it('should reject username that is too short', () => {
    const result = validateUsername('ab');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('at least 3 characters')));
  });

  it('should reject username that is too long', () => {
    const result = validateUsername('a'.repeat(31));
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('too long')));
  });

  it('should reject username with special characters', () => {
    const result = validateUsername('john@doe');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('only contain')));
  });

  it('should reject username starting with number', () => {
    const result = validateUsername('1johndoe');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('must start with a letter')));
  });

  it('should accept username with hyphens and underscores', () => {
    const result = validateUsername('john_doe-123');
    assert.strictEqual(result.isValid, true);
  });
});

describe('validateTextField', () => {
  it('should validate required field with valid value', () => {
    const result = validateTextField('test value', 'Test Field');
    assert.strictEqual(result.isValid, true);
  });

  it('should reject empty required field', () => {
    const result = validateTextField('', 'Test Field', { required: true });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.includes('Test Field is required'));
  });

  it('should accept empty non-required field', () => {
    const result = validateTextField('', 'Test Field', { required: false });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject value below minimum length', () => {
    const result = validateTextField('ab', 'Test Field', { minLength: 3 });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('at least 3 characters')));
  });

  it('should reject value above maximum length', () => {
    const result = validateTextField('abcdef', 'Test Field', { maxLength: 5 });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('must not exceed 5 characters')));
  });

  it('should validate against pattern', () => {
    const result = validateTextField('abc123', 'Test Field', {
      pattern: /^[a-z]+$/,
      patternMessage: 'Must contain only lowercase letters'
    });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.includes('Must contain only lowercase letters'));
  });
});

describe('validateNumber', () => {
  it('should validate a valid number', () => {
    const result = validateNumber(42, 'Age');
    assert.strictEqual(result.isValid, true);
  });

  it('should validate a string number', () => {
    const result = validateNumber('42', 'Age');
    assert.strictEqual(result.isValid, true);
  });

  it('should reject empty required number', () => {
    const result = validateNumber('', 'Age', { required: true });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.includes('Age is required'));
  });

  it('should reject non-numeric value', () => {
    const result = validateNumber('abc', 'Age');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('must be a valid number')));
  });

  it('should reject number below minimum', () => {
    const result = validateNumber(5, 'Age', { min: 18 });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('at least 18')));
  });

  it('should reject number above maximum', () => {
    const result = validateNumber(150, 'Age', { max: 120 });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('must not exceed 120')));
  });

  it('should reject non-integer when integer required', () => {
    const result = validateNumber(42.5, 'Count', { integer: true });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('whole number')));
  });

  it('should accept non-required empty value', () => {
    const result = validateNumber('', 'Age', { required: false });
    assert.strictEqual(result.isValid, true);
  });
});

describe('validateAmount', () => {
  it('should validate a positive amount', () => {
    const result = validateAmount(100, 'Price');
    assert.strictEqual(result.isValid, true);
  });

  it('should reject zero by default', () => {
    const result = validateAmount(0, 'Price');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('greater than zero')));
  });

  it('should accept zero when allowed', () => {
    const result = validateAmount(0, 'Price', { allowZero: true });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject negative amount', () => {
    const result = validateAmount(-10, 'Price', { allowZero: true });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('cannot be negative')));
  });

  it('should reject non-numeric amount', () => {
    const result = validateAmount('abc', 'Price');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('valid number')));
  });

  it('should validate string amount', () => {
    const result = validateAmount('99.99', 'Price');
    assert.strictEqual(result.isValid, true);
  });

  it('should accept empty non-required amount', () => {
    const result = validateAmount('', 'Price', { required: false });
    assert.strictEqual(result.isValid, true);
  });
});

describe('validateDate', () => {
  it('should validate a valid date', () => {
    const result = validateDate(new Date(), 'Event Date');
    assert.strictEqual(result.isValid, true);
  });

  it('should validate a date string', () => {
    const result = validateDate('2024-12-25', 'Event Date');
    assert.strictEqual(result.isValid, true);
  });

  it('should reject invalid date string', () => {
    const result = validateDate('invalid-date', 'Event Date');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('valid date')));
  });

  it('should reject past date when not allowed', () => {
    const pastDate = new Date('2020-01-01');
    const result = validateDate(pastDate, 'Event Date', { allowPast: false });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('cannot be in the past')));
  });

  it('should reject future date when not allowed', () => {
    const futureDate = new Date('2030-01-01');
    const result = validateDate(futureDate, 'Birth Date', { allowFuture: false });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('cannot be in the future')));
  });

  it('should accept empty non-required date', () => {
    const result = validateDate('', 'Event Date', { required: false });
    assert.strictEqual(result.isValid, true);
  });

  it('should validate against min date', () => {
    const minDate = new Date('2024-01-01');
    const testDate = new Date('2023-12-31');
    const result = validateDate(testDate, 'Event Date', { minDate });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('on or after')));
  });

  it('should validate against max date', () => {
    const maxDate = new Date('2024-12-31');
    const testDate = new Date('2025-01-01');
    const result = validateDate(testDate, 'Event Date', { maxDate });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('on or before')));
  });
});

describe('validateDateRange', () => {
  it('should validate valid date range', () => {
    const result = validateDateRange('2024-01-01', '2024-12-31');
    assert.strictEqual(result.isValid, true);
  });

  it('should reject start date after end date', () => {
    const result = validateDateRange('2024-12-31', '2024-01-01');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('must be before')));
  });

  it('should accept same start and end date', () => {
    const result = validateDateRange('2024-06-15', '2024-06-15');
    assert.strictEqual(result.isValid, true);
  });

  it('should reject invalid start date', () => {
    const result = validateDateRange('invalid', '2024-12-31');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('valid date')));
  });

  it('should accept empty non-required dates', () => {
    const result = validateDateRange('', '', { required: false });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject missing required dates', () => {
    const result = validateDateRange('', '2024-12-31', { required: true });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('required')));
  });
});

describe('validateOTP', () => {
  it('should validate a valid OTP', () => {
    const result = validateOTP('123456');
    assert.strictEqual(result.isValid, true);
  });

  it('should reject empty OTP', () => {
    const result = validateOTP('');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.includes('OTP is required'));
  });

  it('should reject OTP with non-numeric characters', () => {
    const result = validateOTP('12abc6');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('only numbers')));
  });

  it('should reject OTP that is too short', () => {
    const result = validateOTP('123');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('between 4 and 8 digits')));
  });

  it('should reject OTP that is too long', () => {
    const result = validateOTP('123456789');
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.includes('between 4 and 8 digits')));
  });
});

describe('sanitizeInput', () => {
  it('should remove HTML tags', () => {
    const result = sanitizeInput('<script>alert("xss")</script>Hello');
    assert.strictEqual(result.includes('<script>'), false);
    assert.strictEqual(result.includes('Hello'), true);
  });

  it('should escape special characters', () => {
    const result = sanitizeInput('&test');
    assert.strictEqual(result.includes('&amp;'), true);
    assert.strictEqual(result, '&amp;test');
  });

  it('should handle empty string', () => {
    const result = sanitizeInput('');
    assert.strictEqual(result, '');
  });

  it('should trim whitespace', () => {
    const result = sanitizeInput('  test  ');
    assert.strictEqual(result, 'test');
  });
});

describe('sanitizeHTML', () => {
  it('should remove script tags', () => {
    const result = sanitizeHTML('<p>Hello</p><script>alert("xss")</script>');
    assert.strictEqual(result.includes('<script>'), false);
    assert.strictEqual(result.includes('<p>'), true);
  });

  it('should remove event handlers', () => {
    const result = sanitizeHTML('<div onclick="alert()">Test</div>');
    assert.strictEqual(result.includes('onclick'), false);
  });

  it('should remove javascript: protocol', () => {
    const result = sanitizeHTML('<a href="javascript:alert()">Link</a>');
    assert.strictEqual(result.includes('javascript:'), false);
  });

  it('should preserve allowed tags', () => {
    const result = sanitizeHTML('<p><b>Bold</b> and <i>italic</i></p>');
    assert.strictEqual(result.includes('<b>'), true);
    assert.strictEqual(result.includes('<i>'), true);
  });

  it('should remove disallowed tags', () => {
    const result = sanitizeHTML('<p>Hello</p><style>body{}</style>');
    assert.strictEqual(result.includes('<style>'), false);
  });
});
