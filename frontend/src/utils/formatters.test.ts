import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatPercentage } from './formatters.js';

// formatCurrency tests
test('formatCurrency formats number to INR currency', () => {
  const result = formatCurrency(1500);
  assert.strictEqual(result, '₹1,500');
});

test('formatCurrency formats large numbers with thousands separators', () => {
  assert.strictEqual(formatCurrency(1000000), '₹10,00,000');
  assert.strictEqual(formatCurrency(50000), '₹50,000');
});

test('formatCurrency formats decimal values correctly', () => {
  assert.strictEqual(formatCurrency(1500.50), '₹1,500.50');
  assert.strictEqual(formatCurrency(99.99), '₹99.99');
});

test('formatCurrency handles zero value', () => {
  assert.strictEqual(formatCurrency(0), '₹0');
});

test('formatCurrency handles negative values', () => {
  const result = formatCurrency(-1500);
  assert.ok(result.includes('1,500') || result.includes('1500'));
});

test('formatCurrency handles very small decimals', () => {
  const result = formatCurrency(0.01);
  assert.ok(result.includes('0.01'));
});

test('formatCurrency handles very large numbers', () => {
  const result = formatCurrency(9999999.99);
  assert.ok(result.includes('9,999,999') || result.includes('9999999'));
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
