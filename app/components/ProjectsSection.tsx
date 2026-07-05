'use client';

import { projects } from '@/app/data/projects';

export default function ProjectsSection() {
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

					{projects.map((project, i) => (
						<a
							className="proj-row"
							data-reveal
							href={project.github}
							target="_blank"
							rel="noopener"
							key={project.id}
						>
							<span className="proj-row__num">[{String(i + 1).padStart(2, '0')}]</span>
							<div>
								<div className="proj-row__name">{project.title}</div>
								<div className="proj-row__desc">{project.description}</div>
							</div>
							<div className="proj-row__tech">{project.technologies.join(' · ')}</div>
							<span className="proj-row__arrow" aria-hidden>
								↗
							</span>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
