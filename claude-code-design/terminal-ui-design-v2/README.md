# Handoff: Portfolio Revamp — "Swiss-Mono Engineering Manifest"

## Overview
A full-site visual + structural revamp of **ariqmuldi.com** (personal SWE portfolio). The
existing site opens with a terminal hero, then switches into a generic light-mode portfolio
(glass cards, gradient text, blurred orbs, timeline dots). The revamp keeps the terminal
*idea* but makes it the language of the **entire** site: one warm off-white canvas, monospace
type throughout, a strict Swiss two-column grid, and **hairline rules instead of cards**.
Terminal motifs appear only as accents (`$` prompts, a blinking caret, a `git log` experience
ledger, a `tree` skill list, a live clock).

This is a single long-scroll page with sticky top-bar nav and scroll-spy — no routing.

## About the Design Files
The file in this bundle — `Ariq Muldi - Portfolio.dc.html` — is a **design reference created
in HTML**. It is a prototype showing the intended look, layout, and behavior. **It is not
production code to copy directly.**

Ariq's real site is a **Next.js (App Router) + TypeScript** project (Tailwind present) with
this shape:
```
app/
  page.tsx
  globals.css
  components/    HeroSection.tsx, ExperienceSection.tsx, ProjectsSection.tsx, ...
  data/          experiences.ts, projects.ts, skills.ts, education.ts,
                 work.ts
public/          profile-photo.jpg, *picture.png/jpg, logos
```
**The task is to recreate this design inside that existing Next.js codebase**, using its
established conventions (React function components, the `app/data/*.ts` files as the content
source, Tailwind and/or CSS modules, `next/font` for fonts, `next/image` for images). Reuse
the existing data files — do not hardcode content into JSX. The HTML prototype inlines all
styles for portability; in the codebase, translate those inline styles into the project's
normal styling approach (Tailwind classes or a stylesheet + design tokens).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all
specified below and are intended to be matched closely. Recreate the UI faithfully using the
codebase's libraries and patterns. Exact hex values, font sizes, and easing curves are given
in the Design Tokens section — use them.

---

## Global Layout & Chrome

- **Page background:** `#FAF7F0` (warm off-white "paper").
- **Content width:** centered column, `max-width: 1200px`, horizontal padding `40px`.
- **Font:** `IBM Plex Mono` everywhere (weights 300–700 + one italic). Loaded via Google
  Fonts in the prototype; in Next.js use `next/font/google` (`IBM_Plex_Mono`). Alternatives
  offered as a toggle in the prototype: `JetBrains Mono`, `Space Mono`.
- **Font features:** `font-feature-settings: 'ss01','zero';` (slashed zero) on the root.
- **Antialiasing:** `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;`
- **Selection color:** `background: rgba(85,88,121,.22); color: #2A2C3B;`
- **Custom scrollbar:** track `#F0E8D2`, thumb `#98A1BC` (hover `#555879`) with a 3px track-colored border.
- **Section rhythm:** every content section is `padding: 80px 40px;` and uses a
  **two-column grid**: `grid-template-columns: 132px minmax(0,1fr); gap: 40px;`
  - Left column = a **sticky section index** (`position: sticky; top: 86px;`) containing the
    section number `[ 01 ]` (accent color), the section label, and a terminal command line
    (e.g. `$ ls ./work`).
  - Right column = the section content.
- **Alternating section backgrounds:** most sections are `#FAF7F0`; **Experience** and
  **Stack** use `#F4EBD3` (a slightly warmer paper) to create rhythm. Contact is dark.
- Every section is separated by a **1px hairline** (`border-bottom: 1px solid rgba(42,44,59,.13)`).

### Top bar (sticky nav)
- `position: sticky; top: 0; z-index: 50; height: 54px.`
- Background `rgba(250,247,240,.86)` with `backdrop-filter: saturate(140%) blur(8px)` and a
  bottom hairline.
- **Left:** a green status dot (`#3FB27F`, with a soft `0 0 0 3px rgba(63,178,127,.16)` ring),
  then `ariqmuldi` (weight 600) + `.com` (faint), then a live path crumb `~/` in accent that
  updates to `~/work`, `~/experience`, etc. as you scroll (driven by scroll-spy).
- **Right:** nav links `WORK · EXPERIENCE · PROJECTS · STACK · EDU · CONTACT` — font-size 11px,
  `letter-spacing: .16em`, uppercase. Default color `rgba(42,44,59,.62)`, hover/active
  `#2A2C3B`. `CONTACT` has a permanent 1px accent underline. Active link (current section)
  turns accent `#555879` via scroll-spy.
- Links are in-page anchors (`#work`, `#experience`, …); `html { scroll-behavior: smooth; }`
  and each section has `scroll-margin-top: 54px;`.

---

## Screens / Views (Sections, top to bottom)

### 1. Hero / Index  (`id="top"`)
- **Purpose:** name, title, one-line positioning, availability, headline metrics.
- **Layout:** grid `minmax(0,1fr) auto`, gap 48px, padding `76px 40px 68px`. Left = text
  block; right = avatar figure.
- **Components:**
  - **Prompt line:** `$ whoami` — the `$` is accent `#555879`; `whoami` is **typed out on load**
    (typewriter, ~95ms/char) followed by a blinking block caret. Font-size 13px, color
    `rgba(42,44,59,.62)`.
  - **Name (h1):** `ARIQ` / `MULDI` on two lines. `font-size: clamp(56px, 10.5vw, 132px);
    line-height: .9; font-weight: 600; letter-spacing: -.045em;` color `#2A2C3B`.
  - **Title line:** `Software Engineer / Full-Stack · Cloud & DevOps` — `clamp(15px,1.6vw,19px)`,
    weight 500; the `/` and `·` separators are faint (`rgba(42,44,59,.40)`).
  - **Intro paragraph:** `max-width: 56ch; font-size: 14.5px; line-height: 1.7;` color
    `rgba(42,44,59,.62)`. Copy: *"I build full-stack platforms that move real people through
    real systems — graduate admissions, makerspace memberships, adaptive learning — and I care
    about the infrastructure underneath: schemas, auth, payments, deploys."*
  - **Status row:** `● Available — 2026 new-grad SWE roles` (green dot) `|` `Currently — SWE @
    DOUBL · Research Assistant @ UBC`. Font-size 12.5px.
  - **Avatar figure (right):** width `clamp(120px,15vw,168px)`. A 1px border `rgba(42,44,59,.30)`
    with 6px padding (passe-partout frame) around the photo; photo `aspect-ratio: 4/5;
    object-fit: cover; object-position: 50% 10%;` rendered **grayscale by default**
    (`filter: grayscale(1) contrast(1.03) brightness(1.02)`), transitions to full color +
    `scale(1.03)` on hover (0.5–0.6s). Caption below: `FIG.00 / ARIQ.MULDI.JPG`, 10px,
    `letter-spacing: .16em`, faint. Image: `public/profile-photo.jpg`.
- **Metric strip** (full content width, below hero): a 4-column grid with a top hairline
  (`rgba(42,44,59,.30)`) and 1px column dividers between cells. Each cell: a big number
  `clamp(24px,2.6vw,32px)` weight 600 letter-spacing -.03em, and a label 10.5px
  `letter-spacing: .16em` faint.
  - `1,000+ / USERS SERVED`
  - `10,000+ / RECORDS PROCESSED`
  - `500+ / STUDENTS IMPACTED`
  - `05 / ACTIVE ROLES`

### 2. Selected Work  (`id="work"`, index `[ 01 ]`, command `$ ls ./work`)
- **Purpose:** the flagship production systems, as mini case studies.
- **Layout:** intro paragraph, then **4 articles** stacked. Each article: top hairline
  (`rgba(42,44,59,.30)`), `padding: 28px 0 44px`, grid `minmax(0,1fr) minmax(0,380px)` gap 44px
  — text left, screenshot figure right.
- **Per-article header row:** an index number in accent (`01`…`04`, weight 600), then a
  meta label (`UBC · RESEARCH ASSISTANT`), then a right-aligned status: `● LIVE` (green) or
  `○ SHOWCASE TBA` (faint) for DOUBL. Font 11px, `letter-spacing: .14em`, faint.
- **Title (h3):** `clamp(26px,3.4vw,38px); font-weight: 600; letter-spacing: -.035em;
  line-height: 1.02.`
- **Body:** 14px, line-height 1.72, `max-width: 52ch`, color `rgba(42,44,59,.62)`.
- **Tech line:** 12px, ink color, with faint `·` separators.
- **Links:** `↗ live site`, `↗ github` — accent color, 12.5px, animated bottom-border on hover.
- **Figure:** same 1px-border + 6px-pad frame as the avatar; image `aspect-ratio: 16/10;
  object-fit: cover;` grayscale by default → full color on hover (0.5s). Caption e.g.
  `FIG.01 / MSYK.MEMBERSHIP`.
- **The four items (content is exact):**
  1. **Makerspace Platform** — UBC · Research Assistant · ● LIVE. *"Membership & equipment
     management platform serving 1,000+ members — workshop enrolment, Stripe checkout
     ($1k+/mo), and ESP32/RFID access control wired to a Node background-job system."* Tech:
     TypeScript · React Router v7 · PostgreSQL · Prisma · Stripe · IoT (ESP32) · Docker.
     Links: live → `https://my.makerspaceyk.com`, github →
     `https://github.com/University-of-British-Columbia-Okanagan/MSYK_Membership`.
     Image `public/msykpicture.png`.
  2. **LearnCoding Platform** — UBC · Research Assistant · ● LIVE. *"Adaptive learning
     platform for 500+ CS students — code visualizers, sandboxes, and AI-generated content,
     with automated Canvas gradebook sync replacing 1,000+ manual grade imports a month."*
     Tech: PHP · Laravel · MySQL · Docker · Canvas API · Matomo · LLMs. Link: live →
     `https://learncoding.ok.ubc.ca`. Image `public/learncodingpicture.png`.
  3. **MDS Admissions** — UBC · Work Study. *"Admissions platform automating 1,000+ annual
     graduate applications — 3-tier role-based auth for 50+ faculty, atomic CSV batch ingest,
     and a 7-stage review engine that cut reporting from 8 hrs to 2 hrs weekly."* Tech:
     Python · Flask · PostgreSQL · bcrypt · AJAX · Tailwind. Link: github →
     `https://github.com/marga120/mds-application`. Image `public/mdsapppicture.png`.
  4. **DOUBL — B2B & ML** — DOUBL · Junior SWE · ○ SHOWCASE TBA. *"Full-stack B2B integrations
     in production — Shopify App Proxy middleware, ML-driven sizing, and automated pipelines
     on Google Cloud Run. Detailed case study coming soon."* Tech: Python · Google Cloud ·
     Next.js · TypeScript · Shopify API · ML · Zoho. Image `public/doublpicture.jpeg` with a
     dark bottom gradient overlay reading `IN PRODUCTION`. (No links yet.)

### 3. Experience  (`id="experience"`, index `[ 02 ]`, command `$ git log`, bg `#F4EBD3`)
- **Purpose:** roles as a version-control history — the terminal accent that replaces the old
  timeline-with-dots.
- **Layout:** a faint pseudo-command line at top (`git log --oneline --author="ariq" main`),
  then **5 rows**. Each row: hairline top border, `padding: 20px 8px 20px 0`, grid
  `78px minmax(0,1fr) 128px` gap 20px — a **fake commit hash** (accent, e.g. `a1c30f2`), the
  role details, and a right-aligned date range.
- **Row hover:** background `rgba(85,88,121,.05)` and content shifts right by 8px
  (`padding-left`), 0.2s — mimics selecting a log line.
- **Role details:** title 15px weight 600 with a faint `@ Company` suffix; a one-line summary
  13px `rgba(42,44,59,.62)` `max-width: 60ch`; a tech line 11px faint.
- **Dates:** right-aligned 11px; current roles show `● present` in green.
- **The five rows (newest first), hash / role / summary / tech / dates:**
  1. `a1c30f2` — **Junior Software Developer** @ DOUBL — *"Shopify App-Proxy middleware,
     HMAC-signed webhooks, and ML sizing on GCP Cloud Run."* — Python · Next.js · Google Cloud
     · Shopify · Zoho — Sept 2025 — ● present.
  2. `7b4e19d` — **Software Developer** @ UBC · Makerspace — *"Built the membership + IoT
     access platform for 1,000+ members; Stripe, Prisma, ESP32."* — TypeScript · React Router
     v7 · PostgreSQL · Stripe · Docker — Jan 2025 — ● present.
  3. `3f9a02c` — **Software Developer** @ UBC · LearnCoding — *"Adaptive learning platform for
     500+ students; Laravel, Canvas API grade sync, Docker."* — PHP · Laravel · MySQL · Canvas
     API · Matomo — Sept 2024 — ● present.
  4. `c05d7e1` — **Software Developer** @ UBC · Work Study — *"MDS admissions platform; Flask
     blueprints, normalized PostgreSQL, RBAC for 50+ faculty."* — Python · Flask · PostgreSQL ·
     bcrypt · AJAX — Jul 2025 — Sept 2025.
  5. `e82b6a4` — **Undergraduate Teaching Assistant** @ UBC — *"Labs & tutoring for 60+
     students; designed and graded for 300+ across the two largest CS courses."* — Java ·
     Machine Architecture — Sept 2024 — ● present.
  > Note: commit hashes are decorative. Generate stable-looking 7-char hex strings; they don't
  > need to be real. Source the actual role data from `app/data/experiences.ts`.

### 4. Projects  (`id="projects"`, index `[ 03 ]`, command `$ ls ~/side`)
- **Purpose:** personal / coursework builds, as a compact index (not cards).
- **Layout:** intro line, then **4 rows**, each an `<a>` linking to GitHub. Row grid:
  `52px minmax(0,1fr) minmax(0,240px) 24px` gap 20px — a `[01]` index (accent), name + one-line
  description, a right tech list (faint), and a trailing `↗`. Hairline top borders; same
  hover treatment as the experience rows (bg tint + 16px padding-left shift).
- **Name** 17px weight 600; **description** 12.5px soft; **tech** 11px faint.
- **The four (name / desc / tech / link):**
  1. **Ponotodoro** — *"Pomodoro timer fused with notes & to-do lists."* — React · Node ·
     PostgreSQL — `https://github.com/ariqmuldi/ponotodoro`.
  2. **Flight Hub** — *"Flight-deal finder + blog on the Amadeus & Twilio APIs."* — Flask ·
     React · SQLite — `https://github.com/ariqmuldi/flight-hub`.
  3. **ChatterBox** — *"Discord-style real-time chat with channels & auth."* — React ·
     Firebase · Tailwind — `https://github.com/namekeptanonymous/Error404`.
  4. **MoodiJawoodi** — *"Grocery storefront on Java + JDBC with a MySQL backend."* — Java ·
     MySQL · Docker — `https://github.com/ariqmuldi/moodi-jawoodi-grocery`.
  > Source from `app/data/projects.ts`; verify the exact repo URLs there.

### 5. Stack  (`id="stack"`, index `[ 04 ]`, command `$ tree`, bg `#F4EBD3`)
- **Purpose:** the toolset, rendered as a literal `tree` command output — the accent that
  replaces skill "chips in boxes".
- **Layout:** a `~/stack` root line, then 5 rows each prefixed with tree glyphs
  (`├──` / `└──`, accent color, `white-space: pre`), a fixed-width category label
  (`width: 130px`, ink, weight 500), and a `·`-separated list of technologies (13px soft).
  Line-height 1.5, each row `padding: 9px 0`.
- **Categories (exact):**
  - `languages/` — TypeScript · JavaScript · Python · Java · C++ · C · PHP · SQL
  - `frameworks/` — React · Next.js · Node · Express · Prisma · Flask · Laravel · Tailwind
  - `tools/` — Git · Docker · Stripe · Shopify · Zod · Jest · Postman · Figma
  - `data/` — Pandas · NumPy · Matplotlib · Plotly · Jupyter · LLMs
  - `cloud/` — Google Cloud · Firebase · Vercel · Fly.io  (last row uses `└──`)
  > Source from `app/data/skills.ts`.

### 6. Education  (`id="education"`, index `[ 05 ]`, command `$ cat edu.md`)
- **Layout:** three stacked blocks separated by hairlines.
  - **Header block:** grid `minmax(0,1fr) auto`. Left: **University of British Columbia** (h3,
    `clamp(24px,3vw,34px)`, weight 600, `-.03em`), then `B.Sc. Computer Science · Minor in Data
    Science`, then `Kelowna, BC · Expected May 2026` (soft). Right, right-aligned: GPA
    `4.21/4.33` — big accent number `clamp(28px,3.4vw,40px)` with the `/4.33` faint and small —
    and a label `GPA · 90.6%`.
  - **Selected Coursework:** a small caps-tracked label, then a `·`-separated 13px line:
    Software Engineering · Data Structures · Databases · Machine Learning · Analysis of
    Algorithms · Networks · Machine Architecture · Human–Computer Interaction · Applied
    Regression.
  - **Certifications:** label, then two lines — *Udemy — The Complete 2024 Web Development
    Bootcamp* and *Udemy — The Complete Python Pro Bootcamp*.
  > Source from `app/data/education.ts`.

### 7. Contact  (`id="contact"`, dark)
- **Purpose:** closing CTA + links; the one **inverted** section (dark terminal).
- **Colors:** background `#23242F`, text `#EDE7D6`, headline `#F4EBD3`, muted `#7E86A6`,
  accents `#98A1BC` / `#B9AE97`, hairlines `rgba(152,161,188,.2)`.
- **Layout:** padding `80px 40px 44px`.
  - **Prompt:** `ariq@muldi:~$ contact --now` (`ariq@muldi` in `#7E86A6`, `~` in `#B9AE97`)
    with a blinking `#98A1BC` caret.
  - **Headline (h2):** `LET'S BUILD` / `SOMETHING.` — `clamp(40px,7vw,88px); line-height: .95;
    weight 600; letter-spacing: -.045em;` color `#F4EBD3`.
  - **Link grid:** `repeat(auto-fit, minmax(180px,1fr))` with 1px gaps over a
    `rgba(152,161,188,.2)` background so cells read as a hairline-ruled table. Each cell:
    `background: #23242F; padding: 22px 20px;` a numbered label (`01 / EMAIL`, `#7E86A6`, 10px
    tracked) and the value (`#F4EBD3`, 14px) with a trailing `↗`. Hover → `background: #2C2E3B`.
    - `01 / EMAIL` → `hello@ariqmuldi.com` (`mailto:`) — **PLACEHOLDER, confirm real email**
    - `02 / GITHUB` → `github.com/ariqmuldi`
    - `03 / LINKEDIN` → `in/ariqmuldi` (`https://linkedin.com/in/ariqmuldi`) — **confirm handle**
    - `04 / RESUME` → `download .pdf` — **PLACEHOLDER, wire to the real résumé file**
  - **Footer strip:** `● available for 2026 roles` (green) `|` `Kelowna, BC` `|`
    `local HH:MM:SS` (a **live clock** in `America/Vancouver`, ticking every second) and, right-
    aligned, `© 2026 Ariq Muldi — built in mono.`

---

## Interactions & Behavior
- **Scroll-reveal:** every element marked for reveal starts at `opacity: 0;
  transform: translateY(16px);` and animates to `opacity: 1; transform: none;` over
  `0.7s cubic-bezier(.2,.6,.2,1)` when it enters the viewport. Use an `IntersectionObserver`
  (`threshold: 0.12`, `rootMargin: '0px 0px -7% 0px'`), unobserve after firing. Hero elements
  use **staggered delays** (0, 80, 120, 160, 220, 280 ms). Respect
  `prefers-reduced-motion: reduce` — skip transforms/typing and show everything immediately.
- **Typewriter (`whoami`):** types the 6 chars at ~95ms each on mount, then a persistent
  blinking caret. Caret blink: `1.05s steps(1) infinite` (opacity 1 → 0 at ~49%).
- **Scroll-spy:** an `IntersectionObserver` (`rootMargin: '-45% 0px -50% 0px'`) marks the
  section nearest viewport center as active → updates the active nav link color to accent and
  rewrites the top-bar path crumb (`~/`, `~/work`, `~/experience`, …). In React, drive both
  the active-link class and the crumb from a single `activeSection` state value.
- **Live clock:** `setInterval` 1s, `new Date().toLocaleTimeString('en-CA', { hour12:false,
  timeZone:'America/Vancouver' })`, with a try/catch fallback to the default locale. Clear the
  interval on unmount.
- **Image hover:** work/avatar images are `filter: grayscale(1)` → `none` over 0.5s; the avatar
  additionally scales to `1.03`.
- **Row hover (experience & projects):** background tint `rgba(85,88,121,.05)` + a small
  `padding-left` shift (8px experience, 16px projects), 0.2s.
- **Anchor nav:** smooth-scroll to sections; account for the 54px sticky bar via
  `scroll-margin-top`.
- **Responsive:** the prototype is desktop-first. For ≤ ~860px: collapse the `132px + 1fr`
  section grids to a single column (the sticky index becomes a normal heading above content),
  stack the work articles (text over image), let the top-bar nav wrap or move to a compact
  menu, and drop the metric strip to 2×2. Keep all type `clamp()`-fluid.

## State Management
Minimal — this is a static content page. Suggested React state (client component or small
hooks):
- `activeSection: string` — set by the scroll-spy observer; drives nav highlight + path crumb.
- `typed: string` (or a ref + effect) — the animated `whoami` text; run once on mount.
- `clock: string` — updated every second by an interval effect.
- Optional `monoFont` / `accent` if you want to expose the prototype's theme toggles (not
  required for production).
All content should be **read from the existing `app/data/*.ts` files**, not stored in state.

## Design Tokens

**Colors**
| Token | Value | Use |
|---|---|---|
| paper | `#FAF7F0` | page background |
| paper-2 | `#F4EBD3` | Experience & Stack section bg |
| ink | `#2A2C3B` | primary text |
| ink-soft | `rgba(42,44,59,.62)` | body text |
| ink-faint | `rgba(42,44,59,.40)` | labels, separators, captions |
| accent | `#555879` | prompts, numbers, active nav, links |
| accent-deep | `#3D3F5C` | alt accent |
| blue | `#98A1BC` | scrollbar, dark-section accent |
| beige | `#DED3C4` | soft beige |
| rule | `rgba(42,44,59,.13)` | hairline dividers |
| rule-2 | `rgba(42,44,59,.30)` | stronger hairlines (section/article tops) |
| green | `#3FB27F` | live/available status dots |
| dark-bg | `#23242F` | Contact section background |
| dark-text | `#EDE7D6` | Contact body text |
| dark-head | `#F4EBD3` | Contact headline |
| dark-muted | `#7E86A6` | Contact labels |
| dark-rule | `rgba(152,161,188,.2)` | Contact hairlines |

**Typography**
- Family: `IBM Plex Mono` (300/400/500/600/700 + italic 400). Options: `JetBrains Mono`,
  `Space Mono`. Load with `next/font/google`.
- Scale (px unless noted): hero h1 `clamp(56,10.5vw,132)/.9/600/-.045em`; contact h2
  `clamp(40,7vw,88)/.95/600/-.045em`; edu/work h3 `clamp(24–26,3–3.4vw,34–38)/600/-.035em`;
  metric number `clamp(24,2.6vw,32)/600/-.03em`; body 14–14.5 / lh 1.7; small 12.5–13;
  labels 10–11 with `letter-spacing .14–.20em` uppercase.

**Spacing**
- Section padding `80px 40px`; hero `76px 40px 68px`; content max-width `1200px`; section grid
  gap `40px`, sidebar `132px`; article grid gap `44px`; row paddings `20–22px` vertical.
- Body copy measures capped with `ch` (`52ch` work, `56ch` hero, `60ch` experience).

**Borders / radius / shadow**
- **No border radius anywhere** (sharp corners are part of the Swiss look) — except the small
  status dots, which are circles.
- Borders are **1px hairlines** only, in `rule` / `rule-2`. No box-shadows (the only shadow is
  the green dot's soft ring). **No glassmorphism, no gradient text, no blurred orbs** — these
  were the tells of the old design and must not return. The one gradient allowed is the small
  dark image-overlay on the DOUBL figure.

**Motion**
- Reveal `.7s cubic-bezier(.2,.6,.2,1)`; hovers `.2–.5s`; caret blink `1.05s steps(1)`;
  typewriter `~95ms/char`.

## Assets
Included in this bundle (copied from the site's `public/`):
- `public/profile-photo.jpg` — hero avatar (rendered grayscale → color on hover).
- `public/msykpicture.png` — Makerspace work figure (FIG.01).
- `public/learncodingpicture.png` — LearnCoding work figure (FIG.02).
- `public/mdsapppicture.png` — MDS Admissions work figure (FIG.03).
- `public/doublpicture.jpeg` — DOUBL work figure (FIG.04, with dark overlay).
These already exist in the real repo's `public/` folder — reference them via `next/image`.
No icon library is required; the only glyphs used are text characters: `$ ● ○ ↗ ├── └── · | /`.

## Open Items (confirm with Ariq before shipping)
- **Email** (`hello@ariqmuldi.com`), **LinkedIn** handle, and **résumé PDF** link in Contact
  are placeholders.
- Commit hashes in Experience are decorative/fabricated.
- The metric-strip numbers are derived from the case studies — verify they're accurate.

## Screenshots
Reference renders of each section live in `screenshots/` (desktop width). Use them to match
layout and spacing; the HTML file is the source of truth for exact values and motion.
- `screenshots/1-hero.png` — hero, avatar figure, metric strip
- `screenshots/2-selected-work.png` — Selected Work article + metric strip tail
- `screenshots/3-experience.png` — Experience `git log` ledger
- `screenshots/4-projects.png` — Projects index rows
- `screenshots/5-stack.png` — Stack `tree` output
- `screenshots/6-education.png` — Education blocks
- `screenshots/7-contact.png` — dark Contact section

## Files
- `Ariq Muldi - Portfolio.dc.html` — the full high-fidelity design reference (open in a browser
  to see every state, hover, and animation). All styles are inlined; a small JS class drives
  the typewriter, scroll-reveal, scroll-spy, and clock — mirror that logic in React effects.
- `screenshots/*.png` — per-section reference renders (see above).
- `public/*` — the 5 images the design uses (already present in the real repo's `public/`).
