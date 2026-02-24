import { useEffect, useCallback, useRef } from 'react';
import { KeyboardShortcut, matchesShortcut } from '@/lib/keyboardShortcuts';

interface UseKeyboardShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  target?: HTMLElement | Document | Window;
}

/**
 * Hook for registering keyboard shortcuts
 * @param shortcut - The keyboard shortcut configuration
 * @param callback - Function to call when shortcut is triggered
 * @param options - Additional options
 */
export function useKeyboardShortcut(
  shortcut: Omit<KeyboardShortcut, 'description' | 'action' | 'category'>,
  callback: (event: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {}
) {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = true,
    target,
  } = options;

  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if shortcut is disabled
      if (!enabled) return;

      // Ignore shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow Escape key even in inputs (for closing modals)
      if (isInput && event.key !== 'Escape') return;

      // Check if event matches shortcut
      if (matchesShortcut(event, shortcut)) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        callbackRef.current(event);
      }
    },
    [enabled, preventDefault, stopPropagation, shortcut]
  );

  useEffect(() => {
    const targetElement = target || document;
    targetElement.addEventListener('keydown', handleKeyDown as any);

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [handleKeyDown, target]);
}

/**
 * Hook for registering multiple keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: Array<{
    shortcut: Omit<KeyboardShortcut, 'description' | 'action' | 'category'>;
    callback: (event: KeyboardEvent) => void;
    options?: UseKeyboardShortcutOptions;
  }>
) {
  shortcuts.forEach(({ shortcut, callback, options }) => {
    useKeyboardShortcut(shortcut, callback, options);
  });
}
