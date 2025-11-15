'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'Is Fintrax really free?',
    answer: 'Yes! Fintrax offers a free forever plan with all core features. You can manage unlimited projects, tasks, and financial transactions at no cost. No credit card required.',
  },
  {
    category: 'Getting Started',
    question: 'How do I create an account?',
    answer: 'Click the "Get Started Free" or "Sign Up" button, enter your email, username, and password. Verify your email with the OTP code we send you, and you\'re ready to go!',
  },
  {
    category: 'Getting Started',
    question: 'Do I need to download anything?',
    answer: 'No! Fintrax is a web-based application that works in any modern browser. Just visit the site, log in, and start using it. No downloads or installations required.',
  },
  {
    category: 'Getting Started',
    question: 'Can I use Fintrax on mobile?',
    answer: 'Absolutely! Fintrax is fully responsive and works great on smartphones and tablets. Simply access it through your mobile browser.',
  },

  // Projects & Tasks
  {
    category: 'Projects & Tasks',
    question: 'What\'s the difference between projects and tasks?',
    answer: 'Projects are containers that group related tasks together. For example, a "Website Redesign" project might contain tasks like "Design mockups," "Write copy," and "Build frontend." Tasks are the individual action items you need to complete.',
  },
  {
    category: 'Projects & Tasks',
    question: 'Can a task belong to multiple projects?',
    answer: 'Currently, each task can only belong to one project. However, you can use tags to categorize tasks across multiple themes or areas.',
  },
  {
    category: 'Projects & Tasks',
    question: 'How do I organize tasks by priority?',
    answer: 'When creating or editing a task, set the priority level to Low, Medium, or High. You can then filter your task views by priority to focus on what\'s most important.',
  },
  {
    category: 'Projects & Tasks',
    question: 'Can I set recurring tasks?',
    answer: 'Recurring tasks are planned for a future update. For now, you can manually create new instances of tasks that repeat.',
  },
  {
    category: 'Projects & Tasks',
    question: 'What are tags and how do I use them?',
    answer: 'Tags are labels you can assign to tasks for categorization. For example, use @quick for tasks under 15 minutes, or #bug-fix for development tasks. Create custom tags with colors to organize tasks your way.',
  },

  // Finance
  {
    category: 'Finance',
    question: 'Is my financial data secure?',
    answer: 'Yes! Your data is encrypted in transit and at rest. We never share your financial information with third parties. You can also export your data anytime for backup.',
  },
  {
    category: 'Finance',
    question: 'Can Fintrax connect to my bank account?',
    answer: 'Currently, Fintrax requires manual entry of transactions. Automatic bank connections are on our roadmap for future updates.',
  },
  {
    category: 'Finance',
    question: 'How do I categorize transactions?',
    answer: 'When adding a transaction, select a category from the dropdown (e.g., Food, Transport, Salary). This helps with analytics and understanding spending patterns.',
  },
  {
    category: 'Finance',
    question: 'Can I track multiple currencies?',
    answer: 'Multi-currency support is planned for a future release. Currently, all amounts are tracked in your default currency.',
  },
  {
    category: 'Finance',
    question: 'How is net worth calculated?',
    answer: 'Net worth = (Balance + Total Savings) - (Total Debts + Total Loans). It represents your total assets minus liabilities.',
  },
  {
    category: 'Finance',
    question: 'Can I set budget limits for categories?',
    answer: 'Budget alerts and limits are coming in a future update. For now, use the expense analytics to monitor spending patterns.',
  },

  // Roadmaps
  {
    category: 'Roadmaps',
    question: 'What are roadmaps used for?',
    answer: 'Roadmaps help you plan long-term goals with timeline visualization. Use them for learning paths (e.g., "Learn Web Development"), career planning, or multi-phase projects.',
  },
  {
    category: 'Roadmaps',
    question: 'Can I link tasks to a roadmap?',
    answer: 'Yes! When creating a task, you can assign it to a roadmap. The task will then appear on the roadmap\'s timeline view.',
  },
  {
    category: 'Roadmaps',
    question: 'How do I set milestones?',
    answer: 'Milestones can be set using tasks with specific dates on your roadmap. Mark key achievements as high-priority tasks to highlight them.',
  },

  // Data & Privacy
  {
    category: 'Data & Privacy',
    question: 'Can I export my data?',
    answer: 'Yes! Go to Settings → Data Management to export all your data as a JSON file. You can also export individual data types as CSV files.',
  },
  {
    category: 'Data & Privacy',
    question: 'Can I import data from other apps?',
    answer: 'You can import data from a Fintrax backup (JSON format). Importing from other apps like Notion, Todoist, or Excel is planned for future updates.',
  },
  {
    category: 'Data & Privacy',
    question: 'What happens if I delete my account?',
    answer: 'All your data will be permanently deleted. We recommend exporting your data before deleting your account. Account deletion cannot be undone.',
  },
  {
    category: 'Data & Privacy',
    question: 'Do you sell my data?',
    answer: 'Never. We do not sell, share, or monetize your personal data. Your privacy is our top priority.',
  },

  // Account & Settings
  {
    category: 'Account & Settings',
    question: 'How do I change my password?',
    answer: 'Go to Settings → Account Security, click "Change Password," enter your current password and new password, then save.',
  },
  {
    category: 'Account & Settings',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you an OTP code to reset your password.',
  },
  {
    category: 'Account & Settings',
    question: 'Can I change my email address?',
    answer: 'Yes, go to Settings → Profile to update your email address. You\'ll need to verify the new email with an OTP code.',
  },
  {
    category: 'Account & Settings',
    question: 'Is two-factor authentication available?',
    answer: '2FA is coming soon! We\'re working on adding this important security feature in an upcoming update.',
  },

  // Technical
  {
    category: 'Technical',
    question: 'Which browsers are supported?',
    answer: 'Fintrax works best on Chrome, Firefox, Safari, and Edge (latest versions). We recommend keeping your browser up to date for the best experience.',
  },
  {
    category: 'Technical',
    question: 'Why is the page loading slowly?',
    answer: 'Check your internet connection first. If the issue persists, try clearing your browser cache or using a different browser. Contact support if problems continue.',
  },
  {
    category: 'Technical',
    question: 'Can I use Fintrax offline?',
    answer: 'Currently, Fintrax requires an internet connection. Offline mode is on our roadmap for future development.',
  },
  {
    category: 'Technical',
    question: 'I found a bug. How do I report it?',
    answer: 'We appreciate bug reports! Contact us through the feedback form in Settings → Feedback, or email support with details about the issue.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map((item) => item.category)))];

  const filteredFAQs = selectedCategory === 'All'
    ? faqData
    : faqData.filter((item) => item.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about Fintrax
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <div className="flex-1">
                  <span className="text-xs font-medium text-purple-600 mb-1 block">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Check out our comprehensive help documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/help"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all"
              >
                View Help Docs
              </Link>
              <Link
                href="/settings"
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
