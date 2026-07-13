import type { Metadata } from 'next';

// Segment layout for /adzra. Following the App Router convention used by the other routes
// (see app/content-generation/layout.tsx), this layout is the single source of truth for the
// segment's metadata and otherwise passes children straight through — the <html>/<body> shell,
// fonts, and design tokens all come from the root app/layout.tsx.
//
// Unlike the rest of the site, this route is a PRIVATE surprise: it must never be indexed or
// discoverable via search, and it is not linked from anywhere (no nav, no sitemap entry, no
// internal links). The metadata below is deliberately vague and locks the page out of search.

// Intentionally vague — enough for a browser tab, nothing that reveals what this page is.
const TITLE = 'a little something for you 🍋';
const DESCRIPTION = 'a small surprise';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,

	// Belt-and-suspenders "do not index, do not surface anywhere" directive. index/follow keep
	// the page out of the index and stop link-following; the extra flags stop caching, archiving,
	// snippets, and — since this page's whole point is private images — image indexing. The
	// googleBot block restates the same limits with Google's granular preview controls.
	//
	// NOTE: this route is deliberately NOT added to app/robots.ts's Disallow list. A robots.txt
	// Disallow would block crawling, which would prevent bots from ever reading this noindex tag —
	// leaving a discovered URL eligible to appear in results with no snippet. Letting it stay
	// crawlable is what makes the noindex actually enforceable. (Same reasoning as
	// /content-generation.) It is also excluded from app/sitemap.ts.
	robots: {
		index: false,
		follow: false,
		nocache: true,
		noarchive: true,
		nosnippet: true,
		noimageindex: true,
		googleBot: {
			index: false,
			follow: false,
			noimageindex: true,
			'max-video-preview': 0,
			'max-image-preview': 'none',
			'max-snippet': 0,
		},
	},

	// Self-referencing canonical, overriding the root layout's '/'. Resolved against metadataBase
	// (set in the root layout) → https://ariqmuldi.com/adzra.
	alternates: {
		canonical: '/adzra',
	},

	// Override the social card so a shared link does NOT inherit the homepage's portfolio OG card
	// (wrong identity, and it would spoil the surprise). Kept intentionally vague, with no image,
	// so any unfurl reveals nothing about the page. noindex governs search, not social unfurls, so
	// these tags still matter.
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		url: '/adzra',
		type: 'website',
		locale: 'en_US',
	},
	twitter: {
		card: 'summary',
		title: TITLE,
		description: DESCRIPTION,
	},

	// Don't leak the site's URL as a referrer when this page loads external resources.
	referrer: 'no-referrer',
};

export default function AdzraLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
