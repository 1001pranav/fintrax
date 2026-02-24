'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoadmapStore } from '@/lib/roadmapStore';
import { useTodoStore } from '@/lib/todoStore';
import AppNavbar from '@/components/Layout/AppNavbar';
import Sidebar from '@/components/Layout/Sidebar';
import RoadmapForm from '@/components/Roadmap/RoadmapForm';
import RoadmapTimeline from '@/components/Roadmap/RoadmapTimeline';
import SVGComponent from '@/components/svg';
import { CreateRoadmapData } from '@/lib/api';

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roadmapId = parseInt(params.roadmapId as string);

  const { selectedRoadmap, isLoading, fetchRoadmapById, updateRoadmap, deleteRoadmap } =
    useRoadmapStore();
  const { tasks, fetchTasks } = useTodoStore();

  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (roadmapId) {
      fetchRoadmapById(roadmapId);
      fetchTasks({ roadmap_id: roadmapId });
    }
  }, [roadmapId, fetchRoadmapById, fetchTasks]);

  const handleEdit = async (data: CreateRoadmapData) => {
    await updateRoadmap(roadmapId, data);
    setShowEditForm(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this roadmap? All associated tasks will be unlinked.')) {
      await deleteRoadmap(roadmapId);
      router.push('/roadmaps');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const roadmapTasks = tasks.filter((task) => task.roadmap_id === roadmapId);
  const tasksByStatus = {
    todo: roadmapTasks.filter((task) => task.status === 1),
    inProgress: roadmapTasks.filter((task) => task.status === 2),
    done: roadmapTasks.filter((task) => task.status === 3 || task.status === 4),
  };

  if (isLoading && !selectedRoadmap) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
        <AppNavbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-white/60">Loading roadmap...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedRoadmap) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
        <AppNavbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <SVGComponent svgType="map" className="w-16 h-16 mx-auto text-gray-300 dark:text-white/20 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Roadmap not found</h2>
              <button
                onClick={() => router.push('/roadmaps')}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Back to roadmaps
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
      <AppNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6 overflow-y-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push('/roadmaps')}
              className="flex items-center gap-2 text-gray-600 dark:text-white/60 hover:text-white mb-6 transition-colors"
            >
              <SVGComponent svgType="leftArrowHead" className="w-5 h-5" />
              Back to Roadmaps
            </button>

            {/* Header */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-6 backdrop-blur-xl mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedRoadmap.name}</h1>
                  <div className="flex items-center gap-6 text-white/60">
                    <span className="flex items-center gap-2">
                      <SVGComponent svgType="calender" className="w-5 h-5" />
                      {formatDate(selectedRoadmap.start_date)} - {formatDate(selectedRoadmap.end_date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <SVGComponent svgType="task_logo" className="w-5 h-5" />
                      {selectedRoadmap.todo_count} tasks
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-gray-900 dark:text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <SVGComponent svgType="editWrite" className="w-5 h-5" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-gray-900 dark:text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <SVGComponent svgType="delete" className="w-5 h-5" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white/80">Overall Progress</span>
                  <span className="text-lg font-bold text-white">
                    {Math.round(selectedRoadmap.progress)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                      selectedRoadmap.progress
                    )}`}
                    style={{ width: `${selectedRoadmap.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">To Do</p>
                    <p className="text-3xl font-bold text-white">{tasksByStatus.todo.length}</p>
                  </div>
                  <div className="bg-slate-500/20 rounded-full p-3">
                    <SVGComponent svgType="task_logo" className="w-8 h-8 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">In Progress</p>
                    <p className="text-3xl font-bold text-blue-400">{tasksByStatus.inProgress.length}</p>
                  </div>
                  <div className="bg-blue-500/20 rounded-full p-3">
                    <SVGComponent svgType="rightArrowHead" className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Done</p>
                    <p className="text-3xl font-bold text-green-400">{tasksByStatus.done.length}</p>
                  </div>
                  <div className="bg-green-500/20 rounded-full p-3">
                    <SVGComponent svgType="check" className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-6 backdrop-blur-xl">
              <RoadmapTimeline
                roadmapId={roadmapId}
                startDate={selectedRoadmap.start_date}
                endDate={selectedRoadmap.end_date}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && selectedRoadmap && (
        <RoadmapForm
          roadmap={selectedRoadmap}
          onSubmit={handleEdit}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
}
