'use client';

import { useEffect } from 'react';
import BetaInviteForm from '@/components/Beta/BetaInviteForm';

export default function BetaPage() {
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && (window as any).trackPageView) {
      (window as any).trackPageView({ path: '/beta', title: 'Beta Signup' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Fintrax Beta
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The unified platform for productivity and finance management. Join our beta program to get early access and
            shape the future of Fintrax.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Management</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Organize tasks with kanban boards, roadmaps, and visual timelines
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Finance Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Track income, expenses, savings goals, and loans all in one place
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Insights & Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Visualize your progress with charts and get actionable insights
            </p>
          </div>
        </div>

        {/* Beta Form */}
        <BetaInviteForm
          onSuccess={(email) => {
            console.log('Beta signup successful:', email);
          }}
        />

        {/* Benefits Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Why Join the Beta?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Early Access</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Be among the first to use Fintrax and access new features before public release
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Shape the Product</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your feedback directly influences feature development and improvements
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Exclusive Perks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beta users get lifetime discounts and special recognition
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Community Access</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join our private Discord community and connect with other beta testers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
