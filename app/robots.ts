import type { MetadataRoute } from 'next';

// Served at /robots.txt. Allows all crawlers everywhere except the API routes (not indexable
// content). /content-generation is deliberately NOT disallowed here: it must stay crawlable so
// bots can read its `noindex` meta tag — a robots.txt Disallow would block crawling and thus
// hide the noindex, leaving the URL eligible to appear in results. See app/sitemap.ts.
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: '/api/',
		},
		sitemap: 'https://ariqmuldi.com/sitemap.xml',
		host: 'https://ariqmuldi.com',
	};
}
