'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { apiCache } from '@/lib/apiCache';

export default function KeyboardShortcutsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const {
    setProjectModalOpen,
    setTaskModalOpen,
    setSelectedTask,
    selectedProject,
    currentView,
    setCurrentView,
  } = useAppStore();

  // Navigation Shortcuts
  useKeyboardShortcut(
    { key: 'd', meta: true, shift: true },
    () => router.push('/'),
    { enabled: pathname !== '/' }
  );

  useKeyboardShortcut(
    { key: 'p', meta: true, shift: true },
    () => router.push('/projects'),
    { enabled: pathname !== '/projects' }
  );

  useKeyboardShortcut(
    { key: 'f', meta: true, shift: true },
    () => router.push('/finance'),
    { enabled: pathname !== '/finance' }
  );

  useKeyboardShortcut(
    { key: 't', meta: true, shift: true },
    () => router.push('/tasks'),
    { enabled: pathname !== '/tasks' }
  );

  useKeyboardShortcut(
    { key: 'r', meta: true, shift: true },
    () => router.push('/roadmaps'),
    { enabled: pathname !== '/roadmaps' }
  );

  // Action Shortcuts
  useKeyboardShortcut(
    { key: 'n', meta: true, shift: true },
    () => setProjectModalOpen(true),
    {}
  );

  useKeyboardShortcut(
    { key: 't', meta: true },
    () => {
      if (selectedProject) {
        setSelectedTask(null);
        setTaskModalOpen(true);
      }
    },
    { enabled: !!selectedProject }
  );

  // View Shortcuts
  useKeyboardShortcut(
    { key: 'v', meta: true },
    () => {
      if (selectedProject) {
        setCurrentView(currentView === 'kanban' ? 'calendar' : 'kanban');
      }
    },
    { enabled: !!selectedProject }
  );

  // General Shortcuts
  useKeyboardShortcut(
    { key: '?', shift: true },
    () => setIsHelpModalOpen(true),
    {}
  );

  useKeyboardShortcut(
    { key: 'r', meta: true },
    (e) => {
      // Clear cache and reload data
      apiCache.clear();
      window.location.reload();
    },
    {}
  );

  useKeyboardShortcut(
    { key: 'k', meta: true },
    () => {
      // Focus on search input if it exists
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    {}
  );

  return (
    <>
      {children}
      <KeyboardShortcutsModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
}
