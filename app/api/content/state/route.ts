import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { experiences } from '@/data/generated/experiences';
import { projects } from '@/data/generated/projects';
import {
	PATHS,
	readJson,
	sourceHash,
	type ProjectContent,
	type RoleContent,
} from '@/app/lib/content-files';

// Public: hydrate the editor. Returns the raw .tex, both AI JSON files, and the visibility config.
// We also stamp a transient `sourceChanged` on each AI entry (comparing its stored sourceHash to a
// freshly-computed hash of the current parsed data) so the UI can flag entries that were approved
// before their résumé source changed. `sourceChanged` is derived — it is NOT written to disk.
export const dynamic = 'force-dynamic';

export async function GET() {
	const [tex, work, project, config] = await Promise.all([
		readFile(PATHS.tex, 'utf8').catch(() => ''),
		readJson<Record<string, RoleContent>>(PATHS.work, {}),
		readJson<Record<string, ProjectContent>>(PATHS.project, {}),
		readJson<Record<string, unknown>>(PATHS.config, {}),
	]);

	const accById = new Map(experiences.map((e) => [e.id, e.accomplishments]));
	const descById = new Map(projects.map((p) => [p.id, p.description]));

	for (const entry of Object.values(work)) {
		const acc = accById.get(entry.experienceId) ?? [];
		(entry as RoleContent & { sourceChanged?: boolean }).sourceChanged =
			acc.length > 0 && sourceHash(acc.join('\n')) !== entry.sourceHash;
	}
	for (const entry of Object.values(project)) {
		const desc = descById.get(entry.projectId) ?? '';
		(entry as ProjectContent & { sourceChanged?: boolean }).sourceChanged =
			desc.length > 0 && sourceHash(desc) !== entry.sourceHash;
	}

	return NextResponse.json({ tex, work, project, config });
}
