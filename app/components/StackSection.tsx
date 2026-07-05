'use client';

import { skills } from '@/app/data/skills';

// Derive a short folder-style label from a category name, e.g.
// "Programming Languages" → "programming/", "Cloud & Deployment" → "cloud/".
function folder(name: string): string {
	const first = name.trim().split(/\s+/)[0].toLowerCase();
	return `${first}/`;
}

export default function StackSection() {
	const categories = skills.categories;

	return (
		<section id="skills" className="section section--warm">
			<div className="section-grid">
				<div className="section-index">
					<div className="section-index__num">[ 04 ]</div>
					<div className="section-index__label">SKILLS</div>
					<div className="section-index__cmd">$ tree</div>
				</div>

				<div className="tree" data-reveal>
					<div className="tree__root">~/stack</div>
					{categories.map((category, i) => {
						const isLast = i === categories.length - 1;
						return (
							<div className="tree__row" key={category.name}>
								<span className="tree__glyph">{isLast ? '└──' : '├──'}</span>
								<span className="tree__label">{folder(category.name)}</span>
								<span className="tree__items">{category.skills.join(' · ')}</span>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
