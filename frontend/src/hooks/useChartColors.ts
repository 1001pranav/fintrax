'use client';

import { useEffect, useState } from 'react';

export interface ChartColors {
  // Primary palette
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;

  // Financial colors
  income: string;
  expense: string;

  // Text and grid colors
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };

  grid: string;
  axis: string;

  // Background colors
  background: {
    card: string;
    tooltip: string;
  };
}

export function useChartColors(): ChartColors {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check if dark mode is active
    const checkTheme = () => {
      const root = document.documentElement;
      setIsDark(root.classList.contains('dark'));
    };

    checkTheme();

    // Watch for class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return {
    // Primary palette (same for both themes)
    primary: '#60a5fa',      // blue-400
    secondary: '#c084fc',    // purple-400
    success: '#4ade80',      // green-400
    danger: '#f87171',       // red-400
    warning: '#facc15',      // yellow-400
    info: '#38bdf8',         // sky-400

    // Financial colors (same for both themes)
    income: '#4ade80',       // green-400
    expense: '#f87171',      // red-400

    // Text and grid colors (theme-aware)
    text: {
      primary: isDark ? '#ffffff' : '#111827',                    // white / gray-900
      secondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(17, 24, 39, 0.6)', // white/60 / gray-900/60
      muted: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(17, 24, 39, 0.4)',    // white/40 / gray-900/40
    },

    grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 24, 39, 0.1)',  // white/10 / gray-900/10
    axis: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(17, 24, 39, 0.2)',  // white/20 / gray-900/20

    // Background colors (theme-aware)
    background: {
      card: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(17, 24, 39, 0.05)', // white/5 / gray-900/5
      tooltip: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',  // black/90 / white/95
    },
  };
}
