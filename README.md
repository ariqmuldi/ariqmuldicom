# ariqmuldi.com

Personal portfolio for Ariq Muldi — a single long-scroll page built with Next.js (App
Router) and React. The design is a **Swiss-mono engineering manifest**: one warm off-white
canvas, `IBM Plex Mono` throughout, a strict two-column grid, hairline rules instead of
cards, and terminal motifs used only as accents (a typed `whoami`, a `git log` experience
ledger, a `tree` skills list, a live clock). All content is rendered dynamically from
`data/generated/*.ts`, most of which is generated from a LaTeX master resume.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack in development
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 (base/reset) plus a hand-written design-token system in `app/globals.css`
- **Font**: `IBM Plex Mono` (300–700 + italic) via `next/font/google`
- **Images**: `next/image` with `unoptimized: true` (see `next.config.ts`)
- **Resume pipeline**: a LaTeX parser (`scripts/parse-resume.ts`) run via `tsx`

> `framer-motion` is still listed in `package.json` but is no longer used — all motion is
> now CSS/IntersectionObserver based. It can be removed.

## Development Commands

```bash
npm run dev              # parse resume (predev) then start dev server (Turbopack)
npm run build            # production build (does NOT run the resume parser)
npm start                # start production server
npm run lint             # ESLint
npm run parse:resume     # manually regenerate data/generated/*.ts from the LaTeX résumé
npm run generate:content # regenerate ALL AI content (work-experience + project) — calls Gemini
npm run generate:work-experience-content # AI work-experience content only (accepts --force/--seed)
npm run generate:project-content         # AI project taglines only (accepts --force/--seed)
```

The `generate:*` content commands are the only ones that reach the network / spend money;
`dev`, `build`, and Vercel never call them. `generate:content` runs the other two in sequence
(plain draft — npm does not forward `--force`/`--seed` through it, so pass those flags to the
specific command). See the AI content section below.

## Architecture

### App Structure

The code is split across three top-level directories — `app/` (Next.js App Router routes, layout,
API, and server helpers), `components/` (all React components), and `data/` (content + résumé
source):

- `app/page.tsx` — the main portfolio (`/`): client component that composes the sections in order,
  runs the page-level hooks (`useActiveSection`, `useScrollReveal`), and emits the `ProfilePage`
  JSON-LD structured data
- `app/content-generation/page.tsx` — a second route (`/content-generation`): the content pipeline
  explainer + local authoring UI (see [Content pipeline route](#content-pipeline-route))
- `app/api/content/*` — route handlers backing the content-generation editor (state/session/auth,
  and the gated `master-tex`/`parse`/`generate`/`work`/`project`/`config` mutations)
- `app/layout.tsx` — root layout: metadata/SEO, loads `IBM Plex Mono`, sets the font CSS variable
- `app/globals.css` — the entire visual system: design tokens (CSS variables), base/reset,
  scroll-reveal, per-section styles, the `/content-generation` UI (`.cg-*`), the shared footer
  (`.site-footer*`), responsive collapse, and reduced-motion handling
- `app/icon.tsx` — dynamically generated favicon via `ImageResponse`: the "whoami echo" mark — a lowercase `am` + block cursor on a dark, 1px-hairline square (no border radius, matching the site's terminal system)
- `app/sitemap.ts` · `app/robots.ts` — generate `/sitemap.xml` and `/robots.txt` (robots allows all,
  disallows `/api/`, and points at the sitemap; the sitemap lists only the indexable home page)
- `app/lib/hooks.ts` — client hooks and helpers (see below)
- `app/lib/content-*.ts` — content-generation server helpers: `content-env` (prod detection),
  `content-auth` (signed cookie), `content-guard` (`requireEditable`), `content-files` (paths +
  sourceHash), `content-file-names` (shared file/script names for the UI and diagram)
- `components/` — the section components plus the shared `TopBar`/`Footer` and the
  content-generation client components (`ContentGenerationApp`, `PipelineDiagram`, `ModelSelect`)
- `data/` — all content data + the résumé source, grouped by pipeline role: `source/`
  (`master-resume.tex`, `resume-config.json`), `generated/` (parser output `.ts` modules),
  `content/` (curated `work.ts` + the AI `*-content.json`), `deprecated/` (archived snapshots)

### Sections (top to bottom)

| Section | Component | Data source | Notes |
|---------|-----------|-------------|-------|
| Top bar | `TopBar.tsx` | nav links from `page.tsx` | shared presentational component (also used by `/content-generation`); sticky nav, scroll-spy highlight, live `~/path` crumb |
| Hero | `HeroSection.tsx` | static + `experiences` count | typed `whoami`, framed avatar, metric strip whose numbers count up on first reveal |
| Work | `WorkSection.tsx` | `work.ts` (+ `work-experience-content.json`) | case-study articles, `● LIVE` / `○ SHOWCASE TBA`; AI `description`/`technologies` |
| Experience | `ExperienceSection.tsx` | `experiences.ts` (+ `work-experience-content.json`) | `git log` ledger: collapsed rows show an AI commit subject + `+N insertions` diffstat, expanding to a full-width `git show` body listing every bullet; AI tech + `commitSubject` overlay |
| Projects | `ProjectsSection.tsx` | `projects.ts` (+ `project-content.json`) | expandable rows: an AI tagline collapsed, expanding to a `cat README.md` panel + GitHub links |
| Skills | `SkillsSection.tsx` | `skills.ts` | `tree`-style output, one row per category |
| Education | `EducationSection.tsx` | `education.ts` | school/GPA header, coursework, certifications |
| Contact | `ContactSection.tsx` | static links | dark section, live Vancouver clock, résumé download; renders the shared `Footer` below it |
| Footer | `Footer.tsx` | items from caller | shared footer (also used by `/content-generation`); pipe-separated left items + a `© {year} Ariq Muldi` line (dynamic year); fades itself in on scroll via its own IntersectionObserver |

`app/page.tsx` renders them in this order: Hero → Work → Experience → Projects → Skills →
Education → Contact. Navigation is anchor-based (`#work`, `#experience`, `#projects`,
`#skills`, `#education`, `#contact`) with `scroll-behavior: smooth`.

### Data-Driven Rendering

Every section `.map()`s over its data module — no content is hardcoded in JSX. Component
count follows array length, so adding/removing an experience, project, skill category, or
work item changes the page automatically.

- **Auto-generated** from `data/source/master-resume.tex`: `experiences.ts`, `skills.ts`,
  `education.ts`, `projects.ts`. **Do not edit these by hand** — they are overwritten on
  every parse. See [`data/README.md`](data/README.md).
- **Manually curated**: `work.ts` (the "Work" case studies). It carries
  optional presentation fields the design needs — `role`, `figLabel`, `overlayLabel`, `imageFit`
  (`'contain'` shows a near-square figure whole instead of cropping it, used for DOUBL),
  `contentKey` (per work item) and `shortName` (per organization group). Work items render in
  the authored order of `workGroups` (currently DOUBL first, then UBC) — reordering is just
  reordering the data.
- **AI-generated**: two JSON files, both produced by `npm run generate:content`, committed to
  git, and hand-editable:
  - `work-experience-content.json` — per-role `description` (Work case-study copy), a
    `technologies` list **shared by both the Work and Experience sections**, and a
    `commitSubject` (the Experience row's git commit subject). Merged into `work.ts` (by
    `contentKey`) and overlaid onto Experience (by `experienceId`) at load. An inline value in
    `work.ts` overrides the AI value
  - `project-content.json` — per-project `tagline` (the collapsed Projects row one-liner),
    overlaid onto Projects by `projectId`, falling back to the first sentence of the parsed
    `description`
  See the AI content section below.

Because the auto-generated files are regenerated on `predev`, any presentation the design
needs from them (commit hashes, company abbreviation, date splitting, skill folder labels)
is **derived in the components**, not stored in the data files.

### Client Hooks (`app/lib/hooks.ts`)

- `useTypewriter(text)` — types the hero's `whoami` (~95ms/char); returns full text immediately under reduced motion
- `useScrollReveal()` — observes `[data-reveal]` elements and adds `.is-visible` when they enter the viewport; also auto-assigns a per-list stagger (`--reveal-delay` by sibling index, 60ms step capped at 260ms) so grouped rows cascade, without overriding explicit inline delays (e.g. the hero's)
- `useCountUp(target, { duration, pad, suffix })` — returns `[ref, text]`; counts `0 → target` (ease-out cubic, ~1150ms) the first time the ref's element enters view. SSR-safe (renders the final formatted value, so no hydration flash) and holds the final value under reduced motion. Drives the hero metric strip
- `useActiveSection()` — scroll-spy over `section[id]`; drives nav highlight and the top-bar path crumb
- `useClock()` — live `HH:MM:SS` clock in `America/Vancouver`, ticking every second
- `fakeCommitHash(seed)` — deterministic 7-char hex for the Experience ledger row (decorative, stable, not real)
- `fakeCommitHashLong(seed)` — a 40-char form of the above for the expanded `git show` commit header
- `usePrefersReducedMotion()` — backing hook for the above

All motion respects `prefers-reduced-motion: reduce` (reveals show immediately, typing/caret/zoom are disabled).

### Design System

Defined as CSS variables in `app/globals.css` (the `tailwind.config.ts` palette is legacy and
largely unused by the current design):

- **Paper**: `#FAF7F0` (page), `#F4EBD3` (warmer bg for Experience & Skills)
- **Ink**: `#2A2C3B` primary, with `-soft` (62%) and `-faint` (40%) variants
- **Accent**: `#555879` (prompts, numbers, links, active nav)
- **Green**: `#3FB27F` (live/available status dots)
- **Dark (Contact)**: `#23242F` bg, `#F4EBD3` headline, `#98A1BC` accent
- **Rules**: 1px hairlines only — `rgba(42,44,59,.13)` and `.30`

Constraints that define the look: **no border radius** (except status dots), **1px hairlines
only**, **no box-shadows** (except the green dot's ring), **no glassmorphism, gradient text,
or blurred orbs**. The only gradient is the dark image overlay on the DOUBL work figure.

### Interactions

- **Scroll reveal** — elements fade/translate in on entering the viewport (IntersectionObserver). `useScrollReveal()` auto-staggers grouped list rows (Work/Experience/Projects/Skills/Contact) by sibling index; the hero keeps its explicit `--reveal-delay`; the sticky section-index marker column uses a directional `.reveal--left` (eases in from the page edge)
- **Count-up metrics** — the four hero metric numbers count from `0` to their value the first time the metric strip enters view (`useCountUp`), preserving thousands separators / zero-pad / trailing `+`
- **Typewriter** — hero `whoami` types on mount, then a blinking caret
- **Status pulse** — the green availability dot in the top bar pulses an outer ring (`topbar-dot-pulse`); the `● available / live / present` status glyphs (`.dot-green`, plus the Work `● LIVE` badge) gently breathe (`dot-breathe`). Both routes
- **Bar & footer entrance** — the shared top bar eases down on load (`topbar-in`); the shared footer fades in when scrolled into view (its own IntersectionObserver, since the page-wide reveal's bottom `rootMargin` would skip it)
- **Scroll-spy** — active section drives the nav highlight and rewrites the `~/path` crumb
- **Live clock** — Vancouver time in the Contact footer
- **Image hover** — avatar and work figures are full color by default and zoom slightly (`scale(1.04)`) on hover
- **Row hover** — Experience/Projects/Skills-tree rows tint and shift right, mimicking selecting a log line
- **Expandable Experience rows** — each row is collapsed by default (AI commit subject + a green `+N insertions · git show ▸` diffstat + tech + dates); clicking (or Enter/Space on the focused row) toggles a `▸`/`▾` glyph and opens a full-width `git show` body — a commit/Author/Date header plus **every** résumé bullet rendered as a green `+` diff line. Independent per row (no accordion); a role with no accomplishments (DOUBL) shows `● in active development` instead and is not expandable. The panel eases both open **and** closed via a `grid-template-rows` collapse (`.row-collapse`, always mounted, `inert` when closed), unless reduced motion is set
- **Expandable Projects rows** — each row is collapsed by default (AI tagline + tech + a `github ↗` link); clicking (or Enter/Space) toggles a `▸`/`▾` glyph and opens a `cat README.md` panel that lists the project's description one sentence per line, plus an `↗ open on github` link. Same bidirectional `.row-collapse` animation as Experience. Independent per row; the GitHub links open the repo without toggling the row

### Responsive

Desktop-first, verified overflow-free from 280px up. At ≤860px the `132px + 1fr` section grids
collapse to one column (the sticky index becomes an inline heading), work articles stack
text-over-image, the metric strip drops to 2×2, and the in-content action links (`↗ live site` /
`github` / `↗ open on github`) gain vertical padding for a comfortable tap target. At ≤700px the
top-bar nav wraps below the brand and its links are padded to ~29px tall — clearing the WCAG 2.2
AA 24px minimum for standalone links — with the Contact link's underline switched from a bottom
border to a `text-decoration` so it stays snug against the padded text, and the anchored-section
`scroll-margin-top` grows to 112px to clear the taller wrapped bar. The shared footer links carry
the same padding site-wide. Type scales fluidly via `clamp()`, and long unbreakable tokens (the
expanded `git show` commit hash) wrap instead of overflowing. On `/content-generation`, the editor
grids collapse at ≤860px and the AI-model dropdown drops to its own full-width line below ~480px so
its 190px min-width can't overflow a narrow phone.

## LaTeX Resume Pipeline

The Experience, Skills, Education, and Projects sections are generated from a single LaTeX
resume so the site stays in sync with the canonical document.

- **Source of truth**: `data/source/master-resume.tex` (exported from Overleaf)
- **Parser**: `scripts/parse-resume.ts` (run with `tsx`)
- **Config**: `data/source/resume-config.json` (hide experiences/accomplishments/technologies)
- **Generated**: `data/generated/experiences.ts`, `skills.ts`, `education.ts`, `projects.ts`
- **Downloadable PDF**: `public/master-resume.pdf` (served at `/master-resume.pdf` by the Contact
  "MASTER RESUME" link) is maintained **manually** — the parser does not generate or sync it

The parser runs automatically before `npm run dev` (via the `predev` hook). It does **not**
run on `npm run build`, so the generated `data/generated/*.ts` files are committed to the repo for
production builds. Run it manually with `npm run parse:resume`.

Full workflow, LaTeX structure, extraction rules, and the config system are documented in
[`data/README.md`](data/README.md).

## AI Content

Two AI files (Google Gemini, from the résumé/project text) sit alongside the LaTeX
pipeline, both under `data/`:

- `work-experience-content.json` (via `scripts/generate-work-experience-content.ts`) — per-role
  `technologies` (shared by **both** the Work and Experience sections), a `commitSubject` for
  the Experience row (every role with accomplishments), and a `description` for roles with a
  live Work card
- `project-content.json` (via `scripts/generate-project-content.ts`) — per-project `tagline`

- **Command**: `npm run generate:content` runs both generators (plain draft). Each has its own
  command — `npm run generate:work-experience-content` / `npm run generate:project-content` —
  which accept flags. These are the only code paths that read `GEMINI_API_KEY` (from `.env`) or
  hit the network. `dev`, `build`, and Vercel only read the committed JSON — generation is a
  deliberate, manual step
- **Shared tech**: one generated `technologies` list per role feeds both sections — Work joins
  it by `contentKey`, Experience overlays it by `experienceId`. `description` exists only for
  roles with a live Work card (DOUBL's coming-soon card has none)
- **Overlays / fallbacks**: Experience uses `commitSubject` (fallback `accomplishments[0]`; a
  role with no accomplishments shows `● in active development`); Projects uses `tagline`
  (fallback the first sentence of `description`)
- **Model**: both scripts read `process.env.GEMINI_MODEL` (default `gemini-2.5-flash-lite`), so the
  model is configurable — set `GEMINI_MODEL` in `.env`, or drive it from the `/content-generation`
  UI's model selector (which passes the choice through per run)
- **Approve / lock**: drafts are written with `approved: false`; set `approved: true` on the
  good ones. Re-running skips approved entries whose source text is unchanged (a `sourceHash`
  guard) and redrafts the rest. `--force [slug]` redrafts regardless; `--seed` fills the file
  from current values without calling the API
- **Precedence**: an inline `description`/`technologies` on a `work.ts` item overrides the AI
  value, so any field can be hand-pinned
- **Commit** both JSON files after approving, like the regenerated `data/generated/*.ts`

Full contract, JSON shape, and workflow are documented in [`data/README.md`](data/README.md).
You can also drive this whole flow from a UI — see [Content pipeline route](#content-pipeline-route).

## Content pipeline route

`/content-generation` (`app/content-generation/page.tsx` + `components/ContentGenerationApp.tsx`)
is **both** a public explainer of how this site's content is generated **and** a local,
password-gated authoring UI over the entire pipeline. It has two sections:

1. **How it works** — an auto-playing, terminal-style animated diagram (`PipelineDiagram.tsx`) of
   the flow: `master-resume.tex` → parser → the data modules, and résumé/project text → the two
   generate scripts → Gemini → the `*-content.json` files → review/approve → the live site
2. **Editor** — edit the `.tex`, run `parse:resume`, review/edit/approve the AI drafts per role and
   per project, toggle résumé visibility (`resume-config.json`), pick the Gemini model
   (`ModelSelect.tsx`), and run `generate:*` — with live previews of the Experience/Work/Projects
   rows and a terminal panel that streams each script's output as it runs

This route shares the main page's motion layer: it calls `useScrollReveal()` (its hero, section
headers, and pipeline diagram fade in on scroll), each editor tab panel fades in when selected
(`cg-tabpanel-in`), and it inherits the shared top-bar entrance/pulse, footer reveal, and
`dot-breathe` status glyphs.

### How it works (backend)

- The client hydrates from `GET /api/content/state` (files) and `GET /api/content/session`
  (authed + production flags); both are public
- Every mutating route (`PUT /master-tex`, `POST /parse`, `POST /generate`,
  `PATCH /work/[key]`, `PATCH /project/[key]`, `PUT /config`) begins with `requireEditable()`
  (`app/lib/content-guard.ts`), which refuses **in production** and without a valid auth cookie
- `POST /parse` and `POST /generate` **stream** the child script's stdout/stderr live
  (newline-delimited, ending in a `__CG_DONE__:{json}` outcome sentinel) into the in-page console
- **Editing only works on `localhost`.** `POST /api/content/auth` checks
  `CONTENT_GENERATION_PASSWORD` server-side but refuses in production first, so the deployed site
  is always a read-only showcase. On success (localhost only) it sets a signed httpOnly cookie
  (`app/lib/content-auth.ts`); production is detected in `app/lib/content-env.ts`
- Committing stays manual — there is no commit button; you `git add`/`commit`/`push` the changed
  files yourself, which triggers Vercel's redeploy
- **Entry points** on the main site: a `Content` link in the top-bar nav and a
  `$ ./how-content-is-generated` button in the hero

### Environment variables

`.env` (local dev), server-only — never prefix with `NEXT_PUBLIC_`:

| Variable | Used by | Notes |
|----------|---------|-------|
| `GEMINI_API_KEY` | the `generate:*` scripts | Google AI key; only these scripts read it |
| `GEMINI_MODEL` | the `generate:*` scripts | default model (`gemini-2.5-flash-lite`); the UI can override per run |
| `CONTENT_GENERATION_PASSWORD` | `/api/content/auth` | unlocks the editor on localhost |
| `CONTENT_GENERATION_SESSION_SECRET` | `content-auth.ts` | HMAC-signs the session cookie |

**Set none of these in production.** The `/content-generation` route is read-only in production
regardless (`isProduction()` short-circuits every write and the unlock route); `VERCEL=1` is set
automatically by Vercel, so no config is needed there.

## Metadata & SEO

- **`app/layout.tsx`** — the home page's metadata: Open Graph + Twitter Card tags, `metadataBase`
  of `https://ariqmuldi.com`, a self-referencing canonical, `robots: index/follow`, and the
  OG/Twitter image `/og-image.png` (1200×630). No `keywords` array — Google ignores the meta
  keywords tag, so it was dropped
- **`app/page.tsx`** — emits `ProfilePage` → `Person` JSON-LD (name, `sameAs` GitHub/LinkedIn) as a
  server-rendered `<script>`; the home page is statically prerendered, so it's in the crawlable HTML
- **`app/sitemap.ts` / `app/robots.ts`** — generate `/sitemap.xml` (home only) and `/robots.txt`
  (allow all, disallow `/api/`, link the sitemap)
- **`app/content-generation/layout.tsx`** — scopes that route to `robots: noindex, nofollow` (a
  read-only showcase kept out of search) with its own canonical + Open Graph card
- **`public/og-image.png`** — the 1200×630 social-share card (a screenshot of the home hero);
  regenerate it with the `/generate-og-image` Claude Code slash command

## Repository Layout

```
app/
  page.tsx            main portfolio: compose sections + page-level hooks + ProfilePage JSON-LD
  layout.tsx          root metadata/SEO, IBM Plex Mono, root HTML
  globals.css         design tokens + all section, content-generation & footer styles
  icon.tsx            generated favicon (lowercase am + block cursor on a dark hairline square)
  sitemap.ts          /sitemap.xml (home only)
  robots.ts           /robots.txt (allow all, disallow /api/, link the sitemap)
  content-generation/ /content-generation route: page.tsx + layout.tsx (noindex metadata)
  api/content/        route handlers for the editor (state/session/auth + gated mutations)
  lib/hooks.ts        reveal / scroll-spy / typewriter / clock / hash
  lib/content-*.ts    content-generation server helpers (env, auth, guard, files, file-names)
components/           shared TopBar + Footer, 7 section components, content-generation components
data/                 all content data + the résumé source, grouped by pipeline role
  source/             master-resume.tex (Overleaf source of truth), resume-config.json (visibility)
  generated/          experiences/skills/education/projects.ts — from the .tex (do not hand-edit)
  content/            work.ts (curated) + work-experience-content.json + project-content.json (AI)
  deprecated/         archived pre-redesign content snapshots
  README.md           content data + résumé pipeline docs
scripts/
  parse-resume.ts        LaTeX → data/generated/*.ts
  generate-work-experience-content.ts  résumé bullets → data/content/work-experience-content.json (Gemini)
  generate-project-content.ts          project text → data/content/project-content.json (Gemini)
public/               og-image.png, profile-photo.jpg, work images + master-resume.pdf (manual)
.claude/              Claude Code slash commands + config (see .claude/README.md)
```
