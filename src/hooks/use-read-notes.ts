'use client';

import { useState, useCallback } from 'react';

function getStorageKey(roomId: string) {
  return `retro-read-${roomId}`;
}

function loadReadNotes(roomId: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(getStorageKey(roomId));
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function useReadNotes(roomId: string) {
  const [readNoteIds, setReadNoteIds] = useState<Set<string>>(() => loadReadNotes(roomId));

  const markAsRead = useCallback((noteId: string) => {
    setReadNoteIds((prev) => {
      const next = new Set(prev);
      next.add(noteId);
      localStorage.setItem(getStorageKey(roomId), JSON.stringify([...next]));
      return next;
    });
  }, [roomId]);

  const markAsUnread = useCallback((noteId: string) => {
    setReadNoteIds((prev) => {
      const next = new Set(prev);
      next.delete(noteId);
      localStorage.setItem(getStorageKey(roomId), JSON.stringify([...next]));
      return next;
    });
  }, [roomId]);

  const isRead = useCallback((noteId: string) => readNoteIds.has(noteId), [readNoteIds]);

  return { isRead, markAsRead, markAsUnread };
}
