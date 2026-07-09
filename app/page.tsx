'use client';

import TopBar, { type TopBarLink } from '@/components/TopBar';
import HeroSection from '@/components/HeroSection';
import WorkSection from '@/components/WorkSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import EducationSection from '@/components/EducationSection';
import ContactSection from '@/components/ContactSection';
import { useActiveSection, useScrollReveal } from './lib/hooks';

const NAV = [
	{ id: 'work', label: 'Work' },
	{ id: 'experience', label: 'Experience' },
	{ id: 'projects', label: 'Projects' },
	{ id: 'skills', label: 'Skills' },
	{ id: 'education', label: 'Education' },
];

// schema.org ProfilePage → Person structured data. Rendered as a JSON-LD <script> per the
// official Next.js recommendation (nextjs.org/docs/app/guides/json-ld) and Google's ProfilePage
// guidance. This page is statically prerendered, so the script is present in the HTML for crawlers.
const profileJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'ProfilePage',
	mainEntity: {
		'@type': 'Person',
		name: 'Ariq Muldi',
		alternateName: 'ariqmuldi',
		url: 'https://ariqmuldi.com',
		image: 'https://ariqmuldi.com/profile-photo.jpg',
		jobTitle: 'Software Engineer',
		description:
			'Software Engineer and Computer Science student at UBC specialized in full-stack development, cloud computing, and DevOps.',
		worksFor: { '@type': 'Organization', name: 'DOUBL' },
		alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of British Columbia' },
		knowsAbout: [
			'Full Stack Development',
			'Cloud Computing',
			'DevOps',
			'TypeScript',
			'React',
			'Node.js',
		],
		sameAs: ['https://github.com/ariqmuldi', 'https://linkedin.com/in/ariqmuldi'],
	},
};

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
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
			/>
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
