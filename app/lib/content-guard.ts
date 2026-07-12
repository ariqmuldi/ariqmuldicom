// Guard used by every mutating /api/content route: refuses in production AND without a valid
// session cookie (belt and braces). Returns a NextResponse to short-circuit, or null to proceed.
import { NextResponse } from 'next/server';
import { isAuthed } from '@/app/lib/content-auth';
import { isProduction } from '@/app/lib/content-env';

export async function requireEditable(): Promise<NextResponse | null> {
	if (isProduction()) {
		return NextResponse.json({ ok: false, error: 'editing disabled in production' }, { status: 403 });
	}
	if (!(await isAuthed())) {
		return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
	}
	return null; // ok to proceed
}
