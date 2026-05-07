'use client';

import { useState, useRef, useEffect } from 'react';
import type { ColumnType } from '@/types';
import { COLUMN_CONFIG } from '@/types';

const COLUMNS: ColumnType[] = ['went_well', 'went_wrong', 'improvements', 'action_items'];

interface FloatingNoteFormProps {
  onSubmit: (columnType: ColumnType, content: string) => Promise<void>;
}

export function FloatingNoteForm({ onSubmit }: FloatingNoteFormProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<ColumnType>('went_well');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(selectedColumn, content.trim());
      setContent('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-bg-primary text-sm font-semibold hover:bg-accent-dim transition-colors shadow-lg shadow-accent/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Note
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30"
        onClick={() => { setOpen(false); setContent(''); }}
      />
      {/* Form */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-bg-secondary border border-border rounded-xl p-5 shadow-2xl space-y-3 animate-[scaleIn_0.15s_ease-out]"
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setOpen(false); setContent(''); }
            }}
          >
            {/* Column selector */}
            <div className="flex gap-2 flex-wrap">
              {COLUMNS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setSelectedColumn(col)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedColumn === col
                      ? 'bg-accent text-bg-primary'
                      : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-border'
                  }`}
                >
                  {COLUMN_CONFIG[col].title}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              rows={4}
              className="w-full px-3 py-2 bg-bg-elevated border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent resize-none transition-colors"
              maxLength={500}
            />

            {/* Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{content.length}/500</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setOpen(false); setContent(''); }}
                  className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary bg-bg-elevated border border-border hover:border-border-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || submitting}
                  className="px-4 py-2 rounded-md bg-accent text-bg-primary text-sm font-medium hover:bg-accent-dim disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  {submitting ? 'Posting...' : 'Post Note'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
