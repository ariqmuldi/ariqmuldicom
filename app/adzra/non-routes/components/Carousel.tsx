'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import styles from '../adzra.module.css';

// Horizontal scroll-snap photo carousel for the detail pages. With a single photo it renders just
// that image — no ‹ / › arrows. With more than one, the arrows appear and scroll one image width
// (touch swipe works via scroll-snap). Add photos to an entry's `photos` array to enable paging.
export default function Carousel({
	photos,
	title,
	objectPosition = 'center',
}: {
	photos: StaticImageData[];
	title: string;
	objectPosition?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const hasMultiple = photos.length > 1;

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
			</div>
			{hasMultiple && (
				<>
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
				</>
			)}
		</div>
	);
}
