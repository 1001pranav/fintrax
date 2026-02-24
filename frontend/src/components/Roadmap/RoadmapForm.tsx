'use client';

import { useState, useEffect } from 'react';
import { Roadmap, CreateRoadmapData } from '@/lib/api';

interface RoadmapFormProps {
  roadmap?: Roadmap | null;
  onSubmit: (data: CreateRoadmapData) => Promise<void>;
  onClose: () => void;
}

export default function RoadmapForm({ roadmap, onSubmit, onClose }: RoadmapFormProps) {
  const [formData, setFormData] = useState<CreateRoadmapData>({
    name: '',
    start_date: '',
    end_date: '',
    progress: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (roadmap) {
      setFormData({
        name: roadmap.name,
        start_date: roadmap.start_date ? new Date(roadmap.start_date).toISOString().split('T')[0] : '',
        end_date: roadmap.end_date ? new Date(roadmap.end_date).toISOString().split('T')[0] : '',
        progress: roadmap.progress || 0,
      });
    }
  }, [roadmap]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Roadmap name is required';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate < startDate) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    if (formData.progress !== undefined && (formData.progress < 0 || formData.progress > 100)) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save roadmap:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateRoadmapData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {roadmap ? 'Edit Roadmap' : 'Create Roadmap'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Roadmap Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter roadmap name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              value={formData.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              value={formData.end_date}
              onChange={(e) => handleChange('end_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.end_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.end_date && <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>}
          </div>

          {/* Progress */}
          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">
              Progress (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                id="progress"
                min="0"
                max="100"
                step="1"
                value={formData.progress}
                onChange={(e) => handleChange('progress', parseFloat(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(formData.progress || 0)}
                onChange={(e) => handleChange('progress', parseFloat(e.target.value) || 0)}
                className={`w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.progress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.progress && <p className="mt-1 text-sm text-red-500">{errors.progress}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? 'Saving...' : roadmap ? 'Update Roadmap' : 'Create Roadmap'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
