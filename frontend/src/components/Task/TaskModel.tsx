'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { useTodoStore } from '@/lib/todoStore';
import { Tags, TaskFormData } from '@/constants/interfaces';
import SVGComponent from '../svg';
import { TASK_TAG_COLORS } from '@/constants/generalConstants';
import ResourceList from './Resources/ResourceList';

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-green-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-red-400' }
];

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
];

export default function TaskModal() {
  const {
    isTaskModalOpen,
    setTaskModalOpen,
    selectedProject
  } = useAppStore();

  const {
    selectedTask,
    setSelectedTask,
    createTask,
    updateTask,
    deleteTask,
    todos,
    tags,
    fetchTags,
    createTag,
    isLoadingTags,
  } = useTodoStore();

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    tags: [],
    notes: '',
    priority: 'medium',
    status: 'todo',
    parentTaskId: ''
  });

  const [tagInput, setTagInput] = useState<Tags>({ id: '', name: '', color: '' });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [mainTaskInfo, setMainTaskInfo] = useState<string | null>(selectedTask?.parentTaskId || null);
  const isEditing = selectedTask?.id ? true : false;

  // Fetch tags when modal opens
  useEffect(() => {
    if (isTaskModalOpen) {
      fetchTags();
    }
  }, [isTaskModalOpen, fetchTags]);

  const handleClose = useCallback(() => {
    setTaskModalOpen(false);
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      tags: [],
      notes: '',
      priority: 'medium',
      parentTaskId: '',
      status: 'todo'
    });
    setMainTaskInfo(null);
    setTagInput({ id: '', name: '', color: '' });
    setShowColorPicker(false);
  }, [setTaskModalOpen, setSelectedTask, setFormData, setTagInput]);
  
  useEffect(() => {
    if (isTaskModalOpen && selectedTask) {
      setFormData({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        startDate: selectedTask.startDate ? new Date(selectedTask.startDate).toISOString().split('T')[0] : '',
        endDate: selectedTask.endDate ? new Date(selectedTask.endDate).toISOString().split('T')[0] : '',
        tags: selectedTask.tags || [],
        notes: selectedTask.notes || '',
        priority: selectedTask.priority || 'medium',
        status: selectedTask.status || 'todo',
        parentTaskId: selectedTask.parentTaskId || ''
      });
    }
  }, [isTaskModalOpen, selectedTask]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    }
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    }
  }, [handleClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject) return;

    const taskData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      projectId: selectedProject.id
    };

    // Handle parent task assignment
    if (mainTaskInfo && !selectedTask?.parentTaskId) {
      const mainTask = todos.find(task => task.id === mainTaskInfo);
      if (mainTask) {
        taskData.parentTaskId = mainTaskInfo;
      }
    }

    try {
      if (isEditing && selectedTask?.id) {
        await updateTask(selectedTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save task:', error);
      // Error is handled by the store, just log it
    }
  };

  const handleMainTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTaskId = e.target.value;
    setFormData({ ...formData, parentTaskId: selectedTaskId || '' });
    setMainTaskInfo(selectedTaskId ? selectedTaskId : null);
  }

  const handleDelete = async () => {
    if (selectedTask?.id && confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(selectedTask.id);
        handleClose();
      } catch (error) {
        console.error('Failed to delete task:', error);
        // Error is handled by the store, just log it
      }
    }
  };

  const handleColorSelect = (color: string) => {
    setTagInput({ ...tagInput, color });
    setShowColorPicker(false);
  };

  const addTagFromDropdown = (tag: Tags) => {
    if (!formData.tags.some(t => t.id === tag.id)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
    setShowTagDropdown(false);
  };

  const createAndAddTag = async () => {
    if (tagInput.name.trim()) {
      try {
        const color = tagInput.color || TASK_TAG_COLORS[0];
        await createTag(tagInput.name.trim(), color);

        // After creating, fetch tags again to get the new tag with ID
        await fetchTags();

        setTagInput({ id: '', name: '', color: '' });
        setShowColorPicker(false);
      } catch (error) {
        console.error('Failed to create tag:', error);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tagInfo => tagInfo.name !== tagToRemove)
    });
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createAndAddTag();
    }
  };

  // Get available tags (exclude already selected tags)
  const availableTags = tags.filter(tag => !formData.tags.some(t => t.id === tag.id));

  if (!isTaskModalOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <div className="flex items-center space-x-2">
            {isEditing && (
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <SVGComponent svgType="delete" className="w-5 h-5 text-red-400" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <SVGComponent svgType="x" className="w-5 h-5 text-gray-600 dark:text-white/60" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 shadow-sm"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 resize-none shadow-sm"
              placeholder="Task description"
              rows={3}
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 shadow-sm"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'todo' | 'in-progress' | 'done' })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 shadow-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 shadow-sm"
              />
            </div>
          </div>

          {/* Task Dropdown Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
              Select Main Task
            </label>
            <select
              value={formData.parentTaskId}
              onChange={(e) => handleMainTaskChange(e)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 shadow-sm"
            >
              <option value="">-- Select a task --</option>
              {todos
                .filter((task) => task.projectId === selectedProject?.id && task.id !== selectedTask?.id)
                .map((task) => (
                  <option key={task.id} value={task.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    {task.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {/* Tag Selector & Create Row */}
              <div className="flex space-x-2">
                {/* Tag Dropdown Selector */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between shadow-sm"
                  >
                    <span className="text-gray-600 dark:text-white/70">Select existing tag...</span>
                    <SVGComponent svgType="chevron-down" className="w-4 h-4 text-gray-600 dark:text-white/60" />
                  </button>

                  {/* Tag Dropdown */}
                  {showTagDropdown && (
                    <div className="absolute top-12 left-0 right-0 z-10 max-h-48 overflow-y-auto bg-white dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-xl shadow-xl">
                      {isLoadingTags ? (
                        <div className="p-4 text-gray-600 dark:text-white/60 text-center text-sm">Loading tags...</div>
                      ) : availableTags.length > 0 ? (
                        availableTags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => addTagFromDropdown(tag)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center space-x-2"
                          >
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="text-gray-900 dark:text-white text-sm">{tag.name}</span>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-gray-600 dark:text-white/60 text-center text-sm">No tags available</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Create New Tag Row */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput.name}
                  onChange={(e) => setTagInput({ ...tagInput, name: e.target.value })}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 shadow-sm"
                  placeholder="Create new tag..."
                />

                {/* Color Picker Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center justify-center w-12 h-10 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm"
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-white/40"
                      style={{ backgroundColor: tagInput.color || TASK_TAG_COLORS[0] }}
                    />
                  </button>

                  {/* Color Picker Dropdown */}
                  {showColorPicker && (
                    <div className="absolute top-12 right-0 z-10 p-3 bg-white dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-xl shadow-xl">
                      <div className="grid grid-cols-4 gap-2">
                        {TASK_TAG_COLORS.map((color, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleColorSelect(color)}
                            className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${
                              tagInput.color === color
                                ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-transparent"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={createAndAddTag}
                  disabled={isLoadingTags || !tagInput.name.trim()}
                  className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-600 dark:text-green-300 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
              
              {/* Selected Tags Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 text-gray-900 dark:text-white rounded-lg text-sm"
                      style={{ backgroundColor: tag?.color || TASK_TAG_COLORS[0] }}
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => removeTag(tag.name)}
                        className="ml-2 hover:text-red-300 transition-colors"
                      >
                        <SVGComponent svgType="x" className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white/90 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 resize-none shadow-sm"
              placeholder="Additional notes"
              rows={3}
            />
          </div>

          {/* Resources - Only show for existing tasks */}
          {isEditing && selectedTask?.task_id && (
            <div className="border-t border-gray-200 dark:border-white/10 pt-4">
              <ResourceList
                todoId={selectedTask.task_id}
                onResourcesChange={() => {
                  // Optionally refresh task data if needed
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              {isEditing ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}