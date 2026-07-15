'use client';

import { useState } from 'react';
import styles from '../adzra.module.css';

// A brown/kraft envelope you tap to open; it reveals the note on cream stationery paper. The letter
// body is passed in (from the entry), with paragraphs separated by blank lines.
export default function LetterCard({ letter }: { letter: string }) {
	const [open, setOpen] = useState(false);
	const paragraphs = letter.split(/\n\n+/);

	if (!open) {
		return (
			<button
				type="button"
				className={styles.envelope}
				onClick={() => setOpen(true)}
				aria-label="open the letter"
			>
				<span className={styles.envFlap} aria-hidden />
				<span className={styles.envSeal} aria-hidden>
					🤍
				</span>
				<span className={styles.envHint}>tap to open 🤍</span>
			</button>
		);
	}

	return (
		<div className={styles.letterPaper}>
			{paragraphs.map((para, i) => (
				<p key={i}>{para}</p>
			))}
			<button type="button" className={styles.letterFold} onClick={() => setOpen(false)}>
				fold the letter back ↑
			</button>
		</div>
	);
}
