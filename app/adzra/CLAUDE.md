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
- **All code for this route lives under `app/adzra/`.** If the route needs:
  - a UI component → `app/adzra/components/`
  - a helper / hook / util → `app/adzra/lib/`
  - constants, data, types → `app/adzra/` (e.g. `app/adzra/data/`)
  - styles → co-located here (inline / a local module), **not** in `app/globals.css`

  Do **not** reach for the site-wide `components/`, `app/lib/`, `data/`, or `app/globals.css`,
  and do **not** add anything there for this route's sake.
- **Do not link to it.** It is unlisted by design — no sitemap entry, no internal links, and
  `robots: noindex, nofollow` (set in [`layout.tsx`](./layout.tsx)). Keep it that way.
- **Keep the docs local.** The only documentation for this route is this file and the
  route-local [`README.md`](./README.md). Update those, and only those, when the route changes.

If a change to `/adzra` seems to require touching a file outside `app/adzra/`, stop and
reconsider — the correct move is almost always to bring that concern *inside* this folder
instead. The route is currently fully self-contained, including its image assets in
[`public/`](./public/) (a plain route-local folder, not the Next.js root `/public`). Keep it
that way — do not add dependencies outside `app/adzra/`.

## Style note

This page uses Tailwind utility classes and `framer-motion` directly and deliberately —
that is a local choice for this route and does **not** reflect (or override) the main site's
design constraints. Do not "fix" it to match the Swiss-mono system; the two are independent.
