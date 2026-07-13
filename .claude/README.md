# ariqmuldi.com — Claude Code

Claude Code configuration for this repository. Contains custom slash commands and local permission settings.

---

## commands/

Custom slash commands defined as markdown files. Invoke them in Claude Code by typing the command name prefixed with `/`.

### /commit

**File:** `commands/commit.md`

Groups changed files into logical commits, one at a time. Key rules it enforces:

- Runs `git status` then `git diff` before staging anything
- Never stages or commits files inside `.agent-context/` or `.claude/`
- Never uses `git add .` or `git add -A` — always adds files by name
- Maximises the number of commits while keeping each one logically coherent (one file per commit when in doubt)
- Writes commit messages in the format `type: description` — type is one of `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`; description is imperative present tense, full message under 72 chars
- Does not add a Co-Authored-By line
- Shows `git log --oneline -10` after all commits are done

### /make-pr

**File:** `commands/make-pr.md`

Creates a pull request into `main` for the current branch. Key rules it enforces:

- Reads `git log main..HEAD --oneline` and `git diff main...HEAD` to understand the full diff before writing anything
- Does not include a test plan section
- Does not include AI attribution
- PR body must include a **Summary** section (2–5 bullet points) and a **Changes** section (per-file breakdown)
- Uses `gh pr create --base main`
- Returns the PR URL when done

### /update-all-docs

**File:** `commands/update-all-docs.md`

Updates all affected markdown documentation in response to code changes. Key rules it enforces:

- Detects the full scope of changes with `git diff`/`git status`, then reads every changed source file in full (code is the source of truth)
- Treats **every markdown file in the repo as in scope** — enumerates them all, then updates whichever the change affects: `README.md`, `data/README.md`, `.claude/README.md`, the slash-command specs, and the always-loaded `CLAUDE.md` session orientation
- Greps all other markdown for cross-references to changed component/hook/script/data names and reconciles them
- Asks before editing an uncertain reference, and before creating any brand-new doc file
- Self-maintains: adds/removes entries in this file and Step 3 when docs or slash commands are added/removed
- Leaves all changes unstaged — does not run `/commit`

### /generate-og-image

**File:** `commands/generate-og-image.md`

Regenerates `public/og-image.png` — the 1200×630 Open Graph / social-share card — by
screenshotting the home-page hero. Key steps it enforces:

- Builds and serves a **production** build on port 3100 (the dev-only Next.js "N" indicator must not
  appear in the card; port 3100 avoids clashing with a dev server on `:3000`)
- Drives the **Playwright MCP tools** (Playwright is not a project dependency) at a 1200×630 viewport
- Runs a fixed DOM-framing script: forces scroll-reveal elements visible, hides sections below the
  hero + the hero CTA + the scrollbar, and zooms to `0.93` so the `Available … / Currently …` status
  line clears the bottom
- Verifies the output is exactly 1200×630 and visually clean, then stops the server and clears
  scratch files
- Reminds (does not auto-run) about social-scraper caching after regeneration


