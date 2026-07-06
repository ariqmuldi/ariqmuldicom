# CLAUDE.md

Guidance for Claude Code (and any agent) working in this repository. This file is loaded into
every session, so it carries the always-relevant context. For full documentation see
[README.md](./README.md); for the résumé pipeline see [data/README.md](./data/README.md).

## What this is

ariqmuldi.com — Ariq Muldi's personal portfolio. A single long-scroll Next.js (App Router) +
React + TypeScript page with a Swiss-mono design: warm off-white paper, `IBM Plex Mono`
throughout, a two-column grid, hairline rules instead of cards, and terminal accents (a typed
`whoami`, a `git log` experience ledger, a `tree` skills list, a live clock).

## Architecture at a glance

- Sections live in `app/components/` and are composed, in order, by `app/page.tsx`:
  TopBar → Hero → Work → Experience → Projects → Skills → Education → Contact
- Client behavior (scroll reveal, scroll-spy, typewriter, live Vancouver clock, decorative
  commit-hash helper) lives in `app/lib/hooks.ts`
- The whole visual system — design tokens as CSS variables, per-section styles, responsive
  collapse, reduced-motion — is in `app/globals.css`. Tailwind is present but the palette in
  `tailwind.config.ts` is legacy/unused. `framer-motion` is an unused leftover dependency
- `IBM Plex Mono` is loaded in `app/layout.tsx` via `next/font`

## Content is data-driven — do not hardcode

Every section `.map()`s over a module in `app/data/`:

- **Generated** from `data/master-resume.tex` by `scripts/parse-resume.ts`: `experiences.ts`,
  `skills.ts`, `education.ts`, `projects.ts`. **Never hand-edit these** — they are overwritten
  on every parse. Any presentation the design needs from them is derived in the component, not
  stored in the data file
- **Manually curated**: `work.ts` (the Work case studies) — safe to edit. Its `description`
  and `technologies` are **AI-owned**: generated per-role into `work-experience-content.json`
  and merged in at module load, keyed by a stable `contentKey`. An inline value on a work item
  overrides the AI value (DOUBL keeps a manual `description` inline, since its card is coming-soon)
- **AI-generated** by two manual generators (committed to git, hand-editable, each entry carries
  an `approved` flag):
  - `scripts/generate-work-experience-content.ts` → `work-experience-content.json` — per-role
    `technologies` (shared by both the Work and Experience sections), a `commitSubject` (the
    Experience row's git subject, for every role with accomplishments), and a `description` for
    roles with a live Work card
  - `scripts/generate-project-content.ts` → `project-content.json` — per-project `tagline`

## Résumé parser gotchas

- Runs automatically **only on `npm run dev`** (the `predev` hook). It does **not** run on
  `npm run build`, and it does **not** watch files
- After editing `data/master-resume.tex` or `data/master-resume.pdf`: run `npm run parse:resume`
  (or restart `npm run dev`), then **commit** the regenerated `app/data/*.ts` and the synced
  `public/master-resume.pdf` so production builds pick them up

## AI content (`work-experience-content.json`, `project-content.json`)

- `npm run generate:content` runs both AI generators (Gemini 2.5 Flash-Lite via REST, reading
  `GEMINI_API_KEY` from `.env`); `generate:work-experience-content` / `generate:project-content`
  run one each and take flags (npm does **not** forward `--force`/`--seed` through the combined
  `generate:content`). These are the **only** commands that call the AI — `dev`, `build`, and
  Vercel never do; they only read the committed JSON
- Drafts land as `approved: false`; review them, then set `approved: true` on the good ones.
  Re-running skips approved entries whose source text is unchanged (a `sourceHash` guard);
  editing the source forces a re-draft. `--force [slug]` redrafts regardless; `--seed` fills the
  file from current values without calling the API (⚠️ seed re-derives `technologies` from the
  parser, so it will clobber a hand-curated tech list — use `--force <key>` to redraft instead)
- The generated `technologies` list feeds both sections (Work joins by `contentKey`, Experience
  by `experienceId`); `commitSubject` overlays Experience by `experienceId`, `tagline` overlays
  Projects by `projectId`. **Commit both JSON files** after approving, like `app/data/*.ts`
- The Experience `git log` ledger is collapsed by default (commit subject + `+N insertions`
  diffstat + tech + dates); clicking a row opens a full-width `git show` body listing every
  résumé bullet as a `+` diff line. A role with no accomplishments (DOUBL) shows
  `● in active development` and is not expandable. Projects rows are the same pattern (tagline →
  `cat README.md` panel)

## Design constraints (do not reintroduce the old look)

No border radius (except status dots), 1px hairlines only, no box-shadows (except the green
status-dot ring), no glassmorphism / gradient text / blurred orbs, no Framer Motion. All motion
is CSS + IntersectionObserver and must respect `prefers-reduced-motion`.

## Keeping docs in sync

After any code change, run `/update-all-docs` (`.claude/commands/update-all-docs.md`) to update
**every** affected markdown file — including this one. If a change makes the orientation above
inaccurate (a new/removed section, hook, data module, parser behavior, or design rule), update
this file so future sessions stay accurate.
