'use client';

import { useEffect, useRef, useState } from 'react';

/** True when the user has requested reduced motion. */
export function usePrefersReducedMotion(): boolean {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		setReduced(mq.matches);
		const onChange = () => setReduced(mq.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, []);
	return reduced;
}

/**
 * Types out `text` one char at a time (~95ms/char) on mount.
 * Returns the current substring; the full string immediately when reduced motion.
 */
export function useTypewriter(text: string, speed = 95): string {
	const reduced = usePrefersReducedMotion();
	const [typed, setTyped] = useState('');

	useEffect(() => {
		if (reduced) {
			setTyped(text);
			return;
		}
		setTyped('');
		let i = 0;
		const t = setInterval(() => {
			i += 1;
			setTyped(text.slice(0, i));
			if (i >= text.length) clearInterval(t);
		}, speed);
		return () => clearInterval(t);
	}, [text, speed, reduced]);

	return typed;
}

/**
 * Observes all `[data-reveal]` elements under `document` and adds `.is-visible`
 * once they enter the viewport. Respects reduced motion (reveals immediately).
 */
export function useScrollReveal(): void {
	useEffect(() => {
		const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
		if (els.length === 0) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		els.forEach((el) => el.classList.add('reveal'));

		if (reduced) {
			els.forEach((el) => el.classList.add('is-visible'));
			return;
		}

		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, []);
}

/**
 * Tracks the section nearest viewport center for scroll-spy.
 * Returns the active section id ('top' when at the very top).
 */
export function useActiveSection(): string {
	const [active, setActive] = useState('top');
	useEffect(() => {
		const secs = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
		if (secs.length === 0) return;
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) setActive(entry.target.id);
				});
			},
			{ threshold: 0, rootMargin: '-45% 0px -50% 0px' }
		);
		secs.forEach((s) => io.observe(s));
		return () => io.disconnect();
	}, []);
	return active;
}

/** Live HH:MM:SS clock in America/Vancouver, ticking every second. */
export function useClock(): string {
	const [time, setTime] = useState('--:--:--');
	const raf = useRef<ReturnType<typeof setInterval> | null>(null);
	useEffect(() => {
		const fmt = () => {
			try {
				setTime(
					new Date().toLocaleTimeString('en-CA', {
						hour12: false,
						timeZone: 'America/Vancouver',
					})
				);
			} catch {
				setTime(new Date().toLocaleTimeString());
			}
		};
		fmt();
		raf.current = setInterval(fmt, 1000);
		return () => {
			if (raf.current) clearInterval(raf.current);
		};
	}, []);
	return time;
}

/**
 * Deterministic 7-char hex "commit hash" for a seed. Decorative only —
 * stable across renders so the git-log ledger looks real without being real.
 */
export function fakeCommitHash(seed: string | number): string {
	const str = String(seed);
	let h = 0x811c9dc5;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}
