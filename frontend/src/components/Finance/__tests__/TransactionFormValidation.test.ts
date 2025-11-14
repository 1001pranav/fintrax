/**
 * TransactionForm Validation Logic Tests
 * Tests the validation rules for transaction forms
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Validation function extracted from TransactionForm component
 * This mirrors the validation logic in TransactionForm.tsx
 */
function validateTransactionForm(formData: {
  source: string;
  amount: string;
  category: string;
  date: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Source validation
  if (!formData.source.trim()) {
    errors.source = 'Source is required';
  }

  // Amount validation
  if (!formData.amount) {
    errors.amount = 'Amount is required';
  } else {
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum)) {
      errors.amount = 'Amount must be a valid number';
    } else if (amountNum <= 0) {
      errors.amount = 'Amount must be greater than zero';
    }
  }

  // Category validation
  if (!formData.category) {
    errors.category = 'Category is required';
  }

  // Date validation
  if (!formData.date) {
    errors.date = 'Date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

describe('TransactionForm Validation', () => {
  describe('Source validation', () => {
    it('should fail when source is empty', () => {
      const result = validateTransactionForm({
        source: '',
        amount: '100',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, false);
      assert.equal(result.errors.source, 'Source is required');
    });

    it('should fail when source is only whitespace', () => {
      const result = validateTransactionForm({
        source: '   ',
        amount: '100',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, false);
      assert.equal(result.errors.source, 'Source is required');
    });

    it('should pass when source is provided', () => {
      const result = validateTransactionForm({
        source: 'Salary',
        amount: '100',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.source, undefined);
    });
  });

  describe('Amount validation', () => {
    it('should fail when amount is empty', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, false);
      assert.equal(result.errors.amount, 'Amount is required');
    });

    it('should fail when amount is not a number', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: 'abc',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, false);
      assert.equal(result.errors.amount, 'Amount must be a valid number');
    });

    it('should fail when amount is zero', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '0',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, false);
      assert.equal(result.errors.amount, 'Amount must be greater than zero');
    });

    it('should fail when amount is negative', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '-50',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, false);
      assert.equal(result.errors.amount, 'Amount must be greater than zero');
    });

    it('should pass with valid positive integer amount', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '100',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.amount, undefined);
    });

    it('should pass with valid decimal amount', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '99.99',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.amount, undefined);
    });

    it('should pass with very small positive amount', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '0.01',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.amount, undefined);
    });

    it('should pass with large amount', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '1000000',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.amount, undefined);
    });
  });

  describe('Category validation', () => {
    it('should fail when category is empty', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '100',
        category: '',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, false);
      assert.equal(result.errors.category, 'Category is required');
    });

    it('should pass when category is provided', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '100',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.category, undefined);
    });
  });

  describe('Date validation', () => {
    it('should fail when date is empty', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '100',
        category: 'Food',
        date: ''
      });

      assert.equal(result.isValid, false);
      assert.equal(result.errors.date, 'Date is required');
    });

    it('should pass when date is provided', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '100',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.date, undefined);
    });
  });

  describe('Complete form validation', () => {
    it('should pass with all valid fields', () => {
      const result = validateTransactionForm({
        source: 'Monthly Salary',
        amount: '5000.00',
        category: 'Salary',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, true);
      assert.deepEqual(result.errors, {});
    });

    it('should fail with multiple missing fields', () => {
      const result = validateTransactionForm({
        source: '',
        amount: '',
        category: '',
        date: ''
      });

      assert.equal(result.isValid, false);
      assert.equal(Object.keys(result.errors).length, 4);
      assert.ok(result.errors.source);
      assert.ok(result.errors.amount);
      assert.ok(result.errors.category);
      assert.ok(result.errors.date);
    });

    it('should accumulate multiple validation errors', () => {
      const result = validateTransactionForm({
        source: '',
        amount: '-100',
        category: '',
        date: ''
      });

      assert.equal(result.isValid, false);
      assert.equal(result.errors.source, 'Source is required');
      assert.equal(result.errors.amount, 'Amount must be greater than zero');
      assert.equal(result.errors.category, 'Category is required');
      assert.equal(result.errors.date, 'Date is required');
    });
  });

  describe('Edge cases', () => {
    it('should handle amount with leading zeros', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '0100',
        category: 'Food',
        date: '2025-11-14'
      });

      // parseFloat handles leading zeros correctly
      assert.equal(result.errors.amount, undefined);
    });

    it('should handle amount with trailing zeros', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '100.00',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.amount, undefined);
    });

    it('should handle scientific notation', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '1e3', // 1000
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.amount, undefined);
    });

    it('should handle amount with extra decimal places', () => {
      const result = validateTransactionForm({
        source: 'Test',
        amount: '99.999999',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.errors.amount, undefined);
    });

    it('should trim source whitespace in validation', () => {
      const result = validateTransactionForm({
        source: '  Valid Source  ',
        amount: '100',
        category: 'Food',
        date: '2025-11-14'
      });

      // Whitespace around valid text should not fail
      assert.equal(result.errors.source, undefined);
    });
  });

  describe('Real-world transaction scenarios', () => {
    it('should validate grocery shopping transaction', () => {
      const result = validateTransactionForm({
        source: 'Whole Foods',
        amount: '87.42',
        category: 'Food',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, true);
      assert.deepEqual(result.errors, {});
    });

    it('should validate salary income transaction', () => {
      const result = validateTransactionForm({
        source: 'Monthly Salary - Acme Corp',
        amount: '6500.00',
        category: 'Salary',
        date: '2025-11-01'
      });

      assert.equal(result.isValid, true);
      assert.deepEqual(result.errors, {});
    });

    it('should validate transport expense', () => {
      const result = validateTransactionForm({
        source: 'Uber Ride',
        amount: '15.75',
        category: 'Transport',
        date: '2025-11-14'
      });

      assert.equal(result.isValid, true);
      assert.deepEqual(result.errors, {});
    });

    it('should validate entertainment expense', () => {
      const result = validateTransactionForm({
        source: 'Netflix Subscription',
        amount: '12.99',
        category: 'Entertainment',
        date: '2025-11-10'
      });

      assert.equal(result.isValid, true);
      assert.deepEqual(result.errors, {});
    });
  });
});
