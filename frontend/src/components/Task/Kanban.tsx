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
