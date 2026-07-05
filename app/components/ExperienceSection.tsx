'use client';

import { useState } from 'react';
import { experiences, type Experience } from '@/app/data/experiences';
import { fakeCommitHash } from '@/app/lib/hooks';
import roleContent from '@/app/data/role-content.json';

// The AI tech list (shared with the Work section) is keyed by experienceId in
// role-content.json. Work joins the same entries by contentKey — both sections render the
// identical generated list. Fall back to the keyword tech in experiences.ts if no entry exists.
const techByExperienceId = new Map<number, string[]>(
	Object.values(roleContent as Record<string, { experienceId: number; technologies: string[] }>).map((e) => [
		e.experienceId,
		e.technologies,
	])
);

// Abbreviate the long institutional name for the ledger's "@ company" suffix.
function shortCompany(company: string): string {
	return company.replace('University of British Columbia', 'UBC');
}

// "Software Developer -- Makerspace Platform" → { role, context }
// so the row reads "Software Developer @ UBC · Makerspace Platform".
function splitTitle(exp: Experience): { role: string; context: string } {
	const [role, suffix] = exp.title.split(' -- ');
	const context = suffix ?? exp.department ?? '';
	return { role: role.trim(), context: context.trim() };
}

// period is "Sept. 2025 -- Present" or "Jul. 2025 -- Sept. 2025".
function splitPeriod(period: string): { start: string; end: string } {
	const [start = '', end = ''] = period.split('--').map((p) => p.replace(/\./g, '').trim());
	return { start, end };
}

export default function ExperienceSection() {
	// Independent expand/collapse per row (no accordion, no "expand all").
	const [openIds, setOpenIds] = useState<Set<number>>(new Set());

	const toggle = (id: number) => {
		setOpenIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	return (
		<section id="experience" className="section section--warm">
			<div className="section-grid">
				<div className="section-index">
					<div className="section-index__num">[ 02 ]</div>
					<div className="section-index__label">EXPERIENCE</div>
					<div className="section-index__cmd">$ git log</div>
				</div>

				<div>
					<div className="gitlog__cmd" data-reveal>
						git log --oneline --author=&quot;ariq&quot; main
					</div>

					{experiences.map((exp) => {
						const { role, context } = splitTitle(exp);
						const { start, end } = splitPeriod(exp.period);
						const tech = techByExperienceId.get(exp.id) ?? exp.technologies;
						const headline = exp.accomplishments[0];
						const body = exp.accomplishments.slice(1);
						// Only rows with more than the headline bullet get the expand affordance.
						const expandable = exp.accomplishments.length > 1;
						const isOpen = expandable && openIds.has(exp.id);

						return (
							<div
								className="gitlog__row"
								data-reveal
								id={`experience-${exp.id}`}
								key={exp.id}
								data-expandable={expandable ? '' : undefined}
								role={expandable ? 'button' : undefined}
								tabIndex={expandable ? 0 : undefined}
								aria-expanded={expandable ? isOpen : undefined}
								onClick={expandable ? () => toggle(exp.id) : undefined}
								onKeyDown={
									expandable
										? (e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													toggle(exp.id);
												}
											}
										: undefined
								}
							>
								<span className="gitlog__hash">
									{expandable && (
										<span className="gitlog__toggle" aria-hidden="true">
											{isOpen ? '▾' : '▸'}{' '}
										</span>
									)}
									{fakeCommitHash(exp.id)}
								</span>
								<div>
									<div className="gitlog__title">
										{role}{' '}
										<span className="gitlog__at">
											@ {shortCompany(exp.company)}
											{context ? ` · ${context}` : ''}
										</span>
									</div>
									{headline && <div className="gitlog__summary">{headline}</div>}
									{tech.length > 0 && <div className="gitlog__tech">{tech.join(' · ')}</div>}
									{isOpen && body.length > 0 && (
										<ul className="gitlog__body">
											{body.map((item, i) => (
												<li className="gitlog__body-item" key={i}>
													{item}
												</li>
											))}
										</ul>
									)}
								</div>
								<div className="gitlog__dates">
									{start} —
									<br />
									{exp.current ? <span className="dot-green">● present</span> : end}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
