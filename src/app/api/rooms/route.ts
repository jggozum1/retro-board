import { db } from '@/lib/db';
import { rooms, participants } from '@/lib/db/schema';
import { createRoomSchema } from '@/lib/validators';
import { generateRoomCode, generateSessionToken } from '@/lib/utils';
import { setSessionCookie } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createRoomSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, pin, adminName } = parsed.data;
    const hashedPin = await bcrypt.hash(pin, 10);

    // Generate unique room code
    let code = generateRoomCode();
    let existing = await db.select().from(rooms).where(eq(rooms.code, code)).limit(1);
    while (existing.length > 0) {
      code = generateRoomCode();
      existing = await db.select().from(rooms).where(eq(rooms.code, code)).limit(1);
    }

    const [room] = await db.insert(rooms).values({
      name,
      code,
      adminPin: hashedPin,
    }).returning();

    // Create admin participant
    const sessionToken = generateSessionToken();
    await db.insert(participants).values({
      roomId: room.id,
      displayName: adminName,
      isAdmin: true,
      sessionToken,
    });

    await setSessionCookie(sessionToken);

    return Response.json({ code: room.code, roomId: room.id }, { status: 201 });
  } catch (error) {
    console.error('Create room error:', error);
    return Response.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
