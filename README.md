# Budget Dashboard

Personal finance dashboard. Mobile-friendly, single-user. Tracks expenses across 7 categories (rent, food, internet, miscellaneous, cosmetic, clothes, tech) with optional monthly limits and progress bars.

**Stack:** Next.js 14 · TypeScript · Tailwind · Supabase (Postgres) · deploy on Vercel.

## Setup (one time, ~10 min)

### 1. Database — Supabase (free)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, paste and run [`supabase/schema.sql`](supabase/schema.sql).
3. In **Project Settings → API**, copy the **Project URL** and **anon public** key.

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

## Notes on access control

The included schema uses a permissive RLS policy because this is a single-user app and the anon key ships in client code. If you ever expose the URL publicly, anyone could write to your tables. Mitigations:

- Keep the deployed URL private (don't share it).
- Or add Supabase Auth and tighten the RLS policy to `auth.uid() = user_id`.

## Conventions

- Currency: CZK (change the `Intl.NumberFormat` locale in [`src/lib/format.ts`](src/lib/format.ts) to switch).
- Month boundary: local time, first of the calendar month.
- Categories are a fixed enum — to add one, update [`src/types.ts`](src/types.ts) AND the SQL `check` constraints in [`supabase/schema.sql`](supabase/schema.sql).
