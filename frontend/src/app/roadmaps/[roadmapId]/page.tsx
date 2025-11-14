'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoadmapStore } from '@/lib/roadmapStore';
import { useTodoStore } from '@/lib/todoStore';
import RoadmapForm from '@/components/Roadmap/RoadmapForm';
import RoadmapTimeline from '@/components/Roadmap/RoadmapTimeline';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedRoadmap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Roadmap not found</h2>
          <button
            onClick={() => router.push('/roadmaps')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to roadmaps
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/roadmaps')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Roadmaps
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedRoadmap.name}</h1>
              <div className="flex items-center gap-6 text-gray-600">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(selectedRoadmap.start_date)} - {formatDate(selectedRoadmap.end_date)}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {selectedRoadmap.todo_count} tasks
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-lg font-bold text-gray-900">
                {Math.round(selectedRoadmap.progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">To Do</p>
                <p className="text-3xl font-bold text-gray-900">{tasksByStatus.todo.length}</p>
              </div>
              <div className="bg-gray-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{tasksByStatus.inProgress.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Done</p>
                <p className="text-3xl font-bold text-green-600">{tasksByStatus.done.length}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <RoadmapTimeline
            roadmapId={roadmapId}
            startDate={selectedRoadmap.start_date}
            endDate={selectedRoadmap.end_date}
          />
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
