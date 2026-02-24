'use client';

import { useState } from 'react';
import {
  TRANSACTION_TYPES,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/constants/financeConstants';

export interface TransactionFilters {
  type: number | null; // null = all, 1 = income, 2 = expense
  category: string;
  startDate: string;
  endDate: string;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

export default function TransactionFiltersComponent({
  filters,
  onFiltersChange,
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof TransactionFilters, value: number | string | null) => {
    const updatedFilters = { ...filters, [key]: value };

    // Reset category when type changes
    if (key === 'type') {
      updatedFilters.category = '';
    }

    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    onFiltersChange({
      type: null,
      category: '',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = filters.type !== null || filters.category || filters.startDate || filters.endDate;

  // Get available categories based on selected type
  const getAvailableCategories = () => {
    if (filters.type === TRANSACTION_TYPES.INCOME) {
      return INCOME_CATEGORIES;
    } else if (filters.type === TRANSACTION_TYPES.EXPENSE) {
      return EXPENSE_CATEGORIES;
    }
    // If 'all' is selected, show both income and expense categories
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  };

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl backdrop-blur-xl overflow-hidden">
      {/* Filter Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full min-h-[56px] flex items-center justify-between p-4 hover:bg-white/5 active:bg-white/10 transition-colors duration-200 touch-manipulation"
      >
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-white font-semibold text-sm sm:text-base">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-500/20 border border-blue-400/50 rounded-lg text-xs text-blue-300">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="min-h-[36px] px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 active:bg-red-500/20 rounded-lg transition-colors duration-200 touch-manipulation"
            >
              Clear
            </button>
          )}
          <svg
            className={`w-5 h-5 text-gray-600 dark:text-white/60 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t border-white/10">
          {/* Transaction Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateFilter('type', null)}
                className={`min-h-[44px] py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                  filters.type === null
                    ? 'bg-blue-500/20 border-2 border-blue-400 text-blue-300'
                    : 'bg-white/10 border  border-gray-300 dark:border-white/20 text-white/70 hover:bg-white/15 active:bg-white/20'
                }`}
              >
                All
              </button>
              <button
                onClick={() => updateFilter('type', TRANSACTION_TYPES.INCOME)}
                className={`min-h-[44px] py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                  filters.type === TRANSACTION_TYPES.INCOME
                    ? 'bg-green-500/20 border-2 border-green-400 text-green-300'
                    : 'bg-white/10 border  border-gray-300 dark:border-white/20 text-white/70 hover:bg-white/15 active:bg-white/20'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => updateFilter('type', TRANSACTION_TYPES.EXPENSE)}
                className={`min-h-[44px] py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                  filters.type === TRANSACTION_TYPES.EXPENSE
                    ? 'bg-red-500/20 border-2 border-red-400 text-red-300'
                    : 'bg-white/10 border  border-gray-300 dark:border-white/20 text-white/70 hover:bg-white/15 active:bg-white/20'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 bg-white/10 border  border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 hover:bg-white/15 touch-manipulation text-base"
            >
              <option value="" className="bg-gray-800">All Categories</option>
              {getAvailableCategories().map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-gray-800">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60">From</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 bg-white/10 border  border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 hover:bg-white/15 text-sm touch-manipulation"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60">To</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 bg-white/10 border  border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 hover:bg-white/15 text-sm touch-manipulation"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
