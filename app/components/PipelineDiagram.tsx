'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/app/lib/hooks';
import { CONTENT_FILES, CONTENT_SCRIPTS, DATA_MODULES } from '@/app/lib/content-file-names';

// Section 01 — the auto-playing pipeline diagram. Decorative: CSS packets flow along each
// connector, and a stepper highlights one node at a time (~1.5s) driving the narration line.
// Under reduced motion the packets are hidden (CSS) and the stepper does not run.
//
// Two rails + a merge, mirrored so each rail is source → script(s) → output:
//   A · LATEX → DATA:   master-resume.tex → parse-resume.ts → the generated data modules
//   B · TEXT → AI DRAFTS: experience+project text → the two generate scripts → Gemini → *-content.json
//   MERGE:              review & approve → ariqmuldi.com (Work · Experience · Projects)
// All file/script names come from content-file-names.ts so a rename propagates here automatically.

interface Node {
	id: number;
	title: string;
	sub: string;
	dark?: boolean;
	wide?: boolean;
	titleTwoLine?: boolean;
}

export default function PipelineDiagram({ modelLabel, modelShort }: { modelLabel: string; modelShort: string }) {
	const reduced = usePrefersReducedMotion();
	const [active, setActive] = useState(0);

	const stages = [
		`read ${CONTENT_FILES.masterResume}`,
		'$ npm run parse:resume — parsing LaTeX',
		`write ${DATA_MODULES.work} · ${DATA_MODULES.experiences} · ${DATA_MODULES.projects} · ${DATA_MODULES.skills}`,
		'collect experience bullets + project descriptions',
		`$ npm run generate:content — ${CONTENT_SCRIPTS.generateWork} · ${CONTENT_SCRIPTS.generateProject}`,
		`Gemini ${modelLabel} drafts prose · taglines · commit subjects`,
		`draft ${CONTENT_FILES.workContent} · ${CONTENT_FILES.projectContent} (approved: false)`,
		'review & approve (approved: true, locked)',
		'ariqmuldi.com renders Work · Experience · Projects',
	];

	useEffect(() => {
		if (reduced) return;
		const t = setInterval(() => setActive((i) => (i + 1) % stages.length), 1500);
		return () => clearInterval(t);
		// Cadence is fixed; only the label text depends on the model.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reduced]);

	const node = (n: Node, sub?: string) => (
		<div
			className={`cg-node${n.dark ? ' cg-node--dark' : ''}${n.wide ? ' cg-node--wide' : ''}${
				active === n.id ? ' is-active' : ''
			}`}
		>
			<div className="cg-node__title">
				{n.titleTwoLine
					? n.title.split('\n').map((line, i) => (
							<span key={i}>
								{line}
								{i === 0 && <br />}
							</span>
						))
					: n.title}
			</div>
			<div className="cg-node__sub">{sub ?? n.sub}</div>
		</div>
	);

	const connector = (label: string, keyId: string) => (
		<div className={`cg-conn${label ? ' cg-conn--labeled' : ''}`} key={keyId}>
			{label && <div className="cg-conn__label">{label}</div>}
			<div className="cg-conn__line" />
			<span className="cg-packet cg-packet--green" style={{ animationDelay: '0s' }} />
			<span className="cg-packet cg-packet--green" style={{ animationDelay: '.8s' }} />
			<span className="cg-conn__arrow" aria-hidden />
		</div>
	);

	return (
		<div className="cg-pipe">
			{/* RAIL A · LATEX → DATA */}
			<div className="cg-rail-label">A · LATEX → DATA</div>
			<div className="cg-rail">
				{node({ id: 0, title: CONTENT_FILES.masterResume, sub: 'LaTeX · Overleaf' })}
				{connector('parse:resume', 'a0')}
				{node({ id: 1, title: CONTENT_SCRIPTS.parse, sub: 'tsx parser' })}
				{connector('', 'a1')}
				{node({
					id: 2,
					title: `${DATA_MODULES.work} · ${DATA_MODULES.experiences}\n${DATA_MODULES.projects} · ${DATA_MODULES.skills}`,
					sub: `+ ${DATA_MODULES.education} · ${CONTENT_FILES.resumeConfig}`,
					wide: true,
					titleTwoLine: true,
				})}
			</div>

			{/* RAIL B · TEXT → AI DRAFTS */}
			<div className="cg-rail-label cg-rail-label--gap">B · TEXT → AI DRAFTS</div>
			<div className="cg-rail">
				{node({ id: 3, title: 'experience + project text', sub: 'role accomplishments · project descriptions' })}
				{connector('generate:content', 'b0')}
				{node({
					id: 4,
					title: `${CONTENT_SCRIPTS.generateWork}\n${CONTENT_SCRIPTS.generateProject}`,
					sub: 'tsx generators',
					wide: true,
					titleTwoLine: true,
				})}
				{connector('', 'b1')}
				{node({ id: 5, title: 'Gemini', sub: '' }, modelShort)}
				{connector('', 'b2')}
				{node({
					id: 6,
					title: `${CONTENT_FILES.workContent}\n${CONTENT_FILES.projectContent}`,
					sub: 'approved: false — awaiting review',
					wide: true,
					titleTwoLine: true,
				})}
			</div>

			{/* MERGE */}
			<div className="cg-merge" aria-hidden>
				↓
			</div>
			<div className="cg-rail">
				{node({ id: 7, title: 'review & approve', sub: 'approved: true · locked · committed' })}
				{connector('', 'm0')}
				{node({ id: 8, title: 'ariqmuldi.com', sub: 'renders Work · Experience · Projects', dark: true })}
			</div>

			<div className="cg-pipe__console">
				<span className="cg-pipe__dot" aria-hidden />
				<span className="cg-pipe__stage-label">stage</span>
				<span className="cg-pipe__stage">{reduced ? 'autoplay paused (reduced motion)' : stages[active]}</span>
			</div>
		</div>
	);
}
