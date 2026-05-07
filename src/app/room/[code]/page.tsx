import { db } from '@/lib/db';
import { rooms, participants, notes, votes } from '@/lib/db/schema';
import { getSession } from '@/lib/session';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { RoomHeader } from '@/components/layout/room-header';
import { RetroBoard } from '@/components/board/retro-board';
import type { Note } from '@/types';

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const [{ code }, session] = await Promise.all([params, getSession()]);

  if (!session) {
    redirect(`/join?code=${code}`);
  }

  // All DB queries in parallel — single round of latency
  const [roomResult, participantList, roomNotes, userVotes] = await Promise.all([
    db.select().from(rooms).where(eq(rooms.code, code.toUpperCase())).limit(1),
    db.select({ id: participants.id, displayName: participants.displayName, isAdmin: participants.isAdmin, joinedAt: participants.joinedAt }).from(participants).where(eq(participants.roomId, session.roomId)),
    db.select({
      id: notes.id,
      roomId: notes.roomId,
      participantId: notes.participantId,
      columnType: notes.columnType,
      content: notes.content,
      voteCount: notes.voteCount,
      createdAt: notes.createdAt,
      participantName: participants.displayName,
    })
      .from(notes)
      .innerJoin(participants, eq(notes.participantId, participants.id))
      .where(eq(notes.roomId, session.roomId)),
    db.select({ noteId: votes.noteId }).from(votes).where(eq(votes.participantId, session.id)),
  ]);

  const room = roomResult[0];
  if (!room || session.roomId !== room.id) {
    redirect(`/join?code=${code}`);
  }

  // Mark which notes the user has voted on
  const votedNoteIds = new Set(userVotes.map((v) => v.noteId));
  const notesWithVoteStatus: Note[] = roomNotes.map((n) => ({
    ...n,
    columnType: n.columnType as Note['columnType'],
    hasVoted: votedNoteIds.has(n.id),
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <RoomHeader
        roomName={room.name}
        roomCode={room.code}
        roomId={room.id}
        isAdmin={session.isAdmin}
        participants={participantList}
        noteCount={notesWithVoteStatus.length}
      />
      <div className="flex-1 p-4 overflow-hidden">
        <RetroBoard
          roomId={room.id}
          roomCode={room.code}
          participantId={session.id}
          isAdmin={session.isAdmin}
          initialNotes={notesWithVoteStatus}
        />
      </div>
    </div>
  );
}
