# BACKEND.md — making `/content-generation` actually work

This is the server side of the handoff: auth (with the three unlock cases), the API routes each UI
action calls, and the one small edit to the existing scripts (so the **model switcher** works and so
routes can run them). Read `README.md` first for the UI.

Guiding principle: **the UI is a thin client over the exact workflow you already do by hand.** Every
button maps to a file read/write and/or an npm script you already run — **except committing, which
you keep doing yourself with git.** There is no commit button and no git/GitHub code to write.

---

## The deployment model (simple: local authoring tool + read-only production)

Your site is on **Vercel**, whose serverless filesystem is read-only. That's fine here because of a
deliberate decision:

- **Editing only works on `localhost`.** You run the app locally (`npm run dev`) when you want to
  change content. The `/content-generation` routes then read/write the **real repo files on your
  machine** and run the real npm scripts.
- **Production is always read-only.** The unlock endpoint **refuses when running in production**
  (`process.env.VERCEL` / `NODE_ENV==='production'`), so the deployed page is a public, un-editable
  explainer. Nothing on the internet can mutate your repo through it.
- **Committing stays manual.** After you generate/approve locally, you commit the changed files with
  git the way you already do (your editor, terminal, etc.). Pushing triggers Vercel's redeploy. No
  commit UI, no `child_process` git, no GitHub API.

This removes every hard problem (serverless can't write files / can't git) and matches "only I can
edit" exactly: the editor is only functional where you run it, behind the password.

**Result:** you build a set of Next.js route handlers that, **in local dev**, write files and run the
generators; in production they're gated off. No database.

---

## Environment variables

`.env` (local dev) — and set the first two in Vercel too so the *auth check* exists in prod (it will
still refuse to unlock there):

```bash
# The editor password. Server-only — NEVER prefix with NEXT_PUBLIC_.
CONTENT_GENERATION_PASSWORD=choose-a-long-random-passphrase

# Secret used to sign the auth session cookie (any long random string).
CONTENT_GENERATION_SESSION_SECRET=another-long-random-string

# Already used by the generate scripts:
GEMINI_API_KEY=your-google-ai-key

# NEW — default model; the UI can override per-request (see script edit below).
GEMINI_MODEL=gemini-2.5-flash-lite
```

No `GITHUB_*`, no DB URL. The "session" is a signed cookie; the password lives only in the env var.

---

## Detecting "production"

One helper both auth and mutations use:

```ts
// app/lib/content-env.ts
export function isProduction(): boolean {
  // Vercel sets VERCEL=1 on all deployments; also treat NODE_ENV=production as prod.
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}
```

If you want to allow editing on a self-hosted always-on box later, widen this (e.g. an explicit
`CONTENT_EDIT_ENABLED=true` gate) — but by default, only local `npm run dev` is editable.

---

## Auth: password → signed httpOnly cookie (with the three cases)

No DB, no user table. One password, checked server-side; on success (and only on localhost) set a
signed, httpOnly cookie that the mutating routes verify.

**`app/lib/content-auth.ts`**
```ts
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE = 'cg_session';
const MAX_AGE = 60 * 60 * 8; // 8h

function sign(payload: string): string {
  const secret = process.env.CONTENT_GENERATION_SESSION_SECRET!;
  const mac = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${mac}`;
}
export function makeSessionToken(): string {
  return sign(`cg.${Date.now() + MAX_AGE * 1000}`); // value.expiry
}
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf('.');
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const a = Buffer.from(token), b = Buffer.from(sign(payload));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const expiry = Number(payload.split('.')[1]);
  return Number.isFinite(expiry) && Date.now() < expiry;
}
export function passwordMatches(input: string): boolean {
  const real = process.env.CONTENT_GENERATION_PASSWORD ?? '';
  const a = Buffer.from(input), b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE)?.value);
}
export const SESSION_COOKIE = COOKIE;
export const SESSION_MAX_AGE = MAX_AGE;
```

**`app/api/content/auth/route.ts`** — login / logout, implementing the three cases
```ts
import { NextResponse } from 'next/server';
import { passwordMatches, makeSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/app/lib/content-auth';
import { isProduction } from '@/app/lib/content-env';

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }));

  // Case 1: wrong password → 401 (same message in every environment).
  if (!passwordMatches(String(password ?? ''))) {
    return NextResponse.json({ ok: false, error: 'incorrect password — editing stays disabled' }, { status: 401 });
  }
  // Case 2: correct password but running in production → refuse.
  if (isProduction()) {
    return NextResponse.json(
      { ok: false, code: 'production',
        error: 'password correct, but content editing is disabled in production — run the site locally (localhost) to unlock' },
      { status: 403 },
    );
  }
  // Case 3: correct password on localhost → set the session cookie.
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, makeSessionToken(), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: SESSION_MAX_AGE,
  });
  return res;
}

export async function DELETE() { // lock / logout
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
```

> **Security note (your call):** validating the password *before* the production check (as above)
> confirms to a caller in production that the password was correct. That's what the UI's "case 2"
> message asks for. If you'd rather not reveal correctness on the public URL, flip the order — check
> `isProduction()` first and return the production message for *any* unlock attempt in prod. Either
> way, production can never actually unlock.

**Guard for every mutating route** — requires auth **and** refuses in production (belt and braces):
```ts
// app/lib/content-guard.ts
import { NextResponse } from 'next/server';
import { isAuthed } from '@/app/lib/content-auth';
import { isProduction } from '@/app/lib/content-env';

export async function requireEditable() {
  if (isProduction()) return NextResponse.json({ ok:false, error:'editing disabled in production' }, { status: 403 });
  if (!(await isAuthed())) return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });
  return null; // ok to proceed
}
```

Expose a tiny read for the initial UI state:
```ts
// app/api/content/session/route.ts  (public)
import { NextResponse } from 'next/server';
import { isAuthed } from '@/app/lib/content-auth';
import { isProduction } from '@/app/lib/content-env';
export async function GET() {
  return NextResponse.json({ authed: await isAuthed(), production: isProduction() });
}
```
The client uses `production` to phrase things correctly (e.g. it can pre-empt the unlock message) and
`authed` to render locked/unlocked — never the password.

---

## Required script edit: make the model configurable

Both generators currently hardcode `const GEMINI_MODEL = 'gemini-2.5-flash-lite';`. In **both**
`scripts/generate-work-experience-content.ts` and `scripts/generate-project-content.ts` change it to:
```ts
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
```
Now `/api/content/generate` can pass the UI-selected model via the child process env. Whitelist the
allowed ids server-side: `['gemini-2.5-flash-lite','gemini-2.5-flash','gemini-2.5-pro','gemini-2.0-flash']`.

No other script changes needed. The scripts already accept `-- --force`, `-- --force <key>`,
`-- --seed`, and already own the approval contract: **approved + unchanged entries are skipped**;
editing a role's bullets (or a project's description) changes its `sourceHash` and forces a redraft
that flips `approved:false`. `sourceHash` = first 8 hex of `sha256(accomplishments.join('\n'))` (work)
/ `sha256(description)` (projects). Don't reinvent it — let the scripts do it.

---

## The API routes (contract the UI calls)

All under `app/api/content/`. `GET /state` and `GET /session` are public. Every other route begins:
```ts
const denied = await requireEditable(); if (denied) return denied;
```
Helper used below:
```ts
import path from 'path'; import { readFile, writeFile } from 'fs/promises';
const root = process.cwd();
const p = (...s: string[]) => path.join(root, ...s);
```

### `GET /api/content/state`  (public) — hydrate the editor
```ts
import { NextResponse } from 'next/server';
export async function GET() {
  const [tex, work, project, config] = await Promise.all([
    readFile(p('data','master-resume.tex'),'utf8'),
    readFile(p('app','data','work-experience-content.json'),'utf8').catch(()=> '{}'),
    readFile(p('app','data','project-content.json'),'utf8').catch(()=> '{}'),
    readFile(p('data','resume-config.json'),'utf8').catch(()=> '{}'),
  ]);
  return NextResponse.json({ tex, work: JSON.parse(work), project: JSON.parse(project), config: JSON.parse(config) });
}
```
For the previews, import the generated `experiences`/`projects` from `app/data/*.ts` directly in the
page (Server Component) and pass as props — no need to re-parse client-side.

### `PUT /api/content/master-tex`  (editable) — save the `.tex`
```ts
// body: { tex: string }  → writes data/master-resume.tex, returns { ok:true }. Does NOT parse.
await writeFile(p('data','master-resume.tex'), body.tex, 'utf8');
```

### `POST /api/content/parse`  (editable) — run parse:resume
Spawn the real script so behavior is identical to your CLI:
```ts
import { spawn } from 'child_process';
function run(cmd: string, args: string[], env: NodeJS.ProcessEnv = {}) {
  return new Promise<{ code:number; out:string }>((resolve) => {
    const c = spawn(cmd, args, { cwd: process.cwd(), env: { ...process.env, ...env }, shell: false });
    let out = ''; c.stdout.on('data', d=>out+=d); c.stderr.on('data', d=>out+=d);
    c.on('close', code => resolve({ code: code ?? 1, out }));
  });
}
export async function POST() {
  const denied = await requireEditable(); if (denied) return denied;
  const { code, out } = await run('npm', ['run','parse:resume']);
  // parse:resume rewrites app/data/*.ts AND auto-updates data/resume-config.json.
  return NextResponse.json({ ok: code === 0, log: out });
}
```
Return `out` for the terminal panel. After a successful parse the UI should re-`GET /state`. If you
want changed-source entries flipped to `approved:false` *immediately* (before the next generate),
recompute `sourceHash` server-side here and unset `approved` where it differs, then rewrite the JSON.

### `POST /api/content/generate`  (editable) — run a generator with the selected model
```ts
// body: { target:'work'|'project'|'all', force?:boolean, key?:string, model?:string }
const ALLOWED = new Set(['gemini-2.5-flash-lite','gemini-2.5-flash','gemini-2.5-pro','gemini-2.0-flash']);
const model = ALLOWED.has(body.model) ? body.model : (process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite');
const script = { work:'generate:work-experience-content', project:'generate:project-content' };
const flags: string[] = []; if (body.force) { flags.push('--force'); if (body.key) flags.push(body.key); }
const gen = (t:'work'|'project') => run('npm', ['run', script[t], ...(flags.length?['--',...flags]:[])], { GEMINI_MODEL: model });

let out = '';
if (body.target === 'all') { out += (await gen('work')).out; out += (await gen('project')).out; }
else out = (await gen(body.target)).out;
return NextResponse.json({ ok:true, log: out, model });
```
- Default (no `force`) drafts only unapproved/changed entries. `force`+`key` redrafts one.
  `target:'all'` = `npm run generate:content`.
- `GEMINI_MODEL` is passed through env → requires the one-line script edit above.
- Re-`GET /state` after it returns to load the new drafts (`approved:false`).

### `PATCH /api/content/work/:key` and `PATCH /api/content/project/:key`  (editable) — field edits & approve
Direct JSON edits so you can tweak or approve a draft **without** calling Gemini:
```ts
// work body:    { commitSubject?, technologies?: string[], description?, approved?: boolean }
// project body: { tagline?, approved?: boolean }
const file = JSON.parse(await readFile(outputPath,'utf8'));
if (!file[key]) return NextResponse.json({ ok:false, error:'unknown key' }, { status:404 });
Object.assign(file[key], patch);  // only provided fields
await writeFile(outputPath, JSON.stringify(file, null, 2) + '\n', 'utf8');
```
Keep field order stable to match the generators' output and keep git diffs clean
(`experienceId, sourceHash, approved, commitSubject?, technologies, description?` for work;
`projectId, sourceHash, approved, tagline?` for projects). Approving does **not** change `sourceHash`.

### `PUT /api/content/config`  (editable) — visibility toggles
```ts
// body: { experiences: Record<key, {hidden, hideAllAccomplishments, hideAccomplishments[], hideTechnologies}> }
```
Merge into `data/resume-config.json` (the parser regenerates the `_instructions` block anyway).
Visibility changes apply on the **next parse** (`applyConfig` runs inside `parse:resume`), so prompt a
re-parse after changing them.

### There is no commit route.
Committing is done by you with git after generating/approving. If you *ever* want a one-click local
commit later, it'd be a small `spawn('git', ['add', ...WHITELIST]); spawn('git',['commit',...])`
guarded by `requireEditable()` — but per the design it's intentionally left out.

---

## Mapping: UI action → route → what actually happens

| UI action | Route | Effect (local dev only) |
|---|---|---|
| Enter password → unlock | `POST /api/content/auth` | wrong→401; correct+prod→403 (stays locked); correct+localhost→sets cookie |
| Edit `.tex`, `$ parse:resume` | `PUT /master-tex` then `POST /parse` | writes `data/master-resume.tex`; runs parser → `app/data/*.ts` + `resume-config.json` |
| `generate (drafts)` / `--force` / `regenerate <key>` / `$ npm run generate:content` | `POST /generate` | runs the generator(s) with selected `GEMINI_MODEL` → updates `*-content.json` (`approved:false`) |
| Edit commit subject / tech / description / tagline | `PATCH /work/:key` or `/project/:key` | writes the field into the JSON |
| `approve & lock` / unlock | `PATCH …:key {approved}` | flips `approved` in the JSON |
| Visibility chips/toggles | `PUT /config` | writes `data/resume-config.json` (applies on next parse) |
| _(commit)_ | — | **manual**: you `git add`/`commit`/`push` the changed files; Vercel redeploys |
| `lock` | `DELETE /api/content/auth` | clears cookie |

Print each route's returned `log` verbatim in the terminal panel so the browser mirrors your CLI.

---

## Security checklist

- [ ] `CONTENT_GENERATION_PASSWORD` and `CONTENT_GENERATION_SESSION_SECRET` are server-only (no `NEXT_PUBLIC_`), never returned to the client.
- [ ] Password compared with `timingSafeEqual`; consider a small delay / rate limit on `/auth`.
- [ ] Cookie is `httpOnly`, `sameSite:'lax'`, `secure` in prod, HMAC-signed, ≤8h.
- [ ] **Every** write/generate route calls `requireEditable()` — which refuses in production *and* without a valid cookie.
- [ ] `/auth` refuses to unlock in production (the deployed site can never enter edit mode).
- [ ] Generate route whitelists the `GEMINI_MODEL` value.
- [ ] No secrets other than the above; no git/GitHub tokens needed.

---

## TL;DR for the implementer

1. Build the route + UI read-only (`README.md`), hydrating from `GET /api/content/state`
   (+ `GET /api/content/session` for authed/production).
2. Add cookie auth (`content-auth.ts` + `content-env.ts` + `/auth` + `requireEditable`); wire the
   unlock bar with the three cases.
3. Edit the two generate scripts to read `process.env.GEMINI_MODEL`.
4. Add the routes above; each mutating one writes the real file / runs the real npm script **in local
   dev** and is gated off in production. Print returned logs in the terminal panel.
5. Ship it as a **local authoring tool**. You generate/approve locally, then commit the changed files
   with git yourself — pushing redeploys the read-only public site.
