'use client';

import { useClock } from '@/app/lib/hooks';
import Footer from './Footer';

// Contact links are static site config (not resume-data driven)
const links = [
	{ label: '01 / EMAIL', value: 'ariqmuldi@gmail.com', href: 'mailto:ariqmuldi@gmail.com', external: false },
	{ label: '02 / GITHUB', value: 'github.com/ariqmuldi', href: 'https://github.com/ariqmuldi', external: true },
	{ label: '03 / LINKEDIN', value: 'in/ariqmuldi', href: 'https://linkedin.com/in/ariqmuldi', external: true },
	{ label: '04 / MASTER RESUME', value: 'download .pdf', href: '/master-resume.pdf', external: true },
];

export default function ContactSection() {
	const clock = useClock();
	const year = new Date().getFullYear();

	return (
		<>
			<section id="contact" className="contact">
				<div className="contact__inner">
					<div className="contact__prompt" data-reveal>
						<span className="user">ariq@muldi</span>:<span className="tilde">~</span>$ contact --now
						<span className="contact__caret" aria-hidden />
					</div>

					<h2 className="contact__head" data-reveal>
						LET&apos;S BUILD
						<br />
						SOMETHING.
					</h2>

					<div className="contact__grid">
						{links.map((link) => (
							<a
								className="contact__cell"
								data-reveal
								href={link.href}
								target={link.external ? '_blank' : undefined}
								rel={link.external ? 'noopener' : undefined}
								key={link.label}
							>
								<div className="contact__cell-label">{link.label}</div>
								<div className="contact__cell-value">
									{link.value} <span className="arrow">↗</span>
								</div>
							</a>
						))}
					</div>
				</div>
			</section>

			<Footer
				items={[
					<>
						<span className="dot-green">●</span> available for {year} roles
					</>,
					'Kelowna, BC',
					<>
						local <span className="site-footer__clock">{clock}</span>
					</>,
				]}
			/>
		</>
	);
}
