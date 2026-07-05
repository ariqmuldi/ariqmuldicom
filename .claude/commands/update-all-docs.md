You are updating all affected markdown documentation in response to code changes in this repository (**ariqmuldi.com** — a Next.js App Router portfolio site whose content is generated from a LaTeX master resume by `scripts/parse-resume.ts`). Follow every step exactly — do not skip or abbreviate anything.

---

## Step 1 — Detect what changed

Run the following to understand the full scope of changes:

```bash
git diff main...HEAD --name-only      # files changed vs main
git diff --name-only                  # uncommitted changes
git status                            # untracked new files
```

If there are no changes detected, tell the user and stop.

---

## Step 2 — Read ALL changed source files in full

For every changed file (code, config, scripts — not markdowns), read it completely. Do not skim. Do not summarize from memory. The code is the source of truth. If you do not read it, you cannot update docs accurately.

This includes:
- React/TypeScript source under `app/` — `app/page.tsx`, `app/layout.tsx`, `app/icon.tsx`, `app/components/*.tsx`, `app/lib/*.ts`
- Styling: `app/globals.css` (design tokens + all section styles), `tailwind.config.ts`
- Content/data modules under `app/data/` — note which are auto-generated vs manually curated vs AI-generated (`experiences.ts`/`skills.ts`/`education.ts`/`projects.ts` are LaTeX-generated; `work.ts` is curated but its `description`/`technologies` are merged from `role-content.json`; `role-content.json` is AI-generated)
- The resume parser `scripts/parse-resume.ts` and its inputs under `data/` (`master-resume.tex`, `resume-config.json`, `master-resume.pdf`)
- The AI content generator `scripts/generate-role-content.ts` (writes `app/data/role-content.json` from the résumé bullets via Gemini)
- Config: `next.config.ts`, `package.json` (scripts + dependencies), `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`

Ignore generated/build output: `.next/`, `node_modules/`, `next-env.d.ts`, `*.tsbuildinfo`.

---

## Step 3 — Identify the docs to update

**Every markdown file in the repo is in scope.** First enumerate them all so none is missed:

```bash
find . -name "*.md" -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./.git/*"
```

Classify each file against the changes. The known docs and when to touch each:

- `README.md` (root) — the main project doc. Update if the tech stack, section list, architecture, data-flow, design system, hooks, interactions, responsive behavior, resume pipeline, commands, SEO, or repository layout changed
- `data/README.md` — the LaTeX resume pipeline doc. Update if the parser, its LaTeX input structure, extraction rules, the config system, the PDF sync, the generated output shape, or how a generated data module is consumed by a component changed
- `CLAUDE.md` — the always-loaded, per-session orientation. Update **whenever a change makes its orientation inaccurate**: the project overview, the section list/order, the data-driven rule, the generated-vs-curated data module list, the parser's run/gotcha behavior, the design constraints, the doc pointers, or the doc set itself
- `.claude/README.md` — update if a slash command was added, removed, or its behavior changed
- `.claude/commands/*.md` — a slash command's own spec; update if that command's behavior changed
- `claude-code-design/**` — the design reference bundle for the current UI. Read-only reference; do not edit unless the user explicitly asks

Any markdown returned by the command above that is **not** in this list is still in scope: decide whether the change affects it and update it if so (and add it to this list per Step 7b). `docs/implementations/*.md` are point-in-time, pre-approved implementation specs — **not** living docs; do not keep them in sync (leave them as the historical record of what was planned). There are no backend/Firestore/ML/deployment docs and no `PROJECT.md` (it was replaced by `README.md`) — do not invent them.

---

## Step 4 — Read each primary doc before editing it

For every doc you intend to update, read its full current content first. Never overwrite content you haven't read.

---

## Step 5 — Update primary docs

Apply the changes. Hold yourself to these standards:

- **The code is the only source of truth.** Every component name, hook, data field, CSS token/variable, npm script, route/anchor id, and behavior you write must come directly from the source files you read in Step 2. If you are not certain about something, say so rather than guessing.
- **Do not remove accurate existing content** unless the code confirms it is now wrong or removed. (The previous design used Framer Motion, glassmorphism, a terminal window, Geist fonts, and a skills-in-hero view — if you see docs describing those, verify against the code before trusting them.)
- **Dates:** if a doc carries a `Last Updated` / date line, set it to today's date (today is provided in the CLAUDE.md context block).
- **Follow established conventions:**
  - No trailing period at the end of table-cell descriptions or bullet-point items
  - Sentences in doc body prose may have periods; table cells and short bullets do not
  - Folder/path subsections use a trailing slash (e.g. `### app/data/`)
  - Match the heading style and tone already used in the doc you're editing — don't introduce a new format

---

## Step 6 — Search all other markdowns for cross-references

Run a grep across all markdown files for references to the changed component names, hook names, data module/field names, npm scripts, anchor ids, CSS tokens, and file paths:

```bash
grep -rn "<changed-term>" . \
  --include="*.md" \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git
```

Run this for each changed term (component, hook, script, data field, etc.).

For every markdown file that contains a reference:
- Read the full file
- Determine whether the reference is now inaccurate
- If yes: update it
- If you are uncertain whether it needs updating: **ask the user before editing**. Show them the current text and what you think it should say, and wait for their answer before proceeding.

---

## Step 7 — Handle genuinely new features with no existing home

If a change introduces something that has no doc coverage anywhere:
1. First try to fit it into an existing doc (a new section/component/hook goes into `README.md`; a change to the resume parser or its data output goes into `data/README.md`; a new slash command goes into `.claude/README.md`)
2. If it genuinely cannot fit in any existing doc and warrants its own file, **notify the user** — explain what it is, why it doesn't fit, and suggest a file name and location. Do not create the file without their confirmation.

---

## Step 7b — Self-maintain this skill

After all doc updates are done, check whether anything changed that should update this skill file itself:

1. **New markdown files added:** Run `git status` and `git diff main...HEAD --name-only` and look for any newly added `.md` files that describe the system (architecture, setup, the resume pipeline, conventions, etc.). If any exist:
   - Read the new file
   - Determine if it belongs in Step 3's primary docs list
   - If yes: add it to Step 3 in this file (`.claude/commands/update-all-docs.md`) with a one-line description of when to update it
   - Also update `.claude/README.md` to mention it in the `/update-all-docs` description if warranted

2. **Markdown files deleted or renamed:** If any doc that appears in Step 3's list was deleted or renamed, remove or update its entry in Step 3.

3. **New slash commands added:** If a new file was added to `.claude/commands/`, add an entry for it in `.claude/README.md`.

Apply these changes to `.claude/commands/update-all-docs.md` and `.claude/README.md` directly — do not ask the user for confirmation. These are mechanical structural updates, not content decisions.

---

## Step 8 — Report what you did

At the end, show a clear summary:

**Updated:**
- List every file changed and one sentence on what was updated

**Confirmed with user:**
- List any uncertain updates the user approved or rejected

**Could not fit in existing docs (user notified):**
- List anything genuinely new that has no existing doc home

**Not changed:**
- List any files that had references but were checked and confirmed accurate

Do not run `/commit` — leave all changes unstaged for the user to review.
