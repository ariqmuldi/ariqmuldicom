import type { Metadata } from 'next';

// Keep this page a secret: not indexed, not followed, not linked from anywhere.
export const metadata: Metadata = {
	title: 'a little something for you 🍋',
	description: 'a small surprise',
	robots: {
		index: false,
		follow: false,
		googleBot: { index: false, follow: false },
	},
};

export default function AdzraLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
