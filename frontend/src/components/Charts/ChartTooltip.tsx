'use client';

import React from 'react';

/**
 * Theme-aware tooltip component for charts
 */
export const ChartTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="bg-white/95 dark:bg-black/90 border border-gray-200 dark:border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-xl"
    >
      {children}
    </div>
  );
};

/**
 * Tooltip header component
 */
export const ChartTooltipHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <p className="text-gray-900 dark:text-white font-semibold mb-3 text-sm border-b border-gray-200 dark:border-white/10 pb-2">
      {children}
    </p>
  );
};

/**
 * Tooltip row component
 */
export interface ChartTooltipRowProps {
  label: string;
  value: string | number;
  color?: string;
  valueClassName?: string;
}

export const ChartTooltipRow: React.FC<ChartTooltipRowProps> = ({
  label,
  value,
  color,
  valueClassName = '',
}) => {
  return (
    <div className="flex items-center justify-between space-x-6">
      <div className="flex items-center space-x-2">
        {color && (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        <span className="text-gray-600 dark:text-white/80 text-xs">{label}</span>
      </div>
      <span className={`font-semibold text-xs ${valueClassName || 'text-gray-900 dark:text-white'}`}>
        {value}
      </span>
    </div>
  );
};
