// Server-side gate for The Sayang Collection.
//
// The whole /adzra route is private: no memory content (photos, notes, messages) may reach the
// browser until the visitor answers the secret question. That check happens HERE, on the server —
// the client never sees the secret, and unauthenticated requests to the collection or any detail
// route are turned away before any content is rendered.
//
// The secret is compared case-insensitively and trimmed. On success we set an HMAC-signed,
// httpOnly session cookie that every gated page verifies.
//
// Env vars (REQUIRED, server-only — never NEXT_PUBLIC_):
//   SUPER_SECRET_PASSWORD         — the answer to "what do I call you?". If unset, nothing can
//                                   unlock the route (an empty secret never matches).
//   SUPER_SECRET_SESSION_SECRET   — key used to sign the session cookie. Falls back to
//                                   SUPER_SECRET_PASSWORD when unset, so the signing key is still
//                                   secret without a second variable.
// Set these in `.env` locally and in your host's environment for production. They are never
// committed and never sent to the browser.
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE = 'adzra_session';
const MAX_AGE = 60 * 60 * 24 * 60; // 60 days — she may come back to it

function answer(): string {
	return process.env.SUPER_SECRET_PASSWORD ?? '';
}

function secret(): string {
	return process.env.SUPER_SECRET_SESSION_SECRET ?? process.env.SUPER_SECRET_PASSWORD ?? '';
}

// "what do I call you?" is a name, not a case-sensitive passphrase — trim + lowercase both sides.
function normalize(input: string): string {
	return input.trim().toLowerCase();
}

function sign(payload: string): string {
	const mac = createHmac('sha256', secret()).update(payload).digest('hex');
	return `${payload}.${mac}`;
}

function makeToken(): string {
	return sign(`adzra.${Date.now() + MAX_AGE * 1000}`); // value.expiry
}

function verifyToken(token: string | undefined): boolean {
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

/** True when the submitted answer matches (case-insensitive, trimmed). An unset secret never
 * matches, so the route stays locked until SUPER_SECRET_PASSWORD is configured. */
export function answerMatches(input: string): boolean {
	const real = answer();
	if (real.length === 0) return false;
	const a = Buffer.from(normalize(input));
	const b = Buffer.from(normalize(real));
	return a.length === b.length && timingSafeEqual(a, b);
}

/** Sets the signed session cookie. Call only after answerMatches() succeeds. */
export async function grantSession(): Promise<void> {
	const jar = await cookies();
	jar.set(COOKIE, makeToken(), {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/adzra',
		maxAge: MAX_AGE,
	});
}

/** Clears the session cookie — locks the collection so the next visit must answer again. */
export async function clearSession(): Promise<void> {
	const jar = await cookies();
	jar.set(COOKIE, '', {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/adzra',
		maxAge: 0,
	});
}

/** True when the current request carries a valid, unexpired session cookie. */
export async function isUnlocked(): Promise<boolean> {
	const jar = await cookies();
	return verifyToken(jar.get(COOKIE)?.value);
}
