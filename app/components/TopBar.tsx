'use client';

// Shared, presentational top bar used by both the main portfolio (`/`) and `/content-generation`.
// The brand markup lives here once; each route passes its own crumb + nav links so the two never
// drift. `active` toggles the accent highlight; `variant: 'contact'` gets the underlined treatment.
export interface TopBarLink {
	href: string;
	label: string;
	active?: boolean;
	variant?: 'contact';
}

export default function TopBar({
	crumb,
	links,
	brandHref = '#top',
	brandLabel = 'Back to top',
}: {
	crumb: string;
	links: TopBarLink[];
	brandHref?: string;
	brandLabel?: string;
}) {
	return (
		<header className="topbar">
			<div className="topbar__inner">
				<a href={brandHref} className="topbar__brand" aria-label={brandLabel}>
					<span className="topbar__dot" aria-hidden />
					<span className="topbar__name">ariqmuldi</span>
					<span className="topbar__tld">.com</span>
					<span className="topbar__crumb">{crumb}</span>
				</a>
				<nav className="topbar__nav">
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className={`topbar__link${link.variant === 'contact' ? ' topbar__link--contact' : ''}${
								link.active ? ' is-active' : ''
							}`}
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>
		</header>
	);
}
