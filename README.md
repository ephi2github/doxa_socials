# DOXA Social

<p align="center">
  <img src="./public/logo.svg" alt="DOXA Innovations PLC logo" width="96" />
</p>

<p align="center">
  <strong>A clean social profile and QR landing page platform by DOXA Innovations PLC.</strong>
</p>

<p align="center">
  Share one public page, one QR code, and all the right destinations.
</p>

---

## ✨ Overview

**DOXA Social** helps a person, brand, or team publish a single public profile page with:

- a display name
- a profile photo
- a custom mix of social platforms
- a shareable public link
- a QR code that stays valid even when links change
- owner-only unique click analytics per social link

It is designed for creators, consultants, event teams, businesses, and campaigns that need one polished digital handoff point.

---

## 🖼️ Product Preview

<p align="center">
  <img src="./creator-page.png" alt="DOXA Social dashboard preview" width="46%" />
  <img src="./viewer-page.png" alt="DOXA Social public profile preview" width="46%" />
</p>

---

## ✅ Core Features

- **Public social card**: one page for your key platforms and identity.
- **Live QR code**: print once, update links later.
- **Large platform library**: social, messaging, creator, payment, portfolio, and contact links.
- **Profile photo upload**: optional hosted image support through Cloudflare R2.
- **Private dashboard**: manage links, display name, and photo from one place.
- **Owner-only analytics**: every social link records unique clicks by IP hash and shows the count only to the QR/profile owner.
- **Secure sign-in flow**: built with Better Auth.

---

## 🧠 How It Works

1. **Sign up** and a profile is created automatically.
2. **Edit your dashboard** with your name, photo, and socials.
3. **Share your public URL or QR code** anywhere online or offline.
4. **Track engagement** from the dashboard using unique outbound click counts per platform.

---

## 🔐 Analytics Behavior

The click tracker currently works like this:

- counts are tracked **per profile owner and per platform**
- uniqueness is based on **IP hash**, not raw IP display
- repeated clicks from the same IP on the same platform do **not** increase the count
- the signed-in owner’s own clicks are **excluded**
- counts are visible **only in the owner dashboard**

---

## 🏗️ Tech Stack

- **Framework**: Next.js 15 + React 19
- **Language**: TypeScript
- **Database**: SQLite + Drizzle ORM
- **Authentication**: Better Auth
- **Storage**: Cloudflare R2 for profile images
- **QR generation**: `qrcode`
- **Styling**: Tailwind CSS

---

## 🚀 Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` with the following values:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=./data/doxa.db
BETTER_AUTH_SECRET=your-auth-secret
BETTER_AUTH_URL=http://localhost:3000

# Optional but recommended for click hashing isolation
CLICK_TRACKER_SECRET=your-click-tracker-secret

# Optional: profile image uploads
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=
```

### 3. Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## 🛠️ Scripts

```bash
npm run dev       # Start local development server
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run lint command
npm run db:push   # Push Drizzle schema changes
npm run db:studio # Open Drizzle Studio
```

---

## 📁 Important Paths

- `app/` — routes, pages, API handlers
- `app/dashboard/` — private owner dashboard
- `app/u/[publicId]/` — public profile page
- `lib/schema.ts` — Drizzle schema
- `lib/social-clicks.ts` — unique click tracking helpers
- `public/logo.svg` — DOXA brand mark used in the app

---

## 🌍 Use Cases

- **Creators**: one bio destination for all channels
- **Professionals**: a smarter QR business card
- **Campaigns**: update destination links without reprinting assets
- **Organizations**: keep a clean branded profile handoff

---

## 🏢 Brand Note

This product is presented as **DOXA Social**, a digital identity and social-sharing tool by **DOXA Innovations PLC**.

---

## 📌 Status

The current product supports:

- profile creation
- public social pages
- QR sharing
- photo uploads
- owner-only unique click analytics

Future improvements can include richer reporting, multi-user administration, and custom branding per profile.
