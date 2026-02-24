'use client';

import { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

interface FeedbackFormProps {
  onClose: () => void;
  onSubmit?: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  email?: string;
  timestamp: string;
}

export default function FeedbackForm({ onClose, onSubmit }: FeedbackFormProps) {
  const [type, setType] = useState<FeedbackData['type']>('improvement');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      type,
      title: title.trim(),
      description: description.trim(),
      email: email.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    try {
      // In production, send to backend API
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedbackData),
      // });

      // For now, log to console and localStorage
      console.log('[Feedback]', feedbackData);

      // Store feedback locally
      const existingFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('user_feedback', JSON.stringify(existingFeedback));

      if (onSubmit) {
        onSubmit(feedbackData);
      }

      setSubmitted(true);

      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Thank you!
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your feedback has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <MessageSquare className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Send Feedback
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Help us improve Fintrax
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close feedback form"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feedback Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'bug', label: '🐛 Bug Report', color: 'red' },
                { value: 'feature', label: '✨ Feature Request', color: 'purple' },
                { value: 'improvement', label: '💡 Improvement', color: 'blue' },
                { value: 'other', label: '💬 Other', color: 'gray' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value as FeedbackData['type'])}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    type === option.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="feedback-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="feedback-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your feedback"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="feedback-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about your feedback. For bugs, include steps to reproduce."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              required
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email (Optional)
            </label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              We'll use this to follow up if needed
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-gray-900 dark:text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
