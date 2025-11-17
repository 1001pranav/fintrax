/**
 * Theme Colors
 * Centralized color palette for the app
 */

export const colors = {
  // Primary Brand Colors
  primary: '#3B82F6', // Blue 500
  primaryDark: '#2563EB', // Blue 600
  primaryLight: '#60A5FA', // Blue 400

  // Secondary Colors
  secondary: '#8B5CF6', // Purple 500
  secondaryDark: '#7C3AED', // Purple 600
  secondaryLight: '#A78BFA', // Purple 400

  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic Colors
  success: '#10B981', // Green 500
  successLight: '#34D399', // Green 400
  successDark: '#059669', // Green 600

  error: '#EF4444', // Red 500
  errorLight: '#F87171', // Red 400
  errorDark: '#DC2626', // Red 600

  warning: '#F59E0B', // Amber 500
  warningLight: '#FBBF24', // Amber 400
  warningDark: '#D97706', // Amber 600

  info: '#3B82F6', // Blue 500
  infoLight: '#60A5FA', // Blue 400
  infoDark: '#2563EB', // Blue 600

  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundDark: '#111827',

  // Text Colors
  text: '#111827', // gray-900
  textSecondary: '#6B7280', // gray-500
  textLight: '#9CA3AF', // gray-400
  textDark: '#000000',
  textOnPrimary: '#FFFFFF',

  // Border Colors
  border: '#E5E7EB', // gray-200
  borderDark: '#D1D5DB', // gray-300

  // Input Colors
  inputBackground: '#FFFFFF',
  inputBorder: '#D1D5DB',
  inputBorderFocus: '#3B82F6',
  inputPlaceholder: '#9CA3AF',
  inputText: '#111827',

  // Button Colors
  buttonPrimary: '#3B82F6',
  buttonPrimaryHover: '#2563EB',
  buttonSecondary: '#F3F4F6',
  buttonSecondaryHover: '#E5E7EB',
  buttonDisabled: '#D1D5DB',

  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Transparent
  transparent: 'transparent',
} as const;

/**
 * Dark Theme Colors (for future dark mode support)
 */
export const darkColors = {
  ...colors,
  background: '#111827',
  backgroundSecondary: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  inputBackground: '#1F2937',
  inputBorder: '#374151',
  border: '#374151',
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
