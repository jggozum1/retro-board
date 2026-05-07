'use client';

import { Column } from './column';
import { FloatingNoteForm } from './floating-note-form';
import { useNotes } from '@/hooks/use-notes';
import { useReadNotes } from '@/hooks/use-read-notes';
import type { ColumnType, Note } from '@/types';

const COLUMNS: ColumnType[] = ['went_well', 'went_wrong', 'improvements', 'action_items'];

interface RetroBoardProps {
  roomId: string;
  roomCode: string;
  participantId: string;
  isAdmin: boolean;
  initialNotes: Note[];
}

export function RetroBoard({ roomId, roomCode, participantId, isAdmin, initialNotes }: RetroBoardProps) {
  const { notes, addNote, deleteNote, toggleVote } = useNotes(roomId, roomCode, initialNotes);
  const { isRead, markAsRead, markAsUnread } = useReadNotes(roomId);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
        {COLUMNS.map((col) => (
          <Column
            key={col}
            type={col}
            notes={notes.filter((n) => n.columnType === col)}
            participantId={participantId}
            isAdmin={isAdmin}
            onVote={(noteId) => toggleVote(noteId)}
            onDelete={(noteId) => deleteNote(noteId)}
            isRead={isRead}
            onMarkAsRead={markAsRead}
            onMarkAsUnread={markAsUnread}
          />
        ))}
      </div>

      <FloatingNoteForm onSubmit={(columnType, content) => addNote(columnType, content)} />
    </>
  );
}
