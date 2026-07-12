import { experiences } from '@/data/generated/experiences';
import { projects } from '@/data/generated/projects';
import { skills } from '@/data/generated/skills';
import ContentGenerationApp from '@/components/ContentGenerationApp';

// Metadata for this route lives in the segment layout (app/content-generation/layout.tsx).

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
