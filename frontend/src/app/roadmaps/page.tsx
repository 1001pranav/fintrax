'use client';

import { useEffect, useState } from 'react';
import { useRoadmapStore } from '@/lib/roadmapStore';
import AppNavbar from '@/components/Layout/AppNavbar';
import Sidebar from '@/components/Layout/Sidebar';
import RoadmapCard from '@/components/Roadmap/RoadmapCard';
import RoadmapForm from '@/components/Roadmap/RoadmapForm';
import SVGComponent from '@/components/svg';
import { Roadmap, CreateRoadmapData } from '@/lib/api';

export default function RoadmapsPage() {
  const { roadmaps, isLoading, error, fetchRoadmaps, createRoadmap, updateRoadmap, deleteRoadmap } =
    useRoadmapStore();
  const [showForm, setShowForm] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'date'>('date');
  const [searchQuery, setSearchQuery] = useState('');

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
    // Filter by status
    if (filterStatus === 'active' && roadmap.progress >= 100) return false;
    if (filterStatus === 'completed' && roadmap.progress < 100) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return roadmap.name.toLowerCase().includes(query);
    }

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

  // Stats
  const stats = {
    total: roadmaps.length,
    active: roadmaps.filter(r => r.progress < 100).length,
    completed: roadmaps.filter(r => r.progress >= 100).length,
    avgProgress: roadmaps.length > 0
      ? Math.round(roadmaps.reduce((sum, r) => sum + r.progress, 0) / roadmaps.length)
      : 0,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
      <AppNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-white">Roadmaps</h1>
                <button
                  onClick={handleCreateClick}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  <SVGComponent svgType="plus" className="w-5 h-5" />
                  <span>Create Roadmap</span>
                </button>
              </div>
              <p className="text-white/60">Plan and track your long-term projects</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Roadmaps</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <SVGComponent svgType="map" className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Active</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <SVGComponent svgType="rightArrowHead" className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <SVGComponent svgType="check" className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Avg Progress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.avgProgress}%</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <SVGComponent svgType="completion_rate_logo" className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <SVGComponent
                    svgType="search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                  />
                  <input
                    type="text"
                    placeholder="Search roadmaps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-lg text-gray-900 dark:text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Filter by Status */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filterStatus === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-600 dark:text-white/60 hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filterStatus === 'active'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-600 dark:text-white/60 hover:bg-white/10'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filterStatus === 'completed'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-600 dark:text-white/60 hover:bg-white/10'
                  }`}
                >
                  Completed
                </button>
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'progress' | 'date')}
                className="px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-start space-x-3">
                  <SVGComponent svgType="errorCircle" className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-400">Error</h3>
                    <p className="mt-1 text-sm text-red-300/80">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && roadmaps.length === 0 && (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-white/60">Loading roadmaps...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && sortedRoadmaps.length === 0 && (
              <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                <SVGComponent svgType="map" className="w-16 h-16 mx-auto text-gray-300 dark:text-white/20 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No roadmaps found</h3>
                <p className="text-white/60 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : filterStatus === 'all'
                    ? 'Create your first roadmap to start planning your projects'
                    : `No ${filterStatus} roadmaps found`}
                </p>
                {filterStatus === 'all' && !searchQuery && (
                  <button
                    onClick={handleCreateClick}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                  >
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
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <RoadmapForm roadmap={editingRoadmap} onSubmit={handleFormSubmit} onClose={handleFormClose} />
      )}
    </div>
  );
}
