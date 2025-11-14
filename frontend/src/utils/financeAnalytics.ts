import { Transaction } from '@/lib/api';
import moment from 'moment';

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface SpendingInsight {
  type: 'info' | 'warning' | 'success';
  title: string;
  description: string;
}

export function calculateMonthlyTrends(transactions: Transaction[], months: number = 6): MonthlyTrend[] {
  const monthsData: { [key: string]: { income: number; expense: number } } = {};

  // Initialize last N months
  for (let i = months - 1; i >= 0; i--) {
    const monthKey = moment().subtract(i, 'months').format('MMM YYYY');
    monthsData[monthKey] = { income: 0, expense: 0 };
  }

  // Aggregate transactions by month
  transactions.forEach((transaction) => {
    const monthKey = moment(transaction.date).format('MMM YYYY');
    if (monthsData[monthKey] !== undefined) {
      if (transaction.type === 1) {
        monthsData[monthKey].income += transaction.amount;
      } else if (transaction.type === 2) {
        monthsData[monthKey].expense += transaction.amount;
      }
    }
  });

  // Convert to array format
  return Object.entries(monthsData).map(([month, data]) => ({
    month,
    income: data.income,
    expense: data.expense,
    net: data.income - data.expense,
  }));
}

export function calculateCategoryBreakdown(transactions: Transaction[], type: 1 | 2): CategoryBreakdown[] {
  const categoryData: { [key: string]: { amount: number; count: number } } = {};

  // Filter and aggregate by category
  transactions
    .filter((t) => t.type === type)
    .forEach((transaction) => {
      const category = transaction.category || 'Uncategorized';
      if (!categoryData[category]) {
        categoryData[category] = { amount: 0, count: 0 };
      }
      categoryData[category].amount += transaction.amount;
      categoryData[category].count += 1;
    });

  // Calculate totals
  const total = Object.values(categoryData).reduce((sum, cat) => sum + cat.amount, 0);

  // Convert to array and calculate percentages
  return Object.entries(categoryData)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function generateSpendingInsights(transactions: Transaction[]): SpendingInsight[] {
  const insights: SpendingInsight[] = [];

  // Calculate averages
  const expenses = transactions.filter((t) => t.type === 2);
  const income = transactions.filter((t) => t.type === 1);

  if (expenses.length === 0 && income.length === 0) {
    return insights;
  }

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const avgExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

  // Insight 1: Spending vs Income
  if (totalExpense > totalIncome * 0.9) {
    insights.push({
      type: 'warning',
      title: 'High Spending Alert',
      description: `You're spending ${Math.round((totalExpense / totalIncome) * 100)}% of your income. Consider reducing expenses.`,
    });
  } else if (totalExpense < totalIncome * 0.7) {
    insights.push({
      type: 'success',
      title: 'Great Savings!',
      description: `You're saving ${Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}% of your income. Keep it up!`,
    });
  }

  // Insight 2: Top Spending Category
  const categoryBreakdown = calculateCategoryBreakdown(transactions, 2);
  if (categoryBreakdown.length > 0) {
    const topCategory = categoryBreakdown[0];
    if (topCategory.percentage > 40) {
      insights.push({
        type: 'warning',
        title: `High ${topCategory.category} Spending`,
        description: `${topCategory.category} accounts for ${Math.round(topCategory.percentage)}% of your expenses.`,
      });
    } else {
      insights.push({
        type: 'info',
        title: 'Top Expense Category',
        description: `Your biggest expense is ${topCategory.category} at ${Math.round(topCategory.percentage)}% of total spending.`,
      });
    }
  }

  // Insight 3: Weekend vs Weekday Spending
  const weekendExpenses = expenses.filter((t) => {
    const day = moment(t.date).day();
    return day === 0 || day === 6;
  });
  const weekdayExpenses = expenses.filter((t) => {
    const day = moment(t.date).day();
    return day !== 0 && day !== 6;
  });

  const weekendAvg = weekendExpenses.length > 0
    ? weekendExpenses.reduce((sum, t) => sum + t.amount, 0) / weekendExpenses.length
    : 0;
  const weekdayAvg = weekdayExpenses.length > 0
    ? weekdayExpenses.reduce((sum, t) => sum + t.amount, 0) / weekdayExpenses.length
    : 0;

  if (weekendAvg > weekdayAvg * 1.3 && weekendExpenses.length > 0) {
    insights.push({
      type: 'info',
      title: 'Weekend Spending Pattern',
      description: `You spend ${Math.round(((weekendAvg - weekdayAvg) / weekdayAvg) * 100)}% more on weekends.`,
    });
  }

  // Insight 4: Transaction Frequency
  const recentMonth = transactions.filter((t) =>
    moment(t.date).isAfter(moment().subtract(30, 'days'))
  );
  const avgPerDay = recentMonth.length / 30;

  if (avgPerDay > 3) {
    insights.push({
      type: 'info',
      title: 'High Transaction Frequency',
      description: `You're making an average of ${avgPerDay.toFixed(1)} transactions per day.`,
    });
  }

  // Insight 5: Month-over-Month Comparison
  const thisMonth = expenses.filter((t) =>
    moment(t.date).isSame(moment(), 'month')
  );
  const lastMonth = expenses.filter((t) =>
    moment(t.date).isSame(moment().subtract(1, 'month'), 'month')
  );

  const thisMonthTotal = thisMonth.reduce((sum, t) => sum + t.amount, 0);
  const lastMonthTotal = lastMonth.reduce((sum, t) => sum + t.amount, 0);

  if (lastMonthTotal > 0) {
    const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    if (Math.abs(change) > 20) {
      insights.push({
        type: change > 0 ? 'warning' : 'success',
        title: 'Monthly Spending Change',
        description: `Your spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to last month.`,
      });
    }
  }

  return insights;
}

export function exportToCSV(transactions: Transaction[], filename: string = 'transactions.csv') {
  const headers = ['Date', 'Source', 'Category', 'Type', 'Amount', 'Status'];
  const rows = transactions.map((t) => [
    moment(t.date).format('YYYY-MM-DD'),
    t.source,
    t.category || 'N/A',
    t.type === 1 ? 'Income' : 'Expense',
    t.amount.toFixed(2),
    t.status === 1 ? 'Active' : 'Deleted',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
