"use client"
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import ProjectModal from '@/components/Project/ProjectModelComponent';
import HeroSection from '@/components/Marketing/HeroSection';
import FeaturesSection from '@/components/Marketing/FeaturesSection';
import HowItWorksSection from '@/components/Marketing/HowItWorksSection';
import CTASection from '@/components/Marketing/CTASection';
import Footer from '@/components/Marketing/Footer';

export default function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Check if user is authenticated
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setIsAuthenticated(!!token);
    }, []);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // Show app interface if authenticated
    if (isAuthenticated) {
        return (
            <div className="flex h-screen bg-slate-900">
                <Sidebar />
                <MainContent />
                <ProjectModal />
            </div>
        );
    }

    // Show landing page if not authenticated
    return (
        <main className="min-h-screen">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection />
            <Footer />
        </main>
    );
}