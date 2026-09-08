import { boolean, index, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export type LinksMap = Record<string, string>;

const timestamptz = (name: string) => timestamp(name, { withTimezone: true, mode: 'date' });

// Better Auth required tables (id/text everywhere — Better Auth uses string ids)
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamptz('createdAt').notNull(),
  updatedAt: timestamptz('updatedAt').notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamptz('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamptz('createdAt').notNull(),
  updatedAt: timestamptz('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamptz('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamptz('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamptz('createdAt').notNull(),
  updatedAt: timestamptz('updatedAt').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamptz('expiresAt').notNull(),
  createdAt: timestamptz('createdAt'),
  updatedAt: timestamptz('updatedAt'),
});

// Application tables
export const profile = pgTable('profile', {
  userId: text('userId').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  publicId: text('publicId').notNull().unique(),
  displayName: text('displayName').notNull(),
  photoUrl: text('photoUrl'),
  links: jsonb('links').$type<LinksMap>().notNull().default({}),
  updatedAt: timestamptz('updatedAt').notNull(),
});

export const profileSocialUniqueClick = pgTable(
  'profileSocialUniqueClick',
  {
    id: text('id').primaryKey(),
    profileUserId: text('profileUserId')
      .notNull()
      .references(() => profile.userId, { onDelete: 'cascade' }),
    platformId: text('platformId').notNull(),
    ipHash: text('ipHash').notNull(),
    createdAt: timestamptz('createdAt').notNull(),
  },
  (table) => ({
    profilePlatformIpUnique: uniqueIndex('profileSocialUniqueClick_profilePlatformIpUnique').on(
      table.profileUserId,
      table.platformId,
      table.ipHash
    ),
  })
);

// One row per public profile view. Deliberately not de-duplicated: total views come from
// count(*), unique visitors from count(distinct ipHash).
export const profileView = pgTable(
  'profileView',
  {
    id: text('id').primaryKey(),
    profileUserId: text('profileUserId')
      .notNull()
      .references(() => profile.userId, { onDelete: 'cascade' }),
    ipHash: text('ipHash').notNull(),
    createdAt: timestamptz('createdAt').notNull(),
  },
  (table) => ({
    profileCreatedAtIdx: index('profileView_profileCreatedAtIdx').on(
      table.profileUserId,
      table.createdAt
    ),
  })
);

// Explicit QR distribution actions taken by an owner from their dashboard.
export const qrEvent = pgTable(
  'qrEvent',
  {
    id: text('id').primaryKey(),
    profileUserId: text('profileUserId')
      .notNull()
      .references(() => profile.userId, { onDelete: 'cascade' }),
    kind: text('kind').notNull(),
    createdAt: timestamptz('createdAt').notNull(),
  },
  (table) => ({
    kindCreatedAtIdx: index('qrEvent_kindCreatedAtIdx').on(table.kind, table.createdAt),
  })
);

export const QR_EVENT_KINDS = ['download', 'copy_link'] as const;
export type QrEventKind = (typeof QR_EVENT_KINDS)[number];

export type Profile = typeof profile.$inferSelect;
