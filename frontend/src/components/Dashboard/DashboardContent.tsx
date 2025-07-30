'use client';

import { useAppStore } from '@/lib/store';
import WelcomeHero from '../Dashboard/WelcomeHero';
import ProjectStats from '../Dashboard/ProjectStats';
import RecentTasks from '../Dashboard/RecentTasks';

export default function DashboardContent() {
  const { selectedProject } = useAppStore();

  // Show dashboard when no project is selected
  if (selectedProject) return null;

  return (
    <div className="h-full p-6 overflow-y-auto">
      <WelcomeHero />
      <ProjectStats />
      <RecentTasks />
    </div>
  );
}