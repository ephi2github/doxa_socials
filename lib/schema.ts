import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

// Better Auth required tables (id/text everywhere — Better Auth uses string ids)
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
});

// Application tables
export const profile = sqliteTable('profile', {
  userId: text('userId').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  publicId: text('publicId').notNull().unique(),
  displayName: text('displayName').notNull(),
  photoUrl: text('photoUrl'),
  links: text('links', { mode: 'json' }).notNull().default('{}'),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const profileSocialUniqueClick = sqliteTable(
  'profileSocialUniqueClick',
  {
    id: text('id').primaryKey(),
    profileUserId: text('profileUserId')
      .notNull()
      .references(() => profile.userId, { onDelete: 'cascade' }),
    platformId: text('platformId').notNull(),
    ipHash: text('ipHash').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    profilePlatformIpUnique: uniqueIndex('profileSocialUniqueClick_profilePlatformIpUnique').on(
      table.profileUserId,
      table.platformId,
      table.ipHash
    ),
  })
);

export type Profile = typeof profile.$inferSelect;
export type LinksMap = Record<string, string>;
