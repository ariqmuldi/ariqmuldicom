'use client';

import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import ContactSection from './components/ContactSection';

export default function MinimalModernPortfolio() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
			<HeroSection />
			<ProjectsSection />
			<ExperienceSection />
			<EducationSection />
			<ContactSection />
		</div>
	);
}