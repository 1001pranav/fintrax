'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Task } from '@/constants/interfaces';
import SVGComponent from '../svg';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarViewComponent() {
  const { selectedProject, getTasksByProject, setSelectedTask, setTaskModalOpen } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {/* <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg> */}
            <SVGComponent
              svgType={"calender"}
              className="w-8 h-8 text-white/40"
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a Project</h3>
          <p className="text-white/60">Choose a project from the sidebar to view calendar</p>
        </div>
      </div>
    );
  }

  const tasks = getTasksByProject(selectedProject.id);
  const tasksWithDates = tasks.filter(task => task.startDate || task.endDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getTasksForDate = (day: number): Task[] => {
    const date = new Date(year, month, day);
    return tasksWithDates.filter(task => {
      const taskStartDate = task.startDate ? new Date(task.startDate) : null;
      const taskEndDate = task.endDate ? new Date(task.endDate) : null;
      
      if (taskStartDate && taskEndDate) {
        return date >= taskStartDate && date <= taskEndDate;
      } else if (taskStartDate) {
        return date.toDateString() === taskStartDate.toDateString();
      } else if (taskEndDate) {
        return date.toDateString() === taskEndDate.toDateString();
      }
      
      return false;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  return (
    <div className="h-full p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedProject.color }}
            />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{selectedProject.name}</h1>
              <p className="text-white/60 text-sm sm:text-base">Calendar View</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="min-w-[40px] min-h-[40px] p-2 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors touch-manipulation"
            aria-label="Previous month"
          >
            <SVGComponent
              svgType={"leftArrowHead"}
              className="w-5 h-5 text-white"
            />
          </button>

          <h2 className="text-base sm:text-xl font-semibold text-white whitespace-nowrap">
            {monthNames[month]} {year}
          </h2>

          <button
            onClick={() => navigateMonth('next')}
            className="min-w-[40px] min-h-[40px] p-2 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors touch-manipulation"
            aria-label="Next month"
          >
            <SVGComponent
              svgType={"rightArrowHead"}
              className="w-5 h-5 text-white"
            />
          </button>
        </div>

        <button
          onClick={goToToday}
          className="min-h-[40px] px-3 sm:px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm hover:bg-blue-500/30 active:bg-blue-500/40 transition-colors touch-manipulation"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2 sm:p-4">
        {/* Week Headers */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
          {weekDays.map((day, index) => (
            <div key={index} className="p-1 sm:p-3 text-center text-white/60 font-medium text-xs sm:text-sm">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-16 sm:h-24" />;
            }

            const dayTasks = getTasksForDate(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            return (
              <div
                key={index}
                className={`h-16 sm:h-24 p-1 sm:p-2 border border-white/5 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation ${
                  isToday ? 'bg-blue-500/10 border-blue-500/30' : ''
                }`}
              >
                <div className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 ${
                  isToday ? 'text-blue-300' : 'text-white/80'
                }`}>
                  {day}
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  {dayTasks.slice(0, window.innerWidth < 640 ? 1 : 2).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className="px-1 sm:px-2 py-0.5 sm:py-1 bg-blue-500/20 text-blue-300 rounded text-[10px] sm:text-xs cursor-pointer hover:bg-blue-500/30 active:bg-blue-500/40 transition-colors truncate touch-manipulation"
                    >
                      {task.title}
                    </div>
                  ))}

                  {dayTasks.length > (window.innerWidth < 640 ? 1 : 2) && (
                    <div className="px-1 sm:px-2 py-0.5 sm:py-1 bg-white/10 text-white/60 rounded text-[10px] sm:text-xs">
                      +{dayTasks.length - (window.innerWidth < 640 ? 1 : 2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
