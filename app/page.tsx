'use client';

import HeroSection from './components/HeroSection';
import ProfessionalContributionsSection from './components/ProfessionalContributionsSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import ContactSection from './components/ContactSection';

export default function Portfolio() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
			<HeroSection />
			<ProfessionalContributionsSection />
			<ProjectsSection />
			<ExperienceSection />
			<EducationSection />
			<ContactSection />
		</div>
	);
}