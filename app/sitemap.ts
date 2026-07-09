import type { MetadataRoute } from 'next';

// Served at /sitemap.xml. Only the indexable home page is listed — /content-generation is
// intentionally excluded because it carries a `noindex` robots directive (a sitemap should only
// advertise pages you want in search results). See app/robots.ts + app/content-generation metadata.
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://ariqmuldi.com',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1,
		},
	];
}
