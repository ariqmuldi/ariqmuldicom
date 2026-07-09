import { NextResponse } from 'next/server';
import { isAuthed } from '@/app/lib/content-auth';
import { isProduction } from '@/app/lib/content-env';

// Public: lets the client render locked/unlocked and phrase the unlock messaging correctly.
// Never returns the password.
export async function GET() {
	return NextResponse.json({ authed: await isAuthed(), production: isProduction() });
}
