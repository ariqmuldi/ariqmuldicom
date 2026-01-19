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
	title: 'Ariq Muldi - Software Engineer | Full Stack Developer | Cloud & DevOps Specialist',
	description:
		'Software Engineer and Computer Science student at UBC with 5+ years of experience. Currently working as a Software Engineer at DOUBL and Undergraduate Research Assistant at UBC. Specialized in Full Stack Development, Cloud Computing, and DevOps.',
	keywords: [
		'Ariq Muldi',
		'Software Engineer',
		'Full Stack Developer',
		'Cloud Specialist',
		'DevOps Engineer',
		'Computer Science Student',
		'UBC Student',
		'Undergraduate Research Assistant',
		'DOUBL',
		'JavaScript',
		'TypeScript',
		'React',
		'Node.js',
		'Python',
		'Google Cloud Platform',
		'AWS',
		'PostgreSQL',
		'Docker',
		'Kubernetes',
		'CI/CD',
		'Web Development',
		'Software Architecture',
		'Vancouver Developer',
		'Kelowna BC',
		'Next.js',
		'React Router',
		'Prisma',
		'Laravel',
		'PHP',
		'MySQL',
		'Educational Technology',
	],
	authors: [{ name: 'Ariq Muldi' }],
	creator: 'Ariq Muldi',
	openGraph: {
		title: 'Ariq Muldi - Software Engineer | Full Stack Developer | Cloud & DevOps Specialist',
		description: 'Software Engineer with 5+ years of experience. Building scalable systems at DOUBL and UBC. Specialized in modern web technologies, cloud infrastructure, and DevOps.',
		url: 'https://ariqmuldi.com',
		siteName: 'Ariq Muldi - Portfolio',
		images: [
			{
				url: '/for-metadata-picture.jpg',
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
		creator: '@ariqmuldi',
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
