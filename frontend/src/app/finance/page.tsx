'use client';

import { useEffect, useState } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import TransactionModal from '@/components/finance/TransactionModal';
import { TransactionFormData } from '@/components/finance/TransactionForm';
import { formatCurrency, formatDate, TRANSACTION_TYPES } from '@/constants/financeConstants';
import { CreateTransactionData } from '@/lib/api';

export default function FinancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    fetchFinanceSummary,
    createTransaction,
    deleteTransaction
  } = useFinanceStore();

  // Fetch data on mount
  useEffect(() => {
    fetchFinanceSummary();
    fetchTransactions();
  }, [fetchFinanceSummary, fetchTransactions]);

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

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Finance Management</h1>
            <p className="text-white/60">Track your income and expenses</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            + Add Transaction
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-400/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && transactions.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-white/60">Loading transactions...</p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="w-20 h-20 mb-4 text-white/20">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Transactions Yet</h3>
            <p className="text-white/60 mb-6">Start tracking your finances by adding your first transaction</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              Add Your First Transaction
            </button>
          </div>
        ) : (
          /* Transaction List */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Recent Transactions ({transactions.length})
              </h2>
            </div>

            <div className="space-y-3">
              {transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          transaction.type === TRANSACTION_TYPES.INCOME
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {transaction.type === TRANSACTION_TYPES.INCOME ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 11l5-5m0 0l5 5m-5-5v12"
                            />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 13l-5 5m0 0l-5-5m5 5V6"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{transaction.source}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-white/60 capitalize bg-white/5 px-2 py-1 rounded">
                            {transaction.category}
                          </span>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/60">{formatDate(transaction.date)}</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right mr-4">
                        <p
                          className={`text-lg font-bold ${
                            transaction.type === TRANSACTION_TYPES.INCOME
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {transaction.type === TRANSACTION_TYPES.INCOME ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all duration-200"
                      aria-label="Delete transaction"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
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
