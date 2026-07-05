# DOUBL Website — Claude Code

**Last Updated:** June 29, 2026

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


