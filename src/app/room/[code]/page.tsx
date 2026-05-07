import { db } from '@/lib/db';
import { rooms, participants, notes, votes } from '@/lib/db/schema';
import { getSession } from '@/lib/session';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { RoomView } from '@/components/board/room-view';
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

  const votedNoteIds = new Set(userVotes.map((v) => v.noteId));
  const notesWithVoteStatus: Note[] = roomNotes.map((n) => ({
    ...n,
    columnType: n.columnType as Note['columnType'],
    hasVoted: votedNoteIds.has(n.id),
  }));

  return (
    <RoomView
      roomId={room.id}
      roomCode={room.code}
      roomName={room.name}
      participantId={session.id}
      isAdmin={session.isAdmin}
      initialParticipants={participantList}
      initialNotes={notesWithVoteStatus}
    />
  );
}
