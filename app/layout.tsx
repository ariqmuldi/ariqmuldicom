import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
	variable: '--font-plex-mono',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	style: ['normal', 'italic'],
	display: 'swap',
});

export const metadata: Metadata = {
	metadataBase: new URL('https://ariqmuldi.com'),
	title: 'Ariq Muldi - Software Engineer | Full Stack Developer | Cloud & DevOps Specialist',
	description:
		'Software Engineer and Computer Science student at UBC with 5+ years of experience. Currently working as a Software Engineer at DOUBL and Undergraduate Research Assistant at UBC. Specialized in Full Stack Development, Cloud Computing, and DevOps.',
	// Note: no `keywords` field — Google states the meta keywords tag "has no effect on indexing
	// and ranking at all" (developers.google.com/search/docs/crawling-indexing/special-tags).
	authors: [{ name: 'Ariq Muldi' }],
	creator: 'Ariq Muldi',
	// Self-referencing canonical for the home page, resolved against metadataBase. Per-route
	// metadata (e.g. /content-generation) overrides this with its own canonical.
	alternates: {
		canonical: '/',
	},
	openGraph: {
		title: 'Ariq Muldi - Software Engineer | Full Stack Developer | Cloud & DevOps Specialist',
		description: 'Software Engineer with 5+ years of experience. Building scalable systems at DOUBL and UBC. Specialized in modern web technologies, cloud infrastructure, and DevOps.',
		url: 'https://ariqmuldi.com',
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
		title: 'Ariq Muldi - Software Engineer | Full Stack Developer',
		description: 'Software Engineer at DOUBL & UBC Student. Passionate about full-stack development, cloud computing, and building scalable solutions.',
		site: '@ariqmuldi',
		creator: '@ariqmuldi',
		images: ['/og-image.png'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={ibmPlexMono.variable} data-scroll-behavior="smooth">
			<body>{children}</body>
		</html>
	);
}
