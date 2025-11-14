'use client';

import { useEffect, useState } from 'react';
import { useRoadmapStore } from '@/lib/roadmapStore';
import RoadmapCard from '@/components/Roadmap/RoadmapCard';
import RoadmapForm from '@/components/Roadmap/RoadmapForm';
import { Roadmap, CreateRoadmapData } from '@/lib/api';

export default function RoadmapsPage() {
  const { roadmaps, isLoading, error, fetchRoadmaps, createRoadmap, updateRoadmap, deleteRoadmap } =
    useRoadmapStore();
  const [showForm, setShowForm] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'date'>('date');

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  const handleCreateClick = () => {
    setEditingRoadmap(null);
    setShowForm(true);
  };

  const handleEditClick = (roadmap: Roadmap) => {
    setEditingRoadmap(roadmap);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: CreateRoadmapData) => {
    if (editingRoadmap) {
      await updateRoadmap(editingRoadmap.roadmap_id, data);
    } else {
      await createRoadmap(data);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRoadmap(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this roadmap?')) {
      await deleteRoadmap(id);
    }
  };

  // Filter roadmaps
  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    if (filterStatus === 'active') return roadmap.progress < 100;
    if (filterStatus === 'completed') return roadmap.progress >= 100;
    return true;
  });

  // Sort roadmaps
  const sortedRoadmaps = [...filteredRoadmaps].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress':
        return b.progress - a.progress;
      case 'date':
      default:
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Roadmaps</h1>
              <p className="text-gray-600 mt-1">Plan and track your long-term projects</p>
            </div>
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Roadmap
            </button>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Filter by Status */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Completed
              </button>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'progress' | 'date')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && roadmaps.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sortedRoadmaps.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roadmaps yet</h3>
            <p className="text-gray-600 mb-4">
              {filterStatus === 'all'
                ? 'Create your first roadmap to start planning your projects'
                : `No ${filterStatus} roadmaps found`}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={handleCreateClick}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Roadmap
              </button>
            )}
          </div>
        )}

        {/* Roadmap Grid */}
        {!isLoading && sortedRoadmaps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRoadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.roadmap_id}
                roadmap={roadmap}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!isLoading && sortedRoadmaps.length > 0 && (
          <div className="mt-8 flex justify-center gap-8 text-sm text-gray-600">
            <span>
              Total: <strong className="text-gray-900">{roadmaps.length}</strong>
            </span>
            <span>
              Active:{' '}
              <strong className="text-gray-900">
                {roadmaps.filter((r) => r.progress < 100).length}
              </strong>
            </span>
            <span>
              Completed:{' '}
              <strong className="text-gray-900">
                {roadmaps.filter((r) => r.progress >= 100).length}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <RoadmapForm roadmap={editingRoadmap} onSubmit={handleFormSubmit} onClose={handleFormClose} />
      )}
    </div>
  );
}
