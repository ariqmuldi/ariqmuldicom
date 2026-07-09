// Shared filesystem helpers for the /api/content routes: absolute paths to the real repo files
// the editor reads/writes, the sourceHash contract (mirrors the generate scripts), a stable JSON
// serializer that keeps git diffs clean, and a child-process runner for the npm scripts.
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import { CONTENT_PATHS, CONTENT_DIR } from '@/app/lib/content-file-names';

// Compile-time guard: the literal 'data' in underData() below must stay in sync with CONTENT_DIR.
// If CONTENT_DIR ever changes, this assignment fails to typecheck (CONTENT_DIR has the literal type
// of its value), flagging that the literal needs updating too.
const _contentDirIsData: 'data' = CONTENT_DIR;
void _contentDirIsData;

// Build an absolute path from a repo-relative CONTENT_PATHS entry (e.g. "data/source/résumé.tex").
// Next's file tracer scopes tracing to the longest STATIC path prefix, so process.cwd() and the
// literal 'data' must sit in the SAME path.join call — that keeps tracing inside data/ instead of
// walking the whole project (the "Encountered unexpected file in NFT list" build warning). A base
// stored in a variable, or an imported const the tracer can't fold, defeats this. The leading
// CONTENT_DIR segment is dropped (it's the literal 'data' here) and the rest resolved under it.
const underData = (repoRelative: string) =>
	path.join(process.cwd(), 'data', ...repoRelative.split('/').slice(1));

export const PATHS = {
	tex: underData(CONTENT_PATHS.masterResume),
	config: underData(CONTENT_PATHS.resumeConfig),
	work: underData(CONTENT_PATHS.workContent),
	project: underData(CONTENT_PATHS.projectContent),
};

// ── Content file shapes (mirror the generate scripts' output) ────────────────────────────
export interface RoleContent {
	experienceId: number;
	sourceHash: string;
	approved: boolean;
	commitSubject?: string;
	technologies: string[];
	description?: string;
}
export interface ProjectContent {
	projectId: number;
	sourceHash: string;
	approved: boolean;
	tagline?: string;
}

// sourceHash = first 8 hex of sha256(source). Work hashes accomplishments.join('\n'); projects
// hash the description. Identical to sourceHashOf() in both generate scripts — do not diverge.
export function sourceHash(source: string): string {
	return createHash('sha256').update(source).digest('hex').slice(0, 8);
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
	try {
		return JSON.parse(await readFile(file, 'utf8')) as T;
	} catch {
		return fallback;
	}
}

// Stable field order matching the generators, so a UI edit produces the same diff a CLI run would.
export function serializeWork(file: Record<string, RoleContent>): string {
	const shaped: Record<string, RoleContent> = {};
	for (const [key, e] of Object.entries(file)) {
		shaped[key] = {
			experienceId: e.experienceId,
			sourceHash: e.sourceHash,
			approved: e.approved,
			...(e.commitSubject !== undefined ? { commitSubject: e.commitSubject } : {}),
			technologies: e.technologies,
			...(e.description !== undefined ? { description: e.description } : {}),
		};
	}
	return JSON.stringify(shaped, null, 2) + '\n';
}

export function serializeProject(file: Record<string, ProjectContent>): string {
	const shaped: Record<string, ProjectContent> = {};
	for (const [key, e] of Object.entries(file)) {
		shaped[key] = {
			projectId: e.projectId,
			sourceHash: e.sourceHash,
			approved: e.approved,
			...(e.tagline !== undefined ? { tagline: e.tagline } : {}),
		};
	}
	return JSON.stringify(shaped, null, 2) + '\n';
}

export async function writeText(file: string, contents: string): Promise<void> {
	await writeFile(file, contents, 'utf8');
}
