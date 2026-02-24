"use client"
import { useEffect } from 'react';
import AppNavbar from '@/components/Layout/AppNavbar';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import ProjectModal from '@/components/Project/ProjectModelComponent';
import { useAppStore } from '@/lib/store';

export default function ProjectPage() {
    const fetchProjects = useAppStore((state) => state.fetchProjects);

    useEffect(() => {
        // Fetch projects when page loads
        fetchProjects();
    }, [fetchProjects]);

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
            <AppNavbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <MainContent />
            </div>
            <ProjectModal />
        </div>
    );
}