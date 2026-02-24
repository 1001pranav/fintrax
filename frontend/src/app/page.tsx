"use client"
import { useEffect, useState } from 'react';
import AppNavbar from '@/components/Layout/AppNavbar';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import ProjectModal from '@/components/Project/ProjectModelComponent';
import Navbar from '@/components/Marketing/Navbar';
import HeroSection from '@/components/Marketing/HeroSection';
import FeaturesSection from '@/components/Marketing/FeaturesSection';
import HowItWorksSection from '@/components/Marketing/HowItWorksSection';
import AboutSection from '@/components/Marketing/AboutSection';
import ContactSection from '@/components/Marketing/ContactSection';
import CTASection from '@/components/Marketing/CTASection';
import Footer from '@/components/Marketing/Footer';
import { useAppStore } from '@/lib/store';
import KeyboardShortcutsProvider from '@/components/KeyboardShortcuts/KeyboardShortcutsProvider';

export default function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const fetchProjects = useAppStore((state) => state.fetchProjects);

    useEffect(() => {
        // Check if user is authenticated
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setIsAuthenticated(!!token);

        // Fetch projects if authenticated
        if (token) {
            fetchProjects();
        }
    }, [fetchProjects]);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-gray-900 dark:text-white">Loading...</div>
            </div>
        );
    }

    // Show app interface if authenticated
    if (isAuthenticated) {
        return (
            <KeyboardShortcutsProvider>
                <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
                    <AppNavbar />
                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar />
                        <MainContent />
                    </div>
                    <ProjectModal />
                </div>
            </KeyboardShortcutsProvider>
        );
    }

    // Show landing page if not authenticated
    return (
        <main className="min-h-screen">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <AboutSection />
            <ContactSection />
            <CTASection />
            <Footer />
        </main>
    );
}