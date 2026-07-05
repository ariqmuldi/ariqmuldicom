'use client';

const NAV = [
	{ id: 'work', label: 'Work' },
	{ id: 'experience', label: 'Experience' },
	{ id: 'projects', label: 'Projects' },
	{ id: 'skills', label: 'Skills' },
	{ id: 'education', label: 'Education' },
] as const;

export default function TopBar({ activeSection }: { activeSection: string }) {
	const crumb = activeSection === 'top' ? '~/' : `~/${activeSection}`;

	return (
		<header className="topbar">
			<div className="topbar__inner">
				<a href="#top" className="topbar__brand" aria-label="Back to top">
					<span className="topbar__dot" aria-hidden />
					<span className="topbar__name">ariqmuldi</span>
					<span className="topbar__tld">.com</span>
					<span className="topbar__crumb">{crumb}</span>
				</a>
				<nav className="topbar__nav">
					{NAV.map((item) => (
						<a
							key={item.id}
							href={`#${item.id}`}
							className={`topbar__link${activeSection === item.id ? ' is-active' : ''}`}
						>
							{item.label}
						</a>
					))}
					<a
						href="#contact"
						className={`topbar__link topbar__link--contact${
							activeSection === 'contact' ? ' is-active' : ''
						}`}
					>
						Contact
					</a>
				</nav>
			</div>
		</header>
	);
}
