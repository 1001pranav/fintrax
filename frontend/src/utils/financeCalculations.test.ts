import { test } from 'node:test';
import assert from 'node:assert/strict';

// Finance calculation functions for testing
function calculateSavingsProgress(amount: number, targetAmount: number): number {
  if (targetAmount === 0) return 0;
  return (amount / targetAmount) * 100;
}

function calculateNetWorth(
  balance: number,
  totalSavings: number,
  totalDebt: number,
  totalLoans: number
): number {
  return balance + totalSavings - totalDebt - totalLoans;
}

function calculateMonthlyInterest(principal: number, annualRate: number): number {
  return (principal * annualRate) / (12 * 100);
}

function isGoalComplete(amount: number, targetAmount: number): boolean {
  return amount >= targetAmount;
}

function calculateTransactionTotal(transactions: { amount: number; type: number }[]): {
  income: number;
  expense: number;
  balance: number;
} {
  let income = 0;
  let expense = 0;

  for (const transaction of transactions) {
    if (transaction.type === 1) {
      income += transaction.amount;
    } else if (transaction.type === 2) {
      expense += transaction.amount;
    }
  }

  return {
    income,
    expense,
    balance: income - expense,
  };
}

// Tests
test('calculateSavingsProgress returns correct percentage', () => {
  assert.strictEqual(calculateSavingsProgress(2500, 10000), 25);
  assert.strictEqual(calculateSavingsProgress(5000, 10000), 50);
  assert.strictEqual(calculateSavingsProgress(10000, 10000), 100);
  assert.strictEqual(calculateSavingsProgress(0, 10000), 0);
});

test('calculateSavingsProgress handles edge cases', () => {
  assert.strictEqual(calculateSavingsProgress(0, 0), 0);
  assert.strictEqual(calculateSavingsProgress(12000, 10000), 120); // Over 100%
  assert.strictEqual(calculateSavingsProgress(100, 1000), 10);
});

test('calculateNetWorth returns correct value', () => {
  const netWorth = calculateNetWorth(10000, 5000, 2000, 3000);
  assert.strictEqual(netWorth, 10000);
});

test('calculateNetWorth handles negative net worth', () => {
  const netWorth = calculateNetWorth(1000, 500, 5000, 10000);
  assert.strictEqual(netWorth, -13500);
});

test('calculateNetWorth handles zero values', () => {
  const netWorth = calculateNetWorth(0, 0, 0, 0);
  assert.strictEqual(netWorth, 0);
});

test('calculateNetWorth with only assets', () => {
  const netWorth = calculateNetWorth(10000, 5000, 0, 0);
  assert.strictEqual(netWorth, 15000);
});

test('calculateNetWorth with only liabilities', () => {
  const netWorth = calculateNetWorth(0, 0, 2000, 3000);
  assert.strictEqual(netWorth, -5000);
});

test('calculateMonthlyInterest returns correct value', () => {
  const interest = calculateMonthlyInterest(10000, 6);
  assert.strictEqual(interest, 50);
});

test('calculateMonthlyInterest with zero rate', () => {
  const interest = calculateMonthlyInterest(10000, 0);
  assert.strictEqual(interest, 0);
});

test('calculateMonthlyInterest with zero principal', () => {
  const interest = calculateMonthlyInterest(0, 6);
  assert.strictEqual(interest, 0);
});

test('calculateMonthlyInterest with high rate', () => {
  const interest = calculateMonthlyInterest(5000, 12);
  assert.strictEqual(interest, 50);
});

test('isGoalComplete returns true when goal reached', () => {
  assert.strictEqual(isGoalComplete(10000, 10000), true);
  assert.strictEqual(isGoalComplete(12000, 10000), true);
});

test('isGoalComplete returns false when goal not reached', () => {
  assert.strictEqual(isGoalComplete(5000, 10000), false);
  assert.strictEqual(isGoalComplete(0, 10000), false);
  assert.strictEqual(isGoalComplete(9999, 10000), false);
});

test('calculateTransactionTotal calculates income and expense correctly', () => {
  const transactions = [
    { amount: 5000, type: 1 }, // income
    { amount: 2000, type: 2 }, // expense
    { amount: 3000, type: 1 }, // income
    { amount: 1500, type: 2 }, // expense
  ];

  const total = calculateTransactionTotal(transactions);

  assert.strictEqual(total.income, 8000);
  assert.strictEqual(total.expense, 3500);
  assert.strictEqual(total.balance, 4500);
});

test('calculateTransactionTotal handles empty array', () => {
  const total = calculateTransactionTotal([]);

  assert.strictEqual(total.income, 0);
  assert.strictEqual(total.expense, 0);
  assert.strictEqual(total.balance, 0);
});

test('calculateTransactionTotal handles only income', () => {
  const transactions = [
    { amount: 5000, type: 1 },
    { amount: 3000, type: 1 },
  ];

  const total = calculateTransactionTotal(transactions);

  assert.strictEqual(total.income, 8000);
  assert.strictEqual(total.expense, 0);
  assert.strictEqual(total.balance, 8000);
});

test('calculateTransactionTotal handles only expenses', () => {
  const transactions = [
    { amount: 2000, type: 2 },
    { amount: 1500, type: 2 },
  ];

  const total = calculateTransactionTotal(transactions);

  assert.strictEqual(total.income, 0);
  assert.strictEqual(total.expense, 3500);
  assert.strictEqual(total.balance, -3500);
});

test('calculateTransactionTotal handles negative balance', () => {
  const transactions = [
    { amount: 1000, type: 1 },
    { amount: 5000, type: 2 },
  ];

  const total = calculateTransactionTotal(transactions);

  assert.strictEqual(total.income, 1000);
  assert.strictEqual(total.expense, 5000);
  assert.strictEqual(total.balance, -4000);
});
