import { db } from '@/lib/db';
import { notes, participants, rooms } from '@/lib/db/schema';
import { createNoteSchema } from '@/lib/validators';
import { getSession } from '@/lib/session';
import { pusherServer } from '@/lib/pusher/server';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const roomId = request.nextUrl.searchParams.get('roomId');
  if (!roomId) {
    return Response.json({ error: 'roomId required' }, { status: 400 });
  }

  const session = await getSession();
  if (!session || session.roomId !== roomId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const roomNotes = await db
    .select({
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
    .where(eq(notes.roomId, roomId));

  return Response.json(roomNotes);
}

export async function POST(request: Request) {
  try {
    const [session, body] = await Promise.all([getSession(), request.json()]);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = createNoteSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { roomId, columnType, content } = parsed.data;
    if (session.roomId !== roomId) {
      return Response.json({ error: 'Not a member of this room' }, { status: 403 });
    }

    // Insert note and get room code in parallel
    const [[note], [room]] = await Promise.all([
      db.insert(notes).values({ roomId, participantId: session.id, columnType, content }).returning(),
      db.select({ code: rooms.code }).from(rooms).where(eq(rooms.id, roomId)).limit(1),
    ]);

    const noteWithName = {
      ...note,
      participantName: session.displayName,
      hasVoted: false,
    };

    // Fire-and-forget Pusher (don't block response)
    pusherServer.trigger(`room-${room.code}`, 'note-added', noteWithName).catch(console.error);

    return Response.json(noteWithName, { status: 201 });
  } catch (error) {
    console.error('Create note error:', error);
    return Response.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
