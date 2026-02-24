'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppNavbar from '@/components/Layout/AppNavbar';
import Sidebar from '@/components/Layout/Sidebar';
import SVGComponent from '@/components/svg';
import { api, Todo } from '@/lib/api';
import { useAppStore } from '@/lib/store';

type FilterType = 'all' | 'todo' | 'in-progress' | 'completed';
type SortType = 'recent' | 'priority' | 'due-date';

export default function TasksPage() {
  const router = useRouter();
  const { setSelectedTask, setTaskModalOpen } = useAppStore();
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.todos.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1: return 'To Do';
      case 2: return 'In Progress';
      case 3: return 'Completed';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 2: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 3: return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'None';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-green-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  const handleTaskClick = (task: Todo) => {
    if (task.project_id) {
      router.push(`/projects/${task.project_id}`);
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      // Filter by status
      if (filter === 'todo' && task.status !== 1) return false;
      if (filter === 'in-progress' && task.status !== 2) return false;
      if (filter === 'completed' && task.status !== 3) return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sort === 'priority') {
        return (b.priority || 0) - (a.priority || 0);
      }
      if (sort === 'due-date') {
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
      }
      // Default: recent (by task_id, assuming higher ID = more recent)
      return b.task_id - a.task_id;
    });

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 1).length,
    inProgress: tasks.filter(t => t.status === 2).length,
    completed: tasks.filter(t => t.status === 3).length,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
      <AppNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-white">All Tasks</h1>
                <button
                  onClick={handleCreateTask}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  <SVGComponent svgType="plus" className="w-5 h-5" />
                  <span>New Task</span>
                </button>
              </div>
              <p className="text-white/60">Manage all your tasks across projects</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <SVGComponent svgType="task_logo" className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">To Do</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.todo}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-500/20 rounded-lg flex items-center justify-center">
                    <SVGComponent svgType="calender" className="w-6 h-6 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <SVGComponent svgType="rightArrowHead" className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <SVGComponent svgType="check" className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <SVGComponent
                    svgType="search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                  />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-lg text-gray-900 dark:text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-600 dark:text-white/60 hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('todo')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filter === 'todo'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-600 dark:text-white/60 hover:bg-white/10'
                  }`}
                >
                  To Do
                </button>
                <button
                  onClick={() => setFilter('in-progress')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filter === 'in-progress'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-600 dark:text-white/60 hover:bg-white/10'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filter === 'completed'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-600 dark:text-white/60 hover:bg-white/10'
                  }`}
                >
                  Completed
                </button>
              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="recent">Recent</option>
                <option value="priority">Priority</option>
                <option value="due-date">Due Date</option>
              </select>
            </div>

            {/* Tasks List */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-white/60">Loading tasks...</p>
                </div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                <SVGComponent svgType="task_logo" className="w-16 h-16 mx-auto text-gray-300 dark:text-white/20 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks found</h3>
                <p className="text-white/60 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Create your first task to get started'}
                </p>
                <button
                  onClick={handleCreateTask}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  Create Task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.task_id}
                    onClick={() => handleTaskClick(task)}
                    className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-5 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-400 transition-colors">
                            {task.title}
                          </h3>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {getStatusLabel(task.status)}
                          </span>
                          {task.priority > 0 && (
                            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {getPriorityLabel(task.priority)} Priority
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-white/60 text-sm mb-3 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          {task.start_date && (
                            <div className="flex items-center gap-1">
                              <SVGComponent svgType="calender" className="w-4 h-4" />
                              <span>{new Date(task.start_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {task.is_roadmap && (
                            <div className="flex items-center gap-1">
                              <SVGComponent svgType="map" className="w-4 h-4" />
                              <span>Roadmap</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <SVGComponent
                        svgType="rightArrowHead"
                        className="w-5 h-5 text-gray-500 dark:text-white/40 group-hover:text-white transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
