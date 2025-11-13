import { create } from 'zustand';
import { api, FinanceSummary, Transaction, Savings, Loan } from './api';

interface FinancialItem {
    name: string;
    amount: number;
    category: string;
}

interface SavingsGoal extends FinancialItem {
    target: number;
    rate?: number;
    id?: number;
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
    balance: number;
    netWorth: number;

    // Loading & Error States
    isLoading: boolean;
    error: string | null;

    // Actions
    setTimeFilter: (filter: 'monthly' | 'quarterly' | 'yearly') => void;
    setSelectedMonth: (month: number) => void;
    setSelectedYear: (year: number) => void;
    updateFinancialData: (data: Partial<FinancialData>) => void;

    // API Actions
    fetchFinanceSummary: () => Promise<void>;
    fetchTransactions: () => Promise<void>;
    fetchSavings: () => Promise<void>;
    fetchLoans: () => Promise<void>;
    updateBalance: (balance: number, totalDebt: number) => Promise<void>;

    // Computed
    getNetWorth: () => number;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
    // Initial State
    timeFilter: 'monthly',
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    balance: 0,
    netWorth: 0,
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

    // Fetch comprehensive finance summary from backend
    fetchFinanceSummary: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.finance.getSummary();
            const summary: FinanceSummary = response.data;

            set({
                balance: summary.balance,
                netWorth: summary.net_worth,
                financialData: {
                    income: {
                        total: summary.total_income,
                        growth: 0, // Calculate growth separately if needed
                        sources: [] // Populate from transactions if needed
                    },
                    expenses: {
                        total: summary.total_expense,
                        growth: 0,
                        items: []
                    },
                    savings: {
                        total: summary.total_savings,
                        growth: 0,
                        goals: []
                    },
                    debts: {
                        total: summary.total_debt + summary.total_loans,
                        growth: 0,
                        items: []
                    }
                },
                isLoading: false
            });

            // Fetch detailed data
            await Promise.all([
                get().fetchTransactions(),
                get().fetchSavings(),
                get().fetchLoans()
            ]);
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch finance summary',
                isLoading: false
            });
        }
    },

    // Fetch transactions and categorize as income/expenses
    fetchTransactions: async () => {
        try {
            const response = await api.transactions.getAll();
            const transactions: Transaction[] = response.data;

            const incomeSources: FinancialItem[] = [];
            const expenseItems: FinancialItem[] = [];

            transactions.forEach(transaction => {
                const item: FinancialItem = {
                    name: transaction.source,
                    amount: transaction.amount,
                    category: transaction.category || 'other'
                };

                if (transaction.type === 1) { // Income
                    incomeSources.push(item);
                } else if (transaction.type === 2) { // Expense
                    expenseItems.push(item);
                }
            });

            set((state) => ({
                financialData: {
                    ...state.financialData,
                    income: {
                        ...state.financialData.income,
                        sources: incomeSources
                    },
                    expenses: {
                        ...state.financialData.expenses,
                        items: expenseItems
                    }
                }
            }));
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    },

    // Fetch savings goals
    fetchSavings: async () => {
        try {
            const response = await api.savings.getAll();
            const savingsList: Savings[] = response.data;

            const savingsGoals: SavingsGoal[] = savingsList.map(saving => ({
                id: saving.saving_id,
                name: saving.name,
                amount: saving.amount,
                target: saving.amount * 2, // You might want to add target to backend model
                category: 'savings',
                rate: saving.rate
            }));

            set((state) => ({
                financialData: {
                    ...state.financialData,
                    savings: {
                        ...state.financialData.savings,
                        goals: savingsGoals
                    }
                }
            }));
        } catch (error) {
            console.error('Failed to fetch savings:', error);
        }
    },

    // Fetch loans and add to debts
    fetchLoans: async () => {
        try {
            const response = await api.loans.getAll();
            const loansList: Loan[] = response.data;

            const loanItems: FinancialItem[] = loansList.map(loan => ({
                name: loan.name,
                amount: loan.total_amount,
                category: 'loan'
            }));

            set((state) => ({
                financialData: {
                    ...state.financialData,
                    debts: {
                        ...state.financialData.debts,
                        items: loanItems
                    }
                }
            }));
        } catch (error) {
            console.error('Failed to fetch loans:', error);
        }
    },

    // Update balance and debt
    updateBalance: async (balance: number, totalDebt: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.finance.update({ balance, total_debt: totalDebt });
            set({
                balance,
                financialData: {
                    ...get().financialData,
                    debts: {
                        ...get().financialData.debts,
                        total: totalDebt
                    }
                },
                isLoading: false
            });
            // Refresh summary after update
            await get().fetchFinanceSummary();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update balance',
                isLoading: false
            });
            throw error;
        }
    },

    // Computed Values
    getNetWorth: () => {
        const { netWorth } = get();
        return netWorth;
    }
}));
