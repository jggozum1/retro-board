import { cookies } from 'next/headers';
import { db } from './db';
import { participants } from './db/schema';
import { eq } from 'drizzle-orm';

const SESSION_COOKIE = 'retro_session';

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.sessionToken, token))
    .limit(1);

  return participant || null;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}
