'use client';

import TopBar from './components/TopBar';
import HeroSection from './components/HeroSection';
import WorkSection from './components/WorkSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
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
