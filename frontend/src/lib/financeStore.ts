import { create } from 'zustand';
import { api, FinanceSummary, Transaction, Savings, Loan, CreateTransactionData, CreateSavingsData, CreateLoanData } from './api';
import { toast } from './useToast';
import { apiCache, cacheKeys } from './apiCache';

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
    transactions: Transaction[];
    loans: Loan[];

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
    createTransaction: (data: CreateTransactionData) => Promise<void>;
    deleteTransaction: (id: number) => Promise<void>;

    // Savings Actions
    createSavings: (data: CreateSavingsData) => Promise<void>;
    updateSavings: (id: number, data: Partial<CreateSavingsData>) => Promise<void>;
    deleteSavings: (id: number) => Promise<void>;

    // Loan Actions
    createLoan: (data: CreateLoanData) => Promise<void>;
    updateLoan: (id: number, data: Partial<CreateLoanData>) => Promise<void>;
    deleteLoan: (id: number) => Promise<void>;

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
    },

    // Actions
    setTimeFilter: (filter) => set({ timeFilter: filter }),
    setSelectedMonth: (month) => set({ selectedMonth: month }),
    setSelectedYear: (year) => set({ selectedYear: year }),
    updateFinancialData: (data) => set((state) => ({
        financialData: { ...state.financialData, ...data }
    })),

    // Fetch comprehensive finance summary from backend with caching
    fetchFinanceSummary: async (options: { forceRefresh?: boolean } = {}) => {
        // Check if we have cached data for immediate display (stale-while-revalidate)
        const cachedSummary = apiCache.getStale<{ data: FinanceSummary }>(cacheKeys.financeSummary());
        if (cachedSummary && !options.forceRefresh) {
            const summary = cachedSummary.data;
            set({
                balance: summary.balance,
                netWorth: summary.net_worth,
                financialData: {
                    income: {
                        total: summary.total_income,
                        growth: 0,
                        sources: get().financialData.income.sources // Keep existing sources
                    },
                    expenses: {
                        total: summary.total_expense,
                        growth: 0,
                        items: get().financialData.expenses.items // Keep existing items
                    },
                    savings: {
                        total: summary.total_savings,
                        growth: 0,
                        goals: get().financialData.savings.goals // Keep existing goals
                    },
                    debts: {
                        total: summary.total_debt + summary.total_loans,
                        growth: 0,
                        items: get().financialData.debts.items // Keep existing items
                    }
                },
                isLoading: false
            });
        }

        set({ isLoading: true, error: null });
        try {
            const response = await apiCache.get(
                cacheKeys.financeSummary(),
                () => api.finance.getSummary(),
                { ttl: 2 * 60 * 1000, forceRefresh: options.forceRefresh } // 2 minutes cache
            );
            const summary: FinanceSummary = response.data;

            set({
                balance: summary.balance,
                netWorth: summary.net_worth,
                financialData: {
                    income: {
                        total: summary.total_income,
                        growth: 0,
                        sources: get().financialData.income.sources // Keep existing sources
                    },
                    expenses: {
                        total: summary.total_expense,
                        growth: 0,
                        items: get().financialData.expenses.items // Keep existing items
                    },
                    savings: {
                        total: summary.total_savings,
                        growth: 0,
                        goals: get().financialData.savings.goals // Keep existing goals
                    },
                    debts: {
                        total: summary.total_debt + summary.total_loans,
                        growth: 0,
                        items: get().financialData.debts.items // Keep existing items
                    }
                },
                isLoading: false
            });

            // Fetch detailed data only if not already loaded or forced refresh
            const hasDetailedData =
                get().financialData.income.sources.length > 0 ||
                get().financialData.savings.goals.length > 0 ||
                get().loans.length > 0;

            if (!hasDetailedData || options.forceRefresh) {
                await Promise.all([
                    get().fetchTransactions(),
                    get().fetchSavings(),
                    get().fetchLoans()
                ]);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch finance summary';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
        }
    },

    // Fetch transactions and categorize as income/expenses with caching
    fetchTransactions: async (options: { forceRefresh?: boolean } = {}) => {
        try {
            const response = await apiCache.get(
                cacheKeys.transactions(),
                () => api.transactions.getAll(),
                { ttl: 2 * 60 * 1000, forceRefresh: options.forceRefresh } // 2 minutes cache
            );
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
                transactions,
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

    // Fetch savings goals with caching
    fetchSavings: async (options: { forceRefresh?: boolean } = {}) => {
        try {
            const response = await apiCache.get(
                cacheKeys.savings(),
                () => api.savings.getAll(),
                { ttl: 2 * 60 * 1000, forceRefresh: options.forceRefresh } // 2 minutes cache
            );
            const savingsList: Savings[] = response.data;

            const savingsGoals: SavingsGoal[] = savingsList.map(saving => ({
                id: saving.saving_id,
                name: saving.name,
                amount: saving.amount,
                target: saving.target_amount,
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

    // Fetch loans and add to debts with caching
    fetchLoans: async (options: { forceRefresh?: boolean } = {}) => {
        try {
            const response = await apiCache.get(
                cacheKeys.loans(),
                () => api.loans.getAll(),
                { ttl: 2 * 60 * 1000, forceRefresh: options.forceRefresh } // 2 minutes cache
            );
            const loansList: Loan[] = response.data;

            const loanItems: FinancialItem[] = loansList.map(loan => ({
                name: loan.name,
                amount: loan.total_amount,
                category: 'loan'
            }));

            set((state) => ({
                loans: loansList,
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
            // Invalidate summary cache
            apiCache.invalidate(cacheKeys.financeSummary());
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update balance',
                isLoading: false
            });
            throw error;
        }
    },

    // Create a new transaction
    createTransaction: async (data: CreateTransactionData) => {
        set({ isLoading: true, error: null });
        try {
            await api.transactions.create(data);
            // Invalidate caches
            apiCache.invalidate(cacheKeys.transactions());
            apiCache.invalidate(cacheKeys.financeSummary());
            // Only refetch transactions and summary (not all detailed data)
            await Promise.all([
                get().fetchTransactions({ forceRefresh: true }),
                get().fetchFinanceSummary()
            ]);
            set({ isLoading: false });
            toast.success('Transaction created successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create transaction';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Delete a transaction
    deleteTransaction: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.transactions.delete(id);
            // Invalidate caches
            apiCache.invalidate(cacheKeys.transactions());
            apiCache.invalidate(cacheKeys.financeSummary());
            // Only refetch transactions and summary
            await Promise.all([
                get().fetchTransactions({ forceRefresh: true }),
                get().fetchFinanceSummary()
            ]);
            set({ isLoading: false });
            toast.success('Transaction deleted successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete transaction';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Create a new savings goal
    createSavings: async (data: CreateSavingsData) => {
        set({ isLoading: true, error: null });
        try {
            await api.savings.create(data);
            // Invalidate caches
            apiCache.invalidate(cacheKeys.savings());
            apiCache.invalidate(cacheKeys.financeSummary());
            // Only refetch savings (summary will be fetched from cache or on next dashboard visit)
            await get().fetchSavings({ forceRefresh: true });
            set({ isLoading: false });
            toast.success(`Savings goal "${data.name}" created successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create savings goal';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Update a savings goal
    updateSavings: async (id: number, data: Partial<CreateSavingsData>) => {
        set({ isLoading: true, error: null });
        try {
            await api.savings.update(id, data);
            // Invalidate caches
            apiCache.invalidate(cacheKeys.savings());
            apiCache.invalidate(cacheKeys.financeSummary());
            // Only refetch savings
            await get().fetchSavings({ forceRefresh: true });
            set({ isLoading: false });
            toast.success(`Savings goal "${data.name || 'Savings'}" updated successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update savings goal';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Delete a savings goal
    deleteSavings: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.savings.delete(id);
            // Invalidate caches
            apiCache.invalidate(cacheKeys.savings());
            apiCache.invalidate(cacheKeys.financeSummary());
            // Only refetch savings
            await get().fetchSavings({ forceRefresh: true });
            set({ isLoading: false });
            toast.success('Savings goal deleted successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete savings goal';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Create a new loan
    createLoan: async (data: CreateLoanData) => {
        set({ isLoading: true, error: null });
        try {
            await api.loans.create(data);
            // Invalidate caches
            apiCache.invalidate(cacheKeys.loans());
            apiCache.invalidate(cacheKeys.financeSummary());
            // Only refetch loans
            await get().fetchLoans({ forceRefresh: true });
            set({ isLoading: false });
            toast.success(`Loan "${data.name}" created successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create loan';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Update a loan
    updateLoan: async (id: number, data: Partial<CreateLoanData>) => {
        set({ isLoading: true, error: null });
        try {
            await api.loans.update(id, data);
            // Invalidate caches
            apiCache.invalidate(cacheKeys.loans());
            apiCache.invalidate(cacheKeys.financeSummary());
            // Only refetch loans
            await get().fetchLoans({ forceRefresh: true });
            set({ isLoading: false });
            toast.success(`Loan "${data.name || 'Loan'}" updated successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update loan';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Delete a loan
    deleteLoan: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await api.loans.delete(id);
            // Invalidate caches
            apiCache.invalidate(cacheKeys.loans());
            apiCache.invalidate(cacheKeys.financeSummary());
            // Only refetch loans
            await get().fetchLoans({ forceRefresh: true });
            set({ isLoading: false });
            toast.success('Loan deleted successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete loan';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Computed Values
    getNetWorth: () => {
        const { netWorth } = get();
        return netWorth;
    }
}));
