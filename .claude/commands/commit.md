Group the changed files into logical commits and commit them one at a time. Follow these rules exactly:

- Run `git status` first to see all changed and untracked files
- Run `git diff` to understand what changed in each file
- Ignore anything inside `.agent-context/` and `.claude/` — do not stage or commit those files under any circumstances
- Do NOT add a Co-Authored-By line
- Do NOT use `git add .` or `git add -A` — always add files by name
- Maximize the number of commits while keeping each one logically coherent. If a file stands alone, commit it alone. If two files are tightly coupled (e.g. a helper and its test, or two helpers changed for the same reason), commit them together. When in doubt, one file per commit is fine.
- Write commit messages using the format `type: description` where type is one of: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`. Description is imperative present tense, describes what the commit does and why — not what you did. Keep the full message under 72 chars.
- After all commits, run `git log --oneline -10` and show the user the final commit list.
