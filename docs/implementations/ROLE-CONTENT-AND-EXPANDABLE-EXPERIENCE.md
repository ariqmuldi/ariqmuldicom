# AI-Generated Role Content (Work descriptions + shared skills) & Expandable Experience

**Status:** Approved — ready to implement. All decisions are locked (see Section 2 and Section 11).
**Date:** 2026-07-05
**Scope:** Three linked changes, all driven by the résumé bullets in
[`data/master-resume.tex`](../../data/master-resume.tex):
1. Auto-generate the Work section's `description` (2–3 sentence project summary) with Gemini 2.5
   Flash-Lite, at author-time only.
2. Auto-generate `technologies` per role with Gemini, and **share one tech list between the Work
   and Experience sections** for roles that appear in both. Roles with no Work card (only the
   Undergraduate Teaching Assistant) still get AI tech, used in Experience only.
3. Make the Experience `git log` ledger **expandable**: collapsed by default (headline + tech +
   dates), click a row to reveal that role's full résumé bullets. Keeps the terminal aesthetic and
   avoids overwhelming the reader.

> **For the implementing agent:** This is a complete, pre-approved spec. The human has chosen the
> provider (Gemini 2.5 Flash-Lite via REST/`fetch`, no SDK) and resolved every open question
> (Section 11). Do not re-ask about model choice, cost, DOUBL handling, or the collapsed-row layout.
> Implement Sections 3–9 in the order given in Section 12. The only thing to confirm at runtime:
> whether the human wants you to run `npm run generate:content` (spends a fraction of a cent) or to
> run it themselves.

---

## 1. Goal & the Work-vs-Experience distinction

Today `description`/`technologies` in `work.ts` are hand-written, and the Experience section's tech
comes from keyword-matching (`TECH_KEYWORDS` in `parse-resume.ts`) while showing only the *first*
résumé bullet per role. We want Gemini to own the prose/tech, kept in sync with the résumé, with a
manual override escape hatch — and we want the two sections to feel intentional, not redundant.

**The two sections differ by _altitude_ and _coverage_, and must not repeat each other:**

| | Work | Experience |
|---|---|---|
| Question it answers | "What impressive things have you *built*?" | "What have you *done*, everywhere, and when?" |
| Coverage | Curated — the flagship projects (3 live + 1 coming-soon) | Complete — every role, incl. Teaching Assistant |
| Altitude | Synthesized 2–3 sentence project overview (AI) | The granular achievements — the receipts (real bullets) |
| Form | Visual case-study cards | Terminal `git log` ledger, chronological, expandable |

So: **AI `description` is Work-only** (Experience never shows an AI summary — it shows real bullets).
**AI `technologies` is shared** by both. Experience's job is completeness + drill-down, which is why
it gets the full bullets on expand.

Hard requirements:

1. **`work.ts` stays hand-curated.** Only `description`/`technologies` become optional/derived.
2. **AI populates `description` (Work) and `technologies` (both sections)** — no hardcoded tech list
   for these; `TECH_KEYWORDS` stays only for Projects and as a fallback.
3. **`npm run dev`, `npm run build`, and Vercel never call the API.** Generation is a separate,
   manual command. Cost is incurred only when the author explicitly runs it.
4. **Approve/lock workflow:** review drafts, approve the good ones, re-run to redraft only the
   unapproved ones — without losing existing approvals.
5. **Experience is not overwhelming:** collapsed rows by default; full bullets only on expand.

---

## 2. Model — decided: Gemini 2.5 Flash-Lite (`gemini-2.5-flash-lite`)

**Final.** Called via the **REST API using Node's global `fetch`** — **no SDK dependency** (nothing
for Vercel to install, no typecheck risk in `next build`; matches the existing `scripts/*.ts` CLI
convention, e.g. `parse-resume.ts`). `GEMINI_API_KEY` **already exists in `.env`** (verified), and
`.env*` is git-ignored (verified), so it never ships.

Pricing for the record (now ~5 roles per full run, still trivial):

| Model | Input $/M | Output $/M | Source |
|---|---|---|---|
| **Gemini 2.5 Flash-Lite (chosen)** | $0.10 | $0.40 | [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Gemini 2.5 Flash | $0.30 | $2.50 | [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Claude Haiku 4.5 | $1.00 | $5.00 | [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing) |

A full 5-role regeneration is well under 0.1¢. Cost is a non-factor; do not re-litigate model choice.

---

## 3. Architecture & data flow

The AI content is **per-role** (not per-work-item) and shared. One generated file feeds both
sections. The API is reachable from exactly one command.

```
                 AUTHOR-TIME (manual, spends money)          BUILD/RUNTIME (free, offline)
                 ───────────────────────────────────         ─────────────────────────────
                                                              ┌─► work.ts (merge) ──► Work section
  master-resume.tex ─► npm run generate:content ─► role-content.json ─┤
                              │                    (committed)  └─► ExperienceSection (overlay) ─► Experience
                              └── calls Gemini REST
                                  (only place GEMINI_API_KEY is ever read)
  npm run dev / npm run build / Vercel  ──── read-only imports; no API ────────────────────┘
```

- `npm run generate:content` is the **only** code path that reads `GEMINI_API_KEY` or hits the
  network.
- `predev` (`parse:resume`) and `next build` never touch it — there is no `prebuild` hook in
  [`package.json`](../../package.json), so Vercel's `npm run build` doesn't even run the parser; it
  compiles the committed `app/data/*.ts` + `app/data/role-content.json`.

---

## 4. Data contract: `app/data/role-content.json`

Committed to git. Generated by `generate:content`, hand-editable, source of truth for approvals.
**Keyed by `contentKey`** (a stable role slug). Each entry carries `experienceId` so the Experience
section can join by id, and `technologies` for every role; `description` is present only for roles
surfaced by a real (non-coming-soon) Work card.

```jsonc
{
  "makerspace": {
    "experienceId": 3,                   // join key for the Experience section
    "sourceHash": "a1b2c3d4",            // first 8 hex chars of sha256(accomplishments.join("\n"))
    "approved": true,
    "technologies": ["TypeScript", "React Router v7", "PostgreSQL", "Prisma", "Stripe"],
    "description": "A comprehensive membership and equipment management system..."  // Work uses this
  },
  "teaching-assistant": {
    "experienceId": 5,
    "sourceHash": "...",
    "approved": true,
    "technologies": ["Java", "Machine Architecture"]
    // no "description" — Experience-only role, Experience never shows an AI summary
  }
}
```

Canonical role slugs (hand-maintained in the generator; 5 roles — verified mapping, experiences are
parsed in `.tex` order):

| `contentKey` | `experienceId` | Role | In Work? | Gets `description`? |
|---|---|---|---|---|
| `doubl` | 1 | Junior Software Developer @ DOUBL | Yes (coming-soon, manual card) | **No** (card copy is manual) |
| `mds` | 2 | Software Developer (Work Study) | Yes | Yes |
| `makerspace` | 3 | Software Developer — Makerspace | Yes | Yes |
| `learncoding` | 4 | Software Developer — LearnCoding | Yes | Yes |
| `teaching-assistant` | 5 | Undergraduate Teaching Assistant | No | No |

Placed under `app/data/` so both `work.ts` and `ExperienceSection.tsx` can `import` it directly.
`resolveJsonModule` is **already `true`** in `tsconfig.json` (verified) — no tsconfig change needed.

---

## 5. Consumer change A — `app/data/work.ts`

Keep hand-curated. Make the two AI-owned fields optional, add a stable `contentKey`, merge the JSON
at module load so the exported shape is unchanged (so `WorkSection.tsx` needs **zero** changes —
verified: it reads `item.description`/`item.technologies` at
[lines 68–70](../../app/components/WorkSection.tsx#L68-L70)).

```ts
import roleContent from './role-content.json';

type RoleContent = { experienceId: number; sourceHash: string; approved: boolean; technologies: string[]; description?: string };
const contentByKey = roleContent as Record<string, RoleContent>;

// exported WorkItem keeps description/technologies REQUIRED; raw curated data may omit them
type CuratedWorkItem = Omit<WorkItem, 'description' | 'technologies'> & {
  description?: string;
  technologies?: string[];
};

// precedence: inline hand-written value → AI value → empty
function resolve(item: CuratedWorkItem): WorkItem {
  const ai = item.contentKey ? contentByKey[item.contentKey] : undefined;
  return {
    ...item,
    description: item.description ?? ai?.description ?? '',
    technologies: item.technologies ?? ai?.technologies ?? [],
  };
}
```

- Add `contentKey?: string` to `WorkItem`.
- Give the three UBC work items their `contentKey` (`makerspace`/`learncoding`/`mds`). The DOUBL
  work item keeps `comingSoon` and its **manual** `description` inline (it will still get a
  `contentKey: 'doubl'` so it *could* pull AI `technologies`, but its card copy stays manual).
- Precedence lets you hand-override any field by keeping it inline.

---

## 6. Consumer change B — `app/components/ExperienceSection.tsx` (overlay tech + expand/collapse)

Two edits to the existing client component ([current file](../../app/components/ExperienceSection.tsx)).

### 6.1 Overlay AI technologies (shared with Work)

Join each experience to its role-content entry **by `experienceId`** and prefer the AI tech list;
fall back to the keyword tech in `experiences.ts` if no entry exists yet.

```ts
import roleContent from '@/app/data/role-content.json';
const techByExperienceId = new Map(
  Object.values(roleContent).map((e: any) => [e.experienceId, e.technologies as string[]])
);
// in render: const tech = techByExperienceId.get(exp.id) ?? exp.technologies;
```

This is how the *same* AI-generated list appears in both sections: Work joins by `contentKey`,
Experience joins by `experienceId`, both pointing at the same `role-content.json` entry.

### 6.2 Collapsed-by-default, expandable rows (terminal style)

Follows the design system in
[`claude-code-design/terminal-ui-design-v2/README.md`](../../claude-code-design/terminal-ui-design-v2/README.md)
(§3 Experience, Design Tokens). Reuse the existing `.gitlog__*` classes; add expand styling in
`app/globals.css`.

- **Collapsed row (default):** exactly today's content — `hash · role @ company·context · headline ·
  tech line · dates`, where `headline = accomplishments[0]` reads as the git "commit subject." This
  is the chosen "not overwhelming" layout.
- **Affordance:** the row is clickable (`cursor: pointer`), with a small accent glyph acting as the
  toggle — `▸` collapsed / `▾` expanded (color `accent #555879`, `white-space: pre`), placed at the
  row start near the hash (consistent with the `tree`/`git` glyph language). Set `role="button"`,
  `tabIndex=0`, `aria-expanded`, and toggle on Enter/Space too.
- **Expanded body ("commit body"):** reveal the role's remaining bullets `accomplishments[1..n]` as a
  monospace list indented under the summary column — 13px, `ink-soft rgba(42,44,59,.62)`,
  `max-width: 66ch`, each line prefixed with a faint `–` (or the tree glyph), line-height ~1.6. No
  cards, no shadows — hairline only if needed (`rule` token).
- **State:** add `const [openIds, setOpenIds] = useState<Set<number>>(new Set())`; toggle per row.
  Independent rows (no accordion). No "expand all."
- **Motion:** respect `prefers-reduced-motion` — if reduced, toggle instantly (no height animation);
  otherwise a short height/opacity ease (~.2–.3s) consistent with existing hovers. This matches the
  README's reduced-motion rule.
- **Rows with no bullets:** DOUBL (id 1) has hidden bullets (`accomplishments: []`) — render it with
  **no headline and no expand affordance** (just role + AI tech + dates), exactly as it degrades
  today. Only show the toggle when `accomplishments.length > 1`.

Keep sourcing role data from `experiences.ts`; only tech is overlaid and only the expand UI is added.

---

## 7. Generator — `scripts/generate-role-content.ts` (the `generate:content` script)

New standalone CLI script run via `tsx` (a Node script like `parse-resume.ts`, **not** Next app
code — no framework, no Next `fetch` conventions apply). Add
`"generate:content": "tsx scripts/generate-role-content.ts"` to `package.json`. No new dependency
(global `fetch` + Node `crypto`).

**Step 0 — refactor for reuse (no behavior change):** in
[`scripts/parse-resume.ts`](../../scripts/parse-resume.ts), add `export` to `parseResume` and
`cleanLatexText`. `parseResume()` returns **all** roles with their **full** bullets (config hiding is
applied later in `main()`), so the generator sees DOUBL's real bullets even though the site hides
them — exactly what we need for DOUBL's AI tech.

**Role list (hand-maintained in the script):** the 5 `{ contentKey, experienceId }` rows from
Section 4, each with an `expectedTitleIncludes` guard string; if the parsed experience at that id
doesn't match, fail loud (protects against résumé reordering shifting ids). Roles in the résumé but
not in this list are skipped with a warning (prompts you to add a slug when you add a role).

**`wantsDescription`:** import `workGroups` from `app/data/work.ts`; a role wants a description iff a
**non-`comingSoon`** work item carries its `contentKey`. → true for `makerspace`/`learncoding`/`mds`,
false for `doubl` (coming-soon) and `teaching-assistant` (no card).

**Main logic:**
1. Parse experiences via `parseResume(master-resume.tex)`; load existing `role-content.json` (`{}`
   if missing).
2. For each role in the list:
   - `accomplishments` = that experience's full bullets. Compute
     `sourceHash = createHash('sha256').update(accomplishments.join('\n')).digest('hex').slice(0,8)`.
   - **Skip vs call:** existing entry `approved === true` **and** `sourceHash` matches → **skip** (no
     API). Otherwise → **call Gemini** and write
     `{ experienceId, sourceHash, approved: false, technologies, ...(wantsDescription ? { description } : {}) }`.
3. Merge & write (read → merge → write; never clobber — preserves approvals, exactly like
   `updateConfigFile` does for `resume-config.json`). Log per role: `skipped (approved)`, `drafted`,
   or `redrafted (résumé changed)`.

**Flags:**
- `--force [contentKey]` — redraft even if approved (all roles, or just the named one).
- `--seed` — see Section 8 (no API).
- Missing `GEMINI_API_KEY` → exit with `Set GEMINI_API_KEY in .env`. Only affects this script;
  dev/build unaffected. Load `.env` via a tiny manual read (don't add a dep for this).

### Gemini REST call (structured output)

- Endpoint: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`
- Auth header: `x-goog-api-key: <GEMINI_API_KEY>`
- Body: `systemInstruction` + `contents` (the joined bullets) + `generationConfig.responseMimeType:
  "application/json"` and a `responseSchema`. **Include `description` in the schema only when
  `wantsDescription`;** always include `technologies`:

```json
{
  "systemInstruction": { "parts": [{ "text": "You write concise third-person portfolio copy from résumé bullets." }] },
  "contents": [{ "parts": [{ "text": "<the joined accomplishment bullets for this role>" }] }],
  "generationConfig": {
    "responseMimeType": "application/json",
    "responseSchema": {
      "type": "OBJECT",
      "properties": {
        "description": { "type": "STRING" },
        "technologies": { "type": "ARRAY", "items": { "type": "STRING" } }
      },
      "required": ["technologies"],
      "propertyOrdering": ["description", "technologies"]
    }
  }
}
```

- Gemini REST `responseSchema` uses **uppercase** type enums (`OBJECT`, `STRING`, `ARRAY`).
- Parse: `JSON.parse(json.candidates[0].content.parts[0].text)`.
- Prompt guidance: "Write a 2–3 sentence third-person project summary for a portfolio (only if asked).
  List the concrete technologies used, in conventional display form (e.g. 'React Router v7',
  'IoT (ESP32)'), deduped, cap ~10, no prose in the tech array."
- Optional `generationConfig.temperature` (~0.7) so a re-roll differs.

### Approve/lock behavior

- Run `generate:content` → unapproved/changed roles get fresh drafts (`approved: false`).
- Review `role-content.json`; set `approved: true` on the good ones (or edit by hand).
- Re-run → approved roles are **skipped**; approvals are **never lost**; only unapproved ones
  redraft. Repeat until happy.
- Editing a role's bullets in the `.tex` changes its `sourceHash` → that role redrafts and flips to
  `approved: false` for re-review. **(Decided: non-sticky — Section 11 #2.)**
- **Commit `role-content.json`** after approving, like the rule for regenerated `app/data/*.ts`.

---

## 8. Seeding (`--seed`, run once, no API) — so nothing breaks and the first live run is a no-op

Populate `role-content.json` from current committed values before removing any inline copy:
- `technologies`: for `makerspace`/`learncoding`/`mds` read the inline tech in `work.ts`; for `doubl`
  and `teaching-assistant` read the current keyword tech from `experiences.ts` (by `experienceId`).
- `description`: for `makerspace`/`learncoding`/`mds` read the inline description in `work.ts`; none
  for `doubl`/`teaching-assistant`.
- Set `approved: true` and the correct `sourceHash` for each.

Result: the site renders byte-identically, and the first real `npm run generate:content` is a no-op
(zero cost) until you deliberately `--force` a role to get an AI draft.

---

## 9. Edge cases

- **DOUBL (id 1):** bullets hidden on-site but present in the `.tex`; generator reads them to produce
  AI `technologies` (used in Experience, and available to the coming-soon Work card). No AI
  `description` — the card copy stays manual. **(Decided — Section 11 #1.)**
- **Teaching Assistant (id 5):** AI `technologies` only, shown in Experience; never in Work.
- **`TECH_KEYWORDS` / Projects:** unchanged. Still used by the Projects section and as the Experience
  tech fallback. We are not moving Projects to AI (out of scope).
- **Résumé reordering:** the `expectedTitleIncludes` guard makes the generator fail loud if an
  `experienceId` no longer matches its slug.
- **Secrets:** `GEMINI_API_KEY` in `.env` (present, git-ignored), read only by `generate:content`.

---

## 10. Files touched

| File | Change |
|---|---|
| `docs/implementations/ROLE-CONTENT-AND-EXPANDABLE-EXPERIENCE.md` | this plan |
| `app/data/work.ts` | `contentKey` on `WorkItem`; optional `description`/`technologies` in curated data; merge from `role-content.json` |
| `app/data/role-content.json` | **new** — per-role AI content (tech for all roles, description for Work roles) + approvals |
| `app/components/ExperienceSection.tsx` | overlay AI tech by `experienceId`; add collapsible rows + full-bullet expand |
| `app/globals.css` | expand/collapse styles + toggle glyph, within existing `.gitlog__*` + design tokens; reduced-motion |
| `scripts/generate-role-content.ts` | **new** — the `generate:content` script (only API caller); `fetch` + `crypto`, no dep |
| `scripts/parse-resume.ts` | `export` `parseResume()` + `cleanLatexText()`; no behavior change |
| `package.json` | add `"generate:content"` script only — **no dependency** |
| `CLAUDE.md` / `data/README.md` | document the new command, the shared role-content model, expandable Experience, commit rule (via `/update-all-docs`) |

No change needed (verified): `tsconfig.json` (`resolveJsonModule` true), `.env` (key present),
`app/components/WorkSection.tsx` (reads merged fields unchanged).

---

## 11. Decisions (all locked — do not re-ask)

1. **DOUBL technologies:** AI-generated from its hidden résumé bullets (one consistent source). ✅
2. **Approvals sticky through résumé edits?** No — a résumé edit (hash change) forces re-review. ✅
3. **Generate a `description` for coming-soon / no-card roles?** No — `description` is Work-only for
   live cards; DOUBL card copy stays manual; TA never has one. ✅
4. **Collapsed Experience row:** headline (`accomplishments[0]`) + tech + dates; expand reveals the
   full bullets. ✅
5. **Provider/model:** Gemini 2.5 Flash-Lite via REST/`fetch`, no SDK. ✅

---

## 12. Implementation order (checklist for the next agent)

1. `export` `parseResume` + `cleanLatexText` from `scripts/parse-resume.ts` (no other change).
2. Write `scripts/generate-role-content.ts` (Sections 7–8); add `generate:content` to `package.json`.
3. Edit `app/data/work.ts`: add `contentKey` to `WorkItem` + curated/merge types + `resolve()`; give
   the 3 UBC items and the DOUBL item their `contentKey`. **Do not remove inline copy yet.**
4. Create `app/data/role-content.json` = `{}`, then run `npm run generate:content -- --seed` to fill
   it from current values (`approved: true`, correct hashes, no API).
5. Remove the now-duplicated inline `description`/`technologies` from the 3 UBC work items (DOUBL
   keeps its manual `description`).
6. Edit `app/components/ExperienceSection.tsx` (Section 6): overlay AI tech by `experienceId`; add
   collapsible rows + full-bullet expand. Add styles to `app/globals.css`.
7. Verify: `npx tsc --noEmit` passes; `npm run dev` shows Work identical (seeded copy), Experience
   rows collapse/expand and show the shared tech; `npm run build` succeeds offline.
8. Confirm with the human before the first **live** call. Then `npm run generate:content -- --force
   teaching-assistant` (or another role) to prove the Gemini integration; show the draft; let them
   approve or re-roll.
9. Run `/update-all-docs` to sync `CLAUDE.md` + `data/README.md`.
