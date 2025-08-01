'use client';

import { useAppStore } from '@/lib/store';
import SVGComponent  from '../svg';

export default function ProjectStats() {
    const { projects, tasks } = useAppStore();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: (
        <SVGComponent
          svgType={"kanban_logo"}
        />
      ),
      color: 'text-blue-400'
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: (
        <SVGComponent
          svgType={"task_logo"}
        />
      ),
      color: 'text-purple-400'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: (
        <SVGComponent
          svgType={"completed_logo"}
        />
      ),
      color: 'text-green-400'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: (
        <SVGComponent
          svgType={"completion_rate_logo"}
        />
      ),
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className={`${stat.color} mb-4`}>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stat.value}
          </div>
          <div className="text-white/60 text-sm">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
