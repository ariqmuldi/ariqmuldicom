'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';
import styles from '../adzra.module.css';
import ExitButton from './ExitButton';

export interface CollectionCard {
	slug: string;
	no: number;
	plateTitle: string;
	tapHint: string;
	cover: StaticImageData;
	ringColor: string;
	objectPosition?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

// The collection browser (shown once authenticated). A horizontal scroll-snap "press" of arched
// plates, with two ways to move around beyond one-by-one paging: the ‹ / › nav and a thumbnail
// jump rail that scrolls directly to any entry. The active index is derived from scroll position.
export default function Collection({ cards }: { cards: CollectionCard[] }) {
	const pressRef = useRef<HTMLDivElement>(null);
	const [idx, setIdx] = useState(0);
	const total = cards.length;

	const onScroll = () => {
		const el = pressRef.current;
		if (!el) return;
		const i = Math.round(el.scrollLeft / el.clientWidth);
		if (i !== idx) setIdx(i);
	};
	const flip = (dir: number) => {
		const el = pressRef.current;
		if (!el) return;
		el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
	};
	const jump = (i: number) => {
		const el = pressRef.current;
		if (!el) return;
		el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
	};

	return (
		<main className={`${styles.screen} ${styles.collectionScreen}`}>
			<div className={styles.collectionPanel}>
				<div className={styles.spine} aria-hidden>
					<span className={styles.stitch} />
					<span className={styles.stitch} />
					<span className={styles.stitch} />
					<span className={styles.stitch} />
				</div>

				<div className={styles.collectionHeader}>
					<div className={styles.collectionEyebrow}>a growing collection</div>
					<h1 className={styles.collectionTitle}>The Sayang Collection</h1>
				</div>

				<div
					ref={pressRef}
					onScroll={onScroll}
					className={`${styles.press} ${styles.noScrollbar}`}
				>
					{cards.map((c, i) => (
						<div key={c.slug} className={styles.slide}>
							<Link
								href={`/adzra/${c.slug}`}
								className={styles.plate}
								style={{ ['--ring' as string]: c.ringColor }}
							>
								<Image
									src={c.cover}
									alt=""
									fill
									placeholder="blur"
									priority={i === 0}
									sizes="(max-width: 480px) 100vw, 440px"
									className={styles.plateImg}
									style={{ objectPosition: c.objectPosition ?? 'center' }}
								/>
								<div className={styles.plateScrim} />
								<div className={styles.plateNo}>no. {pad(c.no)}</div>
								<div className={styles.plateFoot}>
									<div
										className={`${styles.plateTitle} ${
											c.plateTitle.length > 14 ? styles.plateTitleSm : ''
										}`}
									>
										{c.plateTitle}
									</div>
									<div className={styles.plateDate}>{c.slug}</div>
									<div className={styles.plateTap}>{c.tapHint}</div>
								</div>
							</Link>
						</div>
					))}
				</div>

				<div className={styles.navRow}>
					<button
						type="button"
						className={styles.roundBtn}
						onClick={() => flip(-1)}
						aria-label="previous memory"
					>
						‹
					</button>
					<span className={styles.navLabel}>
						no. {pad(idx + 1)} / {pad(total)}
					</span>
					<button
						type="button"
						className={styles.roundBtn}
						onClick={() => flip(1)}
						aria-label="next memory"
					>
						›
					</button>
				</div>

				<div className={styles.thumbRail}>
					{cards.map((c, i) => (
						<button
							key={c.slug}
							type="button"
							onClick={() => jump(i)}
							className={`${styles.thumb} ${i === idx ? styles.thumbActive : ''}`}
							aria-label={`jump to ${c.plateTitle}`}
							aria-current={i === idx}
						>
							<Image
								src={c.cover}
								alt=""
								width={44}
								height={44}
								style={{ objectPosition: c.objectPosition ?? 'center' }}
							/>
						</button>
					))}
				</div>
			</div>

			<div className={styles.collectionCaption}>
				tap a thumbnail to jump anywhere
			</div>

			<ExitButton />
		</main>
	);
}
