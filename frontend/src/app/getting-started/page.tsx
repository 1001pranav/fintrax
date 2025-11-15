'use client';

import { CheckCircle2, ArrowRight, Rocket } from 'lucide-react';
import Link from 'next/link';

interface Step {
  number: number;
  title: string;
  description: string;
  details: string[];
  icon: string;
  cta?: {
    text: string;
    link: string;
  };
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Create Your Account',
    description: 'Get started in less than a minute',
    details: [
      'Click "Sign Up" or "Get Started Free"',
      'Enter your email, username, and password',
      'Verify your email with the OTP code',
      'You\'re all set!',
    ],
    icon: '👤',
    cta: {
      text: 'Sign Up Now',
      link: '/register',
    },
  },
  {
    number: 2,
    title: 'Create Your First Project',
    description: 'Organize your work with projects',
    details: [
      'Click "Projects" in the sidebar',
      'Click "New Project" button',
      'Give it a descriptive name (e.g., "Website Launch")',
      'Choose a color to identify it',
      'Add a brief description',
      'Click "Create"',
    ],
    icon: '📁',
  },
  {
    number: 3,
    title: 'Add Your First Task',
    description: 'Break down your project into actionable items',
    details: [
      'Open your project',
      'Click "Add Task" or the "+" button',
      'Enter a clear task title (e.g., "Design homepage mockup")',
      'Set priority (High, Medium, or Low)',
      'Choose status (To Do, In Progress, or Done)',
      'Set start and end dates',
      'Add tags for categorization',
      'Save your task',
    ],
    icon: '✅',
  },
  {
    number: 4,
    title: 'Track Your First Transaction',
    description: 'Start managing your finances',
    details: [
      'Navigate to "Finance" from the sidebar',
      'Click "Add Transaction"',
      'Select type (Income or Expense)',
      'Enter the source/description',
      'Enter the amount',
      'Select a category',
      'Choose the date',
      'Save the transaction',
    ],
    icon: '💰',
  },
  {
    number: 5,
    title: 'Set a Savings Goal',
    description: 'Track progress toward your financial targets',
    details: [
      'Stay on the Finance page',
      'Scroll to the Savings section',
      'Click "Add Saving"',
      'Enter a goal name (e.g., "Emergency Fund")',
      'Set your current saved amount',
      'Add interest rate if applicable',
      'Watch your progress grow!',
    ],
    icon: '🎯',
  },
  {
    number: 6,
    title: 'Explore Your Dashboard',
    description: 'View insights and track progress',
    details: [
      'Click "Dashboard" in the sidebar',
      'See your financial overview (balance, net worth, savings)',
      'View task and project statistics',
      'Explore beautiful charts and visualizations',
      'Identify spending patterns',
      'Track your productivity',
    ],
    icon: '📊',
  },
];

const quickTips = [
  'Use keyboard shortcuts for faster navigation (press Ctrl/Cmd + / to see all shortcuts)',
  'Tag your tasks for easy filtering across projects',
  'Export your data regularly as a backup',
  'Use the Kanban board view to visualize your workflow',
  'Set realistic deadlines and update them as needed',
  'Review your financial analytics weekly to stay on track',
];

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Rocket className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Getting Started with Fintrax</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Follow these simple steps to set up your account and start managing your projects and finances like a pro
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  {/* Step Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{step.icon}</span>
                      <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>

                    {/* Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    {step.cta && (
                      <Link
                        href={step.cta.link}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                      >
                        {step.cta.text}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Connector */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-purple-300 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            💡 Quick Tips
          </h3>
          <ul className="space-y-3">
            {quickTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to dive deeper?</h3>
          <p className="text-gray-600 mb-6">
            Explore our comprehensive documentation to learn about advanced features
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/help"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all"
            >
              View Full Documentation
            </Link>
            <Link
              href="/faq"
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Browse FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
