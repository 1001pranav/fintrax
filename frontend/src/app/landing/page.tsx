import type { Metadata } from 'next';
import HeroSection from '@/components/Marketing/HeroSection';
import FeaturesSection from '@/components/Marketing/FeaturesSection';
import HowItWorksSection from '@/components/Marketing/HowItWorksSection';
import CTASection from '@/components/Marketing/CTASection';
import Footer from '@/components/Marketing/Footer';

export const metadata: Metadata = {
  title: 'Fintrax - Manage Your Finances and Projects in One Place',
  description: 'Fintrax is your all-in-one solution for task management, finance tracking, budgeting, goal setting, and more. Start free today!',
  keywords: 'finance tracker, budget app, task management, project management, personal finance, expense tracker',
  openGraph: {
    title: 'Fintrax - Manage Your Finances and Projects in One Place',
    description: 'All-in-one platform for financial management and project tracking',
    type: 'website',
  },
};

export default function LandingPage() {
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
