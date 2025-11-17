/**
 * DarkThemeStrategy
 * Concrete strategy for dark theme
 * Part of the Strategy Pattern implementation
 */

import { ThemeStrategy, ColorScheme } from './ThemeStrategy';

export class DarkThemeStrategy implements ThemeStrategy {
  getColors(): ColorScheme {
    return {
      // Background colors
      background: '#111827',
      backgroundSecondary: '#1F2937',
      surface: '#1F2937',
      surfaceSecondary: '#374151',

      // Text colors
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      textTertiary: '#9CA3AF',
      textInverse: '#111827',

      // Primary colors (Indigo - lighter for dark mode)
      primary: '#818CF8',
      primaryLight: '#A5B4FC',
      primaryDark: '#6366F1',

      // Accent colors (Purple - lighter for dark mode)
      accent: '#C084FC',
      accentLight: '#E9D5FF',
      accentDark: '#A855F7',

      // Status colors (lighter for dark mode)
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',

      // Border and divider
      border: '#374151',
      divider: '#4B5563',

      // Card and shadow
      card: '#1F2937',
      shadow: 'rgba(0, 0, 0, 0.3)',

      // Special
      disabled: '#4B5563',
      placeholder: '#6B7280',
    };
  }

  getName(): string {
    return 'Dark';
  }

  getType(): 'light' | 'dark' {
    return 'dark';
  }

  isDark(): boolean {
    return true;
  }
}
