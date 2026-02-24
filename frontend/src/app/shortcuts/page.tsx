'use client';

import { Keyboard, Command } from 'lucide-react';

interface ShortcutCategory {
  category: string;
  icon: string;
  shortcuts: {
    keys: string[];
    description: string;
    status?: 'available' | 'coming-soon';
  }[];
}

const shortcutCategories: ShortcutCategory[] = [
  {
    category: 'Global',
    icon: '🌐',
    shortcuts: [
      {
        keys: ['Ctrl', 'K'],
        description: 'Open global search',
        status: 'coming-soon',
      },
      {
        keys: ['Ctrl', 'N'],
        description: 'Create new item (context-dependent)',
        status: 'coming-soon',
      },
      {
        keys: ['Ctrl', '/'],
        description: 'Show keyboard shortcuts help',
        status: 'coming-soon',
      },
      {
        keys: ['Esc'],
        description: 'Close modals and dialogs',
        status: 'available',
      },
    ],
  },
  {
    category: 'Navigation',
    icon: '🧭',
    shortcuts: [
      {
        keys: ['G', 'D'],
        description: 'Go to Dashboard',
        status: 'coming-soon',
      },
      {
        keys: ['G', 'P'],
        description: 'Go to Projects',
        status: 'coming-soon',
      },
      {
        keys: ['G', 'F'],
        description: 'Go to Finance',
        status: 'coming-soon',
      },
      {
        keys: ['G', 'R'],
        description: 'Go to Roadmaps',
        status: 'coming-soon',
      },
      {
        keys: ['G', 'S'],
        description: 'Go to Settings',
        status: 'coming-soon',
      },
      {
        keys: ['G', 'H'],
        description: 'Go to Help',
        status: 'coming-soon',
      },
    ],
  },
  {
    category: 'Task Management',
    icon: '✅',
    shortcuts: [
      {
        keys: ['N'],
        description: 'New task (in task view)',
        status: 'coming-soon',
      },
      {
        keys: ['E'],
        description: 'Edit selected task',
        status: 'coming-soon',
      },
      {
        keys: ['Delete'],
        description: 'Delete selected task',
        status: 'coming-soon',
      },
      {
        keys: ['Ctrl', 'Enter'],
        description: 'Mark task as done',
        status: 'coming-soon',
      },
      {
        keys: ['1'],
        description: 'Set priority to High',
        status: 'coming-soon',
      },
      {
        keys: ['2'],
        description: 'Set priority to Medium',
        status: 'coming-soon',
      },
      {
        keys: ['3'],
        description: 'Set priority to Low',
        status: 'coming-soon',
      },
      {
        keys: ['T'],
        description: 'Toggle tags',
        status: 'coming-soon',
      },
    ],
  },
  {
    category: 'Finance',
    icon: '💰',
    shortcuts: [
      {
        keys: ['T'],
        description: 'Add new transaction (in finance view)',
        status: 'coming-soon',
      },
      {
        keys: ['I'],
        description: 'Quick add income',
        status: 'coming-soon',
      },
      {
        keys: ['E'],
        description: 'Quick add expense',
        status: 'coming-soon',
      },
      {
        keys: ['S'],
        description: 'Add savings goal',
        status: 'coming-soon',
      },
      {
        keys: ['L'],
        description: 'Add loan',
        status: 'coming-soon',
      },
    ],
  },
  {
    category: 'Modal & Form Actions',
    icon: '📝',
    shortcuts: [
      {
        keys: ['Enter'],
        description: 'Submit form/modal',
        status: 'available',
      },
      {
        keys: ['Esc'],
        description: 'Cancel and close',
        status: 'available',
      },
      {
        keys: ['Tab'],
        description: 'Move to next field',
        status: 'available',
      },
      {
        keys: ['Shift', 'Tab'],
        description: 'Move to previous field',
        status: 'available',
      },
    ],
  },
  {
    category: 'Viewing & Display',
    icon: '👁️',
    shortcuts: [
      {
        keys: ['K'],
        description: 'Kanban view (in project)',
        status: 'coming-soon',
      },
      {
        keys: ['C'],
        description: 'Calendar view (in project)',
        status: 'coming-soon',
      },
      {
        keys: ['L'],
        description: 'List view',
        status: 'coming-soon',
      },
      {
        keys: ['F'],
        description: 'Toggle filter panel',
        status: 'coming-soon',
      },
    ],
  },
];

const KeyBadge = ({ keyName }: { keyName: string }) => {
  // Replace Ctrl with Cmd symbol on Mac
  const displayKey = keyName === 'Ctrl' ? '⌘' : keyName;

  return (
    <kbd className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-mono font-semibold text-gray-800 min-w-[2.5rem] text-center">
      {displayKey}
    </kbd>
  );
};

export default function ShortcutsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Keyboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Keyboard Shortcuts</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Speed up your workflow with these keyboard shortcuts. Work faster and more efficiently!
          </p>
        </div>

        {/* Platform Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Command className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> Replace <kbd className="px-2 py-0.5 bg-blue-100 rounded text-xs">Ctrl</kbd> with{' '}
            <kbd className="px-2 py-0.5 bg-blue-100 rounded text-xs">Cmd (⌘)</kbd> on macOS
          </div>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {shortcutCategories.map((category) => (
            <div
              key={category.category}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-xl font-bold text-gray-900">{category.category}</h2>
              </div>

              <div className="space-y-3">
                {category.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      {shortcut.keys.map((key, idx) => (
                        <span key={idx} className="flex items-center">
                          <KeyBadge keyName={key} />
                          {idx < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-gray-400 text-sm">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-gray-700 text-right">{shortcut.description}</span>
                      {shortcut.status === 'coming-soon' && (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          Soon
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Pro Tips</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Shortcuts are context-aware - they work differently depending on which page you're on</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Combination shortcuts (like "G then D") use letter keys similar to Gmail</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Practice shortcuts to build muscle memory and significantly speed up your workflow</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Most shortcuts marked as "Coming Soon" will be available in the next major update</span>
            </li>
          </ul>
        </div>

        {/* Request Feature */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Want a shortcut for something specific?
          </p>
          <a
            href="/settings"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-gray-900 dark:text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all"
          >
            Send Feedback
          </a>
        </div>
      </div>
    </div>
  );
}
