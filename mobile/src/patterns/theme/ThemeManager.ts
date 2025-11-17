/**
 * ThemeManager - Singleton with Strategy Pattern
 * Central theme management service
 * Manages theme strategies and provides theme switching
 * Part of Sprint 5 - US-5.4: Dark Mode
 */

import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeStrategy, ColorScheme } from './strategies/ThemeStrategy';
import { LightThemeStrategy } from './strategies/LightThemeStrategy';
import { DarkThemeStrategy } from './strategies/DarkThemeStrategy';
import { AutoThemeStrategy } from './strategies/AutoThemeStrategy';

const THEME_STORAGE_KEY = 'app_theme_preference';

export type ThemeMode = 'light' | 'dark' | 'auto';

export class ThemeManager {
  // Singleton instance
  private static instance: ThemeManager;

  // Theme strategies
  private strategies: Map<ThemeMode, ThemeStrategy>;
  private currentStrategy: ThemeStrategy;
  private currentMode: ThemeMode = 'auto';

  // Theme change listeners
  private listeners: Array<(colors: ColorScheme, mode: ThemeMode) => void> = [];

  // Private constructor for Singleton pattern
  private constructor() {
    this.strategies = new Map();
    this.initializeStrategies();
    this.currentStrategy = this.strategies.get('auto')!;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  /**
   * Initialize theme strategies
   */
  private initializeStrategies(): void {
    this.strategies.set('light', new LightThemeStrategy());
    this.strategies.set('dark', new DarkThemeStrategy());
    this.strategies.set('auto', new AutoThemeStrategy());
  }

  /**
   * Initialize theme from storage
   */
  public async initialize(): Promise<void> {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && this.isValidThemeMode(savedMode)) {
        await this.setTheme(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('[ThemeManager] Error initializing theme:', error);
    }
  }

  /**
   * Set theme mode
   */
  public async setTheme(mode: ThemeMode): Promise<void> {
    try {
      const strategy = this.strategies.get(mode);
      if (!strategy) {
        console.error(`[ThemeManager] Invalid theme mode: ${mode}`);
        return;
      }

      this.currentMode = mode;
      this.currentStrategy = strategy;

      // Save preference
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);

      // Notify listeners
      this.notifyListeners();

      console.log(`[ThemeManager] Theme set to: ${mode}`);
    } catch (error) {
      console.error('[ThemeManager] Error setting theme:', error);
    }
  }

  /**
   * Update system theme for auto mode
   */
  public updateSystemTheme(systemTheme: 'light' | 'dark' | null): void {
    const autoStrategy = this.strategies.get('auto') as AutoThemeStrategy;
    if (autoStrategy) {
      autoStrategy.setSystemTheme(systemTheme);

      // If currently using auto mode, notify listeners
      if (this.currentMode === 'auto') {
        this.notifyListeners();
      }
    }
  }

  /**
   * Get current colors
   */
  public getColors(): ColorScheme {
    return this.currentStrategy.getColors();
  }

  /**
   * Get current theme mode
   */
  public getMode(): ThemeMode {
    return this.currentMode;
  }

  /**
   * Get current theme name
   */
  public getThemeName(): string {
    return this.currentStrategy.getName();
  }

  /**
   * Check if current theme is dark
   */
  public isDark(): boolean {
    return this.currentStrategy.isDark();
  }

  /**
   * Subscribe to theme changes
   */
  public subscribe(listener: (colors: ColorScheme, mode: ThemeMode) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(): void {
    const colors = this.getColors();
    const mode = this.currentMode;

    this.listeners.forEach((listener) => {
      try {
        listener(colors, mode);
      } catch (error) {
        console.error('[ThemeManager] Error in listener:', error);
      }
    });
  }

  /**
   * Validate theme mode
   */
  private isValidThemeMode(mode: string): boolean {
    return mode === 'light' || mode === 'dark' || mode === 'auto';
  }

  /**
   * Get all available themes
   */
  public getAvailableThemes(): ThemeMode[] {
    return ['light', 'dark', 'auto'];
  }
}

// Export singleton instance
export default ThemeManager.getInstance();
