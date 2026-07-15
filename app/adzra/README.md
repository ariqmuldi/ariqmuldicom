# `/adzra` — The Sayang Collection

A private, unlisted surprise — a small, warm gift built for one person. It is **not** part of the
public portfolio: it is not indexed, not linked from anywhere, and not mentioned in any site-wide
documentation. Everything it needs lives inside this folder (see [`CLAUDE.md`](./CLAUDE.md) for the
isolation rule).

## What it is

A password-gated, pressed-flower keepsake in a confession-lily + cream palette. Adzra answers a
secret question to unlock, then browses a growing collection of memories — one arched "plate" per
month/occasion. Each memory opens a detail page with a photo carousel, a little note, and "the main
thing" (a message, a letter, or a one-off interaction).

## Folder layout

Route files (anything that produces a URL) live at the top of `app/adzra/`. Everything else —
components, data, helpers, styles, assets — lives under `non-routes/`, a plain folder that is **not**
a route segment (it has no `page.tsx`, so Next never turns it into `/adzra/non-routes`). This keeps
route URLs and supporting code visibly separate while staying fully self-contained.

```
app/adzra/
  layout.tsx            fonts (next/font, scoped) + private metadata
  page.tsx              the /adzra entry: lock gate OR collection (auth-gated)
  not-found.tsx         soft in-theme "not pressed yet" fallback
  may17-2026/page.tsx   "1 Month"  (standard detail)
  june17-2026/page.tsx  "2 Months" (standard detail)
  july4-2026/page.tsx   "For Sayang, Working in the UK" (the lime one-off)
  july17-2026/page.tsx  "3 Months" (standard detail)
  non-routes/
    actions.ts          server actions (unlock / lock)
    adzra.module.css     the whole visual system (tokens + keyframes)
    components/         Lock, Collection, Carousel, LimeExperience, StandardDetail,
                        DetailTopBar, LetterCard, ExitButton
    data/entries.ts     the single source of truth for every memory
    lib/adzra-auth.ts   the server-side gate
    public/             the photos (route-local, not the Next.js /public)
```

### Routes

- **`/adzra`** — the lock gate; once unlocked (session cookie set) the same route renders the
  collection browser.
- **One folder per memory**, so any month can grow its own design later without touching the others:
  - `may17-2026/` — "1 Month" (standard: carousel → note → message).
  - `june17-2026/` — "2 Months" (standard, plus a "🌷 came with flowers" pill).
  - `july4-2026/` — "For Sayang, Working in the UK" — the **one-off** lime click-to-reveal (the
    original `/adzra` experience, preserved here with a back arrow). Not the standard format.
  - `july17-2026/` — "3 Months" (standard layout, with the message shown as a tap-to-open letter).
  - The three standard months share the [`StandardDetail`](./non-routes/components/StandardDetail.tsx)
    component; each still owns its own `page.tsx`, so diverging later is a local edit.
  - An unknown URL renders the themed [`not-found.tsx`](./not-found.tsx) ("not pressed yet 🤍").

## Authentication — server-side, no content before unlock

The gate question is **"what do I call you?"** and the answer is a private secret (kept only in the
`SUPER_SECRET_PASSWORD` env var, never in source), compared case-insensitively and trimmed. The
check runs **entirely on the server** — the answer never reaches the browser, and **no memory
content (photos, notes, messages) is sent until the session cookie is present.**

- [`non-routes/lib/adzra-auth.ts`](./non-routes/lib/adzra-auth.ts) — the whole gate:
  `answerMatches()` (timing-safe, normalized compare), `grantSession()` / `clearSession()` (set or
  clear an HMAC-signed, httpOnly cookie), `isUnlocked()` (verifies it).
- [`non-routes/actions.ts`](./non-routes/actions.ts) — server actions: `checkAnswer` validates only
  (no cookie yet, echoes the answer on success) → the lock shows the "it's you, sayang" bloom →
  `enterCollection` re-validates and grants the cookie → the route refreshes into the collection.
  `lockCollection` clears the cookie (the collection's exit button).
- The main page ([`page.tsx`](./page.tsx)) and every detail page are `force-dynamic` and gate on
  `isUnlocked()` before rendering — an unauthenticated detail request is redirected to `/adzra`.
- **Env vars (REQUIRED, server-only — never `NEXT_PUBLIC_`):** `SUPER_SECRET_PASSWORD` is the answer
  (if unset, nothing can unlock the route). `SUPER_SECRET_SESSION_SECRET` signs the session cookie
  and falls back to `SUPER_SECRET_PASSWORD` when unset. Set them in `.env` locally and in the host's
  environment for production; they are never committed and never sent to the browser.

## The data — one list, a growing collection

Every screen is generated from a single ordered list in
[`non-routes/data/entries.ts`](./non-routes/data/entries.ts), so adding a memory is a **one-object
edit**. Each `Entry` carries its slug, number, titles, date eyebrow, `cover` + `photos`, per-entry
ring colour, the note blurb, and a `mainType` with its payload:

- `'message'` → a chat mockup (`message: { dateChip, bubbles[] }`) — an original styling, **not** a
  WhatsApp clone.
- `'letter'` → a tap-to-open envelope revealing the note on cream paper (`letter: string`, paragraphs
  separated by a blank line).
- `'lime'` → the July 4 click-to-reveal (`limeMessage: string`).
- `'placeholder'` → a soft dashed "to be written & pressed" box (a memory not yet lived).

Photos are `CarouselPhoto` objects (`{ src, objectPosition?, fit? }`): `fit: 'cover'` (default) crops
to fill and `objectPosition` aims the crop; `fit: 'contain'` shows a tall/awkward photo whole on a
cream mat. Entry-level `objectPosition` aims the collection plate/thumbnail crop of `cover`.

## Components

All client interactivity is small and co-located under
[`non-routes/components/`](./non-routes/components/):

- `Lock.tsx` — the gate + "it's you, sayang" celebration (`useActionState`, two-step unlock).
- `Collection.tsx` — the scroll-snap "press" of arched plates, the `‹ / ›` nav, the **thumbnail jump
  rail** (reach any entry directly), and the floating **exit/lock button**.
- `StandardDetail.tsx` — the shared detail layout: `DetailTopBar` → `Carousel` → note → main thing.
- `Carousel.tsx` — the photo carousel; shows `‹ / ›` arrows only when there's more than one photo,
  and honours each photo's `fit` / `objectPosition`.
- `LetterCard.tsx` — the tap-to-open brown envelope → the note on cream stationery (mainType
  `'letter'`).
- `LimeExperience.tsx` — the July 4 experience (framer-motion): a lime that crossfades to
  "lime with two friends" after `CLICKS_TO_REVEAL` clicks, drifting 🍋/💚 floaters, and the reveal
  note. Brings its own full-screen layout + a "‹ collection" back arrow.
- `DetailTopBar.tsx` / `ExitButton.tsx` — the sticky "‹ collection" bar and the lock button.

## Design & styling

- **Aesthetic** — soft & tender: cream paper, arched cards with hairline borders, confession
  reds/pinks + kraft gold + sage greens, gentle CSS motion (`breathe`, `bloomPop`, `flutter`,
  `petalFall`, floaters, `fadeUp`). All ambient motion is disabled under `prefers-reduced-motion`.
- **Type** — Cormorant Garamond (titles), Nunito (body/UI), Caveat (handwritten asides), IBM Plex
  Mono (eyebrows/labels/route chrome). The three collection fonts are loaded in
  [`layout.tsx`](./layout.tsx) via `next/font` and exposed as CSS variables scoped to this route;
  IBM Plex Mono is reused from the site root.
- **Styles** — all in the co-located CSS module
  [`non-routes/adzra.module.css`](./non-routes/adzra.module.css) (tokens as CSS variables +
  keyframes), **not** in the site-wide `app/globals.css`. This keeps the route fully self-contained.

## Assets (the `non-routes/public/` folder)

This route keeps its photos in the route-local
[`non-routes/public/`](./non-routes/public/) folder. Despite the name, this is **not** the Next.js
root `/public` static directory — it's a plain folder inside the route. The images are `import`ed as
modules in [`non-routes/data/entries.ts`](./non-routes/data/entries.ts), so webpack bundles them into
hashed, unguessable URLs rather than exposing them at a predictable public path.

> These files are committed to the repo (so the page builds on deploy) and are therefore visible in
> the public GitHub source — they are unguessable in production, not secret in source.

## Customizing

- **Add / edit a memory** → edit [`non-routes/data/entries.ts`](./non-routes/data/entries.ts) (one
  object per memory). Add more `photos` to enable carousel paging; set a photo's `fit: 'contain'`
  when `cover` crops it too hard.
- **The lime one-off** → `CLICKS_TO_REVEAL`, the encouragements, and the floaters live at the top of
  [`non-routes/components/LimeExperience.tsx`](./non-routes/components/LimeExperience.tsx); its reveal
  note is the `limeMessage` field on the `july4-2026` entry.
- **Colours / motion / spacing** → the tokens and keyframes at the top of
  [`non-routes/adzra.module.css`](./non-routes/adzra.module.css).
