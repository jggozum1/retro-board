'use client';

import { useState, useRef, useEffect } from 'react';

interface NoteFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export function NoteForm({ onSubmit }: NoteFormProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
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
      await onSubmit(content.trim());
      setContent('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md bg-accent text-bg-primary text-sm font-medium hover:bg-accent-dim transition-colors shadow-md"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Note
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
        rows={3}
        className="w-full px-3 py-2 bg-bg-elevated border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent resize-none transition-colors"
        maxLength={500}
        onKeyDown={(e) => {
          if (e.key === 'Escape') { setOpen(false); setContent(''); }
        }}
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="flex-1 py-1.5 rounded-md bg-accent text-bg-primary text-sm font-medium hover:bg-accent-dim disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setContent(''); }}
          className="px-3 py-1.5 rounded-md text-sm font-medium text-text-secondary bg-bg-elevated border border-border hover:border-border-hover transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
