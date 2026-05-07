import { db } from '@/lib/db';
import { votes, notes, rooms } from '@/lib/db/schema';
import { voteSchema } from '@/lib/validators';
import { getSession } from '@/lib/session';
import { pusherServer } from '@/lib/pusher/server';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const [session, body] = await Promise.all([getSession(), request.json()]);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { noteId } = parsed.data;

    // Fetch note and existing vote in parallel
    const [[note], [existingVote]] = await Promise.all([
      db.select().from(notes).where(eq(notes.id, noteId)).limit(1),
      db.select().from(votes).where(and(eq(votes.noteId, noteId), eq(votes.participantId, session.id))).limit(1),
    ]);

    if (!note) {
      return Response.json({ error: 'Note not found' }, { status: 404 });
    }
    if (note.roomId !== session.roomId) {
      return Response.json({ error: 'Not in this room' }, { status: 403 });
    }

    let newVoteCount: number;

    if (existingVote) {
      await db.delete(votes).where(eq(votes.id, existingVote.id));
      [{ voteCount: newVoteCount }] = await db
        .update(notes)
        .set({ voteCount: sql`${notes.voteCount} - 1` })
        .where(eq(notes.id, noteId))
        .returning({ voteCount: notes.voteCount });
    } else {
      await db.insert(votes).values({ noteId, participantId: session.id });
      [{ voteCount: newVoteCount }] = await db
        .update(notes)
        .set({ voteCount: sql`${notes.voteCount} + 1` })
        .where(eq(notes.id, noteId))
        .returning({ voteCount: notes.voteCount });
    }

    // Fire-and-forget Pusher
    const [room] = await db.select({ code: rooms.code }).from(rooms).where(eq(rooms.id, note.roomId)).limit(1);
    pusherServer.trigger(`room-${room.code}`, 'vote-updated', { noteId, voteCount: newVoteCount }).catch(console.error);

    return Response.json({ noteId, voteCount: newVoteCount, hasVoted: !existingVote });
  } catch (error) {
    console.error('Vote error:', error);
    return Response.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
