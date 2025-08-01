'use client';

import { useAppStore } from '@/lib/store';
import ProjectCard from '@/components/Project/ProjectCardComponent';
import ProjectModal from '@/components/Project/ProjectModelComponent';
import SVGComponent from '../svg';

export default function Sidebar() {
  const { projects, selectedProject, setSelectedProject, setProjectModalOpen } = useAppStore();

  return (
    <div className="w-80 h-screen bg-white/5 border-r border-white/10 backdrop-blur-xl p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <SVGComponent className='w-6 h-6 text-white' svgType={"task_logo"} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">TaskFlow</h1>
            <p className="text-white/60 text-sm">Project Management</p>
          </div>
        </div>

        {/* Add Project Button */}
        <button
          onClick={() => setProjectModalOpen(true)}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl text-white hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <SVGComponent 
            svgType={"plus"}
          />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        <h2 className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-4">
          Projects ({projects.length})
        </h2>
        
        {projects.map((project, index) => (
          
            (

              <ProjectCard
                key={index}
                project={project}
                isSelected={selectedProject?.id === project.id}
                onClick={() => setSelectedProject(project)}
              />
            )
          
        ))}
      </div>
    </div>
  );
}
