'use client';

import { VoteButton } from './vote-button';
import type { Note, ColumnType } from '@/types';

const STICKY_COLORS: Record<ColumnType, string> = {
  went_well: 'var(--sticky-well)',
  went_wrong: 'var(--sticky-wrong)',
  improvements: 'var(--sticky-improve)',
  action_items: 'var(--sticky-action)',
};

interface StickyNoteProps {
  note: Note;
  columnType: ColumnType;
  isOwner: boolean;
  isAdmin: boolean;
  isRead: boolean;
  onVote: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export function StickyNote({ note, columnType, isOwner, isAdmin, isRead, onVote, onDelete, onClick }: StickyNoteProps) {
  return (
    <div
      className={`relative rounded-md p-3 group shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${isRead ? 'opacity-70' : ''}`}
      style={{ backgroundColor: STICKY_COLORS[columnType] }}
      onClick={onClick}
    >
      {/* Unread indicator dot */}
      {!isRead && (
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm" />
      )}

      <p className="text-sm text-gray-900 font-medium whitespace-pre-wrap break-words mb-2 line-clamp-4">
        {note.content}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VoteButton voteCount={note.voteCount} hasVoted={note.hasVoted ?? false} onVote={(e) => { e.stopPropagation(); onVote(); }} />
          <span className="text-xs text-gray-700 font-medium">{note.participantName}</span>
        </div>
        {(isOwner || isAdmin) && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 text-xs text-red-900 hover:text-red-700 font-medium transition-opacity"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
