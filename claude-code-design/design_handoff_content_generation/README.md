# Handoff: `/content-generation` — Content Pipeline page + editor

## Overview

A new authenticated route for **ariqmuldi.com** (`ariqmuldi/ariqmuldicom`, branch `ui-v2`) at
**`/content-generation`**. It does two things:

1. **Explains** how the site's résumé/project copy is generated — an auto-playing, terminal-style
   animated pipeline diagram (`master-resume.tex` → parser → `app/data/*.ts` **and** résumé/project
   text → Gemini → `*-content.json` → review/approve → the live site).
2. **Replaces the hand-editing workflow with a UI.** Today you edit `data/master-resume.tex`, run
   npm scripts, hand-edit `approved` flags in the two `*-content.json` files, and commit. This page
   lets you do all of that from the browser: edit the `.tex`, run `parse:resume`, review/edit/approve
   AI drafts per role and per project, toggle résumé visibility, pick the Gemini model, and run
   `generate:content` — all gated behind a password. You then commit the changed files with git as
   usual (there is **no commit button** in the UI — see 4d).

**Auth requirement (important):** the whole page is visible to anyone, but **editing is read-only
until a password is entered — and editing only works when the app runs on `localhost`.** The password
is `CONTENT_GENERATION_PASSWORD`, checked **server-side** (never shipped to the browser); the unlock
endpoint **refuses in production**, so the deployed site is always read-only. Three unlock outcomes:
(1) wrong password → error; (2) correct password but running in production → "disabled in production,
run locally"; (3) correct password on localhost → unlocked. See `BACKEND.md`.

This README covers the **UI recreation**. The server routes, auth, script wiring, and the
"make it actually work" part are in **`BACKEND.md`** — read both.

---

## About the design files

The files in this bundle are **design references created as HTML prototypes** — they show the
intended look, layout, copy, and interaction. They are **not** production code to paste in.

- `Content Generation.dc.html` — the full page prototype (pipeline animation + gated editor).
- `Ariq Muldi - Portfolio.dc.html` — the existing site, recreated, showing where the **entry-point
  link** goes in the hero + top-bar nav.
- `support.js` — runtime so the two `.dc.html` files open in a browser. **Do not port this** — it
  only exists to make the prototypes viewable. Open either `.dc.html` directly in a browser to
  interact with it.

**Your task:** recreate this design as a real route in the existing Next.js app
(`app/content-generation/page.tsx` + Client Components), using the project's **existing design
system** (`app/globals.css` tokens and the same class vocabulary already used by
`HeroSection`, `ExperienceSection`, `ProjectsSection`, `WorkSection`), then wire the backend per
`BACKEND.md`. The prototype persists edits to `localStorage` so the flow feels real — in the real
app those actions hit API routes that read/write the actual files and git.

---

## Fidelity

**High-fidelity.** Colors, typography, spacing, terminal styling, and interactions are final and
match the existing site's "Swiss-Mono Engineering" aesthetic. Recreate it faithfully using the
existing CSS variables and class patterns. The prototype re-declares the tokens inline (it's a
standalone file); in the app, **reuse the existing `:root` tokens in `app/globals.css`** rather than
redefining them — they are identical (see Design Tokens below).

---

## Tech context (from the repo)

- **Next.js 16 (App Router), React 19, TypeScript, Tailwind 3.** `framer-motion` is available.
- Styling is **plain CSS classes** in `app/globals.css` (BEM-ish: `.topbar`, `.section-grid`,
  `.gitlog__row`, `.proj-row`, …) with CSS variables — **not** Tailwind utility soup. Match that.
- Data files the page reads/writes:
  - `data/master-resume.tex` — LaTeX source of truth (hand-edited today).
  - `data/resume-config.json` — visibility config (per-experience hide flags).
  - `app/data/work-experience-content.json` — AI role content (`commitSubject`, `technologies`, `description`) + `approved` + `sourceHash`.
  - `app/data/project-content.json` — AI project `tagline` + `approved` + `sourceHash`.
  - `app/data/experiences.ts`, `skills.ts`, `education.ts`, `projects.ts` — parser output (generated).
- npm scripts (see `package.json`): `parse:resume`, `generate:content`,
  `generate:work-experience-content`, `generate:project-content`.

---

## Screens / Views

The route is a single scrolling page. Regions top → bottom:

### 1. Top bar (reuse existing `.topbar`)
- Sticky, translucent, `backdrop-filter: blur(8px)`, 54px tall, 1px bottom hairline.
- Left: brand — green status dot + `ariqmuldi` + faint `.com` + accent crumb `~/content-generation`.
- Right nav (`.topbar__nav`, 11px, `letter-spacing:.16em`, uppercase): `HOW IT WORKS` (→ `#how`),
  `EDITOR` (→ `#editor`), and a contact-styled `← BACK TO SITE` link (→ `/`).

### 2. Page hero
- Layout: `max-width:1200px; margin:0 auto; padding:64px 40px 52px;` 1px bottom hairline.
- Prompt line (13px, `--ink-soft`): `$ cat ./how-content-is-generated` + blinking caret (reuse `.caret`).
- H1: `CONTENT` / `PIPELINE` (two lines) — `font-size:clamp(40px,7vw,84px); line-height:.92;
  font-weight:600; letter-spacing:-.045em; color:var(--ink);`
- Intro paragraph (`max-width:64ch; font-size:14.5px; line-height:1.72; --ink-soft`):
  > The résumé and project copy on this site isn't hand-typed into components. A single LaTeX master résumé is parsed into data, an LLM drafts the prose, taglines and commit subjects, and every draft is reviewed and approved before it ships. Below: how it flows — then the console to drive it.
- Meta row (12px, wrap, `gap:8px 26px`): `source of truth **master-resume.tex**` · `|` ·
  `drafts by **{selected model}**` · `|` · `● approve-to-publish` (green dot). **The model name here is
  dynamic** — it reflects the AI-model selector in the editor.

### 3. Section 01 — "How it works" (animated pipeline)  `id="how"`
- Warm background (`--paper-2`), 1px hairlines, `padding:72px 40px`.
- Header row: `[ 01 ]` (accent) · `HOW IT WORKS` (ink) · right-aligned `$ ./pipeline --watch` (faint).
- A bordered panel (`--paper` bg) containing the diagram, in three rails:
  - **RAIL A · LATEX → DATA**: `master-resume.tex` →(`parse:resume`)→ `parse-resume.ts` → `experiences.ts · skills.ts · education.ts · projects.ts` (+ `resume-config.json · pdf sync`).
  - **RAIL B · TEXT → AI DRAFTS**: `résumé + project text` →(`generate:content`)→ `Gemini / {model short name}` → `work-experience-content.json · project-content.json` (`approved: false — awaiting review`).
  - **MERGE** (↓): `review & approve` (`approved: true · locked`) → dark node `ariqmuldi.com` (`renders Work · Experience · Projects`).
- **Animation:** small packets travel left→right along each connector (CSS `@keyframes` translate +
  fade, staggered `animation-delay`); the connector labels sit above the line. A stepper highlights
  one node at a time on a timer (~1.5s), driving a live narration line at the bottom
  (`● stage <current step label>`). The Gemini node's sublabel and the narration's generate step
  both show the **currently selected model**. Autoplay should respect `prefers-reduced-motion`
  (freeze packets, keep the diagram static). In the prototype this is a `setInterval` cycling a
  `data-node` index; reimplement with a React effect + CSS animations (or framer-motion). Keep it
  lightweight — it's decorative.

### 4. Section 02 — Editor  `id="editor"`
- Header row: `[ 02 ]` · `EDITOR` · right `$ sudo edit ./app/data`.

**4a. Auth bar** — 1px border, `--paper-2` bg, flex row:
- Left: small 9px status square (grey `--ink-faint` when locked → green `--green` when unlocked;
  **no emoji**) + title `READ-ONLY` / `EDIT MODE` + a one-line sub explaining the state.
- Right (when locked): `<input type="password">` (placeholder `CONTENT_GENERATION_PASSWORD`) +
  `unlock ↵` button. Enter submits. On success (correct password + localhost) → `EDIT MODE`, show
  `● authenticated` + a `lock` button.
- **Unlock outcomes (three cases):**
  1. Wrong password → `✕ incorrect password — editing stays disabled`.
  2. Correct password **but in production** → `✕ password correct, but content editing is disabled in
     production — run the site locally (localhost) to unlock` (stays locked).
  3. Correct password **on localhost** → unlocked (`EDIT MODE`).
- Border/background shift to a green tint when authenticated.
- **No password hint text is shown on the page.** (Removed by request — only the owner knows it.)
- **Prototype-only env toggle:** the standalone `.dc.html` has a small `PREVIEW ENV` segmented control
  (`localhost` / `production`) so all three cases can be demoed. **Do not port it** — in the real app
  the environment is detected server-side (`process.env.VERCEL` / `NODE_ENV`), not toggled in the UI.

**4b. AI model selector** — 1px border strip below the auth bar:
- Left: `AI MODEL` label + sub `used by every generate:* run — Google Gemini`.
- Right: `GEMINI_MODEL =` + a `<select>` with: `Gemini 2.5 Flash-Lite` (value `gemini-2.5-flash-lite`,
  default), `Gemini 2.5 Flash` (`gemini-2.5-flash`), `Gemini 2.5 Pro` (`gemini-2.5-pro`),
  `Gemini 2.0 Flash` (`gemini-2.0-flash`). Disabled while locked.
- Changing it updates the hero meta line, the pipeline diagram's Gemini node, and is sent with every
  generate call (and appears in the terminal log as `GEMINI_MODEL=<id>`).

**4c. Tabs** — underline tabs (`master.tex`, `work-experience.json`, `project-content.json`); active
tab is accent with a 2px accent underline.

- **Tab `master.tex`** — two columns:
  - Left: label `DATA/MASTER-RESUME.TEX` + a dirty indicator (`● unsaved — run parse` / `✓ in sync`);
    a dark code `<textarea>` (`background:#23242f; color:#e7e2d2; font: 11.5px mono; white-space:pre`)
    holding the `.tex`; below it a primary `$ parse:resume` button + hint
    `runs npm run parse:resume → regenerates the 4 data files`.
  - Right: a `PREVIEW YOUR CHANGES` card (explains edits regenerate the data files) with a dark
    primary link **`view on ariqmuldi.com ↗`** (→ `/`) + note `changes appear after you commit the regenerated files`;
    below it a `LAST PARSE` analytics panel: `experiences N · projects N · skills N · education 1` and
    `changed source flips affected AI entries back to approved: false for re-review`.
  - Below the columns: **`DATA/RESUME-CONFIG.JSON — VISIBILITY`** — one row per experience showing
    `experienceId N · N accomplishments`, a row of numbered chips to **hide specific accomplishments**
    (1-based), and three toggle buttons: `hide role` (→ `hidden`), `hide all bullets`
    (→ `hideAllAccomplishments`), `hide tech` (→ `hideTechnologies`). Active toggles fill accent.
    (Chips are hidden when "hide all bullets" is on.)

- **Tab `work-experience.json`** — a generate bar (`$ npm run generate:work-experience-content`,
  `N/5 approved`, `generate (drafts)` + `--force (redraft all)`), then one card per role
  (`doubl`, `mds`, `makerspace`, `learncoding`, `teaching-assistant`). Each card, two columns:
  - Left (edit): header `key · experienceId N · #sourceHash · [status badge ○ draft / ● approved]`;
    a `COMMIT SUBJECT` text input; a `TECHNOLOGIES` comma-separated input; a `DESCRIPTION` textarea
    **only for roles that have a Work card** (`mds`, `makerspace`, `learncoding` — see mapping in
    `BACKEND.md`); a `⚠ source changed since approval` warning when applicable; and buttons
    `approve & lock` / `✓ approved — unlock` + `regenerate --force <key>`.
  - Right (live preview): the **Experience "git log" row** (`hash` · `Role @ Company · context`,
    commit subject, `+N insertions · git show ▸`, tech line; roles with no accomplishments show
    `● in active development`) and, for described roles, the **Work case-study card** (number, meta,
    title, description, tech).

- **Tab `project-content.json`** — a generate bar (`$ npm run generate:project-content`, `N/4 approved`,
  `generate (drafts)` + `--force`), then one card per project (`ponotodoro`, `flight-hub`, `chatterbox`,
  `moodijawoodi`): left has `projectId · #sourceHash · badge`, a `TAGLINE` input (note:
  `fallback: first sentence of the parsed description`), approve + regenerate buttons; right shows the
  live **Projects index row** (`[NN]` · title · tagline · tech · `↗`).

**4d. Generate all content** — a bar (replaces the old staged/commit bar; **there is no git commit in
the UI**). Header `GENERATE ALL CONTENT`; body: `Runs npm run generate:content with
GEMINI_MODEL={model} — drafts every unapproved or source-changed role & project (approved + unchanged
entries are skipped), each landing as approved: false for review above.`; a status line
`N/5 roles · N/4 projects approved · commit the changed files from your editor when done`; and a
primary **`$ npm run generate:content`** button (disabled while locked or generating). Committing the
regenerated files is done by the owner with git, outside this UI.

**4e. Terminal** — a dark panel (traffic-light dots + `ariq@muldi — content-console`) that logs every
action as if it were a shell: `$ npm run …`, draft/skip/approve lines, auth outcomes, success/error.
Auto-scrolls to bottom. Color coding: command `#98a1bc`, dim `#7e86a6`, note `#b9ae97`,
success `--green`, error `#e0806b`, bright `#ede7d6`.

### 5. Footer
Dark bar (`--dark-bg`): `● content pipeline` · `← ariqmuldi.com` (→ `/`) · right `© 2026 Ariq Muldi`.

### 6. Entry points on the main site (edit `HeroSection.tsx` + top-bar nav)
- **Top-bar nav:** add a `CONTENT` link (same `.topbar__link` style) pointing to `/content-generation`,
  placed before the contact link.
- **Hero:** add a bordered button-style link below the status row:
  `$ ./how-content-is-generated — view the AI content pipeline & editor ↗` → `/content-generation`.
  (Prototype: `.dc.html` hero shows the exact treatment — 1px border, `padding:11px 16px`, accent `$`
  and `↗`, hover raises border to accent + faint fill.)

---

## Interactions & behavior

- **Auth gate:** every input/button in the editor is `disabled` while locked; cursor `not-allowed`.
  Unlock calls the server (see `BACKEND.md`) — do **not** compare the password in the browser.
- **Parse:** `$ parse:resume` posts the current `.tex`, runs the parser, refreshes the previews and
  `LAST PARSE` counts. A changed source **flips affected AI entries back to `approved:false`**
  (recompute `sourceHash`; if it differs, unset `approved` and flag "source changed").
- **Generate / regenerate:** posts `{target, force, key, model}`. Default generate drafts only
  **unapproved or source-changed** entries (approved+unchanged are skipped — never lose an approval);
  `--force` redrafts all; `regenerate --force <key>` redrafts one. New drafts come back `approved:false`.
- **Approve & lock:** toggles `approved` on that entry and writes the JSON. Approving clears the
  "source changed" flag.
- **Field edits** (commit subject, technologies, description, tagline) write the JSON directly (debounced).
- **Visibility toggles** write `resume-config.json`; note they take effect on the **next parse**.
- **Generate all:** runs `generate:content` (both generators) with the selected model — drafts only
  unapproved/changed entries. **No commit happens from the UI** — the owner commits the regenerated
  files with git afterward (Vercel then redeploys on push).
- **Live previews** re-render on every keystroke so you see exactly how a commit subject / tagline /
  description will look in the Experience, Work, and Projects sections.
- **Model select** is disabled while locked; persists; feeds every generate call.

---

## State management

Client state for the editor screen (mirror the prototype's shape):
- `unlocked: boolean` (from the auth endpoint; do not persist the password).
- `model: string` (selected `GEMINI_MODEL` id; default `gemini-2.5-flash-lite`).
- `activeTab: 'resume' | 'work' | 'projects'`.
- `tex: string` (+ `texDirty`), `parsing: boolean`.
- `experiences[]`, `projects[]` (for previews), from the parse/state endpoint.
- `work: Record<key, RoleContent>`, `proj: Record<slug, ProjectContent>` (the two JSON files).
- `config: Record<key, {hidden, hideAllAccomplishments, hideAccomplishments[], hideTechnologies}>`.
- `busy` flags, `log: {text,color}[]`.
- Prototype only: `simEnv: 'localhost' | 'production'` backs the demo env toggle. In the real app this
  is **not** client state — the server decides based on `process.env`. (No `staged`/commit state — the
  commit flow was removed from the UI.)

**Data fetching:** on load, `GET /api/content/state` to hydrate `tex`, both JSON files, and config.
All mutations go through the API routes in `BACKEND.md`. (The prototype uses `localStorage` only
because it has no server — replace that with the endpoints.)

---

## Design tokens

**Reuse the existing `:root` variables in `app/globals.css` — do not invent new ones.** They are:

```
--paper:#faf7f0   --paper-2:#f4ebd3   --ink:#2a2c3b
--ink-soft:rgba(42,44,59,.62)   --ink-faint:rgba(42,44,59,.40)
--accent:#555879   --accent-deep:#3d3f5c   --blue:#98a1bc   --beige:#ded3c4
--rule:rgba(42,44,59,.13)   --rule-2:rgba(42,44,59,.30)   --green:#3fb27f
--dark-bg:#23242f  --dark-text:#ede7d6  --dark-head:#f4ebd3  --dark-muted:#7e86a6
--dark-accent:#98a1bc  --dark-accent-2:#b9ae97  --dark-rule:rgba(152,161,188,.2)
--topbar-h:54px  --content-max:1200px  --content-pad:40px
```

- **Font:** `--font-plex-mono` (IBM Plex Mono), already the body font. Terminal/dark areas use the
  same mono. `font-feature-settings:'ss01','zero'`.
- **Terminal log colors:** command `#98a1bc` · dim `#7e86a6` · note `#b9ae97` · success `#3fb27f` ·
  error `#e0806b` · bright `#ede7d6`. Warnings/errors in the light UI: `#b26b2e` (source-changed),
  `#c4553b` (auth error).
- **Spacing:** section padding `72px 40px`; cards `18–22px`; hairline borders `1px` in `--rule`/`--rule-2`.
- **Radius:** essentially 0 (square, engineering aesthetic) — only the status dots are round.
- **Reveal/motion:** reuse the existing `.reveal` + IntersectionObserver pattern; respect
  `prefers-reduced-motion` (the pipeline animation must freeze under reduced motion).

---

## Assets

No new image assets. Icons are text glyphs (`↗ → ↵ ● ○ ✓ ✕ ⚠ ↓ ├── └──`) consistent with the
existing site. No icon library needed.

---

## Files

**In this bundle (design references — view in a browser, don't ship):**
- `Content Generation.dc.html` — the page prototype.
- `Ariq Muldi - Portfolio.dc.html` — entry-point placement reference.
- `support.js` — prototype runtime (ignore for production).
- `BACKEND.md` — **server routes, auth, script edits, deploy models. Required reading.**
- `screenshots/` — reference renders of every state:
  - `01-hero.png` — page hero (Content Pipeline).
  - `02-pipeline.png` — Section 01 animated pipeline diagram.
  - `03-editor-auth-read-only.png` — Section 02 auth bar (READ-ONLY) + AI model selector + tabs.
  - `04-master-tex-editor.png` — master.tex tab (unlocked / EDIT MODE) + preview card + LAST PARSE.
  - `05-work-experience-tab.png` — work-experience.json tab: role cards + live previews.
  - `06-project-content-tab.png` — project-content.json tab: tagline cards + live previews.
  - `07-generate-and-terminal.png` — Generate all content bar + terminal.
  - `08-portfolio-entry-point.png` — the entry-point button on the main site's hero.

**In the real repo (`ariqmuldi/ariqmuldicom@ui-v2`) you will touch/reference:**
- Create: `app/content-generation/page.tsx` (+ client components under e.g. `app/content-generation/`).
- Create: API routes under `app/api/content/*` (see `BACKEND.md`).
- Edit: `app/components/HeroSection.tsx` + the top-bar nav (add entry-point links).
- Edit: `scripts/generate-work-experience-content.ts`, `scripts/generate-project-content.ts`
  (make `GEMINI_MODEL` an env var — see `BACKEND.md`).
- Reference (match styles/shape): `app/globals.css`, `app/components/{Experience,Projects,Work}Section.tsx`,
  `app/data/*.ts`, `app/data/*.json`, `data/master-resume.tex`, `data/resume-config.json`,
  `scripts/parse-resume.ts`.

---

## Implementation plan (suggested order)

1. **Route + shell:** `app/content-generation/page.tsx` with the top bar, hero, and section scaffolding
   using existing classes. Add the two entry-point links on the main site.
2. **Read-only state:** `GET /api/content/state`; render the pipeline animation, the previews, and all
   tabs in read-only mode (no auth yet).
3. **Auth:** implement `POST /api/content/auth` + cookie + `requireAuth()`; wire the unlock bar; gate
   all editing UI on the cookie/response.
4. **Mutations:** master-tex write + `parse`, field edits, approve, config, generate (with model) —
   one endpoint at a time (see `BACKEND.md`), updating the terminal log. All mutating routes require
   auth **and** refuse in production. No commit route — committing is manual (git).
5. **Polish:** live previews on keystroke, reduced-motion, disabled/cursor states, error toasts in the
   terminal.

Ship read-only first; layer auth + mutations on top.
