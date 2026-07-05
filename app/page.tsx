'use client';

import TopBar from './components/TopBar';
import HeroSection from './components/HeroSection';
import ProfessionalContributionsSection from './components/ProfessionalContributionsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import StackSection from './components/StackSection';
import EducationSection from './components/EducationSection';
import ContactSection from './components/ContactSection';
import { useActiveSection, useScrollReveal } from './lib/hooks';

export default function Portfolio() {
	const activeSection = useActiveSection();
	useScrollReveal();

	return (
		<>
			<TopBar activeSection={activeSection} />
			<main>
				<HeroSection />
				<ProfessionalContributionsSection />
				<ExperienceSection />
				<ProjectsSection />
				<StackSection />
				<EducationSection />
				<ContactSection />
			</main>
		</>
	);
}
