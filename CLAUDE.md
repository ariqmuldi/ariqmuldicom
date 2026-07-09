# CLAUDE.md

Guidance for Claude Code (and any agent) working in this repository. This file is loaded into
every session, so it carries the always-relevant context. For full documentation see
[README.md](./README.md); for the résumé pipeline and all content data see
[app/data/README.md](./app/data/README.md).

## What this is

ariqmuldi.com — Ariq Muldi's personal portfolio. A single long-scroll Next.js (App Router) +
React + TypeScript page with a Swiss-mono design: warm off-white paper, `IBM Plex Mono`
throughout, a two-column grid, hairline rules instead of cards, and terminal accents (a typed
`whoami`, a `git log` experience ledger, a `tree` skills list, a live clock).

## Architecture at a glance

- Two routes: `app/page.tsx` (the main portfolio, `/`) and `app/content-generation/page.tsx`
  (the content pipeline explainer + local authoring UI, `/content-generation` — see below)
- Sections live in `app/components/` and are composed, in order, by `app/page.tsx`:
  Hero → Work → Experience → Projects → Skills → Education → Contact. `TopBar.tsx` and
  `Footer.tsx` are **shared presentational components** used by both routes (each passes its own
  crumb + nav links / footer items), so the header/footer never drift between pages
- Client behavior (scroll reveal, scroll-spy, typewriter, live Vancouver clock, decorative
  commit-hash helper) lives in `app/lib/hooks.ts`
- The whole visual system — design tokens as CSS variables, per-section styles, the
  `/content-generation` UI (`.cg-*`), the shared footer (`.site-footer*`), responsive collapse,
  reduced-motion — is in `app/globals.css`. Tailwind is present but the palette in
  `tailwind.config.ts` is legacy/unused. `framer-motion` is an unused leftover dependency
- `IBM Plex Mono` is loaded in `app/layout.tsx` via `next/font`

## Content is data-driven — do not hardcode

Every section `.map()`s over a module in `app/data/`:

- **Generated** from `app/data/master-resume.tex` by `scripts/parse-resume.ts`: `experiences.ts`,
  `skills.ts`, `education.ts`, `projects.ts`. **Never hand-edit these** — they are overwritten
  on every parse. Any presentation the design needs from them is derived in the component, not
  stored in the data file. (The `.tex` source, the `resume-config.json` visibility config, and
  the generated/AI/curated data modules all now live together under `app/data/`)
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
- After editing `app/data/master-resume.tex`: run `npm run parse:resume` (or restart
  `npm run dev`), then **commit** the regenerated `app/data/*.ts` so production builds pick them up
- The parser does **not** touch the downloadable PDF. `public/master-resume.pdf` (served at
  `/master-resume.pdf` by the Contact section) is maintained manually — replace it when the résumé
  changes and commit it

## AI content (`work-experience-content.json`, `project-content.json`)

- `npm run generate:content` runs both AI generators (Google Gemini via REST, reading
  `GEMINI_API_KEY` from `.env`); `generate:work-experience-content` / `generate:project-content`
  run one each and take flags (npm does **not** forward `--force`/`--seed` through the combined
  `generate:content`). These are the **only** commands that call the AI — `dev`, `build`, and
  Vercel never do; they only read the committed JSON
- Model: both scripts read `process.env.GEMINI_MODEL` (default `gemini-2.5-flash-lite`), so the
  model is configurable — set `GEMINI_MODEL` in `.env`, or use the `/content-generation` UI's
  model selector, which passes the choice through per run
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

## Content pipeline route (`/content-generation`)

A second route (`app/content-generation/page.tsx` + `app/components/ContentGenerationApp.tsx`,
`PipelineDiagram.tsx`, `ModelSelect.tsx`) that is **both** a public explainer of how this site's
content is generated **and** a local, password-gated UI over the whole pipeline (edit the `.tex`,
run `parse:resume`, review/approve the AI drafts per role & project, pick the Gemini model, run
`generate:*`). It calls API routes under `app/api/content/*`:

- `GET /state` + `GET /session` are public (read the files / report authed+production)
- Every mutating route (`master-tex`, `parse`, `generate`, `work/[key]`, `project/[key]`, `config`)
  calls `requireEditable()` (`app/lib/content-guard.ts`), which refuses **in production** and
  without a valid auth cookie. `parse` and `generate` **stream** the script's stdout live into the
  in-page console (newline-delimited, ending in a `__CG_DONE__:{json}` sentinel)
- **Editing only works on `localhost`.** The unlock route (`app/api/content/auth`) checks
  `CONTENT_GENERATION_PASSWORD` server-side and refuses in production first, so the deployed site
  is always a read-only showcase. Auth is a signed httpOnly cookie (`app/lib/content-auth.ts`);
  env detection is `app/lib/content-env.ts`
- File/script names shown in the UI + diagram come from `app/lib/content-file-names.ts` (single
  source of truth); server paths from `app/lib/content-files.ts`
- Env vars (local `.env`, server-only — never `NEXT_PUBLIC_`): `CONTENT_GENERATION_PASSWORD`,
  `CONTENT_GENERATION_SESSION_SECRET`, plus `GEMINI_API_KEY` / `GEMINI_MODEL`. **Set none of these
  in production** — the route is read-only there regardless. Committing stays manual (no commit UI)
- Entry points on the main site: a `Content` link in the top-bar nav and a
  `$ ./how-content-is-generated` button in the hero (`HeroSection.tsx`)

## Design constraints (do not reintroduce the old look)

No border radius (except status dots), 1px hairlines only, no box-shadows (except the green
status-dot ring), no glassmorphism / gradient text / blurred orbs, no Framer Motion. All motion
is CSS + IntersectionObserver and must respect `prefers-reduced-motion`.

## Keeping docs in sync

After any code change, run `/update-all-docs` (`.claude/commands/update-all-docs.md`) to update
**every** affected markdown file — including this one. If a change makes the orientation above
inaccurate (a new/removed section, hook, data module, parser behavior, or design rule), update
this file so future sessions stay accurate.
