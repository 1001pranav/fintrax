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
      className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-white/15 border border-white/20 shadow-lg'
          : 'bg-white/5 hover:bg-white/10 border border-transparent'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="font-semibold text-white truncate">{project.name}</h3>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button
            onClick={handleEdit}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <SVGComponent
              svgType={"editWrite"}
              className="w-4 h-4 text-white/60"
            />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
          >
            <SVGComponent
              svgType={"delete"}
              className="w-4 h-4 text-red-400"
            />
          </button>
        </div>
      </div>
      
      <p className="text-white/60 text-sm mb-3 line-clamp-2">{project.description}</p>
      
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{project.taskCount || 0} tasks</span>
        <span>
          {date ? date: null}
        </span>
      </div>
    </div>
  );
}