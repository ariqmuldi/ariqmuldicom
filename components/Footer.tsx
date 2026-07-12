'use client';

import { Fragment, useEffect, useRef, type ReactNode } from 'react';

// Shared, presentational footer used by both the main portfolio (`/`) and `/content-generation`.
// Each route passes its own left-hand `items` (rendered pipe-separated); the copyright — with the
// current year — is always rendered on the right, so it can never drift between routes.
export default function Footer({ items }: { items: ReactNode[] }) {
	const year = new Date().getFullYear();
	const innerRef = useRef<HTMLDivElement>(null);

	// Reveal on scroll with its own observer. The shared useScrollReveal() uses a -7% bottom
	// rootMargin, which leaves a dead zone at the very bottom of the viewport — exactly where the
	// footer lives — so it would never trigger. A plain threshold-based observer (no negative
	// margin) fires as the footer scrolls into view. Progressive-enhancement + reduced-motion match
	// the shared hook: the `.reveal` class is added by JS (so no-JS users see the footer), and
	// reduced motion reveals immediately.
	useEffect(() => {
		const el = innerRef.current;
		if (!el) return;
		el.classList.add('reveal');
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			el.classList.add('is-visible');
			return;
		}
		// Default options (root = viewport, threshold 0, no margin) so it reveals the instant the
		// footer first peeks into view — no negative bottom margin dead zone.
		const io = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					io.unobserve(entry.target);
				}
			});
		});
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<footer className="site-footer">
			<div className="site-footer__inner" ref={innerRef}>
				{items.map((item, i) => (
					<Fragment key={i}>
						{i > 0 && <span className="site-footer__pipe">|</span>}
						<span>{item}</span>
					</Fragment>
				))}
				<span className="site-footer__copy">© {year} Ariq Muldi</span>
			</div>
		</footer>
	);
}
