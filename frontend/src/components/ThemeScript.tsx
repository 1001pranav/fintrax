'use client';

import { useEffect } from 'react';

/**
 * ThemeScript Component
 *
 * Applies theme to document element on mount to prevent flash of wrong theme.
 * Runs as early as possible in the client-side render cycle.
 */
export default function ThemeScript() {
  useEffect(() => {
    const applyTheme = () => {
      try {
        let theme = localStorage.getItem('theme');

        if (!theme) {
          const stored = localStorage.getItem('preferences-storage');
          if (stored) {
            const parsed = JSON.parse(stored);
            theme = parsed.state?.preferences?.theme;
          }
        }

        theme = theme || 'light';
        const root = document.documentElement;

        // Remove both classes first to avoid conflicts
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.classList.add(prefersDark ? 'dark' : 'light');
        } else {
          root.classList.add(theme === 'dark' ? 'dark' : 'light');
        }
      } catch (e) {
        console.error('Failed to apply theme:', e);
      }
    };

    applyTheme();
  }, []);

  return null;
}
