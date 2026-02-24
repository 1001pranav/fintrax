'use client';

import React from 'react';
import { formatCurrency } from '@/constants/financeConstants';

interface LoanItem {
  id?: number;
  name: string;
  total_amount: number;
  rate?: number;
  term?: number;
  duration?: number;
  premium_amount?: number;
}

interface LoanCardProps {
  loan: LoanItem;
  onEdit: (loan: LoanItem) => void;
  onDelete: (id: number) => void;
}

export default function LoanCard({ loan, onEdit, onDelete }: LoanCardProps) {
  // Calculate remaining balance (for now, showing total amount - can be enhanced later)
  const remainingBalance = loan.total_amount;

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-red-600/5 border  border-gray-200 dark:border-white/10 rounded-2xl p-5 backdrop-blur-xl hover:bg-white/5 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        {/* Left: Icon and Details */}
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon */}
          <div className="p-3 bg-white/10 rounded-xl text-orange-400 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate">
              {loan.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-orange-400 text-sm font-medium">
                {formatCurrency(remainingBalance)}
              </span>
              <span className="text-white/40">outstanding</span>
            </div>

            {/* Additional Info */}
            <div className="mt-2 space-y-1">
              {loan.rate && loan.rate > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 text-sm">Interest Rate:</span>
                  <span className="text-blue-400 text-sm font-medium">{loan.rate}%</span>
                </div>
              )}
              {loan.premium_amount && loan.premium_amount > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 text-sm">Payment:</span>
                  <span className="text-white text-sm font-medium">{formatCurrency(loan.premium_amount)}</span>
                  {loan.term && <span className="text-white/40 text-sm">/ {getTermLabel(loan.term)}</span>}
                </div>
              )}
              {loan.duration && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 text-sm">Duration:</span>
                  <span className="text-white text-sm font-medium">{loan.duration} months</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(loan)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Edit loan"
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => loan.id && onDelete(loan.id)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Delete loan"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span className="text-white/60 text-sm">Active Loan</span>
        </div>
        {loan.total_amount > 0 && (
          <span className="text-white/40 text-xs">
            Total: {formatCurrency(loan.total_amount)}
          </span>
        )}
      </div>
    </div>
  );
}

// Helper function to get term label
function getTermLabel(term: number): string {
  const termLabels: Record<number, string> = {
    1: 'monthly',
    2: 'quarterly',
    3: 'semi-annually',
    4: 'annually',
  };
  return termLabels[term] || 'period';
}
