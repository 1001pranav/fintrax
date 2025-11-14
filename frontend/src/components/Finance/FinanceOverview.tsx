'use client';

import { useFinanceStore } from '@/lib/financeStore';
import SVGComponent from '../svg';

export default function FinanceOverview() {
    const { balance, netWorth, financialData } = useFinanceStore();

    const stats = [
        {
            label: 'Balance',
            value: balance,
            icon: (
                <SVGComponent svgType={"wallet_logo"} />
            ),
            color: 'text-blue-400',
            format: 'currency'
        },
        {
            label: 'Net Worth',
            value: netWorth,
            icon: (
                <SVGComponent svgType={"chart_logo"} />
            ),
            color: 'text-green-400',
            format: 'currency'
        },
        {
            label: 'Total Income',
            value: financialData.income.total,
            icon: (
                <SVGComponent svgType={"income_logo"} />
            ),
            color: 'text-emerald-400',
            format: 'currency'
        },
        {
            label: 'Total Expenses',
            value: financialData.expenses.total,
            icon: (
                <SVGComponent svgType={"expense_logo"} />
            ),
            color: 'text-red-400',
            format: 'currency'
        },
        {
            label: 'Total Savings',
            value: financialData.savings.total,
            icon: (
                <SVGComponent svgType={"savings_logo"} />
            ),
            color: 'text-yellow-400',
            format: 'currency'
        },
        {
            label: 'Total Debts',
            value: financialData.debts.total,
            icon: (
                <SVGComponent svgType={"debt_logo"} />
            ),
            color: 'text-orange-400',
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
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all duration-200"
                >
                    <div className={`${stat.color} mb-4`}>
                        {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        {stat.format === 'currency' ? formatCurrency(stat.value) : stat.value}
                    </div>
                    <div className="text-white/60 text-sm">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
