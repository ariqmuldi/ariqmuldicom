'use client';

import { useActionState, useEffect, useState } from 'react';
import { checkAnswer, enterCollection, type CheckResult } from '../actions';
import styles from '../adzra.module.css';

const INITIAL: CheckResult = { ok: false, submitted: false, answer: '' };

// The lock gate for /adzra. Two server-validated phases, mirroring the design:
//  1. Ask the secret question. `checkAnswer` validates on the server (the answer never leaves in
//     the browser's hands, nothing is unlocked yet) and echoes it back on success.
//  2. Show the "it's you, sayang" bloom, then "open the collection →" submits the validated answer
//     to `enterCollection`, which re-checks and grants the signed session cookie. The route then
//     refreshes and the server renders the collection.
export default function Lock() {
	const [state, formAction, pending] = useActionState(checkAnswer, INITIAL);
	// Hide the "not quite" hint the moment she starts editing again (matches the prototype).
	const [edited, setEdited] = useState(false);
	useEffect(() => setEdited(false), [state]);

	const showWrong = state.submitted && !state.ok && !edited && !pending;

	return (
		<main className={`${styles.screen} ${styles.lockScreen}`}>
			<div className={styles.lockPanel}>
				<div className={styles.archOuter} />
				<div className={styles.archInner} />
				<span className={styles.butterfly} aria-hidden>
					🦋
				</span>
				<span className={styles.petal} aria-hidden>
					🌸
				</span>

				<div className={styles.lockInner}>
					{state.ok ? (
						<>
							<div className={styles.lotusBloom} aria-hidden>
								🪷
							</div>
							<h1 className={`${styles.lockTitle} ${styles.lockTitleUnlocked}`}>
								it&rsquo;s you, sayang
							</h1>
							<p className={styles.lockSub}>the collection is open</p>
							<form action={enterCollection}>
								<input type="hidden" name="answer" value={state.answer} />
								<button type="submit" className={styles.openBtn}>
									open the collection →
								</button>
							</form>
						</>
					) : (
						<>
							<div className={styles.eyebrow}>for adzra</div>
							<div className={styles.lotus} aria-hidden>
								🪷
							</div>
							<h1 className={styles.lockTitle}>what do I call you?</h1>
							<p className={styles.lockSub}>only she knows the answer</p>
							<form action={formAction} className={styles.lockForm}>
								<input
									name="answer"
									type="text"
									autoComplete="off"
									autoFocus
									placeholder="answer…"
									className={styles.lockInput}
									onChange={() => setEdited(true)}
									aria-label="what do I call you?"
								/>
								<button type="submit" className={styles.enterBtn} disabled={pending}>
									enter →
								</button>
							</form>
							{showWrong && (
								<div className={styles.wrong}>not quite — try once more 🌱</div>
							)}
						</>
					)}
				</div>
			</div>
		</main>
	);
}
