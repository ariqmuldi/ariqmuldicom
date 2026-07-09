// Single source of truth for the content-pipeline file, script, and directory names.
// Shared by the server path helpers (content-files.ts), the editor tabs/labels
// (ContentGenerationApp), and the pipeline diagram (PipelineDiagram) so renaming a file here
// propagates to every place it's shown or read. Pure strings only — safe to import anywhere.

// Directory (relative to repo root) where all content data + résumé source now live.
export const CONTENT_DIR = 'app/data';

// Hand-edited / AI-content files under CONTENT_DIR.
export const CONTENT_FILES = {
	masterResume: 'master-resume.tex',
	resumeConfig: 'resume-config.json',
	workContent: 'work-experience-content.json',
	projectContent: 'project-content.json',
} as const;

// The scripts that drive the pipeline (under scripts/).
export const CONTENT_SCRIPTS = {
	parse: 'parse-resume.ts',
	generateWork: 'generate-work-experience-content.ts',
	generateProject: 'generate-project-content.ts',
} as const;

// Generated / curated data modules under CONTENT_DIR that the site renders from.
export const DATA_MODULES = {
	work: 'work.ts',
	experiences: 'experiences.ts',
	projects: 'projects.ts',
	skills: 'skills.ts',
	education: 'education.ts',
} as const;
