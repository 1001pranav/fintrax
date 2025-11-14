'use client';

import { TASK_TAG_COLORS } from '@/constants/generalConstants';
import { Task } from '@/constants/interfaces';
import { useAppStore } from '@/lib/store';
import SVGComponent from '../svg';

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
      className={`group min-h-[88px] p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 active:bg-white/15 hover:border-white/20 hover:shadow-lg touch-manipulation ${
        isDragging ? 'opacity-50 rotate-3 scale-105' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
        <h3 className="font-semibold text-white text-sm sm:text-sm line-clamp-2 flex-1">
          {task.title}
        </h3>
        <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-white/60 text-xs mb-2 sm:mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.name}
              className="px-2 py-1 text-white rounded-lg text-xs"
              style={{ backgroundColor: tag.color || TASK_TAG_COLORS[0] }} // Default to blue if no color
            >
              {tag.name}
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
            <SVGComponent svgType="calender" className="w-3 h-3" />
            <span>{formatDate(new Date(task.endDate))}</span>
          </div>
        )}

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex items-center space-x-1">
            <SVGComponent svgType="task_logo" className="w-3 h-3" />
            <span>{task.subtasks.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
