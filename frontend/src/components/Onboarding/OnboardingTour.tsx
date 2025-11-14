'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Fintrax! 🎉',
    description: 'Fintrax is your all-in-one platform for managing tasks, projects, and finances. Let\'s take a quick tour!',
    position: 'center',
  },
  {
    title: 'Dashboard',
    description: 'Your dashboard gives you a quick overview of your tasks, projects, and financial health.',
    target: 'dashboard',
    position: 'center',
  },
  {
    title: 'Projects & Tasks',
    description: 'Organize your work with projects and break them down into manageable tasks. Use the kanban board to track progress.',
    target: 'projects',
    position: 'right',
  },
  {
    title: 'Finance Management',
    description: 'Track your income, expenses, savings, and loans all in one place. Get insights into your spending patterns.',
    target: 'finance',
    position: 'right',
  },
  {
    title: 'Roadmaps',
    description: 'Create learning paths and project roadmaps to visualize your long-term goals and progress.',
    target: 'roadmaps',
    position: 'right',
  },
  {
    title: 'You\'re all set!',
    description: 'Start by creating your first project or adding a transaction. Need help? Check out the help section anytime.',
    position: 'center',
  },
];

export default function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding_completed', 'true');
    onComplete();
  };

  if (!isVisible) return null;

  const isCenterPosition = currentStepData.position === 'center';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" />

      {/* Onboarding Card */}
      <div
        className={`fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md ${
          isCenterPosition
            ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            : 'top-20 left-1/2 transform -translate-x-1/2'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Skip tour"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center justify-center mb-6 gap-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-blue-600'
                  : index < currentStep
                  ? 'w-2 bg-blue-400'
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isLastStep && (
              <button
                onClick={handleSkip}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
              >
                Skip Tour
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>

        {/* Step Counter */}
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep + 1} of {onboardingSteps.length}
        </div>
      </div>
    </>
  );
}
