import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatPercentage } from './formatters.js';

// formatCurrency tests
test('formatCurrency formats number to INR currency', () => {
  const result = formatCurrency(1500);
  assert.strictEqual(result, '₹1,500');
});

test('formatCurrency formats large numbers with thousands separators', () => {
  // Uses en-US locale formatting (Western style, not Indian style)
  assert.strictEqual(formatCurrency(1000000), '₹1,000,000');
  assert.strictEqual(formatCurrency(50000), '₹50,000');
});

test('formatCurrency formats decimal values correctly', () => {
  // Formatter rounds to whole numbers (maximumFractionDigits: 0)
  assert.strictEqual(formatCurrency(1500.50), '₹1,501');
  assert.strictEqual(formatCurrency(99.99), '₹100');
});

test('formatCurrency handles zero value', () => {
  assert.strictEqual(formatCurrency(0), '₹0');
});

test('formatCurrency handles negative values', () => {
  const result = formatCurrency(-1500);
  assert.ok(result.includes('1,500') || result.includes('1500'));
});

test('formatCurrency handles very small decimals', () => {
  // Rounds to nearest whole number (0.01 rounds to 0)
  const result = formatCurrency(0.01);
  assert.strictEqual(result, '₹0');
});

test('formatCurrency handles very large numbers', () => {
  // Rounds to nearest whole number (9999999.99 rounds to 10000000)
  const result = formatCurrency(9999999.99);
  assert.ok(result.includes('10,000,000') || result.includes('10000000'));
});

// formatPercentage tests
test('formatPercentage formats number to one decimal percentage', () => {
  assert.strictEqual(formatPercentage(3.456), '3.5%');
  assert.strictEqual(formatPercentage(-3.456), '3.5%');
});

test('formatPercentage formats whole numbers', () => {
  assert.strictEqual(formatPercentage(5), '5.0%');
  assert.strictEqual(formatPercentage(100), '100.0%');
});

test('formatPercentage formats zero', () => {
  assert.strictEqual(formatPercentage(0), '0.0%');
});

test('formatPercentage formats small decimals', () => {
  assert.strictEqual(formatPercentage(0.123), '0.1%');
  assert.strictEqual(formatPercentage(0.987), '1.0%');
});

test('formatPercentage formats negative percentages as absolute', () => {
  assert.strictEqual(formatPercentage(-10.5), '10.5%');
  assert.strictEqual(formatPercentage(-0.5), '0.5%');
});

test('formatPercentage rounds correctly', () => {
  assert.strictEqual(formatPercentage(3.44), '3.4%');
  assert.strictEqual(formatPercentage(3.45), '3.5%');
  assert.strictEqual(formatPercentage(3.46), '3.5%');
});

test('formatPercentage handles very large percentages', () => {
  assert.strictEqual(formatPercentage(999.99), '1000.0%');
  assert.strictEqual(formatPercentage(1234.567), '1234.6%');
});
