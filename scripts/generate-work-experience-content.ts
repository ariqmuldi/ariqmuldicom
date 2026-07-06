// scripts/generate-role-content.ts
//
// The ONLY code path that reads GEMINI_API_KEY or hits the network. Generates the
// per-role AI content in app/data/role-content.json (2–3 sentence project `description`
// for Work-surfaced roles + a shared `technologies` list for every role). Never run by
// `npm run dev`, `npm run build`, or Vercel — invoked manually via `npm run generate:content`.
//
// Usage:
//   npm run generate:content                    draft unapproved/changed roles (calls Gemini)
//   npm run generate:content -- --force         redraft ALL roles, even approved ones
//   npm run generate:content -- --force <key>   redraft only the named role
//   npm run generate:content -- --seed          fill from current committed values (NO API)
//
// Approve a draft by setting "approved": true on its entry in role-content.json, then
// re-run: approved + unchanged roles are skipped, so approvals are never lost. Editing a
// role's résumé bullets changes its sourceHash and forces a re-draft (approved flips false).

import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { parseResume, type Experience } from './parse-resume';
import { workGroups } from '../app/data/work';
import { experiences as builtExperiences } from '../app/data/experiences';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ── Canonical role list (hand-maintained; see the plan's Section 4 mapping) ─────────────
// Experiences are parsed in .tex order, so experienceId is 1-based position. The
// `expectedTitleIncludes` guard is checked against "<title> <department>" and fails loud
// if a résumé reorder shifts ids out from under a slug.
interface RoleDef {
  contentKey: string;
  experienceId: number;
  expectedTitleIncludes: string;
}

const ROLES: RoleDef[] = [
  { contentKey: 'doubl', experienceId: 1, expectedTitleIncludes: 'DOUBL' },
  { contentKey: 'mds', experienceId: 2, expectedTitleIncludes: 'Work Study' },
  { contentKey: 'makerspace', experienceId: 3, expectedTitleIncludes: 'Makerspace' },
  { contentKey: 'learncoding', experienceId: 4, expectedTitleIncludes: 'LearnCoding' },
  { contentKey: 'teaching-assistant', experienceId: 5, expectedTitleIncludes: 'Teaching Assistant' },
];

// ── The committed data contract (app/data/role-content.json) ────────────────────────────
interface RoleContent {
  experienceId: number;
  sourceHash: string;
  approved: boolean;
  technologies: string[];
  description?: string;
}
type RoleContentFile = Record<string, RoleContent>;

const projectRoot = path.resolve(__dirname, '..');
const latexPath = path.join(projectRoot, 'data', 'master-resume.tex');
const envPath = path.join(projectRoot, '.env');
const outputPath = path.join(projectRoot, 'app', 'data', 'role-content.json');

// ── Helpers ─────────────────────────────────────────────────────────────────────────────

function sourceHashOf(accomplishments: string[]): string {
  return createHash('sha256').update(accomplishments.join('\n')).digest('hex').slice(0, 8);
}

// A role wants a description iff a NON-comingSoon work item carries its contentKey.
// → makerspace / learncoding / mds. DOUBL (comingSoon) and Teaching Assistant (no card) do not.
const describedKeys = new Set(
  workGroups.flatMap((g) => g.workItems).filter((w) => !w.comingSoon && w.contentKey).map((w) => w.contentKey as string)
);
function wantsDescription(contentKey: string): boolean {
  return describedKeys.has(contentKey);
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

function readContentFile(): RoleContentFile {
  if (!fs.existsSync(outputPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(outputPath, 'utf-8')) as RoleContentFile;
  } catch {
    console.warn('   Warning: could not parse role-content.json, starting fresh');
    return {};
  }
}

// Ordered, stable serialization (experienceId → sourceHash → approved → technologies → description).
function serialize(file: RoleContentFile): string {
  const ordered: RoleContentFile = {};
  for (const { contentKey } of ROLES) {
    if (file[contentKey]) ordered[contentKey] = file[contentKey];
  }
  // Preserve any extra keys not in ROLES (defensive).
  for (const key of Object.keys(file)) {
    if (!ordered[key]) ordered[key] = file[key];
  }
  const shaped: Record<string, RoleContent> = {};
  for (const [key, entry] of Object.entries(ordered)) {
    shaped[key] = {
      experienceId: entry.experienceId,
      sourceHash: entry.sourceHash,
      approved: entry.approved,
      technologies: entry.technologies,
      ...(entry.description !== undefined ? { description: entry.description } : {}),
    };
  }
  return JSON.stringify(shaped, null, 2) + '\n';
}

function writeContentFile(file: RoleContentFile): void {
  fs.writeFileSync(outputPath, serialize(file), 'utf-8');
}

// Look up an experience by id, enforcing the reorder guard.
function experienceForRole(experiences: Experience[], role: RoleDef): Experience {
  const exp = experiences.find((e) => e.id === role.experienceId);
  if (!exp) {
    throw new Error(`No experience with id ${role.experienceId} for role "${role.contentKey}". Résumé changed — update ROLES in generate-role-content.ts.`);
  }
  // Guard against a résumé reorder shifting ids under a slug. Includes company so a role can
  // be pinned by employer (e.g. "DOUBL") — resilient to seniority/title changes like Junior→Lead.
  const haystack = `${exp.title} ${exp.department} ${exp.company}`;
  if (!haystack.includes(role.expectedTitleIncludes)) {
    throw new Error(
      `Guard failed for "${role.contentKey}": experience id ${role.experienceId} is "${exp.title}" (dept "${exp.department}", company "${exp.company}"), expected to include "${role.expectedTitleIncludes}". ` +
        `Résumé was likely reordered — fix the experienceId/expectedTitleIncludes mapping in ROLES.`
    );
  }
  return exp;
}

// ── Gemini REST (structured output) ─────────────────────────────────────────────────────

interface GeminiResult {
  technologies: string[];
  description?: string;
}

async function callGemini(apiKey: string, accomplishments: string[], withDescription: boolean): Promise<GeminiResult> {
  const properties: Record<string, unknown> = {
    technologies: { type: 'ARRAY', items: { type: 'STRING' } },
  };
  let propertyOrdering = ['technologies'];
  if (withDescription) {
    properties.description = { type: 'STRING' };
    propertyOrdering = ['description', 'technologies'];
  }

  const techInstruction =
    'List the concrete technologies used, in conventional display form (e.g. "React Router v7", "IoT (ESP32)"), deduped, cap ~10, no prose in the tech array.';

  const guidance = withDescription
    ? 'Write a 2–3 sentence third-person summary of this ENTIRE role for a portfolio case-study card. ' +
      'Read ALL the bullets below and synthesize them into one cohesive overview of the role as a whole: ' +
      'what the project/system fundamentally is, the full breadth of what was built across the role (not just the first few bullets), ' +
      'and the overall scale or impact. Write at a higher altitude than any individual bullet — capture the essence of everything done, ' +
      'do NOT stitch together or paraphrase the opening bullets and ignore the rest. Every bullet should be reflected in the gestalt, ' +
      'even if no single achievement is named. Then ' +
      techInstruction
    : techInstruction;

  const body = {
    systemInstruction: {
      parts: [
        {
          text:
            'You write concise, high-altitude third-person summaries of software engineering roles for a portfolio. ' +
            'Your summaries synthesize the WHOLE of a person\'s work across all their résumé bullets into a cohesive overview of what they built and its impact — ' +
            'you never simply paraphrase or restate the first few bullets.',
        },
      ],
    },
    contents: [{ parts: [{ text: `${guidance}\n\nRésumé bullets:\n${accomplishments.join('\n')}` }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties,
        required: ['technologies'],
        propertyOrdering,
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

  const parsed = JSON.parse(text) as GeminiResult;
  const technologies = Array.isArray(parsed.technologies) ? parsed.technologies.filter((t) => typeof t === 'string' && t.trim()) : [];
  const result: GeminiResult = { technologies };
  if (withDescription && typeof parsed.description === 'string' && parsed.description.trim()) {
    result.description = parsed.description.trim();
  }
  return result;
}

// ── Seed mode (no API): populate from current committed values ──────────────────────────

function seed(experiences: Experience[]): void {
  const existing = readContentFile();
  const workByKey = new Map(
    workGroups.flatMap((g) => g.workItems).filter((w) => w.contentKey).map((w) => [w.contentKey as string, w])
  );

  const file: RoleContentFile = { ...existing };

  for (const role of ROLES) {
    const exp = experienceForRole(experiences, role);
    const hash = sourceHashOf(exp.accomplishments);
    const wants = wantsDescription(role.contentKey);
    const workItem = workByKey.get(role.contentKey);

    // technologies: inline work tech for described roles; keyword tech (experiences.ts) otherwise.
    let technologies: string[];
    if (wants && workItem && workItem.technologies.length > 0) {
      technologies = workItem.technologies;
    } else {
      const built = builtExperiences.find((e) => e.id === role.experienceId);
      technologies = built?.technologies ?? exp.technologies;
    }

    const entry: RoleContent = {
      experienceId: role.experienceId,
      sourceHash: hash,
      approved: true,
      technologies,
    };
    if (wants && workItem?.description) {
      entry.description = workItem.description;
    }
    file[role.contentKey] = entry;
    console.log(`   seeded ${role.contentKey} (${technologies.length} tech${entry.description ? ' + description' : ''})`);
  }

  writeContentFile(file);
  console.log(`\nSeeded ${outputPath} from current committed values (approved: true, no API called).`);
}

// ── Draft mode (calls Gemini) ───────────────────────────────────────────────────────────

async function draft(experiences: Experience[], forceAll: boolean, forceKey: string | undefined): Promise<void> {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('Set GEMINI_API_KEY in .env');
    process.exit(1);
  }

  const file = readContentFile();

  for (const role of ROLES) {
    const exp = experienceForRole(experiences, role);
    const hash = sourceHashOf(exp.accomplishments);
    const wants = wantsDescription(role.contentKey);
    const prev = file[role.contentKey];
    const forced = forceAll || (forceKey !== undefined && forceKey === role.contentKey);

    // Skip approved + unchanged roles unless forced.
    if (!forced && prev?.approved === true && prev.sourceHash === hash) {
      console.log(`   ${role.contentKey}: skipped (approved)`);
      continue;
    }

    const label = prev ? (prev.sourceHash !== hash ? 'redrafted (résumé changed)' : 'redrafted') : 'drafted';
    process.stdout.write(`   ${role.contentKey}: calling Gemini… `);
    const ai = await callGemini(apiKey, exp.accomplishments, wants);

    const entry: RoleContent = {
      experienceId: role.experienceId,
      sourceHash: hash,
      approved: false,
      technologies: ai.technologies,
    };
    if (wants && ai.description) {
      entry.description = ai.description;
    }
    file[role.contentKey] = entry;
    console.log(`${label} (${ai.technologies.length} tech${entry.description ? ' + description' : ''})`);
  }

  writeContentFile(file);
  console.log(`\nWrote ${outputPath}. Review drafts, set "approved": true on the good ones, then re-run.`);
}

// ── Entry point ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!fs.existsSync(latexPath)) {
    throw new Error(`LaTeX file not found at: ${latexPath}`);
  }
  const experiences = parseResume(fs.readFileSync(latexPath, 'utf-8'));

  const argv = process.argv.slice(2);
  const seedMode = argv.includes('--seed');
  const forceIdx = argv.indexOf('--force');
  const forceAll = forceIdx !== -1;
  // --force may be followed by an optional contentKey (a non-flag token).
  const forceKey =
    forceIdx !== -1 && argv[forceIdx + 1] && !argv[forceIdx + 1].startsWith('--') ? argv[forceIdx + 1] : undefined;

  if (seedMode) {
    console.log('Seeding role-content.json (no API)…');
    seed(experiences);
    return;
  }

  console.log(`Generating role content via ${GEMINI_MODEL}…`);
  await draft(experiences, forceKey === undefined && forceAll, forceKey);
}

main().catch((err) => {
  console.error('ERROR: role-content generation failed:');
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
