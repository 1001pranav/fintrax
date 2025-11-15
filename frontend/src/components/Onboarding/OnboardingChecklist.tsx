'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, X } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link?: string;
}

const initialChecklist: ChecklistItem[] = [
  {
    id: 'create_project',
    title: 'Create your first project',
    description: 'Organize your tasks by creating a project',
    completed: false,
    link: '/projects',
  },
  {
    id: 'create_task',
    title: 'Add a task',
    description: 'Break down your project into actionable tasks',
    completed: false,
    link: '/projects',
  },
  {
    id: 'add_transaction',
    title: 'Record a transaction',
    description: 'Start tracking your income and expenses',
    completed: false,
    link: '/finance',
  },
  {
    id: 'create_saving',
    title: 'Set a savings goal',
    description: 'Define a financial goal and track your progress',
    completed: false,
    link: '/finance',
  },
  {
    id: 'explore_dashboard',
    title: 'Explore your dashboard',
    description: 'See your productivity and financial overview',
    completed: false,
    link: '/dashboard',
  },
];

export default function OnboardingChecklist() {
  const [isVisible, setIsVisible] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    // Load checklist from localStorage
    const savedChecklist = localStorage.getItem('onboarding_checklist');
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    } else {
      setChecklist(initialChecklist);
    }

    // Check if checklist should be hidden
    const isHidden = localStorage.getItem('onboarding_checklist_hidden');
    if (isHidden === 'true') {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    // Save checklist to localStorage whenever it changes
    if (checklist.length > 0) {
      localStorage.setItem('onboarding_checklist', JSON.stringify(checklist));
    }
  }, [checklist]);

  const handleToggleItem = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding_checklist_hidden', 'true');
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = (completedCount / totalCount) * 100;
  const allCompleted = completedCount === totalCount;

  if (!isVisible) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {allCompleted ? '🎉 Welcome aboard!' : '👋 Get Started with Fintrax'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {allCompleted
              ? 'You\'ve completed all the onboarding steps! You\'re ready to go.'
              : `Complete these steps to get the most out of Fintrax (${completedCount}/${totalCount})`}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Dismiss checklist"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              item.completed
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <button
              onClick={() => handleToggleItem(item.id)}
              className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {item.completed ? (
                <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
              ) : (
                <Circle className="text-gray-400 dark:text-gray-500" size={20} />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-medium ${
                  item.completed
                    ? 'text-gray-500 dark:text-gray-400 line-through'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {item.title}
              </h4>
              <p
                className={`text-xs ${
                  item.completed
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.description}
              </p>
            </div>
            {item.link && !item.completed && (
              <a
                href={item.link}
                className="flex-shrink-0 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Go →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {allCompleted && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            Great job! You can now dismiss this checklist and continue using Fintrax.
          </p>
        </div>
      )}
    </div>
  );
}
