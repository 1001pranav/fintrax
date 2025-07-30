'use client';

import { Task } from '@/constants/interfaces';
import { useAppStore } from '@/lib/store';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const priorityColors = {
  low: 'text-green-400 bg-green-500/20',
  medium: 'text-yellow-400 bg-yellow-500/20', 
  high: 'text-red-400 bg-red-500/20'
};

export default function TaskCard({ task, isDragging }: TaskCardProps) {
  const { setSelectedTask, setTaskModalOpen } = useAppStore();

  const handleClick = () => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div
      onClick={handleClick}
      className={`group p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:shadow-lg ${
        isDragging ? 'opacity-50 rotate-3 scale-105' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white text-sm line-clamp-2 flex-1">
          {task.title}
        </h3>
        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-white/60 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/10 text-white/60 rounded-lg text-xs">
              +{task.tags.length - 3}
            </span>  
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-white/50">
        {task.endDate && (
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(new Date(task.endDate))}</span>
          </div>
        )}
        
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{task.subtasks.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
