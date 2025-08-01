import { create } from 'zustand';

interface FinancialItem {
    name: string;
    amount: number;
    category: string;
}

interface SavingsGoal extends FinancialItem {
    target: number;
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
    
    // Actions
    setTimeFilter: (filter: 'monthly' | 'quarterly' | 'yearly') => void;
    setSelectedMonth: (month: number) => void;
    setSelectedYear: (year: number) => void;
    updateFinancialData: (data: Partial<FinancialData>) => void;
    
    // Computed
    getNetWorth: () => number;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
    // Initial State
    timeFilter: 'monthly',
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    
    financialData: {
        income: {
        total: 8500,
        growth: 12.5,
        sources: [
            { name: 'Salary', amount: 6500, category: 'primary' },
            { name: 'Freelance', amount: 1200, category: 'secondary' },
            { name: 'Investments', amount: 500, category: 'passive' },
            { name: 'Side Business', amount: 300, category: 'business' },
            { name: 'Rental Income', amount: 200, category: 'passive' }
        ]
        },
        expenses: {
        total: 5200,
        growth: -3.2,
        items: [
            { name: 'Rent', amount: 1800, category: 'housing' },
            { name: 'Groceries', amount: 600, category: 'food' },
            { name: 'Transportation', amount: 400, category: 'transport' },
            { name: 'Utilities', amount: 350, category: 'utilities' },
            { name: 'Entertainment', amount: 300, category: 'lifestyle' }
        ]
        },
        savings: {
        total: 12500,
        growth: 18.7,
        goals: [
            { name: 'Emergency Fund', amount: 5000, target: 10000, category: 'emergency' },
            { name: 'Vacation Fund', amount: 2500, target: 5000, category: 'travel' },
            { name: 'New Car', amount: 3000, target: 15000, category: 'purchase' },
            { name: 'Investment Portfolio', amount: 1500, target: 20000, category: 'investment' },
            { name: 'Home Deposit', amount: 500, target: 50000, category: 'property' }
        ]
        },
        debts: {
        total: 3200,
        growth: -15.4,
        items: [
            { name: 'Credit Card', amount: 1200, category: 'credit' },
            { name: 'Student Loan', amount: 1500, category: 'education' },
            { name: 'Personal Loan', amount: 500, category: 'personal' },
            { name: 'Medical Bills', amount: 0, category: 'medical' },
            { name: 'Auto Loan', amount: 0, category: 'auto' }
        ]
        }
    },
    
    // Actions
    setTimeFilter: (filter) => set({ timeFilter: filter }),
    setSelectedMonth: (month) => set({ selectedMonth: month }),
    setSelectedYear: (year) => set({ selectedYear: year }),
    updateFinancialData: (data) => set((state) => ({
        financialData: { ...state.financialData, ...data }
    })),
    
    // Computed Values
    getNetWorth: () => {
        const { financialData } = get();
        return financialData.savings.total - financialData.debts.total;
    }
}));
