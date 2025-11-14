'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useTodoStore } from '@/lib/todoStore';
import TaskCard from '@/components/Task/TaskCard';
import { Task } from '@/constants/interfaces';
import SVGComponent from '../svg';

const columns = [
  { id: 'todo', title: 'To Do', color: 'border-gray-500/30' },
  { id: 'in-progress', title: 'In Progress', color: 'border-blue-500/30' },
  { id: 'done', title: 'Done', color: 'border-green-500/30' }
] as const;

export default function KanbanBoard() {
  const { selectedProject, setTaskModalOpen } = useAppStore();
  const {
    getTasksByStatus,
    moveTask,
    setSelectedTask,
    fetchTodos,
    isLoading,
    error,
    clearError,
  } = useTodoStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // Fetch todos when project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchTodos(parseInt(selectedProject.id));
    }
  }, [selectedProject, fetchTodos]);

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SVGComponent
              svgType={"kanban_logo"}
              className="w-8 h-8 text-white/40"
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a Project</h3>
          <p className="text-white/60">Choose a project from the sidebar to view tasks</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-white/60">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      try {
        await moveTask(draggedTask.id, status);
      } catch (error) {
        // Error is handled by the store, just log it
        console.error('Failed to move task:', error);
      }
    }
    setDraggedTask(null);
  };

  const handleAddTask = (status: Task['status']) => {
    setSelectedTask({
      id: '',
      title: '',
      description: '',
      tags: [],
      priority: 'medium',
      status,
      projectId: selectedProject.id,
      createdDate: new Date()
    } as Task);
    setTaskModalOpen(true);
  };

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedProject.color }}
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedProject.name}</h1>
              <p className="text-white/60">{selectedProject.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 backdrop-blur-xl">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-400">
                Error loading tasks
              </h3>
              <p className="mt-1 text-sm text-red-300/80">
                {error}
              </p>
              <button
                onClick={() => {
                  clearError();
                  if (selectedProject) {
                    fetchTodos(parseInt(selectedProject.id));
                  }
                }}
                className="mt-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-3 gap-6 h-[calc(100%-120px)]">
        {columns.map((column) => {
          const tasks = getTasksByStatus(selectedProject.id, column.id as Task['status']);
          
          return (
            <div
              key={column.id}
              className={`bg-white/5 border-2 ${column.color} rounded-2xl p-4 flex flex-col`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id as Task['status'])}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-white">{column.title}</h2>
                  <span className="px-2 py-1 bg-white/10 text-white/60 rounded-lg text-xs">
                    {tasks.length}
                  </span>
                </div>
                <button
                  onClick={() => handleAddTask(column.id as Task['status'])}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <SVGComponent svgType="plus" className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {/* Tasks */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <TaskCard 
                      task={task} 
                      isDragging={draggedTask?.id === task.id}
                    />
                  </div>
                ))}
                
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    <SVGComponent svgType="task_logo" className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-sm">No tasks yet</p>
                    <button
                      onClick={() => handleAddTask(column.id as Task['status'])}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Add your first task
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
