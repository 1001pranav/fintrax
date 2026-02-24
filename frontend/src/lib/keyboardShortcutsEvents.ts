/**
 * Keyboard Shortcuts Events
 * Custom events for triggering keyboard shortcuts modal
 */

export const KEYBOARD_SHORTCUTS_EVENTS = {
  OPEN_HELP: 'keyboard-shortcuts:open-help',
} as const;

/**
 * Trigger keyboard shortcuts help modal
 */
export const openKeyboardShortcutsHelp = () => {
  window.dispatchEvent(new CustomEvent(KEYBOARD_SHORTCUTS_EVENTS.OPEN_HELP));
};

/**
 * Listen for keyboard shortcuts help modal event
 */
export const onKeyboardShortcutsHelp = (callback: () => void) => {
  const handler = () => callback();
  window.addEventListener(KEYBOARD_SHORTCUTS_EVENTS.OPEN_HELP, handler);
  return () => window.removeEventListener(KEYBOARD_SHORTCUTS_EVENTS.OPEN_HELP, handler);
};
