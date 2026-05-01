# DOXA Social — handoff brief

A persistent, editable link-in-bio with a permanent QR code per user. Brand-consistent with DOXA (purple `#7851A9` / Georama). Repo: https://github.com/ephi2github/doxa_socials. Working dir: `/home/ephi/Documents/GitHub/doxa_socials`.

## Product spec

- **Sign up / sign in** → user gets a stable `publicId` (UUID) at account creation.
- **Permanent QR**: encodes `${NEXT_PUBLIC_APP_URL}/u/{publicId}`. Never changes for a user, even after they edit their links.
- **Editor** at `/dashboard`: edit display name, photo, and a map of platform → handle (50+ platforms supported via `lib/platforms.ts`). Add/remove links freely.
- **Public viewer** at `/u/{publicId}`: shows tappable link list. If the current session belongs to that profile, an "Edit" pill appears at the top; otherwise it doesn't render. (Compute on the server — don't leak ownership client-side.)
- **Profile photo**: uploaded to Cloudflare R2 via presigned PUT; `photoUrl` stored on profile. UI must degrade gracefully if R2 isn't configured.
- **Design**: keep it minimal but decorative — soft purple gradient background, white floating cards, glow on the avatar, restrained ornamentation. Don't overdo it.

## Tech decisions (already made — keep unless you have a reason)

- **Next.js 15, App Router, React 19, TypeScript**
- **Better Auth** (`better-auth.com`) with **email + password** (no external email service for v1). Session cookies via `nextCookies()` plugin.
- **Drizzle ORM + better-sqlite3** (v12). DB path is `process.env.DATABASE_URL` (fallback `./data/doxa.db`). **Mount a persistent volume to that path in production.**
- **Cloudflare R2** via `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`. S3-compatible endpoint at `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`.
- **Tailwind v3** for styling. Global brand colors in `tailwind.config.ts`: `primary`, `secondary`, `accent`.
- **QR generation**: `qrcode` npm package, render server-side or client-side as you prefer.

## Current state — what's done

```
package.json            ✅  deps declared (next 15.1, better-auth ^1.1, drizzle ^0.36,
                            better-sqlite3 ^12, qrcode, @aws-sdk/* )
tsconfig.json           ✅
next.config.mjs         ✅  (serverComponentsExternalPackages: ['better-sqlite3'])
postcss.config.mjs      ✅
tailwind.config.ts      ✅
drizzle.config.ts       ✅
lib/schema.ts           ✅  user/session/account/verification (Better Auth) + profile
                            { userId PK → user.id, publicId UNIQUE, displayName,
                              photoUrl, links (JSON map), updatedAt }
lib/db.ts               ✅  better-sqlite3 + drizzle, WAL, FK on, auto-mkdir for DB dir
lib/auth.ts             ✅  betterAuth() with drizzleAdapter; databaseHooks.user.create
                            inserts a profile row with a fresh randomUUID publicId
lib/auth-client.ts      ✅  createAuthClient for the React side
lib/platforms.ts        ✅  ported from old static site, typed, 40+ platforms
lib/r2.ts               ✅  S3Client + R2_CONFIGURED guard
public/logo.svg         ⚠️  exists at repo root (logo.svg), MOVE to public/logo.svg
.gitignore              ✅  (will need /node_modules, /.next, /data added)
```

**`npm install` had ERESOLVE conflicts** because Better Auth declares Prisma 7 + better-sqlite3 ^12 as `peerOptional` and npm 11 still installs them. Run `npm install --legacy-peer-deps` (or add `"overrides": { "better-sqlite3": "^12.0.0" }` and re-run). Verify `node_modules/better-sqlite3` ends up at v12.

## What's left

1. **Move `logo.svg` → `public/logo.svg`** so Next can serve it. Update old root path references.
2. **Remove the static `index.html`** at repo root (preserved in git history) — the Next.js app replaces it.
3. **Run schema push**: `mkdir -p data && npx drizzle-kit push` (creates SQLite file + tables).
4. **API routes**:
   - `app/api/auth/[...all]/route.ts` — `import { auth } from '@/lib/auth'; export const { GET, POST } = toNextJsHandler(auth);` (use `better-auth/next-js` `toNextJsHandler`).
   - `app/api/profile/route.ts` — `GET` returns current user's profile; `PUT` accepts `{ displayName, photoUrl, links }` and writes to the `profile` row. Validate that every key in `links` is in `PLATFORM_KEYS`. Authorize via `auth.api.getSession({ headers })`.
   - `app/api/upload/route.ts` — `POST` accepts `{ contentType, ext }`, returns a presigned PUT URL + the eventual public `photoUrl` (`${R2_PUBLIC_URL}/u/{userId}/{nanoid}.{ext}`). Reject if `!R2_CONFIGURED`. Cap content-length, restrict to image MIME.
5. **Pages** (App Router):
   - `app/layout.tsx` — Georama font (`next/font/google`), metadata (title/theme color #19003a), `<body class="font-sans bg-[var(--bg-gradient)] text-white">`, global gradient backdrop.
   - `app/globals.css` — palette variables, body gradient, card/button utilities. Port the look from the previous static `index.html` (gradient `#19003a → #2a0d5e → #3d1487`, radial glows, white cards with stronger purple shadows, gradient-text accent on hero h1).
   - `app/page.tsx` — landing: hero, "What it is" section, sign-in CTA. If session exists, redirect to `/dashboard`.
   - `app/sign-in/page.tsx`, `app/sign-up/page.tsx` — minimal forms calling `authClient.signIn.email` / `authClient.signUp.email`. Brand-consistent card.
   - `app/dashboard/page.tsx` — server component: get session → if none, redirect `/sign-in`; load profile; pass to client editor.
   - `app/dashboard/dashboard-client.tsx` — port the creator UI from the old static site (display-name input, platform search/filter, per-platform inputs, sticky preview card with QR + copy/download). Save via `PUT /api/profile`. Show the *permanent* QR pointing to `/u/${profile.publicId}` — never regenerate the publicId.
   - `app/u/[publicId]/page.tsx` — server component: look up profile by `publicId`. If not found → 404. Get session; if `session.user.id === profile.userId`, render an "Edit your card" pill linking to `/dashboard`. Render avatar (photoUrl OR generated initial), name, link list (port from old viewer), and a small "DOXA Social" badge.
6. **Components**:
   - `components/qr-preview.tsx` — uses `qrcode` to render to a `<canvas>`; expose copy + download actions.
   - `components/platform-icon.tsx` — `<img>` from `cdn.simpleicons.org/${icon}/${color}` with an inline-SVG fallback for `em`/`ph`/`ws`/`lk` from `lib/platforms.ts`.
   - `components/photo-upload.tsx` — drag/drop + click; calls `/api/upload`, PUTs to the presigned URL, sets `photoUrl`. Disabled with a hint when R2 isn't configured.
7. **Verify in browser** (dev server `npm run dev`):
   - Sign up → DB row in `user`, hook created `profile` with `publicId`.
   - Add some links, save, see QR.
   - Open `/u/{publicId}` in another browser/profile → edit pill is **absent**. Same browser logged-in as owner → edit pill is **present**.
   - Logout, hit `/dashboard` → redirected to `/sign-in`.
8. **Commit & push** to `origin/main`.

## Required env (`.env.local`)

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=./data/doxa.db          # mount a persistent volume here in prod
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000

# Optional — image uploads degrade gracefully if missing
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=https://pub-<id>.r2.dev   # or your custom R2 domain
```

## How to run (after the work above is done)

```bash
cd /home/ephi/Documents/GitHub/doxa_socials
npm install --legacy-peer-deps          # peer conflict workaround
mkdir -p data
npx drizzle-kit push                     # creates SQLite tables
cp .env.example .env.local && $EDITOR .env.local
npm run dev                              # http://localhost:3000
```

## Gotchas worth knowing

- **Don't expose `user.id`** in URLs — the QR uses `publicId` (a separate UUID stored on `profile`). Looking up by `publicId` is what protects the auth id.
- **`better-sqlite3` is native**; keep it in `serverComponentsExternalPackages` (already done in `next.config.mjs`) so Next doesn't try to bundle it.
- **Edit-pill ownership check** must be server-side; never trust a client flag.
- **Platform `links` JSON validation**: reject any key not in `PLATFORM_KEYS` and trim values; the old static site relied on this happening implicitly via the input list.
- **Brand**: keep purple-on-purple feel from the previous build — the user explicitly disliked excess white. Cards are white but they're floating on the gradient, not filling the page.
