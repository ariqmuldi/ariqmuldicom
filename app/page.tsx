'use client';

import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/ExperienceSection';
import ContactSection from './components/ContactSection';
import EducationSection from './components/EducationSection';

export default function MinimalModernPortfolio() {
	return (
		<div className="min-h-screen bg-black text-white">
			<HeroSection />
			<ProjectsSection />
			<SkillsSection />
			<EducationSection />
			<ContactSection />
		</div>
	);
}
