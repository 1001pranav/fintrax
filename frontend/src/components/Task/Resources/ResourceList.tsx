'use client';

import { useState, useEffect } from 'react';
import { Resource, api } from '@/lib/api';

interface ResourceListProps {
  todoId: number;
  onResourcesChange?: () => void;
}

export default function ResourceList({ todoId, onResourcesChange }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState({
    type: 1, // 1=Link, 2=Audio, 3=Video, 4=Notes
    link: '',
  });

  useEffect(() => {
    fetchResources();
  }, [todoId]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await api.resources.getTodoResources(todoId);
      setResources(response.data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResource = async () => {
    if (!newResource.link.trim()) return;

    try {
      await api.resources.create({
        type: newResource.type,
        link: newResource.link,
        todo_id: todoId,
      });
      setNewResource({ type: 1, link: '' });
      setShowAddForm(false);
      await fetchResources();
      onResourcesChange?.();
    } catch (error) {
      console.error('Failed to add resource:', error);
      alert('Failed to add resource');
    }
  };

  const handleDeleteResource = async (resourceId: number) => {
    if (!confirm('Delete this resource?')) return;

    try {
      await api.resources.delete(resourceId);
      await fetchResources();
      onResourcesChange?.();
    } catch (error) {
      console.error('Failed to delete resource:', error);
      alert('Failed to delete resource');
    }
  };

  const getResourceIcon = (type: number) => {
    switch (type) {
      case 1: // Link
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        );
      case 2: // Audio
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        );
      case 3: // Video
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case 4: // Notes
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  const getResourceTypeLabel = (type: number) => {
    const labels = { 1: 'Link', 2: 'Audio', 3: 'Video', 4: 'Note' };
    return labels[type as keyof typeof labels] || 'Resource';
  };

  const groupedResources = resources.reduce((acc, resource) => {
    const type = resource.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(resource);
    return acc;
  }, {} as { [key: number]: Resource[] });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-900">Resources</h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Resource
        </button>
      </div>

      {/* Add Resource Form */}
      {showAddForm && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Link</option>
                <option value={2}>Audio</option>
                <option value={3}>Video</option>
                <option value={4}>Note</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="text"
                value={newResource.link}
                onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                placeholder="Enter URL or text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddResource}
                disabled={!newResource.link.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewResource({ type: 1, link: '' });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resources List */}
      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No resources attached</p>
          <p className="text-sm mt-1">Add links, notes, or media to this task</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedResources).map(([type, typeResources]) => (
            <div key={type} className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                {getResourceIcon(parseInt(type))}
                {getResourceTypeLabel(parseInt(type))}s ({typeResources.length})
              </h5>
              <div className="space-y-2">
                {typeResources.map((resource) => (
                  <div
                    key={resource.resource_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <a
                      href={resource.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-blue-600 hover:text-blue-700 truncate"
                    >
                      {resource.link}
                    </a>
                    <button
                      onClick={() => handleDeleteResource(resource.resource_id)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
