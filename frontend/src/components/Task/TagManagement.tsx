'use client';

import { useState, useEffect } from 'react';
import { useTodoStore } from '@/lib/todoStore';
import { Tags } from '@/constants/interfaces';
import SVGComponent from '../svg';
import { TASK_TAG_COLORS } from '@/constants/generalConstants';

interface TagManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TagManagement({ isOpen, onClose }: TagManagementProps) {
  const {
    tags,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    isLoadingTags,
    tagError,
    clearTagError,
  } = useTodoStore();

  const [editingTag, setEditingTag] = useState<Tags | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TASK_TAG_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen, fetchTags]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleClose = () => {
    setEditingTag(null);
    setNewTagName('');
    setNewTagColor(TASK_TAG_COLORS[0]);
    setShowColorPicker(false);
    clearTagError();
    onClose();
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await createTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setNewTagColor(TASK_TAG_COLORS[0]);
      setShowColorPicker(false);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.name.trim()) return;

    try {
      await updateTag(editingTag.id, editingTag.name.trim(), editingTag.color);
      setEditingTag(null);
    } catch (error) {
      console.error('Failed to update tag:', error);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (confirm('Are you sure you want to delete this tag? It will be removed from all tasks.')) {
      try {
        await deleteTag(tagId);
      } catch (error) {
        console.error('Failed to delete tag:', error);
      }
    }
  };

  const startEditingTag = (tag: Tags) => {
    setEditingTag({ ...tag });
  };

  const cancelEditing = () => {
    setEditingTag(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Manage Tags</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <SVGComponent svgType="x" className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Error Message */}
        {tagError && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <p className="text-sm text-red-300">{tagError}</p>
          </div>
        )}

        {/* Create New Tag */}
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
          <h3 className="text-sm font-medium text-white/90 mb-3">Create New Tag</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
              placeholder="Tag name"
            />

            {/* Color Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center justify-center w-12 h-10 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white/40"
                  style={{ backgroundColor: newTagColor }}
                />
              </button>

              {showColorPicker && (
                <div className="absolute top-12 right-0 z-10 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl">
                  <div className="grid grid-cols-4 gap-2">
                    {TASK_TAG_COLORS.map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewTagColor(color);
                          setShowColorPicker(false);
                        }}
                        className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${
                          newTagColor === color
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCreateTag}
              disabled={isLoadingTags || !newTagName.trim()}
              className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>

        {/* Existing Tags List */}
        <div>
          <h3 className="text-sm font-medium text-white/90 mb-3">Existing Tags</h3>
          {isLoadingTags ? (
            <div className="text-center py-8 text-white/60">Loading tags...</div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              No tags yet. Create your first tag above!
            </div>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  {editingTag?.id === tag.id ? (
                    // Edit Mode
                    <>
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0 cursor-pointer border-2 border-white/40"
                        style={{ backgroundColor: editingTag.color }}
                        onClick={() => {
                          const currentIndex = TASK_TAG_COLORS.indexOf(editingTag.color);
                          const nextIndex = (currentIndex + 1) % TASK_TAG_COLORS.length;
                          setEditingTag({ ...editingTag, color: TASK_TAG_COLORS[nextIndex] });
                        }}
                      />
                      <input
                        type="text"
                        value={editingTag.name}
                        onChange={(e) =>
                          setEditingTag({ ...editingTag, name: e.target.value })
                        }
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdateTag()}
                        className="flex-1 px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateTag}
                          className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors"
                        >
                          <SVGComponent svgType="check" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors"
                        >
                          <SVGComponent svgType="x" className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="flex-1 text-white">{tag.name}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditingTag(tag)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <SVGComponent svgType="edit" className="w-4 h-4 text-white/60" />
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <SVGComponent svgType="delete" className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
