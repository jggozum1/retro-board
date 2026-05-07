'use client';

import { useState } from 'react';
import { usePusher } from './use-pusher';

interface Participant {
  id: string;
  displayName: string;
  isAdmin: boolean;
  joinedAt: Date;
}

export function useParticipants(roomCode: string, initialParticipants: Participant[]) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);

  usePusher(`room-${roomCode}`, {
    'participant-joined': (data: unknown) => {
      const newParticipant = data as Participant;
      setParticipants((prev) => {
        if (prev.some((p) => p.id === newParticipant.id)) return prev;
        return [...prev, newParticipant];
      });
    },
  });

  return participants;
}
