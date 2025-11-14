'use client';

import { useEffect, useState } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import Sidebar from '@/components/Layout/Sidebar';
import FinanceOverview from '@/components/Finance/FinanceOverview';
import TransactionList from '@/components/Finance/TransactionList';
import SavingsList from '@/components/Finance/SavingsList';
import LoanList from '@/components/Finance/LoanList';
import TransactionModal from '@/components/finance/TransactionModal';
import { TransactionFormData } from '@/components/finance/TransactionForm';
import { CreateTransactionData } from '@/lib/api';
import ExpensePieChart from '@/components/Charts/ExpensePieChart';
import IncomeTrendChart from '@/components/Charts/IncomeTrendChart';

export default function FinancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    isLoading,
    error,
    fetchFinanceSummary,
    createTransaction
  } = useFinanceStore();

  // Fetch data on mount
  useEffect(() => {
    fetchFinanceSummary();
  }, [fetchFinanceSummary]);

  const handleCreateTransaction = async (formData: TransactionFormData) => {
    const transactionData: CreateTransactionData = {
      source: formData.source,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      transaction_type: 1, // Default transaction type
    };

    await createTransaction(transactionData);
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-white">
                Financial Dashboard
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                + Add Transaction
              </button>
            </div>
            <p className="text-white/60">
              Track your income, expenses, savings, and debts at a glance
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-white/60">Loading financial data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-xl mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-400">
                        Error loading financial data
                      </h3>
                      <p className="mt-1 text-sm text-red-300/80">
                        {error}
                      </p>
                      <button
                        onClick={() => fetchFinanceSummary()}
                        className="mt-3 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Finance Overview Cards (US-1.1) */}
              <FinanceOverview />

              {/* Charts Section */}
              <div className="mt-8 grid grid-cols-1 gap-8">
                {/* Expense Category Breakdown Chart (US-2.2) */}
                <ExpensePieChart />

                {/* Income vs Expense Trend Chart (US-2.3) */}
                <IncomeTrendChart chartType="line" />
              </div>

              {/* Transaction List Section (US-1.3) */}
              <div className="mt-8">
                <TransactionList />
              </div>

              {/* Savings Goals Section (US-1.4) */}
              <div className="mt-8">
                <SavingsList />
              </div>

              {/* Loans & Debts Section (US-1.5) */}
              <div className="mt-8">
                <LoanList />
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl hover:bg-white/10 transition-all duration-200 text-left group"
                  >
                    <div className="text-blue-400 mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                      Add Transaction
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      Record income or expense
                    </p>
                  </button>

                  <button className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl hover:bg-white/10 transition-all duration-200 text-left group">
                    <div className="text-green-400 mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium group-hover:text-green-400 transition-colors">
                      Add Savings Goal
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      Set a new financial goal
                    </p>
                  </button>

                  <button className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl hover:bg-white/10 transition-all duration-200 text-left group">
                    <div className="text-orange-400 mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium group-hover:text-orange-400 transition-colors">
                      Track Loan
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      Add or manage loans
                    </p>
                  </button>

                  <button className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl hover:bg-white/10 transition-all duration-200 text-left group">
                    <div className="text-purple-400 mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                      View Reports
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      Analyze spending patterns
                    </p>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTransaction}
      />
    </div>
  );
}
