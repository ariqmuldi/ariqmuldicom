'use client';

import { useState } from 'react';
import { projects } from '@/data/generated/projects';
import projectContent from '@/data/content/project-content.json';

// AI-generated per-project taglines (project-content.json), keyed by projectId. Fall back to
// the first sentence of the auto-generated `description` when no approved tagline exists.
const taglineByProjectId = new Map<number, string>(
	Object.values(projectContent as Record<string, { projectId: number; tagline?: string }>)
		.filter((p) => p.tagline)
		.map((p) => [p.projectId, p.tagline as string])
);

// Split a description into its individual sentences, one accomplishment statement each.
function toSentences(description: string): string[] {
	return description
		.split(/(?<=[.!?])\s+/)
		.map((s) => s.trim())
		.filter(Boolean);
}

export default function ProjectsSection() {
	// Independent expand/collapse per row (mirrors ExperienceSection — no accordion).
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
		<section id="projects" className="section">
			<div className="section-grid">
				<div className="section-index">
					<div className="section-index__num">[ 03 ]</div>
					<div className="section-index__label">PROJECTS</div>
					<div className="section-index__cmd">$ ls ~/side</div>
				</div>

				<div>
					<p className="intro-copy" data-reveal>
						Personal builds — nights, weekends, and coursework taken further than required.
					</p>

					{projects.map((project, i) => {
						const isOpen = openIds.has(project.id);
						const tagline = taglineByProjectId.get(project.id) ?? toSentences(project.description)[0];
						const repo = project.github.split('/').pop();

						return (
							<div
								className="proj-row"
								data-reveal
								key={project.id}
								role="button"
								tabIndex={0}
								aria-expanded={isOpen}
								onClick={() => toggle(project.id)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										toggle(project.id);
									}
								}}
							>
								<span className="proj-row__num">
									<span className="proj-row__toggle" aria-hidden="true">
										{isOpen ? '▾' : '▸'}{' '}
									</span>
									[{String(i + 1).padStart(2, '0')}]
								</span>
								<div>
									<div className="proj-row__name">{project.title}</div>
									{tagline && <div className="proj-row__tagline">{tagline}</div>}
									{project.technologies.length > 0 && (
										<div className="proj-row__tech">{project.technologies.join(' · ')}</div>
									)}
								</div>
								<div className="proj-row__link-wrap">
									<a
										className="proj-row__link"
										href={project.github}
										target="_blank"
										rel="noopener"
										onClick={(e) => e.stopPropagation()}
									>
										github ↗
									</a>
								</div>
								{isOpen && (
									<div className="proj-row__readme" onClick={(e) => e.stopPropagation()}>
										<div className="proj-row__readme-cmd">
											<span className="proj-row__prompt">$</span> cat ~/side/{repo}/README.md
										</div>
										<div className="proj-row__readme-body">
											{toSentences(project.description).map((sentence, s) => (
												<div className="proj-row__sentence" key={s}>
													<span className="proj-row__marker" aria-hidden="true">
														-
													</span>
													{sentence}
												</div>
											))}
										</div>
										<a
											className="proj-row__open"
											href={project.github}
											target="_blank"
											rel="noopener"
											onClick={(e) => e.stopPropagation()}
										>
											↗ open on github
										</a>
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
