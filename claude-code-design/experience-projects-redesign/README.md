# Handoff: Experience "git show" ledger + Projects README rows

## Overview
Redesign of two sections of **ariqmuldi.com** — the personal portfolio in the `ariqmuldi/ariqmuldicom` repo, branch **`ui-v2`** (Next.js 16 App Router + React 19 + TypeScript, styling via CSS variables in `app/globals.css`). Two sections change:

1. **Experience** (`git log` ledger) — fixes a clipped first-bullet summary and a cramped inline expand. The collapsed row becomes a git **commit subject + diffstat**; clicking runs a full-width **`git show`** commit body (each résumé bullet as a `+` diff line).
2. **Projects** — rows become **expandable "README" rows**: a terse tagline collapsed, expanding to a `cat README.md` panel with the full description + a link out.

This is a **UI-only** change. The site's content is dynamically generated (see the ⚠️ section) and must keep working exactly as it does today.

## About the design files
The bundled **`Experience Redesign.dc.html`** (with `support.js` beside it — open the HTML directly) is a **design-reference prototype built in HTML**, not production code to copy. It is a streaming "Design Component" and renders in any browser.

Your job is to **recreate the chosen designs in the existing Next.js codebase** using its established patterns — the `.gitlog__*` / `.proj-row` classes in `app/globals.css` and the section components in `app/components/`. Do **not** port the HTML/Design-Component runtime into the app.

The prototype is a canvas with several explored options across three "turns." **Implement only the two chosen options:**
- **Experience → option "2a"** (turn 2)
- **Projects → option "3b"** (turn 3)

Ignore every other option in the file (1a–1e, 2b, 2c, 3a, 3c) — they are alternatives that were not chosen.

## Fidelity
**High-fidelity.** Exact colors, type, and spacing are below. The site already defines every token used here in the `:root` block of `app/globals.css` — **reuse those variables, do not introduce new colors, fonts, radii, or shadows.** The whole system is: `IBM Plex Mono`, warm paper backgrounds, 1px hairlines, **no border-radius, no box-shadow** (the green status dot is the only exception).

---

## ⚠️ Preserve the dynamic content pipeline (most important constraint)
Almost nothing on this site is hardcoded. The redesign changes **markup + CSS only**, plus **two new AI-generated text fields**. Keep everything data-driven:

- `app/data/experiences.ts`, `projects.ts`, `skills.ts`, `education.ts` are **auto-generated from `data/master-resume.tex`** by `scripts/parse-resume.ts` (runs on `predev`). **Never hand-edit them and never hardcode their content into components.**
- `app/data/role-content.json` is **AI-generated** (Gemini, via `npm run generate:content` → `scripts/generate-role-content.ts`) and holds per-role `description` (Work) + a shared `technologies` list. The Experience section already overlays `technologies` by `experienceId` — keep that.
- Every section renders by `.map()`-ing its data array. Keep it that way; component count follows the data.

**Do NOT** paste the sample copy from the prototype (`feat(admissions): automate MDS review for 1,000+ applicants`, `Pomodoro timer fused with notes & to-do lists`, etc.) as literal strings. Those are **examples of the style** the AI must produce. They must be generated and read from data, exactly like `description` is today (see "AI generation" below).

---

## Screens / Views

### 1. Experience — option "2a" (`app/components/ExperienceSection.tsx` + `.gitlog__*` in `app/globals.css`)

**Layout (unchanged from today):** the `.section.section--warm` block (bg `--paper-2` `#f4ebd3`) with `.section-grid` = `132px minmax(0,1fr)`, gap 40px, padding 80px 40px. Left `.section-index`: `[ 02 ]` (accent, 11px, letter-spacing .2em), `EXPERIENCE` (ink, 11px), `$ git show` (ink-faint, 11px). Above the rows, the mono command line reads `git log --oneline --stat --author="ariq" main` (ink-faint 11px).

**Row grid:** `78px minmax(0,1fr) 128px`, gap 20px, `align-items:baseline`, `border-top:1px solid var(--rule)`, padding `20px 0`. Hover: `background:rgba(85,88,121,.05)` + `padding-left:8px` (transition .2s). First row top border `--rule-2`; last row bottom border `--rule-2`.

**Collapsed row — three columns:**
- **Col 1 — hash** (`--accent` `#555879`, 12px): expandable rows are prefixed with a toggle glyph `▸ ` (becomes `▾ ` when open), then the 7-char `fakeCommitHash(exp.id)` (already in `app/lib/hooks.ts`).
- **Col 2 — body:**
  1. **Title** (15px / 600, `--ink`, letter-spacing -.01em): `{role} ` + a 400-weight `--ink-faint` span `@ {shortCompany} · {context}` (reuse the existing `shortCompany` + `splitTitle` helpers).
  2. **Commit subject** (13px, `--ink-soft`, line-height 1.55, margin-top 7px): the AI-generated `commitSubject` for this role (see AI section), **fallback to `accomplishments[0]`** if absent. This REPLACES the old clamped first-bullet summary — remove the `-webkit-line-clamp` on `.gitlog__summary`; nothing is truncated now.
  3. **Diffstat hint** (11.5px, margin-top 8px, `--ink-faint`): a green (`--green` `#3fb27f`) `+{N} insertions` where **N = `accomplishments.length`**, then ` · git show ▸`. The hint text turns `--accent` on **row** hover (`.gitlog__row:hover .gitlog__hint{color:var(--accent)}`).
  4. **Tech line** (11px, `--ink-faint`, line-height 1.8): `technologies.join(' · ')` — the `role-content.json` list overlaid by `experienceId`, fallback `experiences.ts` `technologies`.
- **Col 3 — dates** (right-aligned, 11px, `--ink-soft`, line-height 1.5): `{start} —` then on the next line either `{end}` or, if `current`, a green `● present`.

**Special case — role with hidden/empty accomplishments (DOUBL, `hideAllAccomplishments`):** no commit subject and no diffstat; instead show `● in active development` (green dot + ink-faint text). Not expandable (no toggle glyph, no click).

**Expanded state (click row — full-width `git show`):** a block that **spans all three columns** (`grid-column: 1 / -1`), `margin-top:18px`, `border-top:1px solid var(--rule-2)`, `padding-top:18px`, animating in with a fade + `translateY(-4px)→0` over .26s (respect `prefers-reduced-motion`). Contents, in order:
- `commit ` + a 40-char hex hash in `--accent`. (Extend `fakeCommitHash` to 40 chars, or repeat/pad the 7-char value to length 40 — it's decorative and stable.)
- `Author: Ariq Muldi <ariq@ariqmuldi.com>` (12px, `--ink-soft`)
- `Date:   {period}` (12px, `--ink-soft`)
- `{N} files changed, {N} insertions(+)` (11px, `--ink-faint`), N = accomplishments count.
- A **bordered list** that renders **EVERY accomplishment bullet for the role — the complete `accomplishments` array from `app/data/experiences.ts`** (parsed from `data/master-resume.tex`, honoring `resume-config.json` visibility). List all of them, the first bullet included; never cap, subset, or preview. One row per accomplishment: a 36px `+` gutter (green text, bg `rgba(63,178,127,.10)`, centered) next to the bullet text (13px, `--ink`, line-height 1.6, padding 10px 16px). Each line has bg `rgba(63,178,127,.05)` and a `1px solid var(--rule)` divider. **Bullets stay visually uniform — do not colorize the numbers/metrics inside them.**

**Interaction:** independent expand/collapse per row (no accordion), keep the existing `openIds: Set<number>` + Enter/Space keyboard toggle + `aria-expanded`. Clicks inside the expanded body must NOT collapse the row (`stopPropagation` on the expanded container).

---

### 2. Projects — option "3b" (`app/components/ProjectsSection.tsx` + `.proj-row*` in `app/globals.css`)

**Layout (unchanged):** `.section` (bg `--paper` `#faf7f0`), same `.section-grid`. Sidebar `[ 03 ] / PROJECTS / $ ls ~/side`. Keep the existing intro `.intro-copy`.

**Convert Projects from static link rows into expandable rows.** Row grid: `56px minmax(0,1fr) 120px`, gap 20px, baseline, `border-top:1px solid var(--rule)`, padding `22px 0`, same hover tint + shift.

**Collapsed row:**
- **Col 1** (`--accent`, 12px): `▸ [01]` (toggle glyph `▸`/`▾` + the 1-based zero-padded index).
- **Col 2:** project **title** (17px / 600, letter-spacing -.02em), **tagline** (13px, `--ink-soft`, margin-top 6px — the AI-generated one-liner; fallback to the first sentence of `description`), **tech line** (11px, `--ink-faint`, `technologies.join(' · ')`).
- **Col 3:** right-aligned `github ↗` link (11.5px, `--accent`) → `project.github`, `target="_blank"`, `rel="noopener"`, and **`stopPropagation`** so it opens the repo instead of toggling.

**Expanded state (click row — full-width):** `grid-column:1 / -1`, `margin-top:16px`, `border-top:1px solid var(--rule-2)`, `padding-top:16px`, same fade/translate animation. Contents:
- Header (11px, `--ink-faint`): `$ cat ~/side/{repo}/README.md`, where `repo` = the last path segment of `project.github`. (The `$` is `--accent`.)
- The project's full `description`, **split into its individual sentences and rendered one per line** as a markdown-style `- ` bullet list (each sentence is one accomplishment statement — do NOT show it as a single run-on paragraph). Split on sentence boundaries (e.g. `description.split(/(?<=[.!?])\s+/)`, trimmed, empties dropped). Each line: 13.5px, `--ink-soft`, line-height ~1.66, an accent `-` marker in an 18px hanging indent. Every sentence in the description must appear.
- An `↗ open on github` link (12.5px, `--accent`, underlined via 1px border-bottom) → `project.github` (also `stopPropagation`).

**Interaction:** clicking the row toggles the README; the two GitHub links open the repo without toggling. `ProjectsSection` must become a client component (`'use client'`) with its own `openIds: Set<number>` toggle (mirror ExperienceSection). Keyboard: Enter/Space toggles, `aria-expanded` on the row.

---

## State Management
- **Experience:** keep the existing `const [openIds, setOpenIds] = useState<Set<number>>(new Set())` and `toggle(id)` — no change to the state model, only to what each row renders.
- **Projects:** **new** — add the identical `openIds` toggle. It's currently a server/static component rendering `<a>` rows; make it a `'use client'` component with per-row expand state, and keep the GitHub links as real anchors inside.

## Design Tokens (already in `app/globals.css` `:root` — reuse, don't redefine)
```
--paper: #faf7f0;    --paper-2: #f4ebd3;   (Experience section bg)
--ink: #2a2c3b;      --ink-soft: rgba(42,44,59,.62);   --ink-faint: rgba(42,44,59,.4);
--accent: #555879;   --green: #3fb27f;
--rule: rgba(42,44,59,.13);   --rule-2: rgba(42,44,59,.3);
Row hover tint:  rgba(85,88,121,.05)
Diff line bg:    rgba(63,178,127,.05)     Diff "+" gutter bg: rgba(63,178,127,.10)
Font: IBM Plex Mono (300–700 + italic), already loaded in app/layout.tsx
Constraints: no border-radius, no box-shadow, 1px hairlines only.
```

---

## AI generation — extend the existing pipeline (do NOT hardcode these strings)
The collapsed Experience subject and the Projects tagline must be **produced by the AI content pipeline**, exactly like the Work `description` is today. `scripts/generate-role-content.ts` is the only code path that reads `GEMINI_API_KEY` / hits the network; it is manual (`npm run generate:content`) and never runs in `dev`/`build`/Vercel. Preserve all of that.

### A. Experience `commitSubject` — in `scripts/generate-role-content.ts` → `app/data/role-content.json`
- Add `commitSubject?: string` to the `RoleContent` interface **and** to `GeminiResult`.
- In `callGemini`, add `commitSubject: { type: 'STRING' }` to the response schema `properties`, put it **first** in `propertyOrdering`, and generate it for **every** role (NOT gated by `wantsDescription` — every expandable role needs it).
- Prompt guidance to add: *"Also produce `commitSubject`: one imperative Conventional-Commits subject line summarizing the role's most significant work — `type(scope): summary` — lowercase after the colon, no trailing period, ≤ ~72 chars. Use `feat` for shipped/build work; `scope` is a short lowercase area such as admissions, makerspace, learn, teaching."* Style target (from the design): **`feat(admissions): automate MDS review for 1,000+ applicants`**.
- Add `commitSubject` to `serialize()` field ordering: `experienceId → sourceHash → approved → commitSubject → technologies → description`.
- Keep the approve/lock flow untouched: drafts are `approved:false`; the existing `sourceHash` guard still forces a re-draft when accomplishments change; `--seed` should preserve an existing `commitSubject`.
- A role with hidden/empty accomplishments (DOUBL) has nothing to summarize → leave `commitSubject` empty; the component shows `● in active development` (above).
- `ExperienceSection.tsx` overlays `commitSubject` by `experienceId` (same overlay pattern already used for `technologies`); fallback `accomplishments[0]`.

### B. Projects `tagline` — new `app/data/project-content.json`
- Projects come from the auto-generated `app/data/projects.ts` (don't edit). Add a **parallel** AI file `app/data/project-content.json`, keyed by `projectId`, shape:
  ```json
  { "ponotodoro": { "projectId": 1, "sourceHash": "…", "approved": false, "tagline": "…" } }
  ```
  where `sourceHash` mirrors `sourceHashOf` but hashes the project's `description`.
- Generate `tagline` by summarizing each `project.description` into a terse **≤ ~60-char** GitHub-"About"-style one-liner (sentence case, no trailing period). Style targets (from the design): `Pomodoro timer fused with notes & to-do lists`, `Flight-deal finder + blog, via Amadeus & Twilio`, `Real-time, Discord-style group chat on Firebase`, `JDBC grocery storefront in Java + MySQL`.
- Reuse the same generation + approve/lock machinery (draft `approved:false`; skip approved+unchanged; `--force`; `--seed` fills without the API). Either extend `generate-role-content.ts` to also emit `project-content.json`, or add `scripts/generate-project-content.ts` + a `generate:project-content` npm script (and/or fold both into `generate:content`). Keep it in the manual, network-gated step.
- `ProjectsSection.tsx` overlays `tagline` by `projectId`; fallback to the first sentence of `description`.

---

## Files to touch
- `app/components/ExperienceSection.tsx` — commit subject + diffstat collapsed row; full-width `git show` expanded body; overlay `commitSubject`.
- `app/components/ProjectsSection.tsx` — convert to `'use client'` expandable rows; tagline + README expand; overlay `tagline`; keep GitHub links.
- `app/globals.css` — update `.gitlog__*` (drop the summary `-webkit-line-clamp`; add diffstat hint, `git show` body, `+` gutter) and `.proj-row*` (expandable variant + README panel). Reuse existing `:root` tokens.
- `app/lib/hooks.ts` — extend/pad `fakeCommitHash` to a 40-char form for the `git show` header (keep the 7-char form for the row).
- `scripts/generate-role-content.ts` — add `commitSubject` generation; (optionally) project `tagline` generation.
- `app/data/role-content.json` — regenerate so each role gains `commitSubject`, then approve.
- **NEW** `app/data/project-content.json` (+ generator wiring / npm script).

## Reference files in this bundle
- `Experience Redesign.dc.html` (+ `support.js`) — the HTML prototype. **Experience = turn 2, option "2a"; Projects = turn 3, option "3b".** Open the file and expand a row in each to see the interaction. Ignore all other options.
