import { create } from 'zustand';
import { api } from './api';

interface FinancialItem {
    name: string;
    amount: number;
    category: string;
}

interface SavingsGoal extends FinancialItem {
    id?: number;
    target?: number;
    rate?: number;
}

interface Transaction {
    id: number;
    source: string;
    amount: number;
    type: number; // 1 = income, 2 = expense
    category: string;
    date: string;
    transaction_type?: number;
    status: number;
}

interface Loan {
    id: number;
    name: string;
    total_amount: number;
    rate: number;
    term: number;
    duration: number;
    premium_amount: number;
    status: number;
}

interface FinancialData {
    income: {
        total: number;
        growth: number;
        sources: FinancialItem[];
    };
    expenses: {
        total: number;
        growth: number;
        items: FinancialItem[];
    };
    savings: {
        total: number;
        growth: number;
        goals: SavingsGoal[];
    };
    debts: {
        total: number;
        growth: number;
        items: FinancialItem[];
    };
}

interface FinanceStore {
    // Filter State
    timeFilter: 'monthly' | 'quarterly' | 'yearly';
    selectedMonth: number;
    selectedYear: number;

    // Financial Data
    financialData: FinancialData;

    // Loading States
    isLoading: boolean;
    error: string | null;

    // Actions
    setTimeFilter: (filter: 'monthly' | 'quarterly' | 'yearly') => void;
    setSelectedMonth: (month: number) => void;
    setSelectedYear: (year: number) => void;
    updateFinancialData: (data: Partial<FinancialData>) => void;

    // API Actions
    fetchFinancialData: () => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'status'>) => Promise<void>;
    deleteTransaction: (id: number) => Promise<void>;
    addSavingsGoal: (goal: { name: string; amount: number; rate: number }) => Promise<void>;
    deleteSavingsGoal: (id: number) => Promise<void>;
    addLoan: (loan: Omit<Loan, 'id' | 'status'>) => Promise<void>;
    deleteLoan: (id: number) => Promise<void>;

    // Computed
    getNetWorth: () => number;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
    // Initial State
    timeFilter: 'monthly',
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
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
    },

    // Actions
    setTimeFilter: (filter) => set({ timeFilter: filter }),
    setSelectedMonth: (month) => set({ selectedMonth: month }),
    setSelectedYear: (year) => set({ selectedYear: year }),
    updateFinancialData: (data) => set((state) => ({
        financialData: { ...state.financialData, ...data }
    })),

    // API Actions
    fetchFinancialData: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch all financial data in parallel
            const [financeData, transactions, savings, loans]: any = await Promise.all([
                api.finance.get().catch(() => ({ data: { balance: 0, total_debt: 0 } })),
                api.transactions.getAll().catch(() => ({ data: [] })),
                api.savings.getAll().catch(() => ({ data: [] })),
                api.loans.getAll().catch(() => ({ data: [] }))
            ]);

            // Process transactions to separate income and expenses
            const transactionsList = transactions.data || [];
            const incomeTransactions = transactionsList.filter((t: Transaction) => t.type === 1);
            const expenseTransactions = transactionsList.filter((t: Transaction) => t.type === 2);

            const incomeTotal = incomeTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
            const expensesTotal = expenseTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);

            // Process savings
            const savingsList = savings.data || [];
            const savingsTotal = savingsList.reduce((sum: number, s: any) => sum + s.amount, 0);

            // Process loans (debts)
            const loansList = loans.data || [];
            const debtsTotal = loansList.reduce((sum: number, l: Loan) => sum + l.total_amount, 0);

            // Group income by source/category
            const incomeSources = incomeTransactions.reduce((acc: FinancialItem[], t: Transaction) => {
                const existing = acc.find(item => item.name === t.source);
                if (existing) {
                    existing.amount += t.amount;
                } else {
                    acc.push({ name: t.source, amount: t.amount, category: t.category });
                }
                return acc;
            }, []);

            // Group expenses by category
            const expenseItems = expenseTransactions.reduce((acc: FinancialItem[], t: Transaction) => {
                const existing = acc.find(item => item.category === t.category);
                if (existing) {
                    existing.amount += t.amount;
                    existing.name = t.category;
                } else {
                    acc.push({ name: t.category, amount: t.amount, category: t.category });
                }
                return acc;
            }, []);

            // Map savings goals
            const savingsGoals = savingsList.map((s: any) => ({
                id: s.saving_id,
                name: s.name,
                amount: s.amount,
                rate: s.rate,
                category: 'savings',
                target: s.amount * 1.5 // Default target if not provided
            }));

            // Map loans to debt items
            const debtItems = loansList.map((l: Loan) => ({
                name: l.name,
                amount: l.total_amount,
                category: 'loan'
            }));

            set({
                financialData: {
                    income: {
                        total: incomeTotal,
                        growth: 0, // Calculate growth later based on historical data
                        sources: incomeSources
                    },
                    expenses: {
                        total: expensesTotal,
                        growth: 0,
                        items: expenseItems
                    },
                    savings: {
                        total: savingsTotal,
                        growth: 0,
                        goals: savingsGoals
                    },
                    debts: {
                        total: debtsTotal,
                        growth: 0,
                        items: debtItems
                    }
                },
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addTransaction: async (transaction) => {
        try {
            await api.transactions.create(transaction);
            await get().fetchFinancialData(); // Refresh data
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    deleteTransaction: async (id) => {
        try {
            await api.transactions.delete(id);
            await get().fetchFinancialData(); // Refresh data
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    addSavingsGoal: async (goal) => {
        try {
            await api.savings.create(goal);
            await get().fetchFinancialData(); // Refresh data
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    deleteSavingsGoal: async (id) => {
        try {
            await api.savings.delete(id);
            await get().fetchFinancialData(); // Refresh data
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    addLoan: async (loan) => {
        try {
            await api.loans.create(loan);
            await get().fetchFinancialData(); // Refresh data
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    deleteLoan: async (id) => {
        try {
            await api.loans.delete(id);
            await get().fetchFinancialData(); // Refresh data
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        }
    },

    // Computed Values
    getNetWorth: () => {
        const { financialData } = get();
        return financialData.savings.total - financialData.debts.total;
    }
}));
