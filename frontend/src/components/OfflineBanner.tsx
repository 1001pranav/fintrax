'use client';

import { useEffect, useState } from 'react';
import SVGComponent from './svg';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setTimeout(() => setIsVisible(false), 300);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsVisible(true);
    };

    // Check initial status
    setIsOffline(!navigator.onLine);
    setIsVisible(!navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-[9998]
        bg-gradient-to-r from-orange-500/95 to-red-600/95
        backdrop-blur-xl
        border-b border-orange-400/30
        shadow-2xl
        transition-all duration-300 ease-in-out
        ${isOffline ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-white">
          {/* Icon */}
          <div className="flex-shrink-0">
            <SVGComponent svgType="warning" className="w-5 h-5" />
          </div>

          {/* Message */}
          <p className="text-sm font-medium">
            You're offline. Some features may not be available.
          </p>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs text-white/80">Reconnecting...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
