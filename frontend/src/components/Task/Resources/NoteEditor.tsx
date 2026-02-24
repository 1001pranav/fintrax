'use client';

import { useState, useEffect } from 'react';
import { api, Note } from '@/lib/api';

interface NoteEditorProps {
  todoId: number;
  noteId?: number;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function NoteEditor({ todoId, noteId, onSave, onCancel }: NoteEditorProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  const fetchNote = async () => {
    if (!noteId) return;
    setIsLoading(true);
    try {
      const response = await api.notes.getById(noteId);
      setContent(response.data.text);
    } catch (error) {
      console.error('Failed to fetch note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      if (noteId) {
        await api.notes.update(noteId, { text: content });
      } else {
        const note = await api.notes.create({ text: content });
        // Create resource linking note to task
        await api.resources.create({
          type: 4, // Notes type
          misc_id: note.data.note_id,
          todo_id: todoId,
        });
      }
      onSave?.();
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    const textarea = document.getElementById('note-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      content.substring(end);

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Formatting Toolbar */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => insertFormatting('**')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => insertFormatting('*')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={() => insertFormatting('~~')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </button>
        <button
          onClick={() => insertFormatting('`')}
          className="p-2 hover:bg-gray-100 rounded font-mono"
          title="Code"
        >
          {'</>'}
        </button>
        <button
          onClick={() => {
            const lines = content.split('\n');
            const textarea = document.getElementById('note-content') as HTMLTextAreaElement;
            const start = textarea?.selectionStart || 0;
            const lineStart = content.lastIndexOf('\n', start - 1) + 1;
            const newContent =
              content.substring(0, lineStart) + '- ' + content.substring(lineStart);
            setContent(newContent);
          }}
          className="p-2 hover:bg-gray-100 rounded"
          title="Bullet List"
        >
          •
        </button>
      </div>

      {/* Editor */}
      <textarea
        id="note-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here... (Supports basic Markdown formatting)"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] font-mono text-sm"
      />

      {/* Preview Hint */}
      <div className="text-xs text-gray-500">
        Supports basic Markdown: **bold**, *italic*, ~~strikethrough~~, `code`, - lists
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-gray-900 dark:text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Note'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
