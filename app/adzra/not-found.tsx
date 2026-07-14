import Link from 'next/link';
import styles from './non-routes/adzra.module.css';

// Soft, in-theme fallback for a memory that isn't in the collection (yet) — a "not pressed" page
// instead of a bare 404, so the keepsake never breaks character.
export default function NotPressedYet() {
	return (
		<main className={`${styles.screen} ${styles.fallback}`}>
			<div className={styles.fallbackEmoji} aria-hidden>
				🌱
			</div>
			<p className={styles.fallbackText}>this one isn&rsquo;t pressed yet 🤍</p>
			<Link href="/adzra" className={styles.backLink}>
				‹ back to the collection
			</Link>
		</main>
	);
}
