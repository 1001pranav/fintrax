/**
 * Keyboard Shortcuts System
 * Centralized keyboard shortcut management for the application
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean; // Command on Mac, Windows key on Windows
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'views' | 'modals' | 'general';
  disabled?: boolean;
}

export interface ShortcutCategory {
  name: string;
  shortcuts: Omit<KeyboardShortcut, 'action'>[];
}

/**
 * Format keyboard shortcut for display
 */
export const formatShortcut = (shortcut: Omit<KeyboardShortcut, 'action' | 'description' | 'category'>): string => {
  const parts: string[] = [];

  // Detect platform
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.platform);

  if (shortcut.ctrl) parts.push(isMac ? '⌃' : 'Ctrl');
  if (shortcut.alt) parts.push(isMac ? '⌥' : 'Alt');
  if (shortcut.shift) parts.push(isMac ? '⇧' : 'Shift');
  if (shortcut.meta) parts.push(isMac ? '⌘' : 'Win');

  // Format key
  const key = shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key;
  parts.push(key);

  return parts.join(isMac ? '' : '+');
};

/**
 * Check if keyboard event matches shortcut
 */
export const matchesShortcut = (
  event: KeyboardEvent,
  shortcut: Omit<KeyboardShortcut, 'description' | 'action' | 'category'>
): boolean => {
  const key = event.key.toLowerCase();
  const targetKey = shortcut.key.toLowerCase();

  // Check if key matches
  if (key !== targetKey) return false;

  // Check modifiers
  if (!!shortcut.ctrl !== event.ctrlKey) return false;
  if (!!shortcut.alt !== event.altKey) return false;
  if (!!shortcut.shift !== event.shiftKey) return false;
  if (!!shortcut.meta !== event.metaKey) return false;

  return true;
};

/**
 * Default keyboard shortcuts configuration
 */
export const DEFAULT_SHORTCUTS: Record<string, Omit<KeyboardShortcut, 'action'>> = {
  // Navigation
  GO_TO_DASHBOARD: {
    key: 'd',
    meta: true,
    shift: true,
    description: 'Go to Dashboard',
    category: 'navigation',
  },
  GO_TO_PROJECTS: {
    key: 'p',
    meta: true,
    shift: true,
    description: 'Go to Projects',
    category: 'navigation',
  },
  GO_TO_FINANCE: {
    key: 'f',
    meta: true,
    shift: true,
    description: 'Go to Finance',
    category: 'navigation',
  },
  GO_TO_TASKS: {
    key: 't',
    meta: true,
    shift: true,
    description: 'Go to All Tasks',
    category: 'navigation',
  },
  GO_TO_ROADMAPS: {
    key: 'r',
    meta: true,
    shift: true,
    description: 'Go to Roadmaps',
    category: 'navigation',
  },

  // Actions
  NEW_PROJECT: {
    key: 'n',
    meta: true,
    shift: true,
    description: 'Create New Project',
    category: 'actions',
  },
  NEW_TASK: {
    key: 't',
    meta: true,
    description: 'Create New Task',
    category: 'actions',
  },
  NEW_TRANSACTION: {
    key: 'n',
    meta: true,
    alt: true,
    description: 'Create New Transaction',
    category: 'actions',
  },
  SAVE: {
    key: 's',
    meta: true,
    description: 'Save Current Form',
    category: 'actions',
  },

  // Views
  TOGGLE_VIEW: {
    key: 'v',
    meta: true,
    description: 'Toggle Kanban/Calendar View',
    category: 'views',
  },
  TOGGLE_SIDEBAR: {
    key: 'b',
    meta: true,
    description: 'Toggle Sidebar',
    category: 'views',
  },

  // Modals
  CLOSE_MODAL: {
    key: 'Escape',
    description: 'Close Modal/Dialog',
    category: 'modals',
  },

  // General
  SEARCH: {
    key: 'k',
    meta: true,
    description: 'Global Search',
    category: 'general',
  },
  HELP: {
    key: '?',
    shift: true,
    description: 'Show Keyboard Shortcuts',
    category: 'general',
  },
  REFRESH: {
    key: 'r',
    meta: true,
    description: 'Refresh Data',
    category: 'general',
  },
};

/**
 * Group shortcuts by category
 */
export const groupShortcutsByCategory = (
  shortcuts: Record<string, Omit<KeyboardShortcut, 'action'>>
): ShortcutCategory[] => {
  const categories: Record<string, ShortcutCategory> = {
    navigation: { name: 'Navigation', shortcuts: [] },
    actions: { name: 'Actions', shortcuts: [] },
    views: { name: 'Views', shortcuts: [] },
    modals: { name: 'Modals', shortcuts: [] },
    general: { name: 'General', shortcuts: [] },
  };

  Object.entries(shortcuts).forEach(([, shortcut]) => {
    if (categories[shortcut.category]) {
      categories[shortcut.category].shortcuts.push(shortcut);
    }
  });

  return Object.values(categories).filter(cat => cat.shortcuts.length > 0);
};
