# Handoff: /adzra — The Sayang Collection

## Overview
A private, password-gated collection of memories living at the route `/adzra`. Adzra answers a personal question to unlock, then browses a growing "flower-press" of memories (one plate per month/occasion). Each memory opens a detail page with a photo carousel, a short note, and a "main thing" (usually a message). The design is soft & tender — a pressed-flower keepsake aesthetic in a confession-lily + cream palette.

Routes:
- `/adzra` — the lock gate; on success reveals the collection.
- `/adzra/may17-2026` — "1 Month" detail.
- `/adzra/june17-2026` — "2 Months" detail.
- `/adzra/july4-2026` — "For Sayang, Working in the UK" (the current `/adzra` lime experience, moved here; the one entry that does NOT follow the standard detail format).
- `/adzra/july17-2026` — "3 Months" detail (placeholder — content to be written later).

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look and behavior, **not production code to copy directly**. The task is to **recreate these designs in the target codebase** (the user's Next.js app) using its established patterns, component conventions, and libraries. If a styling system already exists, map these values onto it; otherwise implement with plain CSS/CSS-modules/Tailwind as the project prefers.

`The Sayang Collection.dc.html` is a canvas of stacked screens (lock, collection, and the four detail pages) shown side-by-side for review. In the real app each is its own route/page. `support.js` is only the prototype's runtime — **do not ship it**; it exists so the HTML renders in the design tool.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and interactions are final and intended to be recreated closely. Photos are real reference images (in `reference_photos/`) but bracketed `[ ... ]` copy is placeholder text the user will replace.

## Authentication (important)
- The gate question is **"what do I call you?"** and the correct answer is a private secret (compare case-insensitively, trimmed). The answer is not recorded here — it lives only in an env var (see below).
- The check must be server-side: store the secret in an env var (`SUPER_SECRET_PASSWORD`) and validate on the server (route handler / server action / middleware), setting an httpOnly session cookie on success. The route and all sub-routes must be inaccessible without it — no memory content should be sent to the client until authenticated.

## Screens / Views

### 1. Lock — `/adzra`
- **Purpose:** Ask the secret question; unlock on the correct answer.
- **Layout:** Full-viewport centered column. A card/panel with two concentric rounded "arch" borders (a tall arch on top, rectangular bottom): outer border `1.5px solid #E0AEC4` radius `220px 220px 22px 22px`; inner border `1.5px solid rgba(199,217,107,.55)` radius `210px 210px 18px 18px`, inset ~7px from the outer. Background `linear-gradient(180deg,#F7F0E4,#F3E6EA)`.
- **Locked state, top → bottom, centered:**
  - Eyebrow: "for adzra" — IBM Plex Mono, 11px, letter-spacing 2px, uppercase, color `#B08B57`.
  - Lotus emoji 🪷 at 52px, gently pulsing (`breathe` 3.4s).
  - Title "what do I call you?" — Cormorant Garamond 600, 31px, color `#5b3a44`.
  - Sub "only she knows the answer" — IBM Plex Mono 11px, `#b79a86`.
  - Form (max-width 260px, column, gap 11px): text input (transparent, bottom-border only `1.5px solid #E0AEC4`, IBM Plex Mono 15px, centered) + submit button "enter →" (IBM Plex Mono 13px uppercase, `linear-gradient(135deg,#E0779C,#DE5551)`, white, radius 9px, shadow `0 8px 18px rgba(222,85,81,.32)`).
  - On wrong answer: "not quite — try once more 🌱" in `#AD0634`.
  - Footer, absolute bottom center: "made with 🤍 just for you" — Caveat 17px, `rgba(150,90,110,.55)`.
- **Unlocked state:** lotus 🪷 66px with `bloomPop` entrance, "it's you, sayang" (Cormorant 30px, `#C85C86`), sub line, then a button "open the collection →" (`#8ba06f`, white) that navigates to the collection.
- **Ambient motion:** a butterfly 🦋 drifting (`flutter` 13s) and an occasional falling petal 🌸 (`petalFall`).

### 2. Collection — `/adzra` (after unlock)
- **Purpose:** Browse all memories; jump to any one directly.
- **Layout:** Panel background `#F6EFE3`. A vertical "book spine" on the far left: 16px-wide bar, `linear-gradient(90deg,#C6A56B,#E4D6BC)`, inset shadow, with 4 small white dots (stitching). Content padded `22px 20px 18px 28px`.
- **Header (centered):** eyebrow "a growing collection" (Plex Mono 10.5px, ls 2px, uppercase, `#B08B57`); title "The Sayang Collection" (Cormorant 600, 25px, `#6E3149`).
- **Press (one plate per page, horizontal scroll-snap):** each plate is a tall arched card, radius `130px 130px 16px 16px`, full-bleed cover photo with a bottom gradient scrim `linear-gradient(180deg,rgba(30,10,15,.10) 45%,rgba(40,12,20,.72))`, an inset colored ring (`inset 0 0 0 2px <accent>`) whose color differs per entry, a top "no. 0X" label, and bottom title/date/"tap to open". Tapping a plate navigates to that entry's detail route.
  - Plate 1 — cover `adzra-and-i-pic-with-confession-flowers.jpeg`, ring `#A9BE8A`, "1 Month" / "may17-2026".
  - Plate 2 — cover `adzra-2-months-bloomed-flowers-1.jpeg`, ring `#E79ABF`, "2 Months" / "june17-2026".
  - Plate 3 — cover `lime-closeup.jpeg`, ring `#DE5551`, "For Sayang, Working in the UK" / "july4-2026".
  - Plate 4 — cover `adzra-in-oxford.jpeg`, ring `#C6A56B`, "3 Months" / "july17-2026".
- **Navigation controls (this is the key UX request — reach any entry without paging one-by-one):**
  - A centered row with round `‹` / `›` buttons (32px, white, border `1.5px solid #D9C7A8`) flanking a live label "no. 0X / 04" that reflects the current plate.
  - Below it, a **thumbnail jump rail**: four 44×44 rounded thumbnails (radius 10px) of each cover. Clicking one scrolls the press directly to that plate. The active thumbnail shows a `2.5px` inset ring in `#DE5551`; inactive ones `rgba(180,150,120,.35)`. The current index is derived from the press scroll position (round `scrollLeft / clientWidth`).
- **Caption under panel:** "tap a thumbnail to jump anywhere · newest & oldest all reachable".

### 3. Detail — standard format (1 Month, 2 Months, 3 Months)
Routes `/adzra/may17-2026`, `/adzra/june17-2026`, `/adzra/july17-2026`. Scrollable page, background `#FBF5EC`.
- **Sticky top bar:** translucent (`rgba(251,245,236,.9)`, backdrop-blur 6px), left link "‹ collection" (Plex Mono 12px, `#8a6b4a`) → back to collection; right "NO. 0X" label (`#B08B57`).
- **1. Photo carousel:** 300px tall, horizontal scroll-snap. First slide is the cover photo (same one shown in the collection); subsequent slides are more photos. Missing photos render as a diagonal-hatch placeholder (`repeating-linear-gradient(45deg,#EFE6D6,#EFE6D6 12px,#E8DDC9 12px,#E8DDC9 24px)`) with "+ another photo". Round `‹`/`›` buttons (34px, `rgba(255,255,255,.9)`, shadow) are **absolutely centered vertically over the image**, left/right 12px, `top:50%` with `translateY(-50%)`.
- **2. Note blurb:** white card, border `1px solid #F0DCC4`, radius 16px, padding `16px 18px`, subtle shadow. Caveat heading "a little note" (20px, `#C85C86`) + Nunito 14px/1.65 body (`#6a5a60`). The 2-Months blurb additionally shows a pill "🌷 came with flowers" (`#FBE3EC` bg, `#a83e64` text) — this entry included sending lilies.
- **3. The main thing — "the message I sent":** section eyebrow (Plex Mono 10px, ls 2px, uppercase, `#B08B57`), then a chat mockup: a rounded container `linear-gradient(180deg,#EDE4D3,#E7DCC6)` radius 18px, a centered date chip, and right-aligned outgoing bubbles (`#DCF3D0` bg, `#39432c` text, radius `16px`, small time + "✓✓" in `#7c9a63`). This is an **original chat styling, intentionally not a WhatsApp clone** — same "message you sent" feel in the collection's palette. The user pastes their real long message into the second bubble.
  - 3 Months currently shows a dashed "to be written & pressed 🤍" placeholder instead of bubbles.

### 4. Detail — the exception: July 4, UK — `/adzra/july4-2026`
This is the **only entry that does NOT follow the standard format.** It is the existing `/adzra` "lime" experience relocated to this route. No carousel, no note/message layout.
- Sticky top bar as above ("NO. 03").
- Centered column: eyebrow "july 4, 2026", title "For Sayang, Working in the UK", and a pink pill "✿ a one-off, not part of the monthly format".
- **Interaction:** a lime photo button (`lime-closeup.jpeg`, 230×230, radius 24px, `breathe` pulse). Each click increments a counter; a progress bar (`#E7DCC6` track, `linear-gradient(90deg,#C7D96B,#8ba06f)` fill) fills toward a threshold of **7 clicks**. Copy while locked: "how are you doing, sayang? 🍋" + "keep clicking the lime — a little surprise is waiting" + "🍋 × N · keep going".
- **On reveal (≥7 clicks):** "🍋💚" with `bloomPop`, heading "you made it, sayang" (`#8ba06f`), and a white note card with the encouraging message (placeholder copy to replace). Keep/port whatever the current live `/adzra` implementation does — this handoff just moves it to `july4-2026`.

## Interactions & Behavior
- **Unlock:** submit form → validate answer (server-side in prod) → reveal collection / redirect.
- **Collection paging:** `‹`/`›` scroll the press by one page (`scrollBy({left: ±clientWidth, behavior:'smooth'})`). Thumbnail rail jumps directly (`scrollTo({left: index*clientWidth})`). Active index tracked from scroll position.
- **Plate tap:** navigate to the entry's route.
- **Detail carousel:** `‹`/`›` scroll by one image width, smooth; scroll-snap for swipe on touch.
- **Back:** "‹ collection" returns to `/adzra` collection view.
- **Lime:** click-to-progress counter, reveal at 7.
- **Animations (all CSS):**
  - `breathe` — scale 1↔1.06, 3.4s ease-in-out infinite (lotus, lime).
  - `bloomPop` — scale .35→1.12→1 + fade in, .7s cubic-bezier(.2,.8,.2,1) (reveal moments).
  - `flutter` — butterfly translate+rotate drift, ~13s.
  - `petalFall` — petal falls top→bottom with rotation, fades, ~11s.
  - `sway` — rotate -3°↔3° (idle flowers).
  - Smooth scroll behavior on all carousels.

## State Management
- `authenticated: boolean` — server session (httpOnly cookie) is source of truth; client mirrors for view switching.
- `pw: string`, `wrong: boolean` — lock form input + error flag.
- `pressIdx: number` — current collection plate (0–3), derived from scroll or set by nav/jump.
- Per-carousel current index (optional; scroll-snap handles most of it).
- `lime: number`, `limeRevealed: boolean` — July 4 click counter and reveal (threshold 7).
- Data: an ordered list of entries `{ slug, no, title, date, coverImage, ringColor, photos[], noteBlurb, mainType: 'message'|'lime'|'placeholder', message? }`. The collection and routes should be generated from this list so adding a new memory is a one-object edit (supports the "growing collection" goal). Not-yet-added future entries can render a soft-paper "not pressed yet" fallback.

## Design Tokens
**Palette (confession-lily + cream):**
- Cream paper: `#FBF5EC`, `#F6EFE3`, `#F7F0E4`
- Kraft/gold (spine, labels): `#C6A56B`, `#E4D6BC`, `#B08B57`, `#D9C7A8`
- Confession reds/pinks: `#DE5551` (coral-red accent), `#E0779C`, `#C85C86`, `#6E3149`, `#5b3a44`, `#AD0634` (error), `#FBE3EC` / `#a83e64` (pink pill)
- Lily pink ring: `#E79ABF`, border `#E0AEC4`, `#F0DCC4`
- Greens (leaf/stem, lime, chat bubble): `#A9BE8A`, `#8ba06f`, `#C7D96B`, `rgba(199,217,107,.55)`, chat bubble `#DCF3D0` / text `#39432c` / meta `#7c9a63`
- Text neutrals: `#6a5a60`, `#8a7a80`, `#9a8a90`, `#a89aa0`
- Scrim over photos: `linear-gradient(180deg,rgba(30,10,15,.10) 45%,rgba(40,12,20,.72))`

**Typography:**
- Display/serif: **Cormorant Garamond** (500/600, incl. italic) — titles.
- Body/UI: **Nunito** (400/600/700/800).
- Handwritten accent: **Caveat** (500/700) — notes, sweet asides.
- Mono/labels: **IBM Plex Mono** (400/500) — eyebrows, dates, route labels, buttons.

**Radii:** arch cards `130px 130px 16px 16px` (collection) / `150px 150px 16px 16px` (larger); lock arches `220/210px 22/18px`; cards 16–18px; thumbnails 10px; pills 999px; round buttons 50%.

**Shadows:** panels `0 22px 50px rgba(140,100,90,.2)`; cards `0 6px 16px rgba(140,100,90,.08)`; plates `0 10px 22px rgba(140,100,90,.18)`; buttons `0 3px 10px rgba(0,0,0,.2)`.

**Spacing:** panel padding ~22–26px; header gaps 10–14px; carousel height 300px; collection plate height ~356px.

## Assets
In `reference_photos/` (real photos, use as covers/carousel images; wire to whatever storage the app uses):
- `adzra-and-i-pic-with-confession-flowers.jpeg` — 1 Month cover.
- `adzra-2-months-bloomed-flowers-1.jpeg`, `adzra-2-months-bloomed-flowers-2.jpeg`, `adzra-2-months-before-bloom.jpeg` — 2 Months carousel.
- `lime-closeup.jpeg` — July 4 lime.
- `adzra-in-oxford.jpeg` — 3 Months cover.
Fonts via Google Fonts (Cormorant Garamond, Nunito, Caveat, IBM Plex Mono). Emoji used as lightweight motif (🪷 🌸 🌷 🦋 🍋 💚 🤍) — fine to keep, or swap for an icon/illustration set the codebase prefers.

## Screenshots
Reference renders of each screen are in `screenshots/` (each screen scaled to fit; detail pages show the top of their scroll):
- `01-lock.png` — the lock gate.
- `02-collection.png` — the collection with `‹ ›` nav + thumbnail jump rail.
- `03-detail-1month.png` — standard detail (carousel → note → message).
- `04-detail-2months.png` — standard detail with "came with flowers" pill.
- `05-detail-july4-uk.png` — the exception (lime click-to-reveal).
- `06-detail-3months.png` — placeholder detail.

## Files
- `The Sayang Collection.dc.html` — the design reference (lock + collection + 4 detail views, side by side). Open in a browser to see it live.
- `support.js` — prototype runtime only; **do not ship**.
- `reference_photos/` — the images used in the design.
- `screenshots/` — static renders of each screen (see above).

## Notes for implementation
- Recreate the UI closely (hifi), but replace all bracketed `[ ... ]` copy with the user's real words.
- Drive everything from the entries data list so the collection grows by adding one entry.
- Enforce auth server-side; never expose memory content pre-auth.
- The message screens are original styling by design — do not reproduce WhatsApp's proprietary UI.
