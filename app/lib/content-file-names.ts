// Single source of truth for the content-pipeline file, script, and directory names.
// Shared by the server path helpers (content-files.ts), the editor tabs/labels
// (ContentGenerationApp), and the pipeline diagram (PipelineDiagram) so renaming a file here
// propagates to every place it's shown or read. Pure strings only — safe to import anywhere.

// Directory (relative to repo root) where all content data + résumé source live.
export const CONTENT_DIR = 'data';

// Subdirectories under CONTENT_DIR, grouping files by pipeline role:
//   source/    — hand-edited parser inputs (the .tex + visibility config)
//   generated/ — parser output modules the site renders from — do not hand-edit
//   content/   — AI-generated JSON + the curated work.ts, all hand-editable
export const CONTENT_SUBDIRS = {
	source: 'source',
	generated: 'generated',
	content: 'content',
} as const;

// Bare filenames (no directory), used as-is for tab/diagram labels.
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

// Generated / curated data modules the site renders from (bare filenames).
export const DATA_MODULES = {
	work: 'work.ts',
	experiences: 'experiences.ts',
	projects: 'projects.ts',
	skills: 'skills.ts',
	education: 'education.ts',
} as const;

// Full repo-relative paths (dir/subdir/file) for the files the editor reads & writes.
// The server path layer (content-files.ts) and the editor's full-path labels build off these,
// so a file's on-disk location is declared here once.
export const CONTENT_PATHS = {
	masterResume: `${CONTENT_DIR}/${CONTENT_SUBDIRS.source}/${CONTENT_FILES.masterResume}`,
	resumeConfig: `${CONTENT_DIR}/${CONTENT_SUBDIRS.source}/${CONTENT_FILES.resumeConfig}`,
	workContent: `${CONTENT_DIR}/${CONTENT_SUBDIRS.content}/${CONTENT_FILES.workContent}`,
	projectContent: `${CONTENT_DIR}/${CONTENT_SUBDIRS.content}/${CONTENT_FILES.projectContent}`,
} as const;
