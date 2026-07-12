import { NextResponse } from 'next/server';
import { requireEditable } from '@/app/lib/content-guard';
import { PATHS, writeText } from '@/app/lib/content-files';

// Save the raw .tex. Does NOT parse — the client calls /parse afterward.
export async function PUT(req: Request) {
	const denied = await requireEditable();
	if (denied) return denied;

	const body = await req.json().catch(() => ({}));
	if (typeof body.tex !== 'string') {
		return NextResponse.json({ ok: false, error: 'missing tex' }, { status: 400 });
	}
	await writeText(PATHS.tex, body.tex);
	return NextResponse.json({ ok: true });
}
