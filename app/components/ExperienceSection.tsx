'use client';

import { experiences, type Experience } from '@/app/data/experiences';
import { fakeCommitHash } from '@/app/lib/hooks';

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
						const summary = exp.accomplishments[0];

						return (
							<div className="gitlog__row" data-reveal id={`experience-${exp.id}`} key={exp.id}>
								<span className="gitlog__hash">{fakeCommitHash(exp.id)}</span>
								<div>
									<div className="gitlog__title">
										{role}{' '}
										<span className="gitlog__at">
											@ {shortCompany(exp.company)}
											{context ? ` · ${context}` : ''}
										</span>
									</div>
									{summary && <div className="gitlog__summary">{summary}</div>}
									{exp.technologies.length > 0 && (
										<div className="gitlog__tech">{exp.technologies.join(' · ')}</div>
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
