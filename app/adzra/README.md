# `/adzra`

A private, unlisted surprise page — a small, warm gift built for one person. It is **not**
part of the public portfolio: it is not indexed, not linked from anywhere, and not mentioned
in any site-wide documentation. Everything it needs lives inside this folder (see
[`CLAUDE.md`](./CLAUDE.md) for the isolation rule).

## What it does

The page shows a single lime with a gentle "breathing" pulse and the prompt *"How are you
doing, sayang? 🍋"*. Each click nudges the lime and reveals a short line of encouragement while
a row of progress dots fills in. After `CLICKS_TO_REVEAL` clicks (default **7**), the image
crossfades to *"lime with two friends,"* limes and hearts drift up the screen, and a
personal handwritten-style message appears.

## Route

- **Path**: `/adzra`
- **Files**:
  - [`page.tsx`](./page.tsx) — the entire experience (a single `'use client'` component):
    click counter, reveal state, encouragements, floaters, progress dots, and the reveal
    message.
  - [`layout.tsx`](./layout.tsx) — route metadata. Sets a soft title/description and
    `robots: { index: false, follow: false }` so the page stays private and out of search.

## Design & behavior

- **Palette** — warm cream (`#FFF8EC` → `#DCCCAC`) with sage/olive greens (`#99AD7A`,
  `#546B41`). Soft blurred blobs sit on a fixed, clipped background layer so they never add
  scroll.
- **Motion** — `framer-motion`: the idle breathing pulse, the per-click wobble, the
  crossfade between the two images, the drifting floaters, and the staged reveal of the
  message. All motion respects `prefers-reduced-motion` (via `useReducedMotion`) — the
  reveal still works, just without the ambient animation.
- **Images** — the second image is preloaded on mount so the reveal is instant.

## Assets (the `public/` folder)

This route keeps its assets in the route-local [`public/`](./public/) folder — today the two
photos (`lime.jpeg`, `lime-with-two-friends.jpeg`), but it may hold other things in the future.

Despite the name, this is **not** the Next.js root `/public` static directory — it's a plain
folder inside the route. The images are `import`ed as modules in [`page.tsx`](./page.tsx)
(`import lime from './public/lime.jpeg'`), so webpack bundles them into hashed, unguessable URLs
rather than exposing them at a predictable public path. Keeping them here (instead of a
repo-root folder) is what makes the route fully self-contained — everything `/adzra` needs
lives under `app/adzra/`.

> These files are committed to the repo (so the page builds on deploy) and are therefore visible
> in the public GitHub source — they are unguessable in production, not secret in source.

## Customizing

Everything tweakable lives at the top of [`page.tsx`](./page.tsx):

- `CLICKS_TO_REVEAL` — how many clicks before the surprise.
- `ENCOURAGEMENTS` — the lines shown on clicks 1..N.
- `FLOATERS` — the emoji, positions, delays, and durations of the drifting celebration bits.
- The reveal message is the marked `✏️ YOUR MESSAGE` block near the bottom of the component.
