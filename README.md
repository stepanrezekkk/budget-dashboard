# Budget Dashboard

Personal finance dashboard. Mobile-friendly, single-user. Tracks expenses across 7 categories (rent, food, internet, miscellaneous, cosmetic, clothes, tech) with optional monthly limits and progress bars.

**Stack:** Next.js 14 · TypeScript · Tailwind · Supabase (Postgres) · deploy on Vercel.

## Setup (one time, ~10 min)

### 1. Database & auth — Supabase (free)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, paste and run [`supabase/schema.sql`](supabase/schema.sql).
3. In **Project Settings → API**, copy the **Project URL** and **anon public** key.
4. In **Authentication → Providers → Email**, leave "Email" enabled (magic link works out of the box).
5. (Recommended for a single-user app) In **Authentication → Sign In / Up**, **disable "Allow new users to sign up"** AFTER you've signed in once yourself — this stops anyone else from creating an account against your project.
6. In **Authentication → URL Configuration**, set your **Site URL** to your Vercel domain (and add `http://localhost:3000` to the redirect allowlist for local dev).

### 2. Local dev

```bash
npm install
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open http://localhost:3000.

### 3. Deploy — Vercel (free)

1. Push this repo to GitHub (already done).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the same two env vars in the Vercel project settings.
4. Deploy. Open the URL on your phone and add to home screen.

## Access control

- Auth: Supabase magic-link email. The app shows a sign-in screen until a session exists.
- RLS: every row in `expenses` and `budgets` is keyed to `user_id`; policies enforce `auth.uid() = user_id` for select / insert / update / delete. Other users (if any existed) could not read or write your rows.
- Lockout: after your first sign-in, disable new signups in Supabase auth settings (step 5 above) so nobody else can create an account against your project.

## Conventions

- Currency: CZK (change the `Intl.NumberFormat` locale in [`src/lib/format.ts`](src/lib/format.ts) to switch).
- Month boundary: local time, first of the calendar month.
- Categories are a fixed enum — to add one, update [`src/types.ts`](src/types.ts) AND the SQL `check` constraints in [`supabase/schema.sql`](supabase/schema.sql).
