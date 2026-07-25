# RADIKAL — İbrahim'in Doğum Günü

Birthday celebration site for RADIKAL, built with Next.js, Tailwind, and Supabase.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connecting Supabase (global counter + leaderboards)

The celebration counter and game leaderboards are shared across everyone who
visits the site, so they need a real backend. Without it, the site still
works, but the counter and scores are stored per-device in `localStorage`.

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.local.example` to `.env.local` and fill in your project's URL
   and anon key (Project Settings → API).
4. Restart `npm run dev`.

## Swapping in real assets

- **Group photo**: replace `public/images/group-placeholder.svg`, and update
  the `src` in [`src/components/Hero.tsx`](src/components/Hero.tsx).
- **Celebration video**: add a video file at `public/videos/celebration.mp4`
  (referenced in [`src/components/CelebrationSection.tsx`](src/components/CelebrationSection.tsx)).
- **About text / member info**: edit [`src/lib/members.ts`](src/lib/members.ts)
  and the copy in `Hero.tsx`.

## Games

Each game lives in `src/components/games/` with its own page under
`src/app/games/<game-id>/`. Games share `src/components/Leaderboard.tsx`,
`src/components/SubmitScoreForm.tsx`, and `src/lib/scores.ts` for score
persistence. To add a new game, add an entry to `src/lib/games.ts` and follow
the pattern in `ayran-stack` or `ayran-catch`.

The ayran can / Şalgam bottle pixel art in `src/lib/brands.ts` uses original
colors and shapes inspired by each member's favorite brand — not the actual
logos — to keep the nostalgia without reproducing trademarked branding.
