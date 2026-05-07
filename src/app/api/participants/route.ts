import { db } from '@/lib/db';
import { rooms, participants } from '@/lib/db/schema';
import { joinRoomSchema } from '@/lib/validators';
import { generateSessionToken } from '@/lib/utils';
import { setSessionCookie } from '@/lib/session';
import { eq } from 'drizzle-orm';
import { pusherServer } from '@/lib/pusher/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = joinRoomSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { code, displayName } = parsed.data;

    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.code, code.toUpperCase()))
      .limit(1);

    if (!room) {
      return Response.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.status !== 'active') {
      return Response.json({ error: 'Room is no longer active' }, { status: 403 });
    }

    const sessionToken = generateSessionToken();
    const [participant] = await db.insert(participants).values({
      roomId: room.id,
      displayName,
      sessionToken,
    }).returning();

    await setSessionCookie(sessionToken);

    await pusherServer.trigger(`room-${room.code}`, 'participant-joined', {
      id: participant.id,
      displayName: participant.displayName,
      isAdmin: participant.isAdmin,
      joinedAt: participant.joinedAt,
    });

    return Response.json({
      participantId: participant.id,
      roomCode: room.code,
      roomName: room.name,
    }, { status: 201 });
  } catch (error) {
    console.error('Join room error:', error);
    return Response.json({ error: 'Failed to join room' }, { status: 500 });
  }
}
