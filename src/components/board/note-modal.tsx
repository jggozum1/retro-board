'use client';

import { useEffect, useState } from 'react';
import { VoteButton } from './vote-button';
import { ConfirmModal } from './confirm-modal';
import type { Note, ColumnType } from '@/types';
import { COLUMN_CONFIG } from '@/types';

const STICKY_COLORS: Record<ColumnType, string> = {
  went_well: 'var(--sticky-well)',
  went_wrong: 'var(--sticky-wrong)',
  improvements: 'var(--sticky-improve)',
  action_items: 'var(--sticky-action)',
};

interface NoteModalProps {
  note: Note;
  columnType: ColumnType;
  isOwner: boolean;
  isAdmin: boolean;
  isRead: boolean;
  onVote: () => void;
  onDelete: () => void;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  onClose: () => void;
}

export function NoteModal({ note, columnType, isOwner, isAdmin, isRead, onVote, onDelete, onMarkAsRead, onMarkAsUnread, onClose }: NoteModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showConfirm) setShowConfirm(false);
        else onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose, showConfirm]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <div
          className="relative w-full max-w-lg rounded-lg p-6 shadow-2xl transform animate-[scaleIn_0.2s_ease-out]"
          style={{ backgroundColor: STICKY_COLORS[columnType] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header: column badge + read status */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-gray-800 bg-white/40">
              {COLUMN_CONFIG[columnType].title}
            </span>
            {isRead && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-gray-700 bg-white/30">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Read
              </span>
            )}
          </div>

          {/* Note content */}
          <p className="text-lg text-gray-900 font-medium whitespace-pre-wrap break-words leading-relaxed mb-4">
            {note.content}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-900/10">
            <div className="flex items-center gap-3">
              <VoteButton voteCount={note.voteCount} hasVoted={note.hasVoted ?? false} onVote={() => onVote()} />
              <span className="text-sm text-gray-700 font-medium">by {note.participantName}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { if (!isRead) { onMarkAsRead(); onClose(); } else { onMarkAsUnread(); } }}
                className="px-3 py-1.5 text-xs font-medium text-gray-800 bg-white/40 rounded hover:bg-white/60 transition-colors"
              >
                {isRead ? 'Mark Unread' : 'Mark as Read'}
              </button>
              {(isOwner || isAdmin) && (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-3 py-1.5 text-xs font-medium text-red-900 bg-red-100/50 rounded hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              )}
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-gray-800 bg-white/40 rounded hover:bg-white/60 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={onDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
