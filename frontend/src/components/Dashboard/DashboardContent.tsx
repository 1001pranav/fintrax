'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useFinanceStore } from '@/lib/financeStore';
import WelcomeHero from '../Dashboard/WelcomeHero';
import ProjectStats from '../Dashboard/ProjectStats';
import RecentTasks from '../Dashboard/RecentTasks';
import DashboardCharts from '../Dashboard/DashboardCharts';

export default function DashboardContent() {
  const { selectedProject } = useAppStore();
  const { fetchFinanceSummary, isLoading } = useFinanceStore();

  // Fetch dashboard data on mount
  useEffect(() => {
    // Only fetch if no project is selected (showing main dashboard)
    if (!selectedProject) {
      fetchFinanceSummary();
    }
  }, [selectedProject, fetchFinanceSummary]);

  // Show dashboard when no project is selected
  if (selectedProject) return null;

  return (
    <div className="h-full p-6 overflow-y-auto">
      <WelcomeHero />
      <ProjectStats />

      {/* Financial Charts Section (US-2.5) */}
      <div className="mt-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-white/60">Loading financial data...</p>
            </div>
          </div>
        )}
        {!isLoading && <DashboardCharts />}
      </div>

      <RecentTasks />
    </div>
  );
}