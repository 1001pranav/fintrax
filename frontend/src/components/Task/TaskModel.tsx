'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { Tags, TaskFormData } from '@/constants/interfaces';
import SVGComponent from '../svg';
import { TASK_TAG_COLORS } from '@/constants/generalConstants';

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
    selectedTask, 
    setSelectedTask,
    addTask, 
    updateTask, 
    deleteTask,
    selectedProject 
  } = useAppStore();

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
  const [mainTaskInfo, setMainTaskInfo] = useState<string | null>(selectedTask?.parentTaskId || null);
  const isEditing = selectedTask?.id ? true : false;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;

    const taskData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      projectId: selectedProject.id
    };

    if (isEditing && selectedTask?.id) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
    if (mainTaskInfo && !selectedTask?.parentTaskId) {
      const mainTask = useAppStore.getState().tasks.find(task => task.id === mainTaskInfo);
      if (mainTask) {
        taskData.parentTaskId = mainTaskInfo;
      }
    }
    handleClose();
  };

  const handleMainTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTaskId = e.target.value;
    setFormData({ ...formData, parentTaskId: selectedTaskId || '' });
    setMainTaskInfo(selectedTaskId ? selectedTaskId : null);
  }

  const handleDelete = () => {
    if (selectedTask?.id && confirm('Are you sure you want to delete this task?')) {
      deleteTask(selectedTask.id);
      handleClose();
    }
  };

  const handleColorSelect = (color: string) => {
    setTagInput({ ...tagInput, color });
    setShowColorPicker(false);
  };

  const addTag = () => {
    if (tagInput.name.trim() && !formData.tags.some(tag => tag.name === tagInput.name.trim())) {
      const newTag = {
        ...tagInput,
        name: tagInput.name.trim(),
        color: tagInput.color || TASK_TAG_COLORS[0],
        id: Date.now().toString()
      };
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setTagInput({ id: '', name: '', color: '' });
      setShowColorPicker(false);
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
      addTag();
    }
  };

  if (!isTaskModalOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <div className="flex items-center space-x-2">
            {isEditing && (
              <button
                onClick={handleDelete}
                className="min-w-[40px] min-h-[40px] p-2 hover:bg-red-500/20 active:bg-red-500/30 rounded-lg transition-colors touch-manipulation"
                aria-label="Delete task"
              >
                <SVGComponent svgType="delete" className="w-5 h-5 text-red-400" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="min-w-[40px] min-h-[40px] p-2 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors touch-manipulation"
              aria-label="Close modal"
            >
              <SVGComponent svgType="x" className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full min-h-[44px] px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 touch-manipulation text-base"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 resize-none"
              placeholder="Task description"
              rows={3}
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full min-h-[44px] px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 touch-manipulation text-base"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'todo' | 'in-progress' | 'done' })}
                className="w-full min-h-[44px] px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 touch-manipulation text-base"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
              />
            </div>
          </div>

          {/* Task Dropdown Selection */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Select Main Task
            </label>
            <select
              value={formData.parentTaskId}
              onChange={(e) => handleMainTaskChange(e)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
            >
              <option value="">-- Select a task --</option>
              {useAppStore.getState().tasks
                .filter((task) => task.projectId === selectedProject?.id)
                .map((task) => (
                  <option key={task.id} value={task.id} className="bg-gray-800">
                    {task.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {/* Tag Input Row */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput.name}
                  onChange={(e) => setTagInput({ ...tagInput, name: e.target.value })}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
                  placeholder="Add a tag"
                />
                
                {/* Color Picker Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center justify-center w-12 h-10 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white/40"
                      style={{ backgroundColor: tagInput.color || TASK_TAG_COLORS[0] }}
                    />
                  </button>
                  
                  {/* Color Picker Dropdown */}
                  {showColorPicker && (
                    <div className="absolute top-12 right-0 z-10 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl">
                      <div className="grid grid-cols-4 gap-2">
                        {TASK_TAG_COLORS.map((color, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleColorSelect(color)}
                            className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${
                              tagInput.color === color
                                ? "ring-2 ring-white ring-offset-2 ring-offset-transparent"
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
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {/* Selected Tags Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 text-white rounded-lg text-sm"
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
            <label className="block text-sm font-medium text-white/90 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 resize-none"
              placeholder="Additional notes"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 min-h-[48px] py-3 px-4 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[48px] py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 active:from-blue-700 active:to-purple-800 transition-all duration-200 touch-manipulation"
            >
              {isEditing ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}