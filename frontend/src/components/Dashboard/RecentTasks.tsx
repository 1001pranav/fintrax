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
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Tasks</h3>
        <div className="text-center py-8">
          <SVGComponent 
            svgType = {"task_logo"}
          />
          <p className="text-white/60">No tasks yet</p>
          <p className="text-white/40 text-sm mt-1">Create your first task to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Tasks</h3>
        <span className="px-3 py-1 bg-white/10 text-white/60 rounded-lg text-sm">
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