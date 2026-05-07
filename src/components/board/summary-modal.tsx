'use client';

import { useState, useEffect } from 'react';

interface SummaryModalProps {
  roomId: string;
  onClose: () => void;
}

export function SummaryModal({ roomId, onClose }: SummaryModalProps) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    async function generate() {
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Failed to generate summary');
          return;
        }
        const data = await res.json();
        setSummary(data.summary);
      } catch {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    generate();
  }, [roomId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-bg-secondary border border-border rounded-xl shadow-2xl animate-[scaleIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V11h3a3 3 0 0 1 3 3v1.5a2.5 2.5 0 0 1-5 0V14H9v1.5a2.5 2.5 0 0 1-5 0V14a3 3 0 0 1 3-3h3V9.4A4 4 0 0 1 12 2z" />
            </svg>
            <h2 className="text-lg font-semibold text-text-primary">AI Summary</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-text-secondary">Generating summary...</p>
            </div>
          )}
          {error && (
            <div className="py-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {!loading && !error && summary && (
            <div className="prose prose-sm max-w-none text-text-primary">
              {summary.split('\n').map((line, i) => {
                if (line.startsWith('## ') || line.startsWith('**')) {
                  return <p key={i} className="font-semibold text-text-primary mt-3 mb-1">{line.replace(/[#*]/g, '').trim()}</p>;
                }
                if (line.startsWith('- ')) {
                  return <p key={i} className="text-sm text-text-primary pl-4 py-0.5">{line}</p>;
                }
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="text-sm text-text-primary py-0.5">{line}</p>;
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="px-6 py-3 border-t border-border flex justify-end gap-2">
            <button
              onClick={() => { navigator.clipboard.writeText(summary); }}
              className="px-4 py-2 text-sm font-medium text-text-primary bg-bg-elevated border border-border rounded-md hover:border-border-hover transition-colors"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-bg-primary bg-accent rounded-md hover:bg-accent-dim transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
