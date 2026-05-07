import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// HTTP driver is faster for serverless (no WebSocket handshake overhead)
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
