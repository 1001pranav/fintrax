'use client';

import { useAppStore } from '@/lib/store';
import KanbanBoard from '@/components/Task/Kanban';
import CalendarViewComponent  from '@/components/Task/CalenderView';
import TaskModal from '@/components/Task/TaskModel'

///'@/components/Task/TaskModal';
import DashboardContent from '@/components/Dashboard/DashboardContent';
import { Task } from '@/constants/interfaces';

import SVGComponent from '../svg';

export default function MainContent() {
  const { currentView, setCurrentView, selectedProject, setSelectedTask, setTaskModalOpen } = useAppStore();

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

  return (
    <div className="flex-1 h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Bar - Only show when project is selected */}
        {selectedProject && (
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setCurrentView('kanban')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === 'kanban'
                      ? 'bg-white/15 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SVGComponent 
                      svgType={"kanban_logo"}
                    />
                    <span>Kanban</span>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === 'calendar'
                      ? 'bg-white/15 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SVGComponent 
                      svgType={"calender"}
                    />
                    <span>Calendar</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewTask}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center space-x-2"
              >
                <SVGComponent 
                  svgType={"plus"}
                />
                <span>New Task</span>
              </button>
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