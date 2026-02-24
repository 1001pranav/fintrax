'use client';

import { useAppStore } from '@/lib/store';
import SVGComponent  from '../svg';

export default function ProjectStats() {
    const { projects, tasks } = useAppStore();

    const totalTasks = tasks?.length ?? 0;
    const completedTasks = tasks?.filter(task => task.status === 'done').length ?? 0;
    const inProgressTasks = tasks?.filter(task => task.status === 'in-progress').length ?? 0;
    const todoTasks = tasks?.filter(task => task.status === 'todo').length ?? 0;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: 'kanban_logo',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: 'task_logo',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: 'completed_logo',
      iconColor: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: 'completion_rate_logo',
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-white/60 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <SVGComponent svgType={stat.icon as any} className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
