interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'purple' | 'pink' | 'blue' | 'white';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'purple',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    purple: 'border-purple-500',
    pink: 'border-pink-500',
    blue: 'border-blue-500',
    white: 'border-white',
  };

  return (
    <div
      className={`spinner ${sizeClasses[size]} ${className}`}
      style={{ borderTopColor: `var(--color-accent-${color})` }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`loading-dots flex gap-1 ${className}`}>
      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
    </div>
  );
}

export function LoadingText({ text = 'Loading' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <LoadingSpinner size="sm" />
      <span>{text}...</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-slate-400 animate-pulse-slow">Loading Fintrax...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-slate-800 rounded-lg p-6 space-y-4">
      <div className="skeleton h-6 w-3/4"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-5/6"></div>
      <div className="flex gap-2">
        <div className="skeleton h-8 w-20"></div>
        <div className="skeleton h-8 w-20"></div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-16 w-full"></div>
      ))}
    </div>
  );
}
