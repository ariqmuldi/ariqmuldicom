// Shared filesystem helpers for the /api/content routes: absolute paths to the real repo files
// the editor reads/writes, the sourceHash contract (mirrors the generate scripts), a stable JSON
// serializer that keeps git diffs clean, and a child-process runner for the npm scripts.
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import { CONTENT_DIR, CONTENT_FILES } from '@/app/lib/content-file-names';

const root = process.cwd();
export const p = (...s: string[]) => path.join(root, ...s);

// All content data + résumé source now live together under app/data (CONTENT_DIR).
const dir = CONTENT_DIR.split('/');
export const PATHS = {
	tex: p(...dir, CONTENT_FILES.masterResume),
	config: p(...dir, CONTENT_FILES.resumeConfig),
	work: p(...dir, CONTENT_FILES.workContent),
	project: p(...dir, CONTENT_FILES.projectContent),
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
