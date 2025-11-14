'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import TaskCard from '@/components/Task/TaskCard';
import { Task } from '@/constants/interfaces';
import SVGComponent from '../svg';

const columns = [
  { id: 'todo', title: 'To Do', color: 'border-gray-500/30' },
  { id: 'in-progress', title: 'In Progress', color: 'border-blue-500/30' },
  { id: 'done', title: 'Done', color: 'border-green-500/30' }
] as const;

export default function KanbanBoard() {
  const { selectedProject, getTasksByStatus, moveTask, setSelectedTask, setTaskModalOpen } = useAppStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

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

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      moveTask(draggedTask.id, status);
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
    <div className="h-full p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedProject.color }}
            />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{selectedProject.name}</h1>
              <p className="text-white/60 text-sm sm:text-base truncate">{selectedProject.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Columns - Horizontal scroll on mobile, grid on desktop */}
      <div className="h-[calc(100%-100px)] sm:h-[calc(100%-120px)]">
        <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 h-full overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none">
          {columns.map((column) => {
            const tasks = getTasksByStatus(selectedProject.id, column.id as Task['status']);

            return (
              <div
                key={column.id}
                className={`flex-shrink-0 w-[85vw] sm:w-auto bg-white/5 border-2 ${column.color} rounded-2xl p-3 sm:p-4 flex flex-col snap-center sm:snap-align-none touch-pan-x`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id as Task['status'])}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-white text-sm sm:text-base">{column.title}</h2>
                    <span className="px-2 py-1 bg-white/10 text-white/60 rounded-lg text-xs">
                      {tasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddTask(column.id as Task['status'])}
                    className="min-w-[32px] min-h-[32px] sm:min-w-0 sm:min-h-0 p-1.5 sm:p-1 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors touch-manipulation"
                    aria-label={`Add task to ${column.title}`}
                  >
                    <SVGComponent svgType="plus" className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                {/* Tasks */}
                <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto">
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
                    <div className="text-center py-6 sm:py-8 text-white/40">
                      <SVGComponent svgType="task_logo" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm">No tasks yet</p>
                      <button
                        onClick={() => handleAddTask(column.id as Task['status'])}
                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 active:text-blue-200 transition-colors touch-manipulation"
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

        {/* Mobile scroll hint */}
        <div className="sm:hidden flex justify-center mt-2 space-x-1">
          {columns.map((_, index) => (
            <div key={index} className="w-1.5 h-1.5 rounded-full bg-white/20" />
          ))}
        </div>
      </div>
    </div>
  );
}
