'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinanceStore } from '@/lib/financeStore';
import { Transaction } from '@/lib/api';
import {
  calculateMonthlyTrends,
  calculateCategoryBreakdown,
  generateSpendingInsights,
  exportToCSV,
} from '@/utils/financeAnalytics';
import SpendingInsights from '@/components/Finance/Analytics/SpendingInsights';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function AnalyticsPage() {
  const router = useRouter();
  const { transactions, fetchTransactions, isLoading } = useFinanceStore();
  const [dateRange, setDateRange] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('6m');
  const [compareMode, setCompareMode] = useState(false);
  const [compareRange, setCompareRange] = useState<'previous' | 'year'>('previous');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter transactions based on date range
  const getFilteredTransactions = (range: typeof dateRange): Transaction[] => {
    const now = moment();
    return transactions.filter((t) => {
      const date = moment(t.date);
      switch (range) {
        case '1m':
          return date.isAfter(now.clone().subtract(1, 'month'));
        case '3m':
          return date.isAfter(now.clone().subtract(3, 'months'));
        case '6m':
          return date.isAfter(now.clone().subtract(6, 'months'));
        case '1y':
          return date.isAfter(now.clone().subtract(1, 'year'));
        case 'all':
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions(dateRange);
  const insights = generateSpendingInsights(filteredTransactions);

  // Calculate monthly trends
  const getMonthsCount = () => {
    switch (dateRange) {
      case '1m': return 1;
      case '3m': return 3;
      case '6m': return 6;
      case '1y': return 12;
      case 'all': return 24;
    }
  };

  const monthlyTrends = calculateMonthlyTrends(filteredTransactions, getMonthsCount());

  // Calculate category breakdowns
  const expenseCategories = calculateCategoryBreakdown(filteredTransactions, 2);
  const incomeCategories = calculateCategoryBreakdown(filteredTransactions, 1);

  // Summary statistics
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 1)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === 2)
    .reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const handleExport = () => {
    exportToCSV(filteredTransactions, `transactions_${dateRange}_${moment().format('YYYY-MM-DD')}.csv`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/finance')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Finance
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Analytics</h1>
              <p className="text-gray-600 mt-1">Analyze your spending patterns and trends</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
            {(['1m', '3m', '6m', '1y', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range === '1m' && 'Last Month'}
                {range === '3m' && 'Last 3 Months'}
                {range === '6m' && 'Last 6 Months'}
                {range === '1y' && 'Last Year'}
                {range === 'all' && 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Net Savings</p>
            <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ₹{netSavings.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Savings Rate</p>
            <p className={`text-2xl font-bold ${savingsRate >= 20 ? 'text-green-600' : 'text-yellow-600'}`}>
              {savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trend Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expense Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
                <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} name="Net" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage.toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Expense Categories Bar Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Expense Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseCategories.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Income Categories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Sources</h3>
            {incomeCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No income transactions found
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <SpendingInsights insights={insights} />
      </div>
    </div>
  );
}
