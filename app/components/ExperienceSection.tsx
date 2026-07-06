'use client';

import { useState } from 'react';
import { experiences, type Experience } from '@/app/data/experiences';
import { fakeCommitHash, fakeCommitHashLong } from '@/app/lib/hooks';
import workExperienceContent from '@/app/data/work-experience-content.json';

// AI-generated per-role content (work-experience-content.json), keyed by experienceId. Both the
// shared `technologies` list (also rendered by Work) and the git-log `commitSubject` are overlaid
// here; Work joins the same entries by contentKey. Fall back to keyword tech / accomplishments[0].
const contentByExperienceId = new Map<number, { technologies: string[]; commitSubject?: string }>(
	Object.values(
		workExperienceContent as Record<string, { experienceId: number; technologies: string[]; commitSubject?: string }>
	).map((e) => [e.experienceId, { technologies: e.technologies, commitSubject: e.commitSubject }])
);

const AUTHOR = 'Ariq Muldi <ariq@ariqmuldi.com>';

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
					<div className="section-index__cmd">$ git show</div>
				</div>

				<div>
					<div className="gitlog__cmd" data-reveal>
						git log --oneline --stat --author=&quot;ariq&quot; main
					</div>

					{experiences.map((exp) => {
						const { role, context } = splitTitle(exp);
						const { start, end } = splitPeriod(exp.period);
						const overlay = contentByExperienceId.get(exp.id);
						const tech = overlay?.technologies ?? exp.technologies;
						// A role with hidden/empty accomplishments (DOUBL) has nothing to `git show`.
						const expandable = exp.accomplishments.length > 0;
						const isOpen = expandable && openIds.has(exp.id);
						const commitSubject = overlay?.commitSubject || exp.accomplishments[0];
						const insertions = exp.accomplishments.length;
						const dateLine = `${start} — ${exp.current ? 'present' : end}`;

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
									{expandable ? (
										<>
											{commitSubject && <div className="gitlog__summary">{commitSubject}</div>}
											<div className="gitlog__hint">
												<span className="gitlog__ins">+{insertions} insertions</span>
												{' · '}git show ▸
											</div>
										</>
									) : (
										<div className="gitlog__active">
											<span className="dot-green">●</span> in active development
										</div>
									)}
									{tech.length > 0 && <div className="gitlog__tech">{tech.join(' · ')}</div>}
								</div>
								<div className="gitlog__dates">
									{start} —
									<br />
									{exp.current ? <span className="dot-green">● present</span> : end}
								</div>
								{isOpen && (
									<div className="gitlog__show" onClick={(e) => e.stopPropagation()}>
										<div className="gitlog__show-line">
											commit <span className="gitlog__show-hash">{fakeCommitHashLong(exp.id)}</span>
										</div>
										<div className="gitlog__show-meta">Author: {AUTHOR}</div>
										<div className="gitlog__show-meta">Date:&nbsp;&nbsp;&nbsp;{dateLine}</div>
										<div className="gitlog__diffstat">
											{insertions} files changed, {insertions} insertions(+)
										</div>
										<div className="gitlog__difflist">
											{exp.accomplishments.map((item, i) => (
												<div className="gitlog__diff" key={i}>
													<span className="gitlog__diff-plus" aria-hidden="true">
														+
													</span>
													<span className="gitlog__diff-text">{item}</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
