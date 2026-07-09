import { NextResponse } from 'next/server';
import {
	makeSessionToken,
	passwordMatches,
	SESSION_COOKIE,
	SESSION_MAX_AGE,
} from '@/app/lib/content-auth';
import { isProduction } from '@/app/lib/content-env';

// POST = unlock (the three cases); DELETE = lock/logout.
export async function POST(req: Request) {
	const { password } = await req.json().catch(() => ({ password: '' }));

	// Production check runs FIRST — the deployed site can never unlock, and by short-circuiting
	// before the password comparison we never confirm password correctness on the public URL.
	// This also means prod needs NO env vars: any unlock attempt (right or wrong) gets this message.
	if (isProduction()) {
		return NextResponse.json(
			{
				ok: false,
				code: 'production',
				error: 'content editing is disabled in production — run the site locally (localhost) to unlock',
			},
			{ status: 403 }
		);
	}
	// Wrong password (localhost) → 401.
	if (!passwordMatches(String(password ?? ''))) {
		return NextResponse.json(
			{ ok: false, error: 'incorrect password — editing stays disabled' },
			{ status: 401 }
		);
	}
	// Correct password on localhost → set the signed session cookie.
	const res = NextResponse.json({ ok: true });
	res.cookies.set(SESSION_COOKIE, makeSessionToken(), {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: SESSION_MAX_AGE,
	});
	return res;
}

export async function DELETE() {
	const res = NextResponse.json({ ok: true });
	res.cookies.delete(SESSION_COOKIE);
	return res;
}
