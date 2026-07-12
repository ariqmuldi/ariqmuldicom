import type { Metadata } from 'next';

// Segment layout for /content-generation. It owns this route's metadata (moved out of page.tsx so
// there is a single source of truth for the segment) and otherwise passes children straight through
// — the <html>/<body> shell and shared design tokens come from the root app/layout.tsx.

const TITLE = 'Content Pipeline — ariqmuldi.com';
const DESCRIPTION =
	'How the résumé and project copy on ariqmuldi.com is generated: a LaTeX master résumé parsed into data, an LLM drafting prose, taglines and commit subjects, and an approve-to-publish review — plus the local console that drives it.';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	// noindex: this is a read-only tool showcase, not search content. It stays crawlable (no
	// robots.txt Disallow — see app/robots.ts) so bots can actually read this directive; a Disallow
	// would hide it. Excluded from app/sitemap.ts for the same reason.
	robots: { index: false, follow: false },
	// Self-referencing canonical, overriding the root layout's '/'. Resolved against metadataBase
	// (set in the root layout) → https://ariqmuldi.com/content-generation.
	alternates: {
		canonical: '/content-generation',
	},
	// Route-specific social card. Without these, link unfurls inherit the root layout's homepage
	// card (wrong title, description, and og:url). noindex governs search indexing, not social
	// sharing, so accurate OG/Twitter tags still matter here.
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		url: '/content-generation',
		siteName: 'Ariq Muldi - Portfolio',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Ariq Muldi - Software Engineer & Full Stack Developer',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: TITLE,
		description: DESCRIPTION,
		site: '@ariqmuldi',
		creator: '@ariqmuldi',
		images: ['/og-image.png'],
	},
};

export default function ContentGenerationLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
