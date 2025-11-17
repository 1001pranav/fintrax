/**
 * ThemeStrategy Interface
 * Defines the contract for theme strategies
 * Part of the Strategy Pattern implementation
 */

export interface ColorScheme {
  // Background colors
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSecondary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Border and divider
  border: string;
  divider: string;

  // Card and shadow
  card: string;
  shadow: string;

  // Special
  disabled: string;
  placeholder: string;
}

export interface ThemeStrategy {
  /**
   * Get the color scheme for this theme
   * @returns ColorScheme
   */
  getColors(): ColorScheme;

  /**
   * Get the name of this theme
   * @returns string
   */
  getName(): string;

  /**
   * Get the theme type
   * @returns 'light' | 'dark'
   */
  getType(): 'light' | 'dark';

  /**
   * Check if this is a dark theme
   * @returns boolean
   */
  isDark(): boolean;
}
