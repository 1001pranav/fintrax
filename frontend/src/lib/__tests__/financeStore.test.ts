import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { useFinanceStore } from '../financeStore';

describe('useFinanceStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    useFinanceStore.setState({
      timeFilter: 'monthly',
      selectedMonth: currentMonth,
      selectedYear: currentYear,
      balance: 0,
      netWorth: 0,
      transactions: [],
      loans: [],
      isLoading: false,
      error: null,
      financialData: {
        income: {
          total: 0,
          growth: 0,
          sources: []
        },
        expenses: {
          total: 0,
          growth: 0,
          items: []
        },
        savings: {
          total: 0,
          growth: 0,
          goals: []
        },
        debts: {
          total: 0,
          growth: 0,
          items: []
        }
      }
    });
  });

  describe('Filter Management', () => {
    it('should set time filter', () => {
      useFinanceStore.getState().setTimeFilter('monthly');
      assert.strictEqual(useFinanceStore.getState().timeFilter, 'monthly');

      useFinanceStore.getState().setTimeFilter('quarterly');
      assert.strictEqual(useFinanceStore.getState().timeFilter, 'quarterly');

      useFinanceStore.getState().setTimeFilter('yearly');
      assert.strictEqual(useFinanceStore.getState().timeFilter, 'yearly');
    });

    it('should set selected month', () => {
      useFinanceStore.getState().setSelectedMonth(5);
      assert.strictEqual(useFinanceStore.getState().selectedMonth, 5);

      useFinanceStore.getState().setSelectedMonth(11);
      assert.strictEqual(useFinanceStore.getState().selectedMonth, 11);
    });

    it('should set selected year', () => {
      useFinanceStore.getState().setSelectedYear(2024);
      assert.strictEqual(useFinanceStore.getState().selectedYear, 2024);

      useFinanceStore.getState().setSelectedYear(2025);
      assert.strictEqual(useFinanceStore.getState().selectedYear, 2025);
    });
  });

  describe('Financial Data Management', () => {
    it('should update financial data', () => {
      const newIncomeData = {
        income: {
          total: 5000,
          growth: 10,
          sources: [
            { name: 'Salary', amount: 5000, category: 'employment' }
          ]
        }
      };

      useFinanceStore.getState().updateFinancialData(newIncomeData);

      const state = useFinanceStore.getState();
      assert.strictEqual(state.financialData.income.total, 5000);
      assert.strictEqual(state.financialData.income.growth, 10);
      assert.strictEqual(state.financialData.income.sources.length, 1);
    });

    it('should preserve other financial data when updating specific fields', () => {
      // Set initial data
      useFinanceStore.setState({
        financialData: {
          income: { total: 5000, growth: 10, sources: [] },
          expenses: { total: 3000, growth: 5, items: [] },
          savings: { total: 2000, growth: 15, goals: [] },
          debts: { total: 1000, growth: -10, items: [] }
        }
      });

      // Update only income
      useFinanceStore.getState().updateFinancialData({
        income: { total: 6000, growth: 20, sources: [] }
      });

      const state = useFinanceStore.getState();
      assert.strictEqual(state.financialData.income.total, 6000);
      assert.strictEqual(state.financialData.expenses.total, 3000); // Should remain unchanged
      assert.strictEqual(state.financialData.savings.total, 2000); // Should remain unchanged
    });

    it('should calculate net worth', () => {
      useFinanceStore.setState({
        netWorth: 10000
      });

      const netWorth = useFinanceStore.getState().getNetWorth();
      assert.strictEqual(netWorth, 10000);
    });
  });

  describe('Loading and Error State', () => {
    it('should handle loading state', () => {
      assert.strictEqual(useFinanceStore.getState().isLoading, false);

      useFinanceStore.setState({ isLoading: true });
      assert.strictEqual(useFinanceStore.getState().isLoading, true);

      useFinanceStore.setState({ isLoading: false });
      assert.strictEqual(useFinanceStore.getState().isLoading, false);
    });

    it('should handle error state', () => {
      assert.strictEqual(useFinanceStore.getState().error, null);

      useFinanceStore.setState({ error: 'Test error message' });
      assert.strictEqual(useFinanceStore.getState().error, 'Test error message');

      useFinanceStore.setState({ error: null });
      assert.strictEqual(useFinanceStore.getState().error, null);
    });
  });

  describe('Balance and Net Worth', () => {
    it('should update balance', () => {
      useFinanceStore.setState({ balance: 1000 });
      assert.strictEqual(useFinanceStore.getState().balance, 1000);

      useFinanceStore.setState({ balance: 2500 });
      assert.strictEqual(useFinanceStore.getState().balance, 2500);
    });

    it('should update net worth', () => {
      useFinanceStore.setState({ netWorth: 50000 });
      assert.strictEqual(useFinanceStore.getState().netWorth, 50000);
      assert.strictEqual(useFinanceStore.getState().getNetWorth(), 50000);
    });

    it('should handle negative balance', () => {
      useFinanceStore.setState({ balance: -500 });
      assert.strictEqual(useFinanceStore.getState().balance, -500);
    });
  });

  describe('Transactions', () => {
    it('should store transactions', () => {
      const mockTransactions = [
        {
          transaction_id: 1,
          user_id: 1,
          type: 1,
          category: 'salary',
          source: 'Company A',
          amount: 5000,
          transaction_date: '2024-01-01',
          description: 'Monthly salary',
          created_at: '2024-01-01'
        }
      ];

      useFinanceStore.setState({ transactions: mockTransactions });
      assert.strictEqual(useFinanceStore.getState().transactions.length, 1);
      assert.strictEqual(useFinanceStore.getState().transactions[0].amount, 5000);
    });
  });

  describe('Loans', () => {
    it('should store loans', () => {
      const mockLoans = [
        {
          loan_id: 1,
          user_id: 1,
          name: 'Car Loan',
          total_amount: 20000,
          paid_amount: 5000,
          interest_rate: 5.5,
          start_date: '2024-01-01',
          end_date: '2026-01-01',
          installment_count: 24,
          installments_paid: 6,
          created_at: '2024-01-01'
        }
      ];

      useFinanceStore.setState({ loans: mockLoans });
      assert.strictEqual(useFinanceStore.getState().loans.length, 1);
      assert.strictEqual(useFinanceStore.getState().loans[0].name, 'Car Loan');
      assert.strictEqual(useFinanceStore.getState().loans[0].total_amount, 20000);
    });
  });

  describe('Financial Data Structure', () => {
    it('should maintain correct financial data structure', () => {
      const state = useFinanceStore.getState();

      // Check structure
      assert.ok('income' in state.financialData);
      assert.ok('expenses' in state.financialData);
      assert.ok('savings' in state.financialData);
      assert.ok('debts' in state.financialData);

      // Check income structure
      assert.ok('total' in state.financialData.income);
      assert.ok('growth' in state.financialData.income);
      assert.ok('sources' in state.financialData.income);

      // Check expenses structure
      assert.ok('total' in state.financialData.expenses);
      assert.ok('growth' in state.financialData.expenses);
      assert.ok('items' in state.financialData.expenses);

      // Check savings structure
      assert.ok('total' in state.financialData.savings);
      assert.ok('growth' in state.financialData.savings);
      assert.ok('goals' in state.financialData.savings);

      // Check debts structure
      assert.ok('total' in state.financialData.debts);
      assert.ok('growth' in state.financialData.debts);
      assert.ok('items' in state.financialData.debts);
    });

    it('should handle income sources correctly', () => {
      const incomeData = {
        income: {
          total: 10000,
          growth: 15,
          sources: [
            { name: 'Salary', amount: 8000, category: 'employment' },
            { name: 'Freelance', amount: 2000, category: 'business' }
          ]
        }
      };

      useFinanceStore.getState().updateFinancialData(incomeData);

      const sources = useFinanceStore.getState().financialData.income.sources;
      assert.strictEqual(sources.length, 2);
      assert.strictEqual(sources[0].amount, 8000);
      assert.strictEqual(sources[1].amount, 2000);
    });

    it('should handle expense items correctly', () => {
      const expenseData = {
        expenses: {
          total: 4000,
          growth: 5,
          items: [
            { name: 'Rent', amount: 2000, category: 'housing' },
            { name: 'Groceries', amount: 800, category: 'food' },
            { name: 'Utilities', amount: 1200, category: 'utilities' }
          ]
        }
      };

      useFinanceStore.getState().updateFinancialData(expenseData);

      const items = useFinanceStore.getState().financialData.expenses.items;
      assert.strictEqual(items.length, 3);
      assert.strictEqual(items[0].name, 'Rent');
      assert.strictEqual(items[1].amount, 800);
    });
  });
});
