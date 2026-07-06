# ariqmuldi.com

Personal portfolio for Ariq Muldi — a single long-scroll page built with Next.js (App
Router) and React. The design is a **Swiss-mono engineering manifest**: one warm off-white
canvas, `IBM Plex Mono` throughout, a strict two-column grid, hairline rules instead of
cards, and terminal motifs used only as accents (a typed `whoami`, a `git log` experience
ledger, a `tree` skills list, a live clock). All content is rendered dynamically from
`app/data/*.ts`, most of which is generated from a LaTeX master resume.

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
npm run parse:resume     # manually regenerate app/data/*.ts + sync resume PDF
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

Everything lives under `app/` (Next.js App Router):

- `app/page.tsx` — client component that composes the sections in order and runs the
  page-level hooks (`useActiveSection`, `useScrollReveal`)
- `app/layout.tsx` — root layout: metadata/SEO, loads `IBM Plex Mono`, sets the font CSS variable
- `app/globals.css` — the entire visual system: design tokens (CSS variables), base/reset,
  scroll-reveal, per-section styles, responsive collapse, and reduced-motion handling
- `app/icon.tsx` — dynamically generated favicon ("AM" badge) via `ImageResponse`
- `app/lib/hooks.ts` — client hooks and helpers (see below)
- `app/components/` — the section components and top bar
- `app/data/` — the content source (`.ts` data modules)

### Sections (top to bottom)

| Section | Component | Data source | Notes |
|---------|-----------|-------------|-------|
| Top bar | `TopBar.tsx` | static nav config | sticky nav, scroll-spy highlight, live `~/path` crumb |
| Hero | `HeroSection.tsx` | static + `experiences` count | typed `whoami`, framed avatar, metric strip |
| Work | `WorkSection.tsx` | `work.ts` (+ `work-experience-content.json`) | case-study articles, `● LIVE` / `○ SHOWCASE TBA`; AI `description`/`technologies` |
| Experience | `ExperienceSection.tsx` | `experiences.ts` (+ `work-experience-content.json`) | `git log` ledger: collapsed rows show an AI commit subject + `+N insertions` diffstat, expanding to a full-width `git show` body listing every bullet; AI tech + `commitSubject` overlay |
| Projects | `ProjectsSection.tsx` | `projects.ts` (+ `project-content.json`) | expandable rows: an AI tagline collapsed, expanding to a `cat README.md` panel + GitHub links |
| Skills | `SkillsSection.tsx` | `skills.ts` | `tree`-style output, one row per category |
| Education | `EducationSection.tsx` | `education.ts` | school/GPA header, coursework, certifications |
| Contact | `ContactSection.tsx` | static links | dark section, live Vancouver clock, résumé download |

`app/page.tsx` renders them in this order: Hero → Work → Experience → Projects → Skills →
Education → Contact. Navigation is anchor-based (`#work`, `#experience`, `#projects`,
`#skills`, `#education`, `#contact`) with `scroll-behavior: smooth`.

### Data-Driven Rendering

Every section `.map()`s over its data module — no content is hardcoded in JSX. Component
count follows array length, so adding/removing an experience, project, skill category, or
work item changes the page automatically.

- **Auto-generated** from `data/master-resume.tex`: `experiences.ts`, `skills.ts`,
  `education.ts`, `projects.ts`. **Do not edit these by hand** — they are overwritten on
  every parse. See [`data/README.md`](data/README.md).
- **Manually curated**: `work.ts` (the "Work" case studies). It carries
  optional presentation fields the design needs — `role`, `figLabel`, `overlayLabel`,
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
- `useScrollReveal()` — observes `[data-reveal]` elements and adds `.is-visible` when they enter the viewport
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

- **Scroll reveal** — elements fade/translate in on entering the viewport (IntersectionObserver); hero uses staggered `--reveal-delay`
- **Typewriter** — hero `whoami` types on mount, then a blinking caret
- **Scroll-spy** — active section drives the nav highlight and rewrites the `~/path` crumb
- **Live clock** — Vancouver time in the Contact footer
- **Image hover** — avatar and work figures are full color by default and zoom slightly (`scale(1.04)`) on hover
- **Row hover** — Experience/Projects rows tint and shift right, mimicking selecting a log line
- **Expandable Experience rows** — each row is collapsed by default (AI commit subject + a green `+N insertions · git show ▸` diffstat + tech + dates); clicking (or Enter/Space on the focused row) toggles a `▸`/`▾` glyph and opens a full-width `git show` body — a commit/Author/Date header plus **every** résumé bullet rendered as a green `+` diff line. Independent per row (no accordion); a role with no accomplishments (DOUBL) shows `● in active development` instead and is not expandable. The reveal eases open unless reduced motion is set
- **Expandable Projects rows** — each row is collapsed by default (AI tagline + tech + a `github ↗` link); clicking (or Enter/Space) toggles a `▸`/`▾` glyph and opens a `cat README.md` panel that lists the project's description one sentence per line, plus an `↗ open on github` link. Independent per row; the GitHub links open the repo without toggling the row

### Responsive

Desktop-first. At ≤860px the `132px + 1fr` section grids collapse to one column (the sticky
index becomes an inline heading), work articles stack text-over-image, and the metric strip
drops to 2×2. At ≤700px the top-bar nav wraps below the brand. Type scales fluidly via `clamp()`.

## LaTeX Resume Pipeline

The Experience, Skills, Education, and Projects sections are generated from a single LaTeX
resume so the site stays in sync with the canonical document.

- **Source of truth**: `data/master-resume.tex` (exported from Overleaf)
- **Parser**: `scripts/parse-resume.ts` (run with `tsx`)
- **Config**: `data/resume-config.json` (hide experiences/accomplishments/technologies)
- **Generated**: `app/data/experiences.ts`, `skills.ts`, `education.ts`, `projects.ts`
- **PDF sync**: the parser also copies `data/master-resume.pdf` → `public/master-resume.pdf`
  so the Contact "MASTER RESUME" link (`/master-resume.pdf`) is web-servable (`data/` is not)

The parser runs automatically before `npm run dev` (via the `predev` hook). It does **not**
run on `npm run build`, so the generated `app/data/*.ts` files and `public/master-resume.pdf`
are committed to the repo for production builds. Run it manually with `npm run parse:resume`.

Full workflow, LaTeX structure, extraction rules, and the config system are documented in
[`data/README.md`](data/README.md).

## AI Content

Two AI files (Gemini 2.5 Flash-Lite, from the résumé/project text) sit alongside the LaTeX
pipeline, both under `app/data/`:

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
  roles with a live Work card (DOUBL's coming-soon card keeps a manual `description`)
- **Overlays / fallbacks**: Experience uses `commitSubject` (fallback `accomplishments[0]`; a
  role with no accomplishments shows `● in active development`); Projects uses `tagline`
  (fallback the first sentence of `description`)
- **Approve / lock**: drafts are written with `approved: false`; set `approved: true` on the
  good ones. Re-running skips approved entries whose source text is unchanged (a `sourceHash`
  guard) and redrafts the rest. `--force [slug]` redrafts regardless; `--seed` fills the file
  from current values without calling the API
- **Precedence**: an inline `description`/`technologies` on a `work.ts` item overrides the AI
  value, so any field can be hand-pinned
- **Commit** both JSON files after approving, like the regenerated `app/data/*.ts`

Full contract, JSON shape, and workflow are documented in [`data/README.md`](data/README.md).

## Metadata & SEO

Comprehensive metadata lives in `app/layout.tsx`: Open Graph and Twitter Card tags, a keyword
array, `metadataBase` of `https://ariqmuldi.com`, and the OG/Twitter image
`/for-metadata-picture.png`.

## Repository Layout

```
app/
  page.tsx            compose sections + page-level hooks
  layout.tsx          metadata, IBM Plex Mono, root HTML
  globals.css         design tokens + all section styles
  icon.tsx            generated favicon
  lib/hooks.ts        reveal / scroll-spy / typewriter / clock / hash
  components/         TopBar + 7 section components
  data/               content modules (4 generated, 1 curated, 2 AI-generated)
    work-experience-content.json  AI Work descriptions + shared tech + commit subjects (per role)
    project-content.json          AI project taglines (per project)
data/
  master-resume.tex   LaTeX source of truth (Overleaf)
  master-resume.pdf   downloadable résumé (synced into /public)
  resume-config.json  parser visibility config
  README.md           resume pipeline docs
scripts/
  parse-resume.ts        LaTeX → app/data/*.ts + PDF sync
  generate-work-experience-content.ts  résumé bullets → app/data/work-experience-content.json (Gemini)
  generate-project-content.ts          project text → app/data/project-content.json (Gemini)
public/               images, generated résumé PDF
.claude/              Claude Code slash commands + config (see .claude/README.md)
```
