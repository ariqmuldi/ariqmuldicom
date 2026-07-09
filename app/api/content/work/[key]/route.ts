import { NextResponse } from 'next/server';
import { requireEditable } from '@/app/lib/content-guard';
import { PATHS, readJson, serializeWork, writeText, type RoleContent } from '@/app/lib/content-files';

// Direct field edits & approve on one role — writes work-experience-content.json without calling
// Gemini. Body: { commitSubject?, technologies?: string[], description?, approved?: boolean }.
// Approving does NOT change sourceHash.
export async function PATCH(req: Request, ctx: { params: Promise<{ key: string }> }) {
	const denied = await requireEditable();
	if (denied) return denied;

	const { key } = await ctx.params;
	const patch = await req.json().catch(() => ({}));
	const file = await readJson<Record<string, RoleContent>>(PATHS.work, {});
	if (!file[key]) return NextResponse.json({ ok: false, error: 'unknown key' }, { status: 404 });

	const allowed: (keyof RoleContent)[] = ['commitSubject', 'technologies', 'description', 'approved'];
	for (const field of allowed) {
		if (patch[field] !== undefined) (file[key] as unknown as Record<string, unknown>)[field] = patch[field];
	}
	await writeText(PATHS.work, serializeWork(file));
	return NextResponse.json({ ok: true });
}
