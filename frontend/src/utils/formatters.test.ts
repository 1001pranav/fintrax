import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatPercentage } from './formatters.js';

test('formatCurrency formats number to INR currency', () => {
  const result = formatCurrency(1500);
  assert.strictEqual(result, '₹1,500');
});

test('formatPercentage formats number to one decimal percentage', () => {
  assert.strictEqual(formatPercentage(3.456), '3.5%');
  assert.strictEqual(formatPercentage(-3.456), '3.5%');
});
