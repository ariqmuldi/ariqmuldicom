'use client';

import TopBar, { type TopBarLink } from './components/TopBar';
import HeroSection from './components/HeroSection';
import WorkSection from './components/WorkSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import EducationSection from './components/EducationSection';
import ContactSection from './components/ContactSection';
import { useActiveSection, useScrollReveal } from './lib/hooks';

const NAV = [
	{ id: 'work', label: 'Work' },
	{ id: 'experience', label: 'Experience' },
	{ id: 'projects', label: 'Projects' },
	{ id: 'skills', label: 'Skills' },
	{ id: 'education', label: 'Education' },
];

export default function Portfolio() {
	const activeSection = useActiveSection();
	useScrollReveal();

	const crumb = activeSection === 'top' ? '~/' : `~/${activeSection}`;
	const links: TopBarLink[] = [
		...NAV.map((n) => ({ href: `#${n.id}`, label: n.label, active: activeSection === n.id })),
		{ href: '/content-generation', label: 'Content' },
		{ href: '#contact', label: 'Contact', variant: 'contact', active: activeSection === 'contact' },
	];

	return (
		<>
			<TopBar crumb={crumb} links={links} brandHref="#top" brandLabel="Back to top" />
			<main>
				<HeroSection />
				<WorkSection />
				<ExperienceSection />
				<ProjectsSection />
				<SkillsSection />
				<EducationSection />
				<ContactSection />
			</main>
		</>
	);
}
