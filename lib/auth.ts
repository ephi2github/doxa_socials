import 'server-only';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { randomUUID } from 'node:crypto';
import { db } from './db';
import { profile } from './schema';
import { resetPasswordEmail, sendEmail } from './email';

export const GOOGLE_ENABLED = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your DOXA Social password',
        html: resetPasswordEmail(user.name, url),
      });
    },
  },
  socialProviders: GOOGLE_ENABLED
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : {},
  account: {
    // Someone who signed up with a password and later uses "Continue with Google" on the
    // same address should land in the same account, not hit a duplicate-email error.
    accountLinking: { enabled: true, trustedProviders: ['google'] },
  },
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
            // Google supplies an avatar URL; it is not an R2 object, so the profile
            // update path's R2 cleanup ignores it.
            photoUrl: createdUser.image || null,
            links: {},
            updatedAt: new Date(),
          }).onConflictDoNothing();
        },
      },
    },
  },
  plugins: [nextCookies()],
});
