// Detecting "production" for the /content-generation authoring tool.
//
// The editor is a LOCAL authoring tool: editing only works on localhost (`npm run dev`).
// On Vercel the serverless filesystem is read-only, so every mutating route — and the unlock
// route — refuses when this returns true. The deployed page is a public, read-only explainer.
export function isProduction(): boolean {
	// Vercel sets VERCEL=1 on all deployments; also treat NODE_ENV=production as prod.
	return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}
