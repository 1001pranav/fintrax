"use client"
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import FinanceDashboard from '@/components/Finance/FinanceDashboard';

export default function FinancePage() {
    return (
        <div className="flex h-screen bg-slate-900">
            <Sidebar />
            <div className="flex-1 overflow-hidden">
                <FinanceDashboard />
            </div>
        </div>
    );
}
