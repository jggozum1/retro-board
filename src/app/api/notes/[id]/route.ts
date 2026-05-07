import { db } from '@/lib/db';
import { notes, rooms } from '@/lib/db/schema';
import { updateNoteSchema } from '@/lib/validators';
import { getSession } from '@/lib/session';
import { pusherServer } from '@/lib/pusher/server';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [note] = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
  if (!note) {
    return Response.json({ error: 'Note not found' }, { status: 404 });
  }

  if (note.participantId !== session.id) {
    return Response.json({ error: 'Only the author can edit' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const [updated] = await db
    .update(notes)
    .set({ content: parsed.data.content, updatedAt: new Date() })
    .where(eq(notes.id, id))
    .returning();

  const [room] = await db.select({ code: rooms.code }).from(rooms).where(eq(rooms.id, note.roomId)).limit(1);
  await pusherServer.trigger(`room-${room.code}`, 'note-updated', updated);

  return Response.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [note] = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
  if (!note) {
    return Response.json({ error: 'Note not found' }, { status: 404 });
  }

  // Allow author or admin to delete
  if (note.participantId !== session.id && !session.isAdmin) {
    return Response.json({ error: 'Permission denied' }, { status: 403 });
  }

  await db.delete(notes).where(eq(notes.id, id));

  const [room] = await db.select({ code: rooms.code }).from(rooms).where(eq(rooms.id, note.roomId)).limit(1);
  await pusherServer.trigger(`room-${room.code}`, 'note-deleted', { id });

  return Response.json({ success: true });
}
