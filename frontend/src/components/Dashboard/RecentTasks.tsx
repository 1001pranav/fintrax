'use client';

import { useAppStore } from '@/lib/store';
import TaskCard from '@/components/Task/TaskCard';
import SVGComponent from '../svg';

export default function RecentTasks() {
  const { tasks } = useAppStore();

  // Get the 6 most recent tasks
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 6);

  if (recentTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-8 backdrop-blur-xl mt-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Tasks</h3>
        <div className="text-center py-8">
          <SVGComponent
            svgType = {"task_logo"}
            className="w-16 h-16 mx-auto text-gray-300 dark:text-white/20 mb-4"
          />
          <p className="text-gray-600 dark:text-white/60 text-lg">No tasks yet</p>
          <p className="text-gray-500 dark:text-white/40 text-sm mt-1">Create your first task to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 backdrop-blur-xl mt-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h3>
        <span className="px-3 py-1.5 bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-medium">
          {recentTasks.length} tasks
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}