'use client';

import Image from 'next/image';
import { experiences } from '@/data/generated/experiences';
import { useTypewriter, useCountUp } from '@/app/lib/hooks';

// Hooks can't run inside `.map()`, so each metric wraps its number in this tiny client component,
// which counts up from 0 → target the first time the metric strip scrolls into view.
function CountUp({ target, pad = 0, suffix = '' }: { target: number; pad?: number; suffix?: string }) {
	const [ref, text] = useCountUp(target, { pad, suffix });
	return <span ref={ref}>{text}</span>;
}

// Hero is static presentation copy (not data-file driven), per the design brief.
const metrics = [
	{ target: 1000, suffix: '+', label: 'USERS SERVED' },
	{ target: 10000, suffix: '+', label: 'RECORDS PROCESSED' },
	{ target: 500, suffix: '+', label: 'STUDENTS IMPACTED' },
	// Role count is derived from the experiences data so it stays in sync.
	{ target: experiences.length, pad: 2, suffix: '+', label: 'ROLES' },
];

export default function HeroSection() {
	const typed = useTypewriter('whoami');

	return (
		<section id="top" className="section">
			<div className="hero__inner">
				<div>
					<div className="hero__prompt" data-reveal style={{ '--reveal-delay': '0ms' } as React.CSSProperties}>
						<span className="hero__prompt-sign">$</span> {typed}
						<span className="caret" aria-hidden />
					</div>

					<h1 className="hero__name" data-reveal style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
						ARIQ
						<br />
						MULDI
					</h1>

					<div className="hero__title" data-reveal style={{ '--reveal-delay': '160ms' } as React.CSSProperties}>
						Software Engineer<span className="sep">/</span>Full-Stack<span className="sep">·</span>Cloud &amp; DevOps
					</div>

					<p className="hero__intro" data-reveal style={{ '--reveal-delay': '220ms' } as React.CSSProperties}>
						I build production software for problems that have nothing in common — fit preference, graduate
						admissions, makerspace operations, adaptive learning, and a shelf of side projects — and ship every
						one end to end.
					</p>

					<div className="hero__status" data-reveal style={{ '--reveal-delay': '280ms' } as React.CSSProperties}>
						<span>
							<span className="dot-green">●</span> Available — 2027 new-grad SWE roles
						</span>
						<span className="sep">|</span>
						<span>
							Currently — SWE @ <strong>DOUBL</strong> · Research Assistant @ <strong>UBC</strong>
						</span>
					</div>

					<a
						href="/content-generation"
						className="hero__pipeline-link"
						data-reveal
						style={{ '--reveal-delay': '340ms' } as React.CSSProperties}
					>
						<span className="sign">$</span> ./how-content-is-generated — view the AI content pipeline &amp; editor{' '}
						<span className="arrow">↗</span>
					</a>
				</div>

				<figure className="hero__figure" data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
					<div className="frame">
						<span className="frame__clip">
							<Image
								src="/profile-photo.jpg"
								alt="Ariq Muldi"
								width={168}
								height={210}
								priority
								className="hero__photo"
							/>
						</span>
					</div>
					<figcaption className="figcaption">FIG.00 / ARIQ.MULDI.JPG</figcaption>
				</figure>
			</div>

			<div className="metric-strip-wrap">
				<div className="metric-strip">
					{metrics.map((m) => (
						<div className="metric" data-reveal key={m.label}>
							<div className="metric__num"><CountUp target={m.target} pad={m.pad} suffix={m.suffix} /></div>
							<div className="metric__label">{m.label}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
