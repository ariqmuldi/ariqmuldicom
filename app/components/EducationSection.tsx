'use client';

import { education } from '@/app/data/education';

export default function EducationSection() {
	const [gpaMain, gpaMax] = education.gpa.split('/');

	return (
		<section id="education" className="section">
			<div className="section-grid">
				<div className="section-index">
					<div className="section-index__num">[ 05 ]</div>
					<div className="section-index__label">EDUCATION</div>
					<div className="section-index__cmd">$ cat edu.md</div>
				</div>

				<div>
					<div className="edu-head" data-reveal>
						<div>
							<h3 className="edu-head__school">{education.school}</h3>
							<div className="edu-head__degree">
								{education.degree}
								{education.minor && <span className="sep-faint"> · </span>}
								{education.minor}
							</div>
							<div className="edu-head__place">
								{education.location} <span className="sep-faint">·</span> {education.graduationDate}
							</div>
						</div>
						<div className="edu-head__gpa-wrap">
							<div className="edu-head__gpa">
								{gpaMain}
								{gpaMax && <small>/{gpaMax}</small>}
							</div>
							<div className="edu-head__gpa-label">GPA · {education.gpaPercentage}</div>
						</div>
					</div>

					{education.relevantCoursework.length > 0 && (
						<div className="edu-block" data-reveal>
							<div className="edu-block__label">SELECTED COURSEWORK</div>
							<div className="edu-block__courses">
								{education.relevantCoursework.map((course, i) => (
									<span key={course}>
										{i > 0 && <span className="sep-faint"> · </span>}
										{course}
									</span>
								))}
							</div>
						</div>
					)}

					{education.certifications.length > 0 && (
						<div className="edu-block" data-reveal>
							<div className="edu-block__label">CERTIFICATIONS</div>
							<div className="edu-block__certs">
								{education.certifications.map((cert) => (
									<div key={cert}>{cert}</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
