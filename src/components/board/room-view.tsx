'use client';

import { RoomHeader } from '@/components/layout/room-header';
import { RetroBoard } from './retro-board';
import { useParticipants } from '@/hooks/use-participants';
import type { Note } from '@/types';

interface Participant {
  id: string;
  displayName: string;
  isAdmin: boolean;
  joinedAt: Date;
}

interface RoomViewProps {
  roomId: string;
  roomCode: string;
  roomName: string;
  participantId: string;
  isAdmin: boolean;
  initialParticipants: Participant[];
  initialNotes: Note[];
}

export function RoomView({ roomId, roomCode, roomName, participantId, isAdmin, initialParticipants, initialNotes }: RoomViewProps) {
  const participants = useParticipants(roomCode, initialParticipants);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <RoomHeader
        roomName={roomName}
        roomCode={roomCode}
        roomId={roomId}
        isAdmin={isAdmin}
        participants={participants}
        noteCount={initialNotes.length}
      />
      <div className="flex-1 p-4 overflow-hidden">
        <RetroBoard
          roomId={roomId}
          roomCode={roomCode}
          participantId={participantId}
          isAdmin={isAdmin}
          initialNotes={initialNotes}
        />
      </div>
    </div>
  );
}
