// Password → signed httpOnly cookie auth for the /content-generation editor.
//
// No DB, no user table: one password (CONTENT_GENERATION_PASSWORD), checked server-side with a
// timing-safe compare; on success (and only on localhost — see content-env) we set an HMAC-signed,
// httpOnly session cookie that the mutating routes verify. The password never reaches the browser.
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE = 'cg_session';
const MAX_AGE = 60 * 60 * 8; // 8h

function sign(payload: string): string {
	const secret = process.env.CONTENT_GENERATION_SESSION_SECRET ?? '';
	const mac = createHmac('sha256', secret).update(payload).digest('hex');
	return `${payload}.${mac}`;
}

export function makeSessionToken(): string {
	return sign(`cg.${Date.now() + MAX_AGE * 1000}`); // value.expiry
}

export function verifySessionToken(token: string | undefined): boolean {
	if (!token) return false;
	const dot = token.lastIndexOf('.');
	if (dot < 0) return false;
	const payload = token.slice(0, dot);
	const a = Buffer.from(token);
	const b = Buffer.from(sign(payload));
	if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
	const expiry = Number(payload.split('.')[1]);
	return Number.isFinite(expiry) && Date.now() < expiry;
}

export function passwordMatches(input: string): boolean {
	const real = process.env.CONTENT_GENERATION_PASSWORD ?? '';
	// An empty configured password can never be matched (avoids "" unlocking an unconfigured box).
	if (real.length === 0) return false;
	const a = Buffer.from(input);
	const b = Buffer.from(real);
	return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAuthed(): Promise<boolean> {
	const jar = await cookies();
	return verifySessionToken(jar.get(COOKIE)?.value);
}

export const SESSION_COOKIE = COOKIE;
export const SESSION_MAX_AGE = MAX_AGE;
