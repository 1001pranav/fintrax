/**
 * LightThemeStrategy
 * Concrete strategy for light theme
 * Part of the Strategy Pattern implementation
 */

import { ThemeStrategy, ColorScheme } from './ThemeStrategy';

export class LightThemeStrategy implements ThemeStrategy {
  getColors(): ColorScheme {
    return {
      // Background colors
      background: '#FFFFFF',
      backgroundSecondary: '#F9FAFB',
      surface: '#FFFFFF',
      surfaceSecondary: '#F3F4F6',

      // Text colors
      text: '#111827',
      textSecondary: '#6B7280',
      textTertiary: '#9CA3AF',
      textInverse: '#FFFFFF',

      // Primary colors (Indigo)
      primary: '#4F46E5',
      primaryLight: '#818CF8',
      primaryDark: '#3730A3',

      // Accent colors (Purple)
      accent: '#9333EA',
      accentLight: '#C084FC',
      accentDark: '#7E22CE',

      // Status colors
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',

      // Border and divider
      border: '#E5E7EB',
      divider: '#D1D5DB',

      // Card and shadow
      card: '#FFFFFF',
      shadow: 'rgba(0, 0, 0, 0.1)',

      // Special
      disabled: '#D1D5DB',
      placeholder: '#9CA3AF',
    };
  }

  getName(): string {
    return 'Light';
  }

  getType(): 'light' | 'dark' {
    return 'light';
  }

  isDark(): boolean {
    return false;
  }
}
