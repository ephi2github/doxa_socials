import type Database from "better-sqlite3";

export function ensureSqliteSchema(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" text PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "email" text NOT NULL UNIQUE,
      "emailVerified" integer NOT NULL DEFAULT 0,
      "image" text,
      "createdAt" integer NOT NULL,
      "updatedAt" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "session" (
      "id" text PRIMARY KEY NOT NULL,
      "expiresAt" integer NOT NULL,
      "token" text NOT NULL UNIQUE,
      "createdAt" integer NOT NULL,
      "updatedAt" integer NOT NULL,
      "ipAddress" text,
      "userAgent" text,
      "userId" text NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade
    );

    CREATE TABLE IF NOT EXISTS "account" (
      "id" text PRIMARY KEY NOT NULL,
      "accountId" text NOT NULL,
      "providerId" text NOT NULL,
      "userId" text NOT NULL,
      "accessToken" text,
      "refreshToken" text,
      "idToken" text,
      "accessTokenExpiresAt" integer,
      "refreshTokenExpiresAt" integer,
      "scope" text,
      "password" text,
      "createdAt" integer NOT NULL,
      "updatedAt" integer NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade
    );

    CREATE TABLE IF NOT EXISTS "verification" (
      "id" text PRIMARY KEY NOT NULL,
      "identifier" text NOT NULL,
      "value" text NOT NULL,
      "expiresAt" integer NOT NULL,
      "createdAt" integer,
      "updatedAt" integer
    );

    CREATE TABLE IF NOT EXISTS "profile" (
      "userId" text PRIMARY KEY NOT NULL,
      "publicId" text NOT NULL UNIQUE,
      "displayName" text NOT NULL,
      "photoUrl" text,
      "links" text NOT NULL DEFAULT '{}',
      "updatedAt" integer NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade
    );

    CREATE TABLE IF NOT EXISTS "profileSocialUniqueClick" (
      "id" text PRIMARY KEY NOT NULL,
      "profileUserId" text NOT NULL,
      "platformId" text NOT NULL,
      "ipHash" text NOT NULL,
      "createdAt" integer NOT NULL,
      FOREIGN KEY ("profileUserId") REFERENCES "profile"("userId") ON DELETE cascade,
      UNIQUE ("profileUserId", "platformId", "ipHash")
    );
  `);
}
