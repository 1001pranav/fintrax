"use client"

import { Project } from '@/constants/interfaces';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import SVGComponent from '../svg';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

export default function ProjectCard({ project, isSelected, onClick }: ProjectCardProps) {
  const { deleteProject, setProjectModalOpen, setSelectedProject } = useAppStore();
  const [date, setDate] = useState<string | null>(null);
  useEffect(() => {
    if (project.createdDate) {
      setDate(new Date(project.createdDate).toLocaleDateString());
    } else {
      setDate(null);
    }
  }, [project?.createdDate])
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setProjectModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(project.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group min-h-[100px] p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 touch-manipulation ${
        isSelected
          ? 'bg-gray-100 dark:bg-white/15 border border-gray-300 dark:border-white/20 shadow-lg'
          : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 active:bg-gray-100 dark:active:bg-white/15 border border-gray-200 dark:border-transparent shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{project.name}</h3>
        </div>

        <div className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex space-x-1 flex-shrink-0">
          <button
            onClick={handleEdit}
            className="min-w-[32px] min-h-[32px] p-1.5 sm:p-1 hover:bg-gray-200 dark:hover:bg-white/10 active:bg-gray-300 dark:active:bg-white/20 rounded transition-colors touch-manipulation"
            aria-label="Edit project"
          >
            <SVGComponent
              svgType={"editWrite"}
              className="w-4 h-4 text-gray-600 dark:text-white/60"
            />
          </button>
          <button
            onClick={handleDelete}
            className="min-w-[32px] min-h-[32px] p-1.5 sm:p-1 hover:bg-red-500/20 active:bg-red-500/30 rounded transition-colors touch-manipulation"
            aria-label="Delete project"
          >
            <SVGComponent
              svgType={"delete"}
              className="w-4 h-4 text-red-400"
            />
          </button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-white/60 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{project.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/50">
        <span>{project.taskCount || 0} tasks</span>
        <span>
          {date ? date: null}
        </span>
      </div>
    </div>
  );
}