'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

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
 * Counts 0 → `target` the first time the returned ref's element scrolls into view.
 * SSR-safe (renders the final formatted value on the server, so no hydration flash) and
 * honors reduced motion (stays at the final value). Returns [ref, displayText].
 */
export function useCountUp(
	target: number,
	{ duration = 1150, pad = 0, suffix = '' }: { duration?: number; pad?: number; suffix?: string } = {}
): [RefObject<HTMLSpanElement | null>, string] {
	const reduced = usePrefersReducedMotion();
	const ref = useRef<HTMLSpanElement>(null);
	const fmt = (n: number) =>
		(pad > 0 ? String(n).padStart(pad, '0') : n.toLocaleString('en-US')) + suffix;
	const [text, setText] = useState(() => fmt(target)); // final value = SSR + no-JS + reduced fallback

	useEffect(() => {
		const el = ref.current;
		if (!el || reduced) return;
		let raf = 0;
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					io.unobserve(el);
					const t0 = performance.now();
					const tick = (now: number) => {
						const p = Math.min(1, (now - t0) / duration);
						const eased = 1 - Math.pow(1 - p, 3);
						setText(fmt(Math.round(target * eased)));
						if (p < 1) raf = requestAnimationFrame(tick);
						else setText(fmt(target));
					};
					setText(fmt(0));
					raf = requestAnimationFrame(tick);
				});
			},
			{ threshold: 0.6 }
		);
		io.observe(el);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reduced, target, duration, pad, suffix]);

	return [ref, text];
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

		// Gentle per-list cascade: assign a delay by sibling index so list rows (Work /
		// Experience / Projects) reveal in sequence. Skips lone elements and never overrides an
		// explicit inline --reveal-delay (Hero sets its own), so it's purely additive.
		if (!reduced) {
			const groups = new Map<HTMLElement, HTMLElement[]>();
			els.forEach((el) => {
				const parent = el.parentElement as HTMLElement | null;
				if (!parent) return;
				const list = groups.get(parent) ?? [];
				list.push(el);
				groups.set(parent, list);
			});
			groups.forEach((list) => {
				if (list.length < 2) return; // don't stagger lone elements
				list.forEach((el, i) => {
					if (!el.style.getPropertyValue('--reveal-delay')) {
						el.style.setProperty('--reveal-delay', `${Math.min(i * 60, 260)}ms`);
					}
				});
			});
		}

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

/**
 * A 40-char form of {@link fakeCommitHash} for the expanded `git show` header.
 * Repeats/truncates the stable 7-char value to a full SHA-1 length — decorative only.
 */
export function fakeCommitHashLong(seed: string | number): string {
	return fakeCommitHash(seed).repeat(6).slice(0, 40);
}
