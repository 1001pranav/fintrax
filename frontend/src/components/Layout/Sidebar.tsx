'use client';

import { useAppStore } from '@/lib/store';
import ProjectCard from '@/components/Project/ProjectCardComponent';
import SVGComponent from '../svg';
import { APP_NAME } from '@/constants/generalConstants';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const { projects, selectedProject, setSelectedProject, setProjectModalOpen } = useAppStore();
  const router = useRouter();
  const [username, setUsername] = useState<string>('User');

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <div className="w-80 h-screen bg-white/5 border-r border-white/10 backdrop-blur-xl p-6 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <SVGComponent className='w-6 h-6 text-white' svgType={"task_logo"} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{APP_NAME.toUpperCase()}</h1>
            <p className="text-white/60 text-sm">Project, Finance, Goal Managements</p>
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
      <div className="flex-1 overflow-y-auto space-y-3">
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

      {/* User Profile Section */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <button
          onClick={handleProfileClick}
          className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all duration-200 flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <SVGComponent svgType="user" className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-white font-medium truncate">{username}</p>
            <p className="text-white/60 text-xs">View Profile</p>
          </div>
          <SVGComponent svgType="rightArrowHead" className="w-4 h-4 text-white/60" />
        </button>
      </div>
    </div>
  );
}
