/**
 * ThemeContext
 * React Context for theme management
 * Provides theme to all components in the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeManager, ThemeMode } from '../patterns/theme/ThemeManager';
import { ColorScheme } from '../patterns/theme/strategies/ThemeStrategy';

interface ThemeContextValue {
  colors: ColorScheme;
  mode: ThemeMode;
  isDark: boolean;
  setTheme: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const themeManager = ThemeManager.getInstance();

  const [colors, setColors] = useState<ColorScheme>(themeManager.getColors());
  const [mode, setMode] = useState<ThemeMode>(themeManager.getMode());
  const [isDark, setIsDark] = useState<boolean>(themeManager.isDark());

  useEffect(() => {
    // Initialize theme manager
    themeManager.initialize();

    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe((newColors, newMode) => {
      setColors(newColors);
      setMode(newMode);
      setIsDark(themeManager.isDark());
    });

    return () => {
      unsubscribe();
    };
  }, [themeManager]);

  useEffect(() => {
    // Update system theme for auto mode
    themeManager.updateSystemTheme(systemTheme);
  }, [systemTheme, themeManager]);

  const handleSetTheme = async (newMode: ThemeMode): Promise<void> => {
    await themeManager.setTheme(newMode);
  };

  const value: ThemeContextValue = {
    colors,
    mode,
    isDark,
    setTheme: handleSetTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
