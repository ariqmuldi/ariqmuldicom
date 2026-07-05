'use client';

import Image from 'next/image';
import { workGroups, type WorkItem } from '@/app/data/work';

// Flatten every work item across groups, tagging each with its org short name.
// Live/shipped work first, "coming soon" showcases last — a presentation rule that
// works for any number of groups/items, not a hardcoded order.
type FlatWorkItem = WorkItem & { org: string };

const items: FlatWorkItem[] = workGroups
	.flatMap((group) =>
		group.workItems.map((c) => ({
			...c,
			org: group.shortName ?? group.organization,
		}))
	)
	.sort((a, b) => Number(a.comingSoon ?? false) - Number(b.comingSoon ?? false));

function TechLine({ tech }: { tech: string[] }) {
	return (
		<>
			{tech.map((t, i) => (
				<span key={t}>
					{i > 0 && <span className="sep-faint"> · </span>}
					{t}
				</span>
			))}
		</>
	);
}

export default function WorkSection() {
	return (
		<section id="work" className="section">
			<div className="section-grid">
				<div className="section-index">
					<div className="section-index__num">[ 01 ]</div>
					<div className="section-index__label">WORK</div>
					<div className="section-index__cmd">$ ls ./selected-work</div>
				</div>

				<div>
					<p className="intro-copy" data-reveal>
						Production systems I&apos;ve shipped across research, academic, and industry roles — real users, real stakes, real uptime on the line.
					</p>

					{items.map((item, i) => {
						const num = String(i + 1).padStart(2, '0');
						const isLive = !item.comingSoon && Boolean(item.websiteUrl);
						const metaRole = [item.org, item.role].filter(Boolean).join(' · ').toUpperCase();
						const figLabel = item.figLabel ?? item.title.toUpperCase();

						return (
							<article className="work-article" data-reveal key={item.id}>
								<div>
									<div className="work-article__meta">
										<span className="work-article__num">{num}</span>
										<span>{metaRole}</span>
										{item.comingSoon ? (
											<span className="work-article__status">○ SHOWCASE TBA</span>
										) : isLive ? (
											<span className="work-article__status work-article__status--live">● LIVE</span>
										) : null}
									</div>

									<h3 className="work-article__title">{item.title}</h3>
									<p className="work-article__body">{item.description}</p>
									<div className="work-article__tech">
										<TechLine tech={item.technologies} />
									</div>

									{(item.websiteUrl || item.githubUrl) && (
										<div className="work-article__links">
											{item.websiteUrl && (
												<a className="link-underline" href={item.websiteUrl} target="_blank" rel="noopener">
													↗ live site
												</a>
											)}
											{item.githubUrl && (
												<a className="link-underline" href={item.githubUrl} target="_blank" rel="noopener">
													↗ github
												</a>
											)}
										</div>
									)}
								</div>

								<figure className="work-figure">
									<div className="work-figure__frame">
										<Image
											src={item.image}
											alt={item.title}
											width={380}
											height={238}
											className="work-figure__img"
										/>
										{item.overlayLabel && (
											<div className="work-figure__overlay">
												<span>{item.overlayLabel}</span>
											</div>
										)}
									</div>
									<figcaption className="figcaption">
										FIG.{num} / {figLabel}
									</figcaption>
								</figure>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
