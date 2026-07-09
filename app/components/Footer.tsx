'use client';

import { Fragment, type ReactNode } from 'react';

// Shared, presentational footer used by both the main portfolio (`/`) and `/content-generation`.
// Each route passes its own left-hand `items` (rendered pipe-separated); the copyright — with the
// current year — is always rendered on the right, so it can never drift between routes.
export default function Footer({ items }: { items: ReactNode[] }) {
	const year = new Date().getFullYear();
	return (
		<footer className="site-footer">
			<div className="site-footer__inner">
				{items.map((item, i) => (
					<Fragment key={i}>
						{i > 0 && <span className="site-footer__pipe">|</span>}
						<span>{item}</span>
					</Fragment>
				))}
				<span className="site-footer__copy">© {year} Ariq Muldi</span>
			</div>
		</footer>
	);
}
