'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import { trackUserAction } from '@/lib/analytics';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    trackUserAction.provideFeedback();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        aria-label="Send feedback"
        title="Send Feedback"
      >
        <MessageSquare size={24} />
        <span className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-gray-900 dark:text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Send Feedback
        </span>
      </button>

      {/* Feedback Form Modal */}
      {isOpen && <FeedbackForm onClose={handleClose} />}
    </>
  );
}
