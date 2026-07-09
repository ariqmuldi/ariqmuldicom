'use client';

import { useEffect, useRef, useState } from 'react';

// Custom listbox replacing the native <select> so the open menu matches the Swiss-mono design
// (the native popup is OS-drawn and unstyleable, and behaves inconsistently on mobile). Keyboard-
// and click-outside-aware, with open/close animations; styled with the existing `.cg-*` tokens.
interface Option {
	id: string;
	label: string;
}

const CLOSE_MS = 130; // must match the cg-dd-out animation duration

export default function ModelSelect({
	value,
	options,
	disabled,
	onChange,
}: {
	value: string;
	options: Option[];
	disabled?: boolean;
	onChange: (id: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const [closing, setClosing] = useState(false);
	const [activeIdx, setActiveIdx] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const current = options.find((o) => o.id === value) ?? options[0];

	// Animate the menu out, then unmount it once the exit animation has played.
	const close = () => {
		if (!open || closing) return;
		setClosing(true);
		closeTimer.current = setTimeout(() => {
			setOpen(false);
			setClosing(false);
		}, CLOSE_MS);
	};
	const openMenu = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		setClosing(false);
		setOpen(true);
	};
	const toggle = () => {
		if (disabled) return;
		if (open && !closing) close();
		else openMenu();
	};

	// Close on outside click while open.
	useEffect(() => {
		if (!open) return;
		const onDoc = (e: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
		};
		document.addEventListener('mousedown', onDoc);
		return () => document.removeEventListener('mousedown', onDoc);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, closing]);

	// Point the keyboard cursor at the current selection each time the menu opens.
	useEffect(() => {
		if (open && !closing) setActiveIdx(Math.max(0, options.findIndex((o) => o.id === value)));
	}, [open, closing, value, options]);

	// Snap shut (no animation) if the control becomes disabled (e.g. the editor is locked).
	useEffect(() => {
		if (disabled) {
			if (closeTimer.current) clearTimeout(closeTimer.current);
			setOpen(false);
			setClosing(false);
		}
	}, [disabled]);

	const choose = (id: string) => {
		onChange(id);
		close();
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;
		if (!open || closing) {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
				e.preventDefault();
				openMenu();
			}
			return;
		}
		if (e.key === 'Escape') {
			close();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActiveIdx((i) => Math.min(options.length - 1, i + 1));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActiveIdx((i) => Math.max(0, i - 1));
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			choose(options[activeIdx].id);
		}
	};

	const expanded = open && !closing;

	return (
		<div className="cg-dropdown" ref={rootRef}>
			<button
				type="button"
				className="cg-dropdown__btn"
				disabled={disabled}
				aria-haspopup="listbox"
				aria-expanded={expanded}
				onClick={toggle}
				onKeyDown={onKeyDown}
			>
				<span>{current.label}</span>
				<span className={`cg-dropdown__caret${expanded ? ' is-open' : ''}`} aria-hidden>
					▾
				</span>
			</button>
			{open && (
				<ul className={`cg-dropdown__menu${closing ? ' is-closing' : ''}`} role="listbox" tabIndex={-1}>
					{options.map((o, i) => (
						<li
							key={o.id}
							role="option"
							aria-selected={o.id === value}
							className={`cg-dropdown__opt${o.id === value ? ' is-selected' : ''}${
								i === activeIdx ? ' is-active' : ''
							}`}
							onMouseEnter={() => setActiveIdx(i)}
							onClick={() => choose(o.id)}
						>
							<span className="cg-dropdown__check" aria-hidden>
								{o.id === value ? '✓' : ''}
							</span>
							{o.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
