// scripts/generate-project-content.ts
//
// A network/GEMINI_API_KEY code path (sibling to generate-work-experience-content.ts). Generates
// the per-project AI content in data/content/project-content.json — a terse GitHub-"About"-style
// `tagline` for each project. Never run by `npm run dev`, `npm run build`, or Vercel — invoked
// manually via `npm run generate:project-content` (or `npm run generate:content`, which runs both).
//
// Usage:
//   npm run generate:project-content                    draft unapproved/changed projects (calls Gemini)
//   npm run generate:project-content -- --force         redraft ALL projects, even approved ones
//   npm run generate:project-content -- --force <key>   redraft only the named project
//   npm run generate:project-content -- --seed          seed the file structure (NO API, no tagline)
//
// Approve a draft by setting "approved": true on its entry in project-content.json, then
// re-run: approved + unchanged projects are skipped, so approvals are never lost. Editing a
// project's description changes its sourceHash and forces a re-draft (approved flips false).

import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { projects } from '../data/generated/projects';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ── The committed data contract (data/content/project-content.json) ─────────────────────────
interface ProjectContent {
  projectId: number;
  sourceHash: string;
  approved: boolean;
  tagline?: string;
}
type ProjectContentFile = Record<string, ProjectContent>;

const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env');
const outputPath = path.join(projectRoot, 'data', 'content', 'project-content.json');

// ── Helpers ─────────────────────────────────────────────────────────────────────────────

// Stable, human-readable key from the (stable) project title: "Flight Hub" → "flight-hub".
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// sourceHash mirrors role-content's sourceHashOf, but hashes the project's description.
function sourceHashOf(description: string): string {
  return createHash('sha256').update(description).digest('hex').slice(0, 8);
}

// Load only GEMINI_API_KEY from .env (no dependency; process.env wins if already set).
function loadApiKey(): string | undefined {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (!fs.existsSync(envPath)) return undefined;
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^\s*GEMINI_API_KEY\s*=\s*(.*)\s*$/);
    if (m) return m[1].replace(/^['"]|['"]$/g, '').trim();
  }
  return undefined;
}

function readContentFile(): ProjectContentFile {
  if (!fs.existsSync(outputPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(outputPath, 'utf-8')) as ProjectContentFile;
  } catch {
    console.warn('   Warning: could not parse project-content.json, starting fresh');
    return {};
  }
}

// Ordered, stable serialization (projects in data order → projectId → sourceHash → approved → tagline).
function serialize(file: ProjectContentFile): string {
  const ordered: ProjectContentFile = {};
  for (const project of projects) {
    const key = slugify(project.title);
    if (file[key]) ordered[key] = file[key];
  }
  for (const key of Object.keys(file)) {
    if (!ordered[key]) ordered[key] = file[key];
  }
  const shaped: Record<string, ProjectContent> = {};
  for (const [key, entry] of Object.entries(ordered)) {
    shaped[key] = {
      projectId: entry.projectId,
      sourceHash: entry.sourceHash,
      approved: entry.approved,
      ...(entry.tagline !== undefined ? { tagline: entry.tagline } : {}),
    };
  }
  return JSON.stringify(shaped, null, 2) + '\n';
}

function writeContentFile(file: ProjectContentFile): void {
  fs.writeFileSync(outputPath, serialize(file), 'utf-8');
}

// ── Gemini REST (structured output) ─────────────────────────────────────────────────────

async function callGemini(apiKey: string, description: string): Promise<string | undefined> {
  const guidance =
    'Summarize the software project described below into ONE terse GitHub-"About"-style tagline: ' +
    'a single line, sentence case, no trailing period, ≤ ~60 characters, naming what it fundamentally is. ' +
    'Style targets: "Pomodoro timer fused with notes & to-do lists", "Flight-deal finder + blog, via Amadeus & Twilio", ' +
    '"Real-time, Discord-style group chat on Firebase", "JDBC grocery storefront in Java + MySQL".';

  const body = {
    systemInstruction: {
      parts: [
        {
          text:
            'You write terse, punchy one-line project taglines in the style of a GitHub repository "About" field. ' +
            'One line only, no period, no fluff — name what the thing is.',
        },
      ],
    },
    contents: [{ parts: [{ text: `${guidance}\n\nProject description:\n${description}` }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: { tagline: { type: 'STRING' } },
        required: ['tagline'],
        propertyOrdering: ['tagline'],
      },
    },
  };

  const res = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error(`Gemini returned no text. Response: ${JSON.stringify(json).slice(0, 500)}`);
  }

  const parsed = JSON.parse(text) as { tagline?: string };
  return typeof parsed.tagline === 'string' && parsed.tagline.trim() ? parsed.tagline.trim() : undefined;
}

// ── Seed mode (no API): ensure every project has a locked entry structure ────────────────

function seed(): void {
  const existing = readContentFile();
  const file: ProjectContentFile = { ...existing };

  for (const project of projects) {
    const key = slugify(project.title);
    const entry: ProjectContent = {
      projectId: project.id,
      sourceHash: sourceHashOf(project.description),
      approved: true,
    };
    const prevTagline = existing[key]?.tagline;
    if (prevTagline) {
      entry.tagline = prevTagline;
    }
    file[key] = entry;
    console.log(`   seeded ${key}${entry.tagline ? ' (+ tagline)' : ' (no tagline yet)'}`);
  }

  writeContentFile(file);
  console.log(`\nSeeded ${outputPath} from current committed values (approved: true, no API called).`);
}

// ── Draft mode (calls Gemini) ───────────────────────────────────────────────────────────

async function draft(forceAll: boolean, forceKey: string | undefined): Promise<void> {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('Set GEMINI_API_KEY in .env');
    process.exit(1);
  }

  const file = readContentFile();

  for (const project of projects) {
    const key = slugify(project.title);
    const hash = sourceHashOf(project.description);
    const prev = file[key];
    const forced = forceAll || (forceKey !== undefined && forceKey === key);

    if (!forced && prev?.approved === true && prev.sourceHash === hash) {
      console.log(`   ${key}: skipped (approved)`);
      continue;
    }

    const label = prev ? (prev.sourceHash !== hash ? 'redrafted (description changed)' : 'redrafted') : 'drafted';
    process.stdout.write(`   ${key}: calling Gemini… `);
    const tagline = await callGemini(apiKey, project.description);

    const entry: ProjectContent = {
      projectId: project.id,
      sourceHash: hash,
      approved: false,
    };
    if (tagline) {
      entry.tagline = tagline;
    }
    file[key] = entry;
    console.log(`${label}${tagline ? `: "${tagline}"` : ' (no tagline returned)'}`);
  }

  writeContentFile(file);
  console.log(`\nWrote ${outputPath}. Review drafts, set "approved": true on the good ones, then re-run.`);
}

// ── Entry point ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const seedMode = argv.includes('--seed');
  const forceIdx = argv.indexOf('--force');
  const forceAll = forceIdx !== -1;
  const forceKey =
    forceIdx !== -1 && argv[forceIdx + 1] && !argv[forceIdx + 1].startsWith('--') ? argv[forceIdx + 1] : undefined;

  if (seedMode) {
    console.log('Seeding project-content.json (no API)…');
    seed();
    return;
  }

  console.log(`Generating project content via ${GEMINI_MODEL}…`);
  await draft(forceKey === undefined && forceAll, forceKey);
}

main().catch((err) => {
  console.error('ERROR: project-content generation failed:');
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
