'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '@/lib/financeStore';
import FinanceOverview from './FinanceOverview';

export default function FinanceDashboard() {
    const { fetchFinanceSummary, isLoading, error } = useFinanceStore();

    useEffect(() => {
        // Fetch finance data on component mount
        fetchFinanceSummary();
    }, [fetchFinanceSummary]);

    return (
        <div className="h-full p-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Financial Dashboard
                </h1>
                <p className="text-gray-600 dark:text-white/60">
                    Track your income, expenses, savings, and debts at a glance
                </p>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                        <p className="text-gray-600 dark:text-white/60">Loading financial data...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
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

            {/* Finance Overview - Only show when not loading */}
            {!isLoading && !error && (
                <>
                    <FinanceOverview />

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-4 backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 text-left group">
                                <div className="text-blue-400 mb-2">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-medium group-hover:text-blue-400 transition-colors">
                                    Add Transaction
                                </h3>
                                <p className="text-gray-600 dark:text-white/60 text-sm mt-1">
                                    Record income or expense
                                </p>
                            </button>

                            <button className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-4 backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 text-left group">
                                <div className="text-green-400 mb-2">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-medium group-hover:text-green-400 transition-colors">
                                    Add Savings Goal
                                </h3>
                                <p className="text-gray-600 dark:text-white/60 text-sm mt-1">
                                    Set a new financial goal
                                </p>
                            </button>

                            <button className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-4 backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 text-left group">
                                <div className="text-orange-400 mb-2">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-medium group-hover:text-orange-400 transition-colors">
                                    Track Loan
                                </h3>
                                <p className="text-gray-600 dark:text-white/60 text-sm mt-1">
                                    Add or manage loans
                                </p>
                            </button>

                            <button className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-4 backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 text-left group">
                                <div className="text-purple-400 mb-2">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-medium group-hover:text-purple-400 transition-colors">
                                    View Reports
                                </h3>
                                <p className="text-gray-600 dark:text-white/60 text-sm mt-1">
                                    Analyze spending patterns
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Coming Soon Section */}
                    <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Coming Soon</h2>
                        <p className="text-gray-600 dark:text-white/60 mb-4">
                            We're working on bringing you more detailed financial insights:
                        </p>
                        <ul className="space-y-2 text-gray-700 dark:text-white/80">
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-400 mt-0.5">•</span>
                                <span>Transaction history with filters</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-purple-400 mt-0.5">•</span>
                                <span>Detailed savings goals tracking</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span>Loan repayment schedules</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-yellow-400 mt-0.5">•</span>
                                <span>Visual charts and analytics</span>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
