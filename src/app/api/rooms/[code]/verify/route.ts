import { db } from '@/lib/db';
import { rooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { pin } = await request.json();

  const [room] = await db
    .select()
    .from(rooms)
    .where(eq(rooms.code, code.toUpperCase()))
    .limit(1);

  if (!room) {
    return Response.json({ error: 'Room not found' }, { status: 404 });
  }

  const valid = await bcrypt.compare(pin, room.adminPin);
  if (!valid) {
    return Response.json({ error: 'Invalid PIN' }, { status: 401 });
  }

  return Response.json({ valid: true });
}
