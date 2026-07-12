# Handoff: Frontend micro-animations + new favicon (ariqmuldi.com)

## Overview

Two **frontend-only** changes to the `ui-v2` branch of `ariqmuldicom`:

1. **New favicon** — replace the bold "AM" purple **circle** (`app/icon.tsx`) with concept **F3**: a
   lowercase `am` + block cursor on a dark **square** with a 1px hairline, matching the site's
   no-radius, monospace, terminal system.
2. **Subtle micro-animations** — add a couple of tasteful, on-brand motions and make sure they read
   consistently on **both** routes (`/` and `/content-generation`).

> **Scope guardrails (read first).** This is a **frontend + favicon** task. It must **not touch or
> modify the backend**, and it must **not remove any existing functionality**. The site already has
> a well-built motion layer — the job is mostly *additive*. See **§6 Guardrails** for the explicit
> do-not-touch list and the preserve-everything checklist.

---

## About the design files

The files in `reference-prototypes/` are **design references authored in HTML** (a prototype of the
main page + the favicon concept board) — they show intended look and behavior. They are **not**
production code to copy. Your target is the **existing Next.js codebase** (App Router, React 19,
TypeScript, Tailwind present-but-mostly-unused, all real styling in `app/globals.css`). Implement
these changes using the codebase's **established patterns**:

- Motion = **CSS `@keyframes` + `IntersectionObserver` hooks** in `app/lib/hooks.ts`. **No Framer
  Motion** (it's a dead dependency in `package.json` — do not start using it).
- Styling = the `.reveal`, `.topbar__*`, `.metric__*`, `.cg-*` classes in `app/globals.css` and the
  CSS variables in `:root`. No inline style systems, no new CSS-in-JS.
- Everything must respect `prefers-reduced-motion` (the codebase already does this consistently).

To view the prototype: open `reference-prototypes/Portfolio.dc.html` (it loads `./support.js` and
`./public/*`). Open `reference-prototypes/Favicon Concepts.dc.html` to see all six favicon concepts
rendered at 16/32/large on dark + paper; **F3** is the chosen one.

## Fidelity

**High-fidelity.** Exact colors, sizes, easings, and durations are specified below. Match them.

---

## 1. Favicon — `app/icon.tsx`  (REPLACE)

**What:** swap the AM circle for concept **F3**. A drop-in replacement file is included at
`icon.tsx` in this bundle. Design:

- **Shape:** 32×32 **square**, `border-radius: 0`, `1px solid #555879` hairline. (Deliberately not a
  circle — the whole site is square + hairline; only status dots are round.)
- **Background:** `#23242f` (`--dark-bg`).
- **Glyph:** lowercase `am` in cream `#f4ebd3` (`--dark-head`), weight 700, `letter-spacing: -0.03em`,
  followed by a **block cursor** — a `4×12` cream rectangle, `margin-left: 1.5`.
- Font: satori's default sans is acceptable at this size; optional IBM Plex Mono note is in the file.

Also included: `favicon-f3.svg` — the same mark as a standalone SVG, if you additionally want a
`<link rel="icon" type="image/svg+xml">` or an `apple-icon`.

**Do not** change `app/layout.tsx` metadata, `opengraph`/`og-image`, `sitemap`, or `robots` — the
favicon route stands alone.

---

## 2. NEW animation — count-up metrics (Hero)

The four hero metrics (`1,000+ · 10,000+ · 500+ · 05+`) currently render as static text
(`HeroSection.tsx`). Make each **count up from 0 → its value** the first time the metric strip
enters the viewport. This is the one genuinely new motion on `/`.

**Spec:** duration **1150ms**, ease-out cubic (`1 − (1−p)³`), trigger at IntersectionObserver
`threshold: 0.6`, animate **once** (unobserve after firing). Preserve formatting: thousands
separators (`1,000`), zero-pad the roles count to 2 digits (`05`), keep the trailing `+`. Under
reduced motion (and on the server / no-JS) render the **final** value immediately — no flash, no
layout shift.

**2a. Add a hook to `app/lib/hooks.ts`** (mirrors the existing hook style):

```ts
import React, { useEffect, useRef, useState } from 'react';

/**
 * Counts 0 → `target` the first time the returned ref's element scrolls into view.
 * SSR-safe (renders the final formatted value on the server, so no hydration flash) and
 * honors reduced motion (stays at the final value). Returns [ref, displayText].
 */
export function useCountUp(
	target: number,
	{ duration = 1150, pad = 0, suffix = '' }: { duration?: number; pad?: number; suffix?: string } = {}
): [React.RefObject<HTMLSpanElement>, string] {
	const reduced = usePrefersReducedMotion();
	const ref = useRef<HTMLSpanElement>(null);
	const fmt = (n: number) =>
		(pad > 0 ? String(n).padStart(pad, '0') : n.toLocaleString('en-US')) + suffix;
	const [text, setText] = useState(() => fmt(target)); // final value = SSR + no-JS + reduced fallback

	useEffect(() => {
		const el = ref.current;
		if (!el || reduced) return;
		let raf = 0;
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					io.unobserve(el);
					const t0 = performance.now();
					const tick = (now: number) => {
						const p = Math.min(1, (now - t0) / duration);
						const eased = 1 - Math.pow(1 - p, 3);
						setText(fmt(Math.round(target * eased)));
						if (p < 1) raf = requestAnimationFrame(tick);
						else setText(fmt(target));
					};
					setText(fmt(0));
					raf = requestAnimationFrame(tick);
				});
			},
			{ threshold: 0.6 }
		);
		io.observe(el);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reduced, target, duration, pad, suffix]);

	return [ref, text];
}
```

**2b. Use it in `components/HeroSection.tsx`.** Hooks can't run inside `.map()`, so wrap one metric in
a tiny client component and change the `metrics` data to carry the numeric target:

```tsx
function CountUp({ target, pad = 0, suffix = '' }: { target: number; pad?: number; suffix?: string }) {
	const [ref, text] = useCountUp(target, { pad, suffix });
	return <span ref={ref}>{text}</span>;
}

const metrics = [
	{ target: 1000, suffix: '+', label: 'USERS SERVED' },
	{ target: 10000, suffix: '+', label: 'RECORDS PROCESSED' },
	{ target: 500, suffix: '+', label: 'STUDENTS IMPACTED' },
	{ target: experiences.length, pad: 2, suffix: '+', label: 'ROLES' }, // stays derived from data
];

// …in the metric strip map:
<div className="metric__num">
	<CountUp target={m.target} pad={m.pad} suffix={m.suffix} />
</div>
```

Keep the `.metric-strip` element's existing `data-reveal` (it fades in as before; the numbers count
up once revealed). No CSS change needed for this one.

---

## 3. NEW animation — status-dot pulse (shared TopBar → applies to BOTH routes)

`.topbar__dot` (the green "available" dot in `components/TopBar.tsx`) currently has a **static** ring
only. Give it a slow, subtle **pulse**. Because `TopBar` is a **shared component** used by both `/`
and `/content-generation`, this is the single change that makes the new motion **"consider" the
content-generation route** — it appears there automatically, no per-route work.

**Add to `app/globals.css`** (near the other keyframes). The keyframe keeps the existing static 3px
ring at all times and pulses an *outer* ring outward:

```css
@keyframes topbar-dot-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(63, 178, 127, 0.45), 0 0 0 3px rgba(63, 178, 127, 0.16);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(63, 178, 127, 0), 0 0 0 3px rgba(63, 178, 127, 0.16);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(63, 178, 127, 0), 0 0 0 3px rgba(63, 178, 127, 0.16);
  }
}
```

**Update the existing `.topbar__dot` rule** — keep everything it has (that static `box-shadow` is the
reduced-motion / no-animation resting state) and add:

```css
.topbar__dot {
  /* …existing declarations unchanged… */
  animation: topbar-dot-pulse 2.6s ease-out infinite;
}
```

**Add a reduced-motion guard** (extend the existing `@media (prefers-reduced-motion: reduce)` block,
which already zeroes `.caret`/`.contact__caret`):

```css
@media (prefers-reduced-motion: reduce) {
  /* …existing… */
  .topbar__dot { animation: none; }
}
```

Result: dot pulses gently on `/` and `/content-generation`. Verify it reads well against the
translucent top-bar background on both routes (same `.topbar` styles, so it should).

---

## 4. ENHANCEMENT (optional) — cascade the list rows on `/`

The reveal system already supports per-element stagger via the `--reveal-delay` CSS variable, but
today only `HeroSection` sets it (`0 / 80 / 120 / 160 / 220 / 280 / 340ms`). The **Work /
Experience / Projects** list rows all reveal at ~the same time. To get the gentle cascade shown in
the prototype, auto-assign a delay by sibling index — one change in `useScrollReveal()`, no
per-component edits, and it **won't override** Hero's explicit inline delays:

```ts
// inside useScrollReveal(), after els.forEach((el) => el.classList.add('reveal')):
if (!reduced) {
  const groups = new Map<HTMLElement, HTMLElement[]>();
  els.forEach((el) => {
    const parent = el.parentElement as HTMLElement | null;
    if (!parent) return;
    const list = groups.get(parent) ?? [];
    list.push(el);
    groups.set(parent, list);
  });
  groups.forEach((list) => {
    if (list.length < 2) return; // don't stagger lone elements
    list.forEach((el, i) => {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', `${Math.min(i * 60, 260)}ms`);
      }
    });
  });
}
```

This is a **nice-to-have**. If you skip it, the reveals still work exactly as they do now.

---

## 5. The `/content-generation` route — what to do (no new HTML needed)

You asked to make sure the animations "consider" this route. Here's the exact situation and the plan
— **this route already has rich, correct motion; the task is mostly to not break it and to add one
optional consistency pass.**

**Already present here (PRESERVE — do not remove or duplicate):**

- **Pipeline packets** — `@keyframes cg-flow` dots travelling each connector (`PipelineDiagram.tsx` /
  `.cg-packet`). Reduced-motion: hidden via CSS.
- **Pipeline stepper** — a `setInterval` in `PipelineDiagram` highlights one `.cg-node.is-active`
  every 1.5s and drives the narration line; **it is already gated by `usePrefersReducedMotion()`**
  (paused + shows "autoplay paused (reduced motion)").
- **Toasts** — `@keyframes cg-toast-in/out` + the pulsing busy dot `@keyframes cg-pulse`
  (`.cg-toast*`). Reduced-motion guarded.
- **Model dropdown** — `@keyframes cg-dd-in/out` (`.cg-dropdown__menu`). Reduced-motion guarded.
- Caret, node hover transitions, auth/lock color transitions.

**Automatically inherited from §3:** the shared **TopBar dot-pulse** now appears on this route too.
Just eyeball it here after implementing.

**Optional consistency pass (recommended, additive):** this route currently does **not** do
scroll-reveal — `ContentGenerationApp` never calls `useScrollReveal()` and its blocks have no
`data-reveal`, so sections appear immediately rather than fading in like `/`. To match the main page:

1. Call the existing hook once near the top of `ContentGenerationApp` (client component):
   ```ts
   import { useScrollReveal } from '@/app/lib/hooks';
   // …inside the component body:
   useScrollReveal();
   ```
2. Add `data-reveal` to the top-level blocks you want to fade/cascade in: the `.cg-hero__inner`
   contents, each `.cg-section__head`, the `.cg-pipe` wrapper, and each `.cg-card`. The `.reveal`
   class + observer + reduced-motion handling already exist, so this is purely additive. If you added
   §4's auto-stagger, the editor cards will cascade for free.

**Do NOT** add count-up here. The only numbers are the small "LAST PARSE — experiences 5 · projects
4 · skills N" line, which changes on re-parse; leave it static. Count-up stays a hero-of-`/` accent.

---

## 6. Guardrails

### Do NOT touch the backend (or anything that isn't presentation)

Off-limits — leave entirely unchanged:

- **API routes:** `app/api/content/**` — `state`, `session`, `auth`, `master-tex`, `parse`,
  `generate`, `work/[key]`, `project/[key]`, `config`.
- **Server guards / env / path helpers:** `app/lib/content-guard.ts`, `content-auth.ts`,
  `content-env.ts`, `content-files.ts`, `content-file-names.ts`.
- **Pipeline scripts:** `scripts/**` (`parse-resume.ts`, `generate-work-experience-content.ts`,
  `generate-project-content.ts`).
- **Data (owned by the pipeline — never hand-edit):** `data/source/**` (the `.tex`,
  `resume-config.json`), `data/generated/**` (`experiences.ts`, `projects.ts`, `skills.ts`,
  `education.ts`), `data/content/**` (`work.ts`, `work-experience-content.json`,
  `project-content.json`). Your UI reads this data; it must keep reading it the same way.
- `public/master-resume.pdf`, and the SEO/metadata files (`layout.tsx` metadata, `sitemap.ts`,
  `robots.ts`, `content-generation/layout.tsx`) unless a change is purely the favicon.

The animations are **display-layer only**: they read the same data and call the same handlers. The
editor's parse/generate/approve/auth flows, the streaming console, and every network call stay
exactly as they are.

### Preserve ALL existing functionality (regression checklist)

- Typewriter prompts (`useTypewriter`: `whoami` on `/`, `cat ./how-content-is-generated` on cg).
- Scroll-spy crumb + nav highlight (`useActiveSection`) — **do not change** its observer
  `threshold`/`rootMargin`.
- Live Vancouver clock in the footer (`useClock`).
- Git-log (Experience) and README (Projects) **expand/collapse**, incl. `aria-expanded`, keyboard
  (Enter/Space), and the existing `gitlogExpand` open animation.
- Data-driven rendering of Work / Experience / Projects / Skills / Education.
- Content editor: auth unlock/lock, tabs, model select + `localStorage` persistence, parse/generate
  buttons + 3-min abort, toasts, live streaming console, visibility-config toggles.
- Keep every existing `data-reveal` attribute and `.reveal`/`.is-visible` behavior.

### Keep the design constraints

No border-radius except status dots · 1px hairlines only · no box-shadow except the green
status-dot ring · **no Framer Motion** · all motion CSS + IntersectionObserver and gated by
`prefers-reduced-motion`.

---

## 7. Design tokens (from `app/globals.css :root` — reuse, don't hardcode new colors)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#faf7f0` | page bg |
| `--paper-2` | `#f4ebd3` | warm section bg |
| `--ink` | `#2a2c3b` | primary text |
| `--ink-soft` | `rgba(42,44,59,.62)` | body text |
| `--ink-faint` | `rgba(42,44,59,.4)` | meta text |
| `--accent` | `#555879` | links, prompts, active nav |
| `--green` | `#3fb27f` | status dot, "live"/"present" |
| `--dark-bg` | `#23242f` | contact + favicon bg |
| `--dark-head` | `#f4ebd3` | cream on dark (favicon glyph) |
| `--rule` / `--rule-2` | `rgba(42,44,59,.13)` / `.3` | hairlines |

**Motion values used above:** reveal `0.7s cubic-bezier(0.2,0.6,0.2,1)` + `translateY(16px)` (existing);
count-up `1150ms`, ease-out cubic, `threshold 0.6`; dot-pulse `2.6s ease-out infinite`; stagger step
`60ms`, cap `260ms`. Existing expand `gitlogExpand 0.26s ease`.

## 8. Assets

- `icon.tsx` — drop-in replacement for `app/icon.tsx` (favicon F3).
- `favicon-f3.svg` — the F3 mark as SVG (optional `<link rel="icon">` / apple-icon source).
- No new images. The favicon is code-generated; nothing else is added to `public/`.

## 9. Files you will edit (summary)

| File | Change |
|---|---|
| `app/icon.tsx` | **Replace** with the F3 favicon (bundled `icon.tsx`). |
| `app/lib/hooks.ts` | **Add** `useCountUp`; *(optional §4)* add auto-stagger to `useScrollReveal`. |
| `components/HeroSection.tsx` | Metrics use `<CountUp>`; `metrics` data carries `target/pad/suffix`. |
| `app/globals.css` | **Add** `@keyframes topbar-dot-pulse`; add `animation` to `.topbar__dot`; add its reduced-motion guard. |
| `components/ContentGenerationApp.tsx` | *(optional §5)* call `useScrollReveal()`; add `data-reveal` to top-level cg blocks. |

Everything else — backend, data, scripts, other components — stays untouched.

## 10. Reference prototypes (in this bundle)

- `reference-prototypes/Portfolio.dc.html` — the main page with all target motions (count-up,
  staggered reveal, dot-pulse, hover, expand). Open in a browser to feel the timing.
- `reference-prototypes/Favicon Concepts.dc.html` — the six favicon concepts; **F3** is chosen.
- `reference-prototypes/FaviconMark.dc.html`, `support.js`, `public/` — support files so the
  prototypes render standalone. Not for production use.
