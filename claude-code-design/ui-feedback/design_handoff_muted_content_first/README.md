# Handoff: Muted / Content-First Legibility Pass — `/` + `/content-generation`

## Overview

Reviewer feedback on the live site:

> "I think it [needs] less color and so [I want] less highlighted content. A bit hard to put my eyes and pay attention to the content."

Plus a direction from the site owner: keep the minimalist **Swiss-mono terminal** identity, and make the page read clearly for **non-technical** visitors as well as engineers.

**Goal:** reduce color and dial back decorative "highlighting" so the actual content — names, prose, results, dates — is what the eye lands on first. Color becomes *rare and meaningful* instead of ambient.

This is a **restyle + light copy pass, not a rebuild.** Layout, the two-column `132px + 1fr` grids, type scale, spacing, section order, `IBM Plex Mono`, hairline rules, `next/image` usage, and every interaction stay **exactly** as they are on `ui-v2`. What changes is the *color/emphasis system*, a few *motion* effects, and a small number of *clarity* additions. Almost everything below is edits to `app/globals.css`; a couple of one-line copy changes touch components.

## About the design files

The two `.dc.html` files in this bundle are **design references built in HTML** — they show the intended look and behavior; they are **not** code to ship. Recreate the changes in the existing Next.js app by editing `app/globals.css` and the relevant components. Every color/class named below already exists in the repo.

- `Ariq Muldi - Portfolio.dc.html` → the `/` route (`app/page.tsx` + section components)
- `Content Generation.dc.html` → the `/content-generation` route (`components/ContentGenerationApp.tsx`, `PipelineDiagram.tsx`, `ModelSelect.tsx`), shown in its **production read-only** state (which is what visitors see)

Both are self-contained — open in any browser (`support.js` and `public/` are included in this folder). The content-generation reference renders the editor as read-only (the deployed behavior), so interactive controls appear disabled.

## Fidelity

**High-fidelity.** Exact target hex values, opacities, and copy are given below. Recreate pixel-for-pixel by adjusting the existing token/rule set — do not restructure markup.

---

## The idea in one paragraph

Today the design spends color generously. The slate `--accent` (`#555879`) tints prompts, section numbers, git hashes, `tree` glyphs, GPA, project numbers, packets, toggles, and links — everywhere. The green `--green` (`#3fb27f`) fills status dots, the **entire** git-show diff list (row backgrounds + `+` gutters), the `+N insertions` counter, the `● LIVE` badge, approve buttons, and the animated pipeline packets. Several dots pulse/breathe. All of it competes with the reading content. The revision makes color rare: **near-monochrome ink on the existing warm paper**, with (a) `--accent` reserved for genuinely interactive elements, and (b) a **single calm green kept only for the "available / live / present" status signal**. Decorative terminal chrome (hashes, `$` prompts, `[ 01 ]` numbers, tree glyphs) drops to a faint ink so it reads as quiet metadata, not as a highlight. Because the jargon recedes while plain content stays prominent, the same move that removes color also makes the page clearer for non-technical readers.

---

## Design tokens — before → after

Edit `:root` in `app/globals.css`:

| Token | Before | After | Notes |
|---|---|---|---|
| `--green` | `#3fb27f` | **`#5f9276`** | desaturated "status" green; now used **only** for availability/live/present dots |
| `--accent` | `#555879` | `#555879` *(value unchanged)* | its **usage** is cut back sharply — see Global change #1 |
| reading copy | mostly `--ink-soft` (`rgba(42,44,59,.62)`) | **`.72`** for body prose | prose/body a touch darker so it's easier to read |
| row-hover tint | `rgba(85,88,121,.05)` | **`rgba(42,44,59,.03)`** (or none) | neutral, barely-there |
| diff green fills | `rgba(63,178,127,.05 / .1)` | **removed** (transparent / `rgba(42,44,59,.03)`) | see Global change #2 |

Everything else in `:root` (paper `#faf7f0`, paper-2 `#f4ebd3`, ink `#2a2c3b`, `--ink-faint`, rules, the whole `--dark-*` contact palette) stays.

---

## Global changes (mostly `app/globals.css`)

**1. Reserve `--accent` for interaction only.**
Keep `var(--accent)` on: text links (`.link-underline`, `.proj-row__link`, `.proj-row__open`, `.hero__pipeline-link`, footer links), active nav (`.topbar__link.is-active`, the `.topbar__link--contact` underline), the expand toggles (`.gitlog__toggle`, `.proj-row__toggle`), the active tab underline (`.cg-tab.is-active`), the dropdown selected/active states, and the `approved: false` inline callout (`.cg-accent`).
**Recolor every *decorative* accent use to `var(--ink-faint)`** (≈ `rgba(42,44,59,.4–.5)`):
`.section-index__num`, `.gitlog__hash`, `.work-article__num`, `.proj-row__num`, `.tree__glyph`, `.hero__prompt-sign`, the `$`/user/tilde in `.contact__prompt`, `.cg-section__num`, `.cg-hero__prompt-sign`, `.gitlog__show-hash`, `.proj-row__prompt`, `.proj-row__marker`, `.cg-prev-*__num`/`__hash`.
`.edu-head__gpa` → make it `var(--ink)` (`#2a2c3b`) rather than accent (it's a headline number, not a link).

**2. Cut green to one job (`--green` = the calm `#5f9276`, status only).**
- `.gitlog__diff` background `rgba(63,178,127,.05)` → `transparent`; `.gitlog__diff-plus` background `rgba(63,178,127,.1)` → `rgba(42,44,59,.03)` and its `color` green → `var(--ink-faint)`. Keep the hairline separators; `.gitlog__diff-text` stays `var(--ink)`. (The expanded "git show" list becomes a clean monochrome diff.)
- `.gitlog__ins` (the `+N insertions` count) green → `var(--ink-faint)` **and** change the wording (see Copy).
- `.work-article__status--live` (`● LIVE`) green → `var(--ink)` at ~`.55`; **remove** its `dot-breathe` animation.
- Content-generation: `.cg-badge.is-approved` → keep a small `--green` (`#5f9276`) dot/border but no fill; `.cg-btn--approve` → neutral (treat like `.cg-btn--primary`/ghost, not green); `.cg-prev-work__live`, `.cg-prev-exp` `.cg-ins` → `--ink`/`--ink-faint`; terminal `C.success` (`#3fb27f`) → a muted `#9aa1b4`; `.cg-packet--green` → faint ink (see #3).
- **Keep** `--green` (`#5f9276`) on: `.topbar__dot`, `.dot-green` (available / present / active glyphs), the footer availability dot, the contact footer dot, and the cg "approve-to-publish" dot.

**3. Calm the motion.**
- Remove `topbar-dot-pulse` → `.topbar__dot` is a static dot (keep its small static ring or drop it).
- Remove `dot-breathe` → status dots are steady, not pulsing.
- `.cg-packet` / `@keyframes cg-flow`: delete, or keep a single faint-ink packet on a slow (~3.4s) cycle purely to hint "flow." No green/accent packets.
- **Keep** `caret-blink` (subtle, on-brand), the `row-collapse` expand/collapse tween, and `useScrollReveal` (already gentle). The pipeline stepper can stay but at a relaxed ~2.2s and **without** the accent active-glow (see Content-generation notes).

**4. Solid top bar.**
`.topbar` — replace `backdrop-filter: saturate(140%) blur(8px)` + translucent `rgba(250,247,240,.86)` with a solid `background: var(--paper)`. Calmer, and it also fixes screenshot / PDF / PPTX capture, which blanks out on `backdrop-filter`.

**5. Soften row hover.**
`.gitlog__row:hover`, `.proj-row:hover`, `.tree__row:hover` — change the `rgba(85,88,121,.05)` accent tint to a neutral `rgba(42,44,59,.03)` (or remove the background entirely and keep only the small `padding-left` nudge).

---

## Per-screen deltas

### `/` — portfolio (long-scroll)
Order and layout unchanged: **TopBar → Hero → Work → Experience → Projects → Skills → Education → Contact → Footer.**

- **TopBar** — solid paper bg (#4). Availability dot uses the calm `--green`, static (#2/#3). Active/contact links keep `--accent`; other links stay `--ink-soft`.
- **Hero** — `$ whoami` prompt sign → ink-faint; caret stays. Name/title/intro unchanged (intro prose can go to `.72`). Status line `● Available…` dot = calm green. Metric strip: the count-up may stay, but consider showing final values (calmer) — optional.
- **Work** — `[ 01 ]` number → ink-faint. `○ SHOWCASE TBA` stays faint ink; `● LIVE` → quiet ink `.55`, no breathe (#2). Real screenshots and `FIG.NN /` captions unchanged. `↗ live site` / `↗ github` links keep `--accent`.
- **Experience (git log)** — hashes → ink-faint; toggle `▸/▾` keeps `--accent`. Collapsed teaser copy → `{N} accomplishments · git show ▸` (see Copy). Expanded git-show list **de-greened** to a monochrome diff (#2). `● in active development` and `● present` dots use the calm green.
- **Projects** — `[NN]` numbers → ink-faint; toggle keeps `--accent`. `$ cat …README.md` line and `-` markers → ink-faint. `github ↗` / `↗ open on github` keep `--accent`.
- **Skills** — `tree` glyphs (`├── └──`) → ink-faint; folder labels stay `--ink`; item lists `--ink-soft`.
- **Education** — GPA number → `--ink` (not accent). Labels faint ink as-is.
- **Contact (dark)** — unchanged structurally; already calm. Keep the muted `--dark-accent` arrows; caret stays. Availability dot in footer = calm green.

### `/content-generation`
Order unchanged: **TopBar → Hero (CONTENT PIPELINE) → 01 How it works (pipeline) → 02 Editor → Footer.**

- **Hero** — prompt sign ink-faint; `approve-to-publish` dot = calm green. The plain-English intro paragraph already reads well for non-technical visitors — keep it.
- **01 · Pipeline diagram** (`PipelineDiagram.tsx`) — nodes keep hairline borders; **drop the accent active-node glow** (`.cg-node.is-active` box-shadow/accent bg) — if you keep the stepper, indicate the active node with a slightly darker hairline only. Packets faint ink or removed (#3). **Add** the plain-language lead-in under the section head (see Copy). The `.cg-pipe__console` stage line stays, dot = calm green.
- **02 · Editor** — read-only in production. `.cg-auth` neutral; lock dot faint. `.cg-tab.is-active` keeps the `--accent` underline (it's a control). Approve badges/buttons de-greened (#2). The dark `.cg-code` résumé panel and dark `.cg-term` terminal stay dark (structural, not "color") — just mute the terminal log line colors toward `#98a1bc`/`#7e86a6`/`#9aa1b4` and drop bright green/red for the idle state.

---

## Copy / clarity changes (for non-technical readers)

1. **Experience teaser** (`components/ExperienceSection.tsx`): change `+{insertions} insertions · git show ▸` to **`{insertions} accomplishments · git show ▸`** — a plain noun, keeping the `git show ▸` affordance. (`insertions` is already `exp.accomplishments.length`.)
2. **Pipeline lead-in** (`components/ContentGenerationApp.tsx`, under the `[ 01 ] HOW IT WORKS` head, above `<PipelineDiagram />`): add one line —
   > *In plain terms: the résumé is the single source. Everything below reads left-to-right — a source file, the script that processes it, and what it produces. Two tracks run in parallel, then merge into the live site.*
3. **(Optional)** A `showCommandHints` boolean (default `true`) that hides the `$ …` command hints and the `git log --oneline …` line for an even cleaner, less-technical view. The design references expose this as a tweak; treat it as optional polish, not required.

---

## Interactions & motion (unchanged unless noted)

- Expand/collapse on Experience & Projects rows: **unchanged** (`row-collapse`, per-row, keyboard-accessible).
- Scroll-reveal: **keep** (gentle). Typewriter `whoami` + caret: **keep**.
- Removed: `topbar-dot-pulse`, `dot-breathe`, colored pipeline packets. Softened: row-hover tint. Solid (non-blurred) top bar.
- Live Vancouver clock in the footer: **unchanged**.

## Files to touch

- `app/globals.css` — the bulk (tokens + the `.gitlog__*`, `.work-article__status--live`, `.topbar*`, `.tree__glyph`, `.cg-*`, hover, and keyframe rules above)
- `components/ExperienceSection.tsx` — one copy string (#1)
- `components/ContentGenerationApp.tsx` — one added paragraph (#2); optional `showCommandHints`
- `components/PipelineDiagram.tsx` — drop the accent active-glow; packet treatment
- No data changes. `data/**`, résumé pipeline, and API routes are untouched.

## Assets

No new assets. Existing `public/` images are reused (`profile-photo.jpg`, `msyk-picture.png`, `learncoding-picture.png`, `mds-picture.png`, `doubl-picture.png`) — copies are included here only so the HTML references render offline.

## Files in this bundle

- `Ariq Muldi - Portfolio.dc.html` — `/` route design reference (target look)
- `Content Generation.dc.html` — `/content-generation` route design reference (read-only state)
- `support.js` — runtime for the two references (do not port)
- `public/*` — images used by the references
