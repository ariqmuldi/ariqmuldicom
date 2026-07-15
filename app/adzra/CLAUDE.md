# CLAUDE.md — `/adzra`

Guidance for Claude Code (and any agent) working inside the `/adzra` route.

## The one rule: `/adzra` is fully self-contained

**Nothing about the `/adzra` route may live, or be mentioned, outside this folder.**
This route is a private, personal surprise page — it is intentionally isolated from the
rest of the site (`ariqmuldi.com`) and must stay that way.

That means, concretely:

- **Do not document it anywhere else.** Do not add `/adzra` to the root
  [`README.md`](../../README.md), the root [`CLAUDE.md`](../../CLAUDE.md),
  [`data/README.md`](../../data/README.md), `app/sitemap.ts`, `app/robots.ts`, any nav/footer,
  or any other markdown, comment, or config outside `app/adzra/`. When you run
  `/update-all-docs` or any doc-sync task, treat `app/adzra/**` as **out of scope** — never
  surface it in a doc that lives above this directory.
- **All code for this route lives under `app/adzra/`.** Route files (anything with a `page.tsx`)
  sit at the top; everything else lives under `app/adzra/non-routes/` — a plain folder that is
  **not** a route segment (no `page.tsx`, so Next never serves `/adzra/non-routes`). The route is
  organized this way:
  - route pages → `app/adzra/page.tsx`, `app/adzra/<slug>/page.tsx` (one folder per memory:
    `may17-2026`, `june17-2026`, `july4-2026`, `july17-2026`), plus `app/adzra/not-found.tsx`
  - UI components → `app/adzra/non-routes/components/` (`Lock`, `Collection`, `StandardDetail`,
    `Carousel`, `LetterCard`, `LimeExperience`, `DetailTopBar`, `ExitButton`)
  - helpers / hooks / utils → `app/adzra/non-routes/lib/` (`adzra-auth.ts` — the server-side gate)
  - server actions → `app/adzra/non-routes/actions.ts`
  - constants, data, types → `app/adzra/non-routes/data/` (`entries.ts` — the one list every screen
    is generated from)
  - styles → the co-located CSS module `app/adzra/non-routes/adzra.module.css`, **not**
    `app/globals.css`
  - assets → `app/adzra/non-routes/public/`
  - fonts → loaded in `app/adzra/layout.tsx` via `next/font` and scoped to this route

  Do **not** reach for the site-wide `components/`, `app/lib/`, `data/`, or `app/globals.css`,
  and do **not** add anything there for this route's sake. New non-route files go under
  `non-routes/`.
- **Do not link to it.** It is unlisted by design — no sitemap entry, no internal links, and
  `robots: noindex, nofollow` (set in [`layout.tsx`](./layout.tsx)). Keep it that way.
- **Keep the docs local.** The only documentation for this route is this file and the
  route-local [`README.md`](./README.md). Update those, and only those, when the route changes.

If a change to `/adzra` seems to require touching a file outside `app/adzra/`, stop and
reconsider — the correct move is almost always to bring that concern *inside* this folder
instead. The route is currently fully self-contained, including its image assets in
[`non-routes/public/`](./non-routes/public/) (a plain route-local folder, not the Next.js root
`/public`, and namespaced under `non-routes/` so it's clearly not a route segment). Keep it
that way — do not add dependencies outside `app/adzra/`.

## Auth rule: server-side, no content before unlock

This route is genuinely private. The secret answer is checked **only on the server**
([`non-routes/lib/adzra-auth.ts`](./non-routes/lib/adzra-auth.ts) +
[`non-routes/actions.ts`](./non-routes/actions.ts)), never in the browser, and **no memory content
is rendered until the session cookie is present** — the collection and every detail page are
`force-dynamic` and gate on `isUnlocked()`. Keep it that way: never move the answer
check client-side, and never render an entry's photos/note/message on a page that hasn't gated
first. The answer lives ONLY in the `SUPER_SECRET_PASSWORD` env var (never in source or the design
folder); `SUPER_SECRET_SESSION_SECRET` signs the cookie (falls back to the password). Never commit
these values or write the real answer into any tracked file.

## Style note

This route has its own tender, pressed-flower design system — Cormorant Garamond / Nunito / Caveat /
IBM Plex Mono, cream + confession-lily palette, arched cards, CSS keyframe motion — kept in the
co-located CSS module [`non-routes/adzra.module.css`](./non-routes/adzra.module.css) and fonts loaded
in [`layout.tsx`](./layout.tsx). This is a deliberate **local** choice and does **not** reflect (or
override) the main site's Swiss-mono design constraints. Do not "fix" it to match the main site, and
do not fold its styles/fonts into `app/globals.css` or the root layout; the two systems are
independent and must stay that way. All motion respects `prefers-reduced-motion`.
