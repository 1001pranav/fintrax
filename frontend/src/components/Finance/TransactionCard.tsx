'use client';

import React from 'react';
import { Transaction } from '@/lib/api';
import { formatCurrency, formatDate, TRANSACTION_TYPES } from '@/constants/financeConstants';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

// Icon mapping for transaction categories
const getCategoryIcon = (category: string, type: number) => {
  const isIncome = type === TRANSACTION_TYPES.INCOME;

  const iconMap: Record<string, React.JSX.Element> = {
    // Income icons
    salary: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    freelance: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    investment: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    // Expense icons
    food: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    transport: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    bills: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    entertainment: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    shopping: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    other: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  };

  return iconMap[category.toLowerCase()] || iconMap.other;
};

export default function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const isIncome = transaction.type === TRANSACTION_TYPES.INCOME;
  const amountColor = isIncome ? 'text-green-400' : 'text-red-400';
  const iconColor = isIncome ? 'text-green-400' : 'text-red-400';
  const bgGradient = isIncome
    ? 'from-green-500/10 to-green-600/5'
    : 'from-red-500/10 to-red-600/5';

  return (
    <div className={`bg-gradient-to-br ${bgGradient} border border-gray-200 dark:border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-white/5 active:bg-gray-100 dark:active:bg-white/10 transition-all duration-200 group touch-manipulation shadow-sm`}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
        {/* Top/Left: Icon and Details */}
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1 w-full sm:w-auto">
          {/* Icon */}
          <div className={`p-2.5 sm:p-3 bg-gray-100 dark:bg-white/10 rounded-xl ${iconColor} flex-shrink-0`}>
            {getCategoryIcon(transaction.category || 'other', transaction.type)}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg truncate">
              {transaction.source}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
              <span className="text-gray-600 dark:text-white/60 text-xs sm:text-sm capitalize">
                {transaction.category}
              </span>
              <span className="text-gray-400 dark:text-white/40 hidden sm:inline">•</span>
              <span className="text-gray-600 dark:text-white/60 text-xs sm:text-sm">
                {formatDate(transaction.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom/Right: Amount and Actions */}
        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 w-full sm:w-auto sm:ml-4">
          {/* Amount */}
          <div className={`font-bold text-lg sm:text-xl ${amountColor}`}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </div>

          {/* Action Buttons - Always visible on mobile, hover on desktop */}
          <div className="flex items-center space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(transaction)}
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:p-2 p-2.5 hover:bg-gray-200 dark:hover:bg-white/10 active:bg-gray-300 dark:active:bg-white/20 rounded-lg transition-colors duration-200 touch-manipulation"
              aria-label="Edit transaction"
            >
              <svg className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(transaction.id)}
              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:p-2 p-2.5 hover:bg-gray-200 dark:hover:bg-white/10 active:bg-gray-300 dark:active:bg-white/20 rounded-lg transition-colors duration-200 touch-manipulation"
              aria-label="Delete transaction"
            >
              <svg className="w-5 h-5 sm:w-4 sm:h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
