'use client';

import { APP_NAME } from '@/constants/generalConstants';
import { useAppStore } from '@/lib/store';

export default function WelcomeHero() {
  const { projects, tasks, setProjectModalOpen } = useAppStore();

  const completedTasks = tasks?.filter(task => task.status === 'done').length ?? 0;
  const totalTasks = tasks?.length ?? 0;

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/30 rounded-xl p-8 mb-8 relative overflow-hidden backdrop-blur-xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to {APP_NAME} 👋
            </h1>
            <p className="text-gray-700 dark:text-white/80 text-lg mb-4">
              Manage your projects and tasks with ease
            </p>

            {totalTasks > 0 && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-600 dark:text-white/70">
                    {completedTasks} of {totalTasks} tasks completed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-600 dark:text-white/70">
                    {projects.length} active projects
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {projects.length === 0 && (
              <button
                onClick={() => setProjectModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                Create Your First Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}