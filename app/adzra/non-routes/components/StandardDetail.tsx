import type { Entry } from '../data/entries';
import DetailTopBar from './DetailTopBar';
import Carousel from './Carousel';
import styles from '../adzra.module.css';

// The "standard" memory layout: photo carousel → a little note → the main thing (a chat message,
// or a soft placeholder for a memory not yet lived). Shared by the monthly entries that follow the
// same shape; a month that wants a different design just renders its own page instead of this.
export default function StandardDetail({ entry }: { entry: Entry }) {
	return (
		<main className={`${styles.screen} ${styles.detailScreen}`}>
			<div className={styles.detailWrap}>
				<DetailTopBar no={entry.no} />
				<Carousel
					photos={entry.photos}
					extraSlots={entry.extraPhotoSlots}
					title={entry.detailTitle}
					objectPosition={entry.objectPosition}
				/>
				<div className={styles.detailBody}>
					<div className={styles.detailEyebrow}>{entry.dateEyebrow}</div>
					<h1 className={styles.detailTitle}>{entry.detailTitle}</h1>

					{entry.noteBlurb && (
						<div className={styles.noteCard}>
							<div className={styles.noteHeading}>a little note</div>
							<p className={styles.noteBody}>{entry.noteBlurb}</p>
							{entry.cameWithFlowers && (
								<div className={styles.flowersPill}>🌷 came with flowers</div>
							)}
						</div>
					)}

					{entry.mainEyebrow && <div className={styles.mainEyebrow}>{entry.mainEyebrow}</div>}

					{entry.mainType === 'message' && entry.message && (
						<div className={styles.chat}>
							<div className={styles.chatDate}>{entry.message.dateChip}</div>
							{entry.message.bubbles.map((b, i) => (
								<div key={i} className={styles.bubbleRow}>
									<div className={`${styles.bubble} ${i === 0 ? styles.bubbleFirst : ''}`}>
										{b.text}
										<span className={styles.bubbleMeta}>{b.time} ✓✓</span>
									</div>
								</div>
							))}
						</div>
					)}

					{entry.mainType === 'placeholder' && (
						<div className={styles.placeholderBox}>
							<div className={styles.placeholderEmoji} aria-hidden>
								🌷
							</div>
							<p className={styles.placeholderText}>to be written &amp; pressed 🤍</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
