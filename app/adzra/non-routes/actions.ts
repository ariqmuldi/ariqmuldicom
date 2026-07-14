'use server';

import { answerMatches, grantSession, clearSession } from './lib/adzra-auth';

export interface CheckResult {
	ok: boolean;
	/** false only for the initial state, before any attempt — lets the UI distinguish
	 * "not tried yet" from "tried and wrong". */
	submitted: boolean;
	/** The validated answer, echoed back so the celebration step can re-submit it to grant the
	 * session. Empty on a wrong answer. */
	answer: string;
}

// Phase 1 — validate only (no cookie yet). Runs entirely on the server: the answer is never
// checked in the browser, and nothing is unlocked here. On success we echo the answer so the
// celebration step can hand it to `enterCollection`.
export async function checkAnswer(_prev: CheckResult, formData: FormData): Promise<CheckResult> {
	const input = String(formData.get('answer') ?? '');
	if (!answerMatches(input)) return { ok: false, submitted: true, answer: '' };
	return { ok: true, submitted: true, answer: input };
}

// Phase 2 — re-validate and grant the signed session cookie. Re-checking here (rather than
// trusting the client) keeps the grant secure: the cookie is only ever set for a correct answer.
// After this resolves the route refreshes and the server renders the collection.
export async function enterCollection(formData: FormData): Promise<void> {
	const input = String(formData.get('answer') ?? '');
	if (answerMatches(input)) await grantSession();
}

// Lock the collection again — clears the session cookie so the next visit must answer the question.
export async function lockCollection(): Promise<void> {
	await clearSession();
}
