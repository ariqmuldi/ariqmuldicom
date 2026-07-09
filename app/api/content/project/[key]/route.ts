import { NextResponse } from 'next/server';
import { requireEditable } from '@/app/lib/content-guard';
import { PATHS, readJson, serializeProject, writeText, type ProjectContent } from '@/app/lib/content-files';

// Direct field edits & approve on one project — writes project-content.json without calling Gemini.
// Body: { tagline?, approved?: boolean }. Approving does NOT change sourceHash.
export async function PATCH(req: Request, ctx: { params: Promise<{ key: string }> }) {
	const denied = await requireEditable();
	if (denied) return denied;

	const { key } = await ctx.params;
	const patch = await req.json().catch(() => ({}));
	const file = await readJson<Record<string, ProjectContent>>(PATHS.project, {});
	if (!file[key]) return NextResponse.json({ ok: false, error: 'unknown key' }, { status: 404 });

	const allowed: (keyof ProjectContent)[] = ['tagline', 'approved'];
	for (const field of allowed) {
		if (patch[field] !== undefined) (file[key] as unknown as Record<string, unknown>)[field] = patch[field];
	}
	await writeText(PATHS.project, serializeProject(file));
	return NextResponse.json({ ok: true });
}
