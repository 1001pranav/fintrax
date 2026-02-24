import { useEffect } from 'react';
import { usePreferences } from './usePreferences';

export function useTheme() {
  const { data: preferences, isLoading } = usePreferences();

  useEffect(() => {
    const applyTheme = () => {
      // Get theme from preferences or localStorage as fallback
      let theme = preferences?.theme;

      if (!theme && typeof window !== 'undefined') {
        // Try to get from localStorage
        const stored = localStorage.getItem('preferences-storage');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            theme = parsed.state?.preferences?.theme;
          } catch (e) {
            console.error('Failed to parse stored preferences:', e);
          }
        }
      }

      // Default to light if still no theme
      theme = theme || 'light';

      const root = document.documentElement;

      if (theme === 'system') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
        }
      } else {
        // Use explicit theme
        if (theme === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
        }
      }

      // Store in localStorage for faster initial load
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
    };

    applyTheme();

    // Listen for system theme changes if theme is set to 'system'
    const theme = preferences?.theme || localStorage.getItem('theme') || 'light';
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences?.theme, isLoading]);
}

// Initial theme application (runs before React hydration)
if (typeof window !== 'undefined') {
  const applyInitialTheme = () => {
    let theme = localStorage.getItem('theme');

    // Try to get from stored preferences
    if (!theme) {
      const stored = localStorage.getItem('preferences-storage');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          theme = parsed.state?.preferences?.theme;
        } catch (e) {
          // Ignore parse errors
        }
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
  };

  applyInitialTheme();
}
