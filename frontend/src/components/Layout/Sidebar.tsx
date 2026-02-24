'use client';

import { useAppStore } from '@/lib/store';
import ProjectCard from '@/components/Project/ProjectCardComponent';
import SVGComponent from '../svg';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const projects = useAppStore((state) => state.projects);
  const selectedProject = useAppStore((state) => state.selectedProject);
  const setSelectedProject = useAppStore((state) => state.setSelectedProject);
  const setProjectModalOpen = useAppStore((state) => state.setProjectModalOpen);

  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isProjectsCollapsed, setIsProjectsCollapsed] = useState<boolean>(false);

  const navigationLinks = [
    { name: 'Dashboard', icon: 'home', path: '/projects', badge: null },
    { name: 'Tasks', icon: 'checkmark-circle', path: '/tasks', badge: null },
    { name: 'Finance', icon: 'wallet', path: '/finance', badge: null },
    { name: 'Roadmaps', icon: 'map', path: '/roadmaps', badge: null },
    { name: 'Settings', icon: 'settings', path: '/settings', badge: null },
  ];

  const isActive = (path: string) => {
    if (path === '/projects') {
      return pathname === '/projects' || pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } h-screen bg-white dark:bg-slate-900/50 border-r border-gray-200 dark:border-white/10 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300`}
    >
      {/* Collapse Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
        {!isCollapsed && (
          <span className="text-gray-600 dark:text-white/60 text-xs font-semibold uppercase tracking-wider">
            Navigation
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all ml-auto"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <SVGComponent
            svgType={isCollapsed ? "chevron-right" : "chevron-left"}
            className="w-4 h-4"
          />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        {navigationLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => router.push(link.path)}
            className={`w-full py-3 px-3 flex items-center ${
              isCollapsed ? 'justify-center' : 'space-x-3'
            } rounded-lg transition-all duration-200 group relative ${
              isActive(link.path)
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-white border border-blue-500/30'
                : 'text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
            }`}
            title={isCollapsed ? link.name : ''}
          >
            <SVGComponent
              svgType={link.icon as any}
              className={`w-5 h-5 ${isActive(link.path) ? 'text-blue-400' : ''}`}
            />
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium flex-1 text-left">{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 bg-blue-500 text-gray-900 dark:text-white text-xs font-semibold rounded-full">
                    {link.badge}
                  </span>
                )}
              </>
            )}
            {/* Active indicator */}
            {isActive(link.path) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-4 my-2 border-t border-gray-200 dark:border-white/10"></div>

      {/* Projects Section */}
      <div className="flex-1 overflow-hidden flex flex-col px-3">
        <div className="mb-3">
          <button
            onClick={() => !isCollapsed && setIsProjectsCollapsed(!isProjectsCollapsed)}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            } text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white text-xs font-semibold uppercase tracking-wider py-2 px-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all`}
            title={isCollapsed ? 'Projects' : ''}
          >
            {!isCollapsed && (
              <>
                <span>Projects ({projects.length})</span>
                <SVGComponent
                  svgType={isProjectsCollapsed ? "chevron-down" : "chevron-up"}
                  className="w-4 h-4"
                />
              </>
            )}
            {isCollapsed && (
              <SVGComponent svgType="folder" className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* New Project Button */}
        {!isCollapsed && (
          <button
            onClick={() => {
              setProjectModalOpen(true);
            }}
            className="w-full py-2.5 px-3 mb-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg text-blue-700 dark:text-white/90 hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-500/50 transition-all duration-200 flex items-center justify-center space-x-2 group"
          >
            <SVGComponent
              svgType={"plus"}
              className="w-4 h-4 group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">New Project</span>
          </button>
        )}

        {/* Projects List */}
        {!isProjectsCollapsed && !isCollapsed && (
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-white/40">
                <SVGComponent svgType="folder" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No projects yet</p>
                <p className="text-xs mt-1">Create your first project</p>
              </div>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isSelected={selectedProject?.id === project.id}
                  onClick={() => setSelectedProject(project)}
                />
              ))
            )}
          </div>
        )}

        {/* Collapsed Projects View */}
        {isCollapsed && projects.length > 0 && (
          <div className="flex-1 overflow-y-auto space-y-2">
            {projects.slice(0, 5).map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`w-full p-3 rounded-lg transition-all ${
                  selectedProject?.id === project.id
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
                title={project.name}
              >
                <div
                  className="w-6 h-6 rounded-md mx-auto"
                  style={{ backgroundColor: project.color || '#3b82f6' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions - Bottom */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-200 dark:border-white/10 space-y-2">
          <button
            onClick={() => router.push('/getting-started')}
            className="w-full py-2 px-3 flex items-center space-x-3 text-gray-700 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all text-sm"
          >
            <SVGComponent svgType="book" className="w-4 h-4" />
            <span>Getting Started</span>
          </button>
        </div>
      )}
    </div>
  );
}
