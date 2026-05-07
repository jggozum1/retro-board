'use client';

import { useState, useRef } from 'react';
import { StickyNote } from './sticky-note';
import { NoteModal } from './note-modal';
import { ScrollIndicator } from './scroll-indicator';
import type { Note, ColumnType } from '@/types';
import { COLUMN_CONFIG } from '@/types';

interface ColumnProps {
  type: ColumnType;
  notes: Note[];
  participantId: string;
  isAdmin: boolean;
  onVote: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  isRead: (noteId: string) => boolean;
  onMarkAsRead: (noteId: string) => void;
  onMarkAsUnread: (noteId: string) => void;
}

export function Column({ type, notes, participantId, isAdmin, onVote, onDelete, isRead, onMarkAsRead, onMarkAsUnread }: ColumnProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const config = COLUMN_CONFIG[type];
  const sortedNotes = [...notes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const unreadCount = notes.filter((n) => !isRead(n.id)).length;

  return (
    <>
      <div className="flex flex-col h-full min-w-[280px]">
        <div
          className="px-4 py-3 rounded-t-lg border border-border border-b-0"
          style={{ backgroundColor: `color-mix(in srgb, ${config.color} 10%, var(--bg-secondary))` }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">{config.title}</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-bold bg-accent text-bg-primary rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs text-text-secondary">{notes.length} notes</span>
        </div>
        <div className="relative flex-1 min-h-0 bg-bg-secondary border border-border border-t-0 rounded-b-lg">
          <div
            ref={scrollRef}
            className="absolute inset-0 column-scroll p-3 space-y-2"
          >
            {sortedNotes.map((note) => (
              <StickyNote
                key={note.id}
                note={note}
                columnType={type}
                isOwner={note.participantId === participantId}
                isAdmin={isAdmin}
                isRead={isRead(note.id)}
                onVote={() => onVote(note.id)}
                onDelete={() => onDelete(note.id)}
                onClick={() => setSelectedNote(note)}
              />
            ))}
            {notes.length === 0 && (
              <p className="text-xs text-text-secondary text-center py-4">No notes yet</p>
            )}
          </div>
          <ScrollIndicator containerRef={scrollRef} />
        </div>
      </div>

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          columnType={type}
          isOwner={selectedNote.participantId === participantId}
          isAdmin={isAdmin}
          isRead={isRead(selectedNote.id)}
          onVote={() => onVote(selectedNote.id)}
          onDelete={() => { onDelete(selectedNote.id); setSelectedNote(null); }}
          onMarkAsRead={() => onMarkAsRead(selectedNote.id)}
          onMarkAsUnread={() => onMarkAsUnread(selectedNote.id)}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </>
  );
}
