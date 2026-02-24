'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import AppNavbar from '@/components/Layout/AppNavbar';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, setSelectedProject } = useAppStore();

  const projectId = params.projectId as string;

  useEffect(() => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    } else {
      router.push('/');
    }
  }, [projectId, projects, setSelectedProject, router]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
      <AppNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}