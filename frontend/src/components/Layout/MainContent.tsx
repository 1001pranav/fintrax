'use client';

import { useAppStore } from '@/lib/store';
import KanbanBoard from '@/components/Task/Kanban';
import CalendarViewComponent  from '@/components/Task/CalenderView';
import TaskModal from '@/components/Task/TaskModel'
import { useRef, useState } from 'react';

///'@/components/Task/TaskModal';
import DashboardContent from '@/components/Dashboard/DashboardContent';
import { Task } from '@/constants/interfaces';

import SVGComponent from '@/components/svg';
import SettingsDropdown from '../Settings/ProjectSettings';

export default function MainContent() {
  const { currentView, setCurrentView, selectedProject, setSelectedTask, setTaskModalOpen } = useAppStore();

  // Settings dropdown state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const handleNewTask = () => {
    if (!selectedProject) return;
    
    setSelectedTask({
      id: '',
      title: '',
      description: '',
      tags: [],
      priority: 'medium',
      status: 'todo',
      projectId: selectedProject.id,
      createdDate: new Date()
    } as Task);
    setTaskModalOpen(true);
  };

  const handleSaveAsTemplate = () => {
    if (!selectedProject) return;

    console.log('Saving project as template:', selectedProject);
    
    // t want to:
    // 1. Create a template object from the current project
    // 2. Save it to your store or send it to your API
    // 3. Show a success notification
    
    // Example implementation:
    // const template = {
    //   id: generateId(),
    //   name: `${selectedProject.name} Template`,
    //   description: selectedProject.description,
    //   structure: selectedProject.tasks,
    //   createdAt: new Date(),
    // };
    // saveTemplate(template);
    
    alert('Project saved as template successfully!'); // Replace with proper notification
  };

  
  const toggleSettingsDropdown = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const closeSettingsDropdown = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Bar - Only show when project is selected */}
        {selectedProject && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* View Toggle */}
              <div className="flex bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setCurrentView('kanban')}
                  className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    currentView === 'kanban'
                      ? 'bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-lg'
                      : 'text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <SVGComponent
                      svgType={"kanban_logo"}
                    />
                    <span className="hidden sm:inline">Kanban</span>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    currentView === 'calendar'
                      ? 'bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-lg'
                      : 'text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <SVGComponent
                      svgType={"calender"}
                    />
                    <span className="hidden sm:inline">Calendar</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handleNewTask}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center space-x-1 sm:space-x-2"
              >
                <SVGComponent 
                  svgType={"plus"}
                />
                <span className="hidden sm:inline">New Task</span>
              </button>
              
              {/* Settings Button with Dropdown */}
              <div className="relative">
                <button
                  ref={settingsButtonRef}
                  onClick={toggleSettingsDropdown}
                  className={`p-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center space-x-2 ${
                    isSettingsOpen ? 'from-blue-600 to-purple-700 scale-105' : ''
                  }`}
                >
                  <SVGComponent
                    svgType={"settings"}
                  />
                </button>

                {/* Settings Dropdown */}
                <SettingsDropdown
                  isOpen={isSettingsOpen}
                  onClose={closeSettingsDropdown}
                  onSaveAsTemplate={handleSaveAsTemplate}
                  buttonRef={settingsButtonRef}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main View */}
        <div className="flex-1 overflow-hidden">
          {!selectedProject ? (
            <DashboardContent />
          ) : currentView === 'kanban' ? (
            <KanbanBoard />
          ) : (
            <CalendarViewComponent />
          )}
        </div>
      </div>

      <TaskModal />
    </div>
  );
}
