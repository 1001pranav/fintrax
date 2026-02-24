'use client';

import { useEffect, useState } from 'react';
import { Toast as ToastType, useToast } from '@/lib/useToast';
import SVGComponent from '../svg';

interface ToastProps {
  toast: ToastType;
}

const toastStyles = {
  success: {
    gradient: 'from-green-500/90 to-emerald-600/90',
    border: 'border-green-400/30',
    icon: 'check' as const,
    iconColor: 'text-green-100'
  },
  error: {
    gradient: 'from-red-500/90 to-rose-600/90',
    border: 'border-red-400/30',
    icon: 'x' as const,
    iconColor: 'text-red-100'
  },
  warning: {
    gradient: 'from-yellow-500/90 to-amber-600/90',
    border: 'border-yellow-400/30',
    icon: 'warning' as const,
    iconColor: 'text-yellow-100'
  },
  info: {
    gradient: 'from-blue-500/90 to-indigo-600/90',
    border: 'border-blue-400/30',
    icon: 'info' as const,
    iconColor: 'text-blue-100'
  }
};

export default function Toast({ toast }: ToastProps) {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);
  const style = toastStyles[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300); // Match animation duration
  };

  return (
    <div
      className={`
        min-w-[280px] max-w-md w-full sm:w-auto
        bg-gradient-to-r ${style.gradient}
        border ${style.border}
        backdrop-blur-xl rounded-xl
        shadow-2xl
        p-4
        flex items-center gap-3
        transition-all duration-300 ease-in-out
        ${isExiting
          ? 'opacity-0 translate-x-full scale-95'
          : 'opacity-100 translate-x-0 scale-100 animate-slideIn'
        }
        touch-manipulation
      `}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-5 h-5 ${style.iconColor}`}>
        <SVGComponent svgType={style.icon} className="w-5 h-5" />
      </div>

      {/* Message */}
      <p className="flex-1 text-gray-900 dark:text-white text-sm font-medium leading-relaxed">
        {toast.message}
      </p>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 min-w-[32px] min-h-[32px] p-1 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors touch-manipulation"
        aria-label="Close notification"
      >
        <SVGComponent svgType="x" className="w-4 h-4 text-white/80" />
      </button>
    </div>
  );
}
