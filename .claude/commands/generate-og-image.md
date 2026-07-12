---
description: Regenerate public/og-image.png — the 1200×630 Open Graph / social-share card — by screenshotting the live home-page hero of a production build.
---

You are regenerating **`public/og-image.png`**, the 1200×630 Open Graph / Twitter social-share
image for **ariqmuldi.com**. It is a clean screenshot of the home-page **hero** (the `whoami`
prompt, the big `ARIQ MULDI`, the tagline, the intro copy, and the `● Available … | Currently …`
status line) captured at exactly OG dimensions.

Follow every step exactly. Do not skip verification.

---

## Prerequisite — the Playwright MCP server (required)

This skill takes the screenshot through the **Playwright MCP server** (tools prefixed
`mcp__playwright__*`). Playwright is **not** an npm dependency of this repo, so there is nothing to
`npm install`. The **only** requirement is that the Playwright MCP server is connected to the
current session.

- **If it is connected** (the normal case — the user has it configured), this skill runs end to end
  and produces `public/og-image.png` with no extra setup.
- **If it is NOT connected**, Step 2's `ToolSearch` will not find the `mcp__playwright__*` tools.
  In that case **stop** and tell the user to enable the Playwright MCP server (e.g. via `/mcp` or
  `claude mcp` in an interactive session), then re-run this skill. Do not attempt to substitute a
  standalone Playwright script — this repo has no Playwright package installed.

---

## Why a production build (not `npm run dev`)

The Next.js **dev-mode indicator** (the small "N" badge, bottom-left) renders **only** under
`npm run dev`. It must NOT appear in the card, so always screenshot a **production** build
(`npm run build` + `next start`). To avoid disturbing a dev server the user may have running on
`:3000`, serve the production build on a **dedicated port (3100)**.

---

## Step 1 — Build and start a production server on port 3100

```bash
cd "$(git rev-parse --show-toplevel)"
npm run build
```

If the build fails, stop and report it. Otherwise start production on port 3100 **in the
background** (a background Bash call), then wait for it to answer:

```bash
npm start -- -p 3100        # run this one in the background
```

```bash
for i in $(seq 1 30); do curl -sf -o /dev/null http://localhost:3100 && { echo READY; break; }; sleep 1; done
```

Do not proceed until you see `READY`.

## Step 2 — Load the Playwright MCP tools

Their schemas are deferred. Load them first:

```
ToolSearch → select:mcp__playwright__browser_navigate,mcp__playwright__browser_resize,mcp__playwright__browser_evaluate,mcp__playwright__browser_take_screenshot,mcp__playwright__browser_close
```

If the Playwright MCP browser is locked from a prior run
(`Browser is already in use …`), clear it and retry:

```bash
pkill -f "ms-playwright-mcp" 2>/dev/null; rm -rf "$HOME/Library/Caches/ms-playwright-mcp"/*/SingletonLock 2>/dev/null; echo cleared
```

## Step 3 — Navigate and set the OG viewport

1. `browser_navigate` → `http://localhost:3100`
2. `browser_resize` → **width 1200, height 630** (the standard OG ratio, 1.91:1)

## Step 4 — Frame the hero (the important part)

The hero uses IntersectionObserver scroll-reveal (elements start at `opacity:0`), and React
hydration can re-hide them right after load. So run this **framing script** with
`browser_evaluate`, then check the result:

```js
() => {
  // 1. Force every scroll-reveal element visible (they start opacity:0 until the observer fires;
  //    the reveal CSS uses !important, so override with priority).
  document.querySelectorAll('.reveal, [data-reveal]').forEach((el) => {
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('transform', 'none', 'important');
  });
  // 2. Hide every section AFTER the hero so no next-section sliver shows at the bottom edge.
  document.querySelectorAll('main > section').forEach((s, i) => { if (i > 0) s.style.display = 'none'; });
  // 3. Hide the hero CTA button ("$ ./how-content-is-generated") for a clean paper bottom.
  //    Target the <a>/<button> ELEMENT ONLY — do NOT hide a parent wrapper (closest('div') grabs
  //    the whole hero column and collapses the layout).
  const cta = Array.from(document.querySelectorAll('a,button'))
    .filter((e) => /how-content-is-generated/i.test(e.textContent))
    .sort((a, b) => a.textContent.length - b.textContent.length)[0];
  if (cta) cta.style.setProperty('visibility', 'hidden', 'important');
  // 4. Hide the scrollbar for a clean right edge; zoom out slightly so the status line clears the
  //    bottom; scroll to top.
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.zoom = '0.93';
  window.scrollTo(0, 0);
  const status = document.querySelector('.hero__status');
  return {
    statusOpacity: status ? getComputedStyle(status).opacity : null,
    statusBottom: status ? Math.round(status.getBoundingClientRect().bottom) : null,
  };
}
```

Check the return value:
- `statusOpacity` **must be `"1"`**. If it is `"0"`, hydration re-hid the reveals — **run the exact
  same script again** (it is idempotent) and re-check.
- `statusBottom` should be **< 630** (≈ 590). If it is ≥ 630 the status line would be clipped:
  lower the zoom slightly (e.g. `0.90`) and re-run. (Raise the zoom toward `1.0` only if the hero
  content shrank and there's too much empty space at the bottom.)

## Step 5 — Screenshot at OG size

`browser_take_screenshot` with:
- `type: "png"`
- `scale: "device"`  (device scale → the 1200×630 CSS viewport maps 1:1 to a 1200×630 PNG here)
- `filename: "og-image-new.png"`

This writes `./og-image-new.png` at the repo root.

## Step 6 — Install, verify, clean up

```bash
cd "$(git rev-parse --show-toplevel)"
mv -f og-image-new.png public/og-image.png
sips -g pixelWidth -g pixelHeight public/og-image.png | tail -2   # MUST be 1200 x 630
```

Then **Read `public/og-image.png`** and confirm visually: no "N" badge, no scrollbar, no CTA
button, and the full `● Available … | Currently …` status line is in frame with a little space
below it.

Finally, clean up:

```bash
pkill -f "next start" 2>/dev/null; pkill -f "next-server" 2>/dev/null   # stop the :3100 prod server
rm -rf "$(git rev-parse --show-toplevel)/.playwright-mcp" 2>/dev/null    # playwright scratch
```

Call `browser_close` to release the Playwright browser.

---

## Knobs (only if the design changes)

- **Viewport** `1200×630` is the OG standard — keep it unless intentionally changing the card size.
  If you do, update the `width`/`height` in the `openGraph.images` metadata too (`app/layout.tsx`,
  `app/content-generation/layout.tsx`).
- **Zoom** `0.93` is tuned so the status line clears the bottom. Re-tune per Step 4 if hero content
  grows or shrinks.
- **What's hidden** — sections below the hero, the CTA button, the scrollbar. If the hero gains a
  new element below the status line, hide it the same way (element-only `visibility:hidden`).

## After regenerating (reminders for the user — do NOT do these automatically)

- The image path `/og-image.png` is unchanged, so **social scrapers cache by URL and may keep the
  old image**. If you need an instant refresh, either rename the file (and its 4 metadata refs) or
  re-scrape via the platform debuggers: Facebook Sharing Debugger, LinkedIn Post Inspector,
  X Card Validator.
- Committing is manual — the file is a normal committed asset.
