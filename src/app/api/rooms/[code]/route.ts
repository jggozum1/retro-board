import { db } from '@/lib/db';
import { rooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const [room] = await db
    .select({ id: rooms.id, name: rooms.name, code: rooms.code, status: rooms.status })
    .from(rooms)
    .where(eq(rooms.code, code.toUpperCase()))
    .limit(1);

  if (!room) {
    return Response.json({ error: 'Room not found' }, { status: 404 });
  }

  return Response.json(room);
}
