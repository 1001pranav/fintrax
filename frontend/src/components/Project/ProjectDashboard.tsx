'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTodoStore } from '@/lib/todoStore';
import { Project, Task } from '@/constants/interfaces';
import SVGComponent from '../svg';
import TaskStatusChart from '@/components/Charts/TaskStatusChart';

interface ProjectDashboardProps {
  project: Project;
}

export default function ProjectDashboard({ project }: ProjectDashboardProps) {
  const router = useRouter();
  const { fetchTodos, getTasksByProject, isLoading } = useTodoStore();

  useEffect(() => {
    fetchTodos(parseInt(project.id));
  }, [project.id, fetchTodos]);

  const tasks = getTasksByProject(project.id);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const byStatus = {
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
    const byPriority = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
    };
    const completion = total > 0 ? Math.round((byStatus.done / total) * 100) : 0;

    return {
      total,
      byStatus,
      byPriority,
      completion,
    };
  }, [tasks]);

  // Get recent tasks (last 5 updated/created)
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        const dateA = a.createdDate || new Date(0);
        const dateB = b.createdDate || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);
  }, [tasks]);

  const handleBackToProjects = () => {
    router.push('/projects');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-white/60">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleBackToProjects}
          className="mb-4 px-4 py-2 bg-white/5 border  border-gray-300 dark:border-white/20 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center space-x-2"
        >
          <SVGComponent svgType="arrow-left" className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <p className="text-white/60">{project.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{stats.completion}%</div>
            <div className="text-sm text-white/60">Complete</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Total Tasks</span>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <SVGComponent svgType="task_logo" className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">To Do</span>
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <SVGComponent svgType="circle" className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.byStatus.todo}</div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">In Progress</span>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <SVGComponent svgType="clock" className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.byStatus.inProgress}</div>
        </div>

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Done</span>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <SVGComponent svgType="check" className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.byStatus.done}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
          <TaskStatusChart tasks={tasks} type="status" />
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Priority Distribution</h2>
          <TaskStatusChart tasks={tasks} type="priority" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Tasks</h2>
        {recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.status === 'done'
                        ? 'bg-green-400'
                        : task.status === 'in-progress'
                        ? 'bg-blue-400'
                        : 'bg-gray-400'
                    }`}
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{task.title}</h3>
                    {task.description && (
                      <p className="text-white/60 text-sm line-clamp-1">{task.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-500/20 text-red-300'
                        : task.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      task.status === 'done'
                        ? 'bg-green-500/20 text-green-300'
                        : task.status === 'in-progress'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'To Do'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/60">
            <SVGComponent svgType="task_logo" className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p>No tasks in this project yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
