import 'server-only';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// node-postgres is lazy: constructing the pool does not open a connection.
// This lets `next build` compile without runtime secrets. Kubernetes supplies
// DATABASE_URL before the application handles any database-backed request.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const db = drizzle(pool, { schema });
export { schema };
