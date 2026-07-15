import type { Metadata } from 'next';
import { Cormorant_Garamond, Nunito, Caveat } from 'next/font/google';

// Segment layout for /adzra. Following the App Router convention used by the other routes
// (see app/content-generation/layout.tsx), this layout is the single source of truth for the
// segment's metadata.
//
// FONTS: The Sayang Collection has its own type system (Cormorant Garamond, Nunito, Caveat) that
// the rest of the site does not use. Rather than add them to the root layout, they are loaded here
// and exposed as CSS variables on a wrapper that scopes them to this route only — keeping /adzra
// self-contained. IBM Plex Mono is already global (--font-plex-mono) and is reused for labels.
//
// Unlike the rest of the site, this route is a PRIVATE, password-gated keepsake: it must never be
// indexed or discoverable via search, and it is not linked from anywhere (no nav, no sitemap entry,
// no internal links). The metadata below is warm but deliberately vague — it names the keepsake for
// the person who has the link, without revealing any of the private memories in a shared unfurl,
// and it locks the page out of search.

// Enough for a browser tab / a shared link's card — on-theme, but nothing that spills what's inside.
const TITLE = 'The Sayang Collection 🤍';
const DESCRIPTION = 'a little keepsake, just for you';

const cormorant = Cormorant_Garamond({
	variable: '--adzra-font-serif',
	subsets: ['latin'],
	weight: ['500', '600'],
	style: ['normal', 'italic'],
	display: 'swap',
});
const nunito = Nunito({
	variable: '--adzra-font-body',
	subsets: ['latin'],
	weight: ['400', '600', '700', '800'],
	display: 'swap',
});
const caveat = Caveat({
	variable: '--adzra-font-hand',
	subsets: ['latin'],
	weight: ['500', '700'],
	display: 'swap',
});

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
	return (
		<div className={`${cormorant.variable} ${nunito.variable} ${caveat.variable}`}>
			{children}
		</div>
	);
}
