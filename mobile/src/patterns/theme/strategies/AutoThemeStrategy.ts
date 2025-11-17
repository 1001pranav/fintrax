/**
 * AutoThemeStrategy
 * Concrete strategy that follows system theme
 * Part of the Strategy Pattern implementation
 */

import { useColorScheme } from 'react-native';
import { ThemeStrategy, ColorScheme } from './ThemeStrategy';
import { LightThemeStrategy } from './LightThemeStrategy';
import { DarkThemeStrategy } from './DarkThemeStrategy';

export class AutoThemeStrategy implements ThemeStrategy {
  private lightTheme: LightThemeStrategy;
  private darkTheme: DarkThemeStrategy;
  private systemTheme: 'light' | 'dark' | null;

  constructor() {
    this.lightTheme = new LightThemeStrategy();
    this.darkTheme = new DarkThemeStrategy();
    this.systemTheme = null;
  }

  setSystemTheme(theme: 'light' | 'dark' | null): void {
    this.systemTheme = theme;
  }

  getColors(): ColorScheme {
    const currentTheme = this.getCurrentTheme();
    return currentTheme.getColors();
  }

  getName(): string {
    return 'Auto (System)';
  }

  getType(): 'light' | 'dark' {
    return this.getCurrentTheme().getType();
  }

  isDark(): boolean {
    return this.getCurrentTheme().isDark();
  }

  private getCurrentTheme(): ThemeStrategy {
    return this.systemTheme === 'dark' ? this.darkTheme : this.lightTheme;
  }
}
