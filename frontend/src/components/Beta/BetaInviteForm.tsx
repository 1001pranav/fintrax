'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface BetaInviteFormProps {
  onSuccess?: (email: string) => void;
}

export default function BetaInviteForm({ onSuccess }: BetaInviteFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // In production, this would call the backend API
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store in localStorage for demo purposes
      const betaSignups = JSON.parse(localStorage.getItem('beta_signups') || '[]');
      betaSignups.push({
        email: email.trim(),
        name: name.trim(),
        useCase: useCase.trim(),
        timestamp: new Date().toISOString(),
        status: 'pending',
      });
      localStorage.setItem('beta_signups', JSON.stringify(betaSignups));

      // In production, call API:
      // const response = await fetch('/api/beta/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, name, useCase }),
      // });

      setSubmitted(true);
      if (onSuccess) {
        onSuccess(email);
      }

      // Track event
      if (typeof window !== 'undefined' && (window as any).trackEvent) {
        (window as any).trackEvent('beta_signup', { email });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            You're on the list! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thanks for signing up for the Fintrax beta. We'll send you an invite to{' '}
            <strong className="text-gray-900 dark:text-white">{email}</strong> soon.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200">
            <p className="font-medium mb-1">What's next?</p>
            <ul className="text-left space-y-1">
              <li>• Check your email for the beta invite</li>
              <li>• Join our community Discord (link in email)</li>
              <li>• Get early access to new features</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Join the Fintrax Beta
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get early access to the all-in-one productivity and finance platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="beta-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="beta-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="beta-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="beta-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Use Case Field */}
          <div>
            <label htmlFor="beta-usecase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What will you use Fintrax for? (Optional)
            </label>
            <select
              id="beta-usecase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting}
            >
              <option value="">Select an option</option>
              <option value="personal">Personal productivity & finance</option>
              <option value="freelance">Freelance project tracking</option>
              <option value="student">Student learning & budgeting</option>
              <option value="business">Small business management</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              <>
                <Mail size={20} />
                Request Beta Access
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle2 size={16} className="text-green-500" />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
