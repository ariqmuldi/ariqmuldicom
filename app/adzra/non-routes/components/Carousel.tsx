'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import styles from '../adzra.module.css';

// Horizontal scroll-snap photo carousel for the detail pages. The first slide is the cover; any
// `extraSlots` render as diagonal-hatch "+ another photo" placeholders. ‹ / › scroll one image
// width; touch swipe works via scroll-snap.
export default function Carousel({
	photos,
	extraSlots = 0,
	title,
	objectPosition = 'center',
}: {
	photos: StaticImageData[];
	extraSlots?: number;
	title: string;
	objectPosition?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const flip = (dir: number) => {
		const el = ref.current;
		if (!el) return;
		el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
	};

	return (
		<div className={styles.carousel}>
			<div ref={ref} className={`${styles.carouselTrack} ${styles.noScrollbar}`}>
				{photos.map((p, i) => (
					<div key={i} className={styles.carouselSlide}>
						<Image
							src={p}
							alt={`${title} — photo ${i + 1}`}
							fill
							placeholder="blur"
							sizes="(max-width: 560px) 100vw, 560px"
							priority={i === 0}
							style={{ objectPosition }}
						/>
					</div>
				))}
				{Array.from({ length: extraSlots }).map((_, i) => (
					<div key={`slot-${i}`} className={`${styles.carouselSlide} ${styles.hatch}`}>
						<span>+ another photo</span>
					</div>
				))}
			</div>
			<button
				type="button"
				className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`}
				onClick={() => flip(-1)}
				aria-label="previous photo"
			>
				‹
			</button>
			<button
				type="button"
				className={`${styles.carouselBtn} ${styles.carouselBtnRight}`}
				onClick={() => flip(1)}
				aria-label="next photo"
			>
				›
			</button>
		</div>
	);
}
