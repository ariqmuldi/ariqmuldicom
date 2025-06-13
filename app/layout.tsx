import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Ariq Muldi - Aspiring Software Engineer & Computer Science Student',
	description:
		'Computer Science student at UBC with 3+ years of hands-on development experience. Currently serving as Undergraduate Research Assistant building systems for 1,000+ users. Passionate about creating scalable web applications and innovative software solutions.',
	keywords: [
		'Ariq Muldi',
		'Aspiring Software Engineer',
		'Computer Science Student',
		'UBC Student',
		'Undergraduate Research Assistant',
		'Teaching Assistant',
		'Full Stack Developer',
		'JavaScript',
		'TypeScript',
		'React',
		'Node.js',
		'Python',
		'PostgreSQL',
		'Docker',
		'Web Development',
		'Software Development',
		'University of British Columbia',
		'Student Developer',
		'Vancouver Developer',
		'Kelowna BC',
		'React Router v7',
		'Prisma',
		'Laravel',
		'PHP',
		'MySQL',
		'Canvas API',
		'Educational Technology',
		'Membership Management System',
		'LearnCoding Platform',
	],
	authors: [{ name: 'Ariq Muldi' }],
	creator: 'Ariq Muldi',
	openGraph: {
		title: 'Ariq Muldi - Aspiring Software Engineer & UBC Computer Science Student',
		description: 'Computer Science student at UBC building production systems serving 1,000+ users. Experienced in full-stack development with React, TypeScript, and modern web technologies.',
		url: 'https://ariqmuldi.com',
		siteName: 'Ariq Muldi - Portfolio',
		images: [
			{
				url: '/profile-photo.jpg',
				width: 1200,
				height: 630,
				alt: 'Ariq Muldi - Computer Science Student & Aspiring Software Engineer',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Ariq Muldi - Aspiring Software Engineer & UBC Student',
		description: 'Computer Science student building production systems for 1,000+ users. Passionate about full-stack development and educational technology.',
		creator: '@ariqmuldi',
		images: ['/profile-photo.jpg'],
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
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
