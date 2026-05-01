import 'server-only';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { randomUUID } from 'node:crypto';
import { db } from './db';
import { profile } from './schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: { enabled: true, autoSignIn: true, minPasswordLength: 8 },
  session: { expiresIn: 60 * 60 * 24 * 30 },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          await db.insert(profile).values({
            userId: createdUser.id,
            publicId: randomUUID(),
            displayName: createdUser.name || createdUser.email.split('@')[0],
            photoUrl: null,
            links: '{}',
            updatedAt: new Date(),
          }).onConflictDoNothing();
        },
      },
    },
  },
  plugins: [nextCookies()],
});
