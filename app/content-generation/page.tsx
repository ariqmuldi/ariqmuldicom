import type { Metadata } from 'next';
import { experiences } from '@/data/generated/experiences';
import { projects } from '@/data/generated/projects';
import { skills } from '@/data/generated/skills';
import ContentGenerationApp from '@/components/ContentGenerationApp';

export const metadata: Metadata = {
	title: 'Content Pipeline — ariqmuldi.com',
	description:
		'How the résumé and project copy on ariqmuldi.com is generated: a LaTeX master résumé parsed into data, an LLM drafting prose, taglines and commit subjects, and an approve-to-publish review — plus the local console that drives it.',
	robots: { index: false, follow: false },
};

// Server Component: hydrates the client editor's previews from the committed generated data
// (experiences/projects/skills). The client fetches /api/content/state + /session for the rest.
export default function ContentGenerationPage() {
	return (
		<main>
			<ContentGenerationApp
				experiences={experiences}
				projects={projects}
				skillsCount={skills.categories.length}
			/>
		</main>
	);
}
