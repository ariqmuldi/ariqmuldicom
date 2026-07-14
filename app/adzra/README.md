# `/adzra` — The Sayang Collection

A private, unlisted surprise — a small, warm gift built for one person. It is **not** part of the
public portfolio: it is not indexed, not linked from anywhere, and not mentioned in any site-wide
documentation. Everything it needs lives inside this folder (see [`CLAUDE.md`](./CLAUDE.md) for the
isolation rule).

## What it is

A password-gated, pressed-flower keepsake in a confession-lily + cream palette. Adzra answers a
secret question to unlock, then browses a growing collection of memories — one arched "plate" per
month/occasion. Each memory opens a detail page with a photo carousel, a little note, and "the main
thing" (usually the message I sent).

### Routes

- **`/adzra`** — the lock gate; once unlocked (session cookie set) the same route renders the
  collection browser.
- **`/adzra/<slug>`** — one detail page per memory, generated from the entries list:
  - `may17-2026` — "1 Month" (standard: carousel → note → message).
  - `june17-2026` — "2 Months" (standard, plus a "🌷 came with flowers" pill).
  - `july4-2026` — "For Sayang, Working in the UK" — the **one-off** lime click-to-reveal (the
    original `/adzra` experience, now living here). Not the standard format.
  - `july17-2026` — "3 Months" (standard layout with a "to be written & pressed" placeholder for
    the message, until the day comes).
  - Any unknown slug renders a soft in-theme "not pressed yet" fallback
    ([`[slug]/not-found.tsx`](./[slug]/not-found.tsx)).

## Authentication — server-side, no content before unlock

The gate question is **"what do I call you?"** and the answer is a private secret (kept only in the
`SUPER_SECRET_PASSWORD` env var, never in source), compared case-insensitively and trimmed. The
check runs **entirely on the server** — the answer never reaches the browser, and **no memory
content (photos, notes, messages) is sent until the session cookie is present.**

- [`lib/adzra-auth.ts`](./lib/adzra-auth.ts) — the whole gate: `answerMatches()` (timing-safe,
  normalized compare), `grantSession()` (sets an HMAC-signed, httpOnly cookie), `isUnlocked()`
  (verifies it).
- [`actions.ts`](./actions.ts) — two server actions mirroring the design's two-step unlock:
  `checkAnswer` validates only (no cookie yet, echoes the answer on success) → the lock shows the
  "it's you, sayang" bloom → `enterCollection` re-validates and grants the cookie → the route
  refreshes into the collection.
- The main page ([`page.tsx`](./page.tsx)) and every detail page ([`[slug]/page.tsx`](./[slug]/page.tsx))
  are `force-dynamic` and gate on `isUnlocked()` before rendering — an unauthenticated detail
  request is redirected to `/adzra`.
- **Env vars (REQUIRED, server-only — never `NEXT_PUBLIC_`):** `SUPER_SECRET_PASSWORD` is the answer
  (if unset, nothing can unlock the route). `SUPER_SECRET_SESSION_SECRET` signs the session cookie
  and falls back to `SUPER_SECRET_PASSWORD` when unset. Set them in `.env` locally and in the host's
  environment for production; they are never committed and never sent to the browser.

## The data — one list, a growing collection

Every screen is generated from a single ordered list in [`data/entries.ts`](./data/entries.ts), so
adding a memory is a **one-object edit**. Each `Entry` carries its slug, number, titles, date
eyebrow, cover + carousel photos, per-entry ring colour, the note blurb, and a `mainType`
(`'message' | 'lime' | 'placeholder'`) with its payload (chat bubbles / lime message). Replace any
`[ bracketed ]` copy with your own words — those are the placeholders to fill in.

## Components

All client interactivity is small and co-located under [`components/`](./components/):

- [`Lock.tsx`](./components/Lock.tsx) — the gate + celebration (`useActionState`).
- [`Collection.tsx`](./components/Collection.tsx) — the scroll-snap "press" of arched plates, the
  `‹ / ›` nav, and the **thumbnail jump rail** (the key UX: reach any entry directly). The active
  index is derived from scroll position.
- [`Carousel.tsx`](./components/Carousel.tsx) — the detail-page photo carousel (scroll-snap + arrow
  buttons; empty slots render as a diagonal-hatch "+ another photo" placeholder).
- [`LimeExperience.tsx`](./components/LimeExperience.tsx) — the July 4 click-to-reveal lime (7
  clicks → progress bar fills → a hidden note + drifting 🍋/💚 floaters).

## Design & styling

- **Aesthetic** — soft & tender: cream paper, arched cards with hairline borders, confession
  reds/pinks + kraft gold + sage greens, gentle CSS motion (`breathe`, `bloomPop`, `flutter`,
  `petalFall`, floaters). All ambient motion is disabled under `prefers-reduced-motion`.
- **Type** — Cormorant Garamond (titles), Nunito (body/UI), Caveat (handwritten asides), IBM Plex
  Mono (eyebrows/labels/route chrome). The three collection fonts are loaded in
  [`layout.tsx`](./layout.tsx) via `next/font` and exposed as CSS variables scoped to this route;
  IBM Plex Mono is reused from the site root.
- **Styles** — all in the co-located CSS module [`adzra.module.css`](./adzra.module.css) (tokens as
  CSS variables + keyframes), **not** in the site-wide `app/globals.css`. This keeps the route
  fully self-contained.

## Assets (the `non-routes/public/` folder)

This route keeps its photos in the route-local [`non-routes/public/`](./non-routes/public/) folder.
Despite the name, this is **not** the Next.js root `/public` static directory — it's a plain folder
inside the route, namespaced under `non-routes/` so it's clearly not a route segment. The images are
`import`ed as modules in [`data/entries.ts`](./data/entries.ts), so webpack bundles them into hashed,
unguessable URLs rather than exposing them at a predictable public path. Keeping them here (instead
of a repo-root folder) is what makes the route fully self-contained.

> These files are committed to the repo (so the page builds on deploy) and are therefore visible in
> the public GitHub source — they are unguessable in production, not secret in source.

## Customizing

- **Add / edit a memory** → edit [`data/entries.ts`](./data/entries.ts) (one object per memory).
- **The lime one-off** → `CLICKS_TO_REVEAL` and the floaters live at the top of
  [`components/LimeExperience.tsx`](./components/LimeExperience.tsx); its reveal message is the
  `limeMessage` field on the `july4-2026` entry.
- **Colours / motion / spacing** → the tokens and keyframes at the top of
  [`adzra.module.css`](./adzra.module.css).
