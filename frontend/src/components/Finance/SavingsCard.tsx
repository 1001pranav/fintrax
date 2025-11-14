'use client';

import React from 'react';
import { formatCurrency } from '@/constants/financeConstants';

interface SavingsGoal {
  id?: number;
  name: string;
  amount: number;
  target: number;
  rate?: number;
  category: string;
}

interface SavingsCardProps {
  savings: SavingsGoal;
  onEdit: (savings: SavingsGoal) => void;
  onDelete: (id: number) => void;
}

export default function SavingsCard({ savings, onEdit, onDelete }: SavingsCardProps) {
  // Calculate progress percentage
  const progress = savings.target > 0 ? Math.min((savings.amount / savings.target) * 100, 100) : 0;
  const progressColor = progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-blue-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-orange-500';

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl hover:bg-white/5 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        {/* Left: Icon and Details */}
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon */}
          <div className="p-3 bg-white/10 rounded-xl text-green-400 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate">
              {savings.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-green-400 text-sm font-medium">
                {formatCurrency(savings.amount)}
              </span>
              <span className="text-white/40">of</span>
              <span className="text-white/60 text-sm font-medium">
                {formatCurrency(savings.target)}
              </span>
            </div>
            {savings.rate && savings.rate > 0 && (
              <div className="mt-1">
                <span className="text-white/60 text-sm">
                  Interest Rate: <span className="text-blue-400 font-medium">{savings.rate}%</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(savings)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Edit savings goal"
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => savings.id && onDelete(savings.id)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Delete savings goal"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Progress</span>
          <span className="text-white font-semibold">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${progressColor} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress >= 100 && (
          <div className="flex items-center space-x-1 text-green-400 text-sm mt-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Goal Achieved!</span>
          </div>
        )}
      </div>
    </div>
  );
}
