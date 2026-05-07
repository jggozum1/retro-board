'use client';

import { useState, useCallback } from 'react';
import { usePusher } from './use-pusher';
import type { Note } from '@/types';

export function useNotes(roomId: string, roomCode: string, initialNotes: Note[] = []) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const addNote = async (columnType: string, content: string) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, columnType, content }),
    });
    if (!res.ok) throw new Error('Failed to create note');
    const note = await res.json();
    // Optimistic: add immediately (Pusher will deduplicate)
    setNotes((prev) => {
      if (prev.some((n) => n.id === note.id)) return prev;
      return [...prev, note];
    });
    return note;
  };

  const deleteNote = async (noteId: string) => {
    // Optimistic removal
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    if (!res.ok) {
      // Revert on failure — refetch
      const refetch = await fetch(`/api/notes?roomId=${roomId}`);
      if (refetch.ok) setNotes(await refetch.json());
    }
  };

  const toggleVote = async (noteId: string) => {
    // Optimistic toggle
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, hasVoted: !n.hasVoted, voteCount: n.voteCount + (n.hasVoted ? -1 : 1) }
          : n
      )
    );
    const res = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId }),
    });
    if (!res.ok) {
      // Revert on failure
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? { ...n, hasVoted: !n.hasVoted, voteCount: n.voteCount + (n.hasVoted ? -1 : 1) }
            : n
        )
      );
    }
  };

  usePusher(`room-${roomCode}`, {
    'note-added': (data: unknown) => {
      const note = data as Note;
      setNotes((prev) => {
        if (prev.some((n) => n.id === note.id)) return prev;
        return [...prev, note];
      });
    },
    'note-updated': (data: unknown) => {
      const updated = data as Note;
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? { ...n, ...updated } : n)));
    },
    'note-deleted': (data: unknown) => {
      const { id } = data as { id: string };
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    'vote-updated': (data: unknown) => {
      const { noteId, voteCount } = data as { noteId: string; voteCount: number };
      setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, voteCount } : n)));
    },
  });

  return { notes, addNote, deleteNote, toggleVote };
}
