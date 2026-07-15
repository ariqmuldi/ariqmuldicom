'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { lockCollection } from '../actions';
import styles from '../adzra.module.css';

// A small floating button that locks the collection back up: it clears the session cookie on the
// server, then refreshes so the route re-gates to the lock screen. Next time, the answer is
// required again.
export default function ExitButton() {
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	const lock = () =>
		startTransition(async () => {
			await lockCollection();
			router.refresh();
		});

	return (
		<button
			type="button"
			className={styles.exitBtn}
			onClick={lock}
			disabled={pending}
			aria-label="lock the collection"
		>
			lock 🔒
		</button>
	);
}
