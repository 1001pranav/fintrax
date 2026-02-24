'use client';

import { useState } from 'react';
import SVGComponent from '@/components/svg';
import {
  DEFAULT_SHORTCUTS,
  groupShortcutsByCategory,
  formatShortcut,
} from '@/lib/keyboardShortcuts';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  const categories = groupShortcutsByCategory(DEFAULT_SHORTCUTS);

  // Close modal with Escape key
  useKeyboardShortcut({ key: 'Escape' }, onClose, { enabled: isOpen });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <SVGComponent svgType="keyboard" className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
              <p className="text-gray-600 dark:text-white/60 text-sm">Navigate faster with keyboard shortcuts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <SVGComponent svgType="close" className="w-6 h-6 text-gray-600 dark:text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.name}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  <span>{category.name}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-white/80 text-sm">{shortcut.description}</span>
                        <kbd className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white font-mono text-sm font-semibold shadow-sm">
                          {formatShortcut(shortcut)}
                        </kbd>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <SVGComponent svgType="bulb" className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-1">Pro Tips</h4>
                <ul className="text-sm text-gray-600 dark:text-white/60 space-y-1">
                  <li>• Press <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">?</kbd> anytime to see this help</li>
                  <li>• Most shortcuts work globally across the app</li>
                  <li>• Shortcuts are disabled when typing in input fields</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-slate-800/50">
          <p className="text-gray-600 dark:text-white/60 text-sm">
            Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-white/20 rounded text-xs">Esc</kbd> to close
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
