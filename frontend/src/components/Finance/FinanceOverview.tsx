'use client';

import { useFinanceStore } from '@/lib/financeStore';
import SVGComponent from '../svg';

export default function FinanceOverview() {
    const { balance, netWorth, financialData } = useFinanceStore();

    const stats = [
        {
            label: 'Balance',
            value: balance,
            icon: 'wallet_logo',
            iconColor: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
            format: 'currency'
        },
        {
            label: 'Net Worth',
            value: netWorth,
            icon: 'chart_logo',
            iconColor: 'text-green-400',
            bgColor: 'bg-green-500/20',
            format: 'currency'
        },
        {
            label: 'Total Income',
            value: financialData.income.total,
            icon: 'income_logo',
            iconColor: 'text-emerald-400',
            bgColor: 'bg-emerald-500/20',
            format: 'currency'
        },
        {
            label: 'Total Expenses',
            value: financialData.expenses.total,
            icon: 'expense_logo',
            iconColor: 'text-red-400',
            bgColor: 'bg-red-500/20',
            format: 'currency'
        },
        {
            label: 'Total Savings',
            value: financialData.savings.total,
            icon: 'savings_logo',
            iconColor: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20',
            format: 'currency'
        },
        {
            label: 'Total Debts',
            value: financialData.debts.total,
            icon: 'debt_logo',
            iconColor: 'text-orange-400',
            bgColor: 'bg-orange-500/20',
            format: 'currency'
        }
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 dark:text-white/60 text-sm">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stat.format === 'currency' ? formatCurrency(stat.value) : stat.value}
                            </p>
                        </div>
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                            <SVGComponent svgType={stat.icon as any} className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
