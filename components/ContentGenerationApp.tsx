'use client';

import { useEffect, useRef, useState } from 'react';
import { fakeCommitHash } from '@/app/lib/hooks';
import { CONTENT_DIR, CONTENT_SUBDIRS, CONTENT_FILES, CONTENT_PATHS } from '@/app/lib/content-file-names';
import type { Experience } from '@/data/generated/experiences';
import type { Project } from '@/data/generated/projects';
import PipelineDiagram from './PipelineDiagram';
import ModelSelect from './ModelSelect';
import TopBar from './TopBar';
import Footer from './Footer';

// ── Static config (mirrors the generate scripts' role/project mapping) ───────────────────────
const WORK_ORDER = ['doubl', 'mds', 'makerspace', 'learncoding', 'teaching-assistant'] as const;
const PROJ_ORDER = ['ponotodoro', 'flight-hub', 'chatterbox', 'moodijawoodi'] as const;

const ROLE_META: Record<string, { experienceId: number; hasDescription: boolean }> = {
	doubl: { experienceId: 1, hasDescription: false },
	mds: { experienceId: 2, hasDescription: true },
	makerspace: { experienceId: 3, hasDescription: true },
	learncoding: { experienceId: 4, hasDescription: true },
	'teaching-assistant': { experienceId: 5, hasDescription: false },
};

// Roles with no Work card: explain why the description field is absent.
const NO_DESC_NOTE: Record<string, string> = {
	doubl: 'no Work card · commit subject unused while accomplishments are hidden (config: hideAllAccomplishments)',
	'teaching-assistant': 'no Work card — technologies shown in Experience only',
};

// resume-config.json experience keys, in résumé order, paired with their experienceId.
const CONFIG_KEYS: { key: string; expId: number }[] = [
	{ key: 'Lead Software Developer', expId: 1 },
	{ key: 'Software Developer (Work Study Program)', expId: 2 },
	{ key: 'Software Developer -- Makerspace Platform (Undergraduate Research Assistant & Directed Studies)', expId: 3 },
	{ key: 'Software Developer -- LearnCoding Platform (Undergraduate Research Assistant & Directed Studies)', expId: 4 },
	{ key: 'Undergraduate Teaching Assistant', expId: 5 },
];

const MODELS = [
	{ id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', short: '2.5 Flash-Lite' },
	{ id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', short: '2.5 Flash' },
	{ id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', short: '2.5 Pro' },
	{ id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', short: '2.0 Flash' },
];

// Terminal log colors (from the handoff).
const C = {
	cmd: '#98a1bc',
	dim: '#7e86a6',
	note: '#b9ae97',
	success: '#3fb27f',
	error: '#e0806b',
	bright: '#ede7d6',
} as const;

interface RoleContent {
	experienceId: number;
	sourceHash: string;
	approved: boolean;
	commitSubject?: string;
	technologies: string[];
	description?: string;
	sourceChanged?: boolean;
}
interface ProjectContent {
	projectId: number;
	sourceHash: string;
	approved: boolean;
	tagline?: string;
	sourceChanged?: boolean;
}
interface ConfigEntry {
	hidden: boolean;
	hideAllAccomplishments: boolean;
	hideAccomplishments: number[];
	hideTechnologies: boolean;
}
type LogLine = { t: string; c: string };

// ── Presentation helpers (mirror ExperienceSection / ProjectsSection) ────────────────────────
function shortCompany(company: string): string {
	return company.replace('University of British Columbia', 'UBC');
}
function splitTitle(exp: Experience): { role: string; context: string } {
	const [role, suffix] = exp.title.split(' -- ');
	const context = [suffix, exp.department]
		.map((s) => s?.trim())
		.filter(Boolean)
		.join(' · ');
	return { role: role.trim(), context };
}
function splitPeriod(period: string): { start: string; end: string } {
	const [start = '', end = ''] = period.split('--').map((s) => s.replace(/\./g, '').trim());
	return { start, end };
}
function firstSentence(description: string): string {
	return description.split(/(?<=[.!?])\s+/)[0] ?? '';
}

export default function ContentGenerationApp({
	experiences,
	projects,
	skillsCount,
}: {
	experiences: Experience[];
	projects: Project[];
	skillsCount: number;
}) {
	// ── State ──────────────────────────────────────────────────────────────────────────────
	const [loaded, setLoaded] = useState(false);
	const [production, setProduction] = useState(false);
	const [unlocked, setUnlocked] = useState(false);
	const [pwInput, setPwInput] = useState('');
	const [pwError, setPwError] = useState('');
	const [model, setModel] = useState('gemini-2.5-flash-lite');
	const [activeTab, setActiveTab] = useState<'resume' | 'work' | 'projects'>('resume');

	const [tex, setTex] = useState('');
	const [texDirty, setTexDirty] = useState(false);
	const [parsing, setParsing] = useState(false);

	const [work, setWork] = useState<Record<string, RoleContent>>({});
	const [proj, setProj] = useState<Record<string, ProjectContent>>({});
	const [config, setConfig] = useState<Record<string, ConfigEntry>>({});

	// Which generate action is currently running (null = idle). Value is a stable id so the exact
	// button that was pressed shows "generating…" while every other generate button is disabled.
	// e.g. 'work:drafts', 'work:force', 'work:regen:doubl', 'project:drafts', 'all'.
	const [running, setRunning] = useState<string | null>(null);
	const isRunning = running !== null;

	const [log, setLog] = useState<LogLine[]>([
		{ t: 'ariq@muldi:~/ariqmuldicom$ content-console --init', c: C.cmd },
		{ t: `loading ${CONTENT_PATHS.workContent} · ${CONTENT_FILES.projectContent} …`, c: C.dim },
	]);

	// Bottom-right toast. 'busy' persists (no timer) while an action runs and points the user to the
	// console; 'success'/'error' replace it on completion and auto-dismiss. `leaving` drives the exit.
	const [flash, setFlash] = useState<{ kind: 'success' | 'error' | 'busy'; text: string } | null>(null);
	const [flashLeaving, setFlashLeaving] = useState(false);

	const termRef = useRef<HTMLDivElement>(null);
	const debounce = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
	const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const flashExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const dismissFlash = () => {
		if (flashTimer.current) clearTimeout(flashTimer.current);
		setFlashLeaving(true);
		flashExitTimer.current = setTimeout(() => {
			setFlash(null);
			setFlashLeaving(false);
		}, 280); // must match the cg-toast-out animation duration
	};
	// Persistent "working…" toast — no auto-dismiss; replaced when the action finishes.
	const showBusy = (text: string) => {
		if (flashTimer.current) clearTimeout(flashTimer.current);
		if (flashExitTimer.current) clearTimeout(flashExitTimer.current);
		setFlashLeaving(false);
		setFlash({ kind: 'busy', text });
	};
	const showFlash = (kind: 'success' | 'error', text: string) => {
		if (flashTimer.current) clearTimeout(flashTimer.current);
		if (flashExitTimer.current) clearTimeout(flashExitTimer.current);
		setFlashLeaving(false);
		setFlash({ kind, text });
		flashTimer.current = setTimeout(dismissFlash, 4500);
	};
	const scrollToConsole = () => {
		document.getElementById('cg-console')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	const locked = !unlocked;
	const modelObj = MODELS.find((m) => m.id === model) ?? MODELS[0];

	const addLog = (t: string, c: string = C.note) => setLog((prev) => [...prev, { t, c }]);

	// Consume a live newline-delimited stream from the parse/generate routes, appending each output
	// line to the console as it arrives. The trailing `__CG_DONE__:{json}` line carries the outcome.
	const consumeStream = async (res: Response): Promise<{ ok: boolean; model?: string }> => {
		if (!res.body) return { ok: false };
		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		let result: { ok: boolean; model?: string } = { ok: false };
		let buf = '';
		const flushLine = (line: string) => {
			if (line.startsWith('__CG_DONE__:')) {
				try {
					result = JSON.parse(line.slice('__CG_DONE__:'.length) || '{}');
				} catch {
					/* ignore malformed sentinel */
				}
				return;
			}
			const t = line.replace(/\s+$/, '');
			if (t.length) addLog(`  ${t}`, C.dim);
		};
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			buf += decoder.decode(value, { stream: true });
			let nl: number;
			while ((nl = buf.indexOf('\n')) >= 0) {
				flushLine(buf.slice(0, nl));
				buf = buf.slice(nl + 1);
			}
		}
		if (buf.length) flushLine(buf);
		return result;
	};

	// ── Data fetching ─────────────────────────────────────────────────────────────────────
	const refreshState = async () => {
		const res = await fetch('/api/content/state');
		const data = await res.json();
		setTex(data.tex ?? '');
		setTexDirty(false);
		setWork(data.work ?? {});
		setProj(data.project ?? {});
		setConfig((data.config?.experiences ?? {}) as Record<string, ConfigEntry>);
	};

	useEffect(() => {
		try {
			const saved = localStorage.getItem('cg_model');
			if (saved && MODELS.some((m) => m.id === saved)) setModel(saved);
		} catch {}
		(async () => {
			try {
				const s = await fetch('/api/content/session').then((r) => r.json());
				setProduction(!!s.production);
				setUnlocked(!!s.authed);
				await refreshState();
				setLoaded(true);
				addLog('loaded 5 roles · 4 projects — read-only (enter password to edit)', C.note);
			} catch {
				addLog('✕ failed to load content state', C.error);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const el = termRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [log]);

	// ── Auth ────────────────────────────────────────────────────────────────────────────────
	const onUnlock = async () => {
		addLog('$ auth --unlock', C.cmd);
		const res = await fetch('/api/content/auth', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ password: pwInput }),
		});
		const data = await res.json().catch(() => ({}));
		if (res.ok && data.ok) {
			setUnlocked(true);
			setPwInput('');
			setPwError('');
			addLog('authenticated ✓ — edit mode enabled (localhost)', C.success);
		} else {
			setPwError(data.error || 'unlock failed');
			addLog(`auth failed — ${data.error || 'unlock failed'}`, C.error);
		}
	};
	const onLock = async () => {
		await fetch('/api/content/auth', { method: 'DELETE' });
		setUnlocked(false);
		addLog('locked — back to read-only', C.note);
	};

	const onModel = (id: string) => {
		setModel(id);
		try {
			localStorage.setItem('cg_model', id);
		} catch {}
		addLog(`set GEMINI_MODEL=${id}`, C.note);
	};

	// ── Master.tex + parse ─────────────────────────────────────────────────────────────────
	const onParse = async () => {
		if (parsing) return;
		setParsing(true);
		addLog('$ npm run parse:resume', C.cmd);
		showBusy('running parse:resume — regenerating the data files. Scroll to the console to follow along.');
		try {
			await fetch('/api/content/master-tex', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ tex }),
			});
			const res = await fetch('/api/content/parse', { method: 'POST' });
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				throw new Error(d.error || 'parse request rejected');
			}
			const { ok } = await consumeStream(res);
			if (ok) {
				addLog(`parsed → regenerated ${CONTENT_DIR}/${CONTENT_SUBDIRS.generated}/*.ts + ${CONTENT_FILES.resumeConfig}`, C.success);
				await refreshState();
				showFlash('success', '✓ parse:resume succeeded — data files regenerated');
			} else {
				addLog('✕ parse failed — see output above', C.error);
				showFlash('error', '✕ parse:resume failed — see the console below');
			}
		} catch {
			addLog('✕ parse request failed', C.error);
			showFlash('error', '✕ parse request failed — is the dev server running?');
		} finally {
			setParsing(false);
		}
	};

	// ── Field edits (debounced PATCH) ────────────────────────────────────────────────────────
	const patchWork = (key: string, patch: Partial<RoleContent>) => {
		clearTimeout(debounce.current[`w:${key}`]);
		debounce.current[`w:${key}`] = setTimeout(() => {
			fetch(`/api/content/work/${key}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(patch),
			});
		}, 500);
	};
	const patchProj = (key: string, patch: Partial<ProjectContent>) => {
		clearTimeout(debounce.current[`p:${key}`]);
		debounce.current[`p:${key}`] = setTimeout(() => {
			fetch(`/api/content/project/${key}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(patch),
			});
		}, 500);
	};

	const editCommit = (key: string, v: string) => {
		setWork((w) => ({ ...w, [key]: { ...w[key], commitSubject: v } }));
		patchWork(key, { commitSubject: v });
	};
	const editTech = (key: string, v: string) => {
		const arr = v.split(',').map((t) => t.trim()).filter(Boolean);
		setWork((w) => ({ ...w, [key]: { ...w[key], technologies: arr } }));
		patchWork(key, { technologies: arr });
	};
	const editDesc = (key: string, v: string) => {
		setWork((w) => ({ ...w, [key]: { ...w[key], description: v } }));
		patchWork(key, { description: v });
	};
	const editTagline = (key: string, v: string) => {
		setProj((p) => ({ ...p, [key]: { ...p[key], tagline: v } }));
		patchProj(key, { tagline: v });
	};

	const approveWork = async (key: string) => {
		const next = !work[key].approved;
		setWork((w) => ({ ...w, [key]: { ...w[key], approved: next, sourceChanged: next ? false : w[key].sourceChanged } }));
		await fetch(`/api/content/work/${key}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ approved: next }),
		});
		addLog(`${next ? 'approved' : 'unapproved'} work[${key}]${next ? ' — locked (approved:true)' : ''}`, next ? C.success : C.note);
	};
	const approveProj = async (key: string) => {
		const next = !proj[key].approved;
		setProj((p) => ({ ...p, [key]: { ...p[key], approved: next, sourceChanged: next ? false : p[key].sourceChanged } }));
		await fetch(`/api/content/project/${key}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ approved: next }),
		});
		addLog(`${next ? 'approved' : 'unapproved'} project[${key}]${next ? ' — locked (approved:true)' : ''}`, next ? C.success : C.note);
	};

	// ── Generate ───────────────────────────────────────────────────────────────────────────
	// actionId identifies the exact button pressed so only it shows "generating…".
	const generate = async (target: 'work' | 'project' | 'all', force: boolean, key?: string) => {
		if (running) return; // one generate at a time
		const actionId = target === 'all' ? 'all' : key ? `${target}:regen:${key}` : force ? `${target}:force` : `${target}:drafts`;
		const scriptName =
			target === 'all' ? 'generate:content' : target === 'work' ? 'generate:work-experience-content' : 'generate:project-content';
		const flag = force ? (key ? ` --force ${key}` : ' --force') : '';
		setRunning(actionId);
		addLog(`$ GEMINI_MODEL=${model} npm run ${scriptName}${flag}`, C.cmd);
		addLog('  calling Gemini… this can take a while for a full redraft', C.dim);
		showBusy(`running ${scriptName} — drafting via Gemini. Scroll to the console to follow along.`);

		// Guard against a hung dev request (real Gemini calls can be slow) so the button can't
		// spin forever — abort after 3 minutes and surface a clear failure.
		const ac = new AbortController();
		const timeout = setTimeout(() => ac.abort(), 180_000);
		try {
			const res = await fetch('/api/content/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ target, force, key, model }),
				signal: ac.signal,
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				throw new Error(d.error || 'generate request rejected');
			}
			const { ok } = await consumeStream(res);
			addLog(ok ? 'done — drafts written (approved:false)' : '✕ generate failed — see output above', ok ? C.success : C.error);
			await refreshState();
			if (ok) showFlash('success', `✓ ${scriptName} done — new drafts landed as approved: false`);
			else showFlash('error', `✕ ${scriptName} failed — see the console below`);
		} catch (err) {
			const aborted = err instanceof DOMException && err.name === 'AbortError';
			const msg = aborted
				? `✕ ${scriptName} timed out — check the terminal / your GEMINI_API_KEY`
				: `✕ ${scriptName} request failed — is the dev server running?`;
			addLog(msg, C.error);
			showFlash('error', msg);
			// The script may still have written files server-side; re-sync so the UI matches disk.
			await refreshState().catch(() => {});
		} finally {
			clearTimeout(timeout);
			setRunning(null);
		}
	};

	// ── Visibility config toggles ─────────────────────────────────────────────────────────────
	const writeConfig = (next: Record<string, ConfigEntry>) => {
		clearTimeout(debounce.current['cfg']);
		debounce.current['cfg'] = setTimeout(() => {
			fetch('/api/content/config', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ experiences: next }),
			});
		}, 400);
	};
	const cfgOf = (key: string): ConfigEntry =>
		config[key] ?? { hidden: false, hideAllAccomplishments: false, hideAccomplishments: [], hideTechnologies: false };
	const toggleCfg = (key: string, field: keyof ConfigEntry) => {
		const cur = cfgOf(key);
		const entry = { ...cur, [field]: !cur[field] } as ConfigEntry;
		const next = { ...config, [key]: entry };
		setConfig(next);
		writeConfig(next);
		addLog(`config: ${key} ${field}=${entry[field]} — applies on next parse`, C.note);
	};
	const toggleAcc = (key: string, n: number) => {
		const cur = cfgOf(key);
		const set = new Set(cur.hideAccomplishments ?? []);
		if (set.has(n)) set.delete(n);
		else set.add(n);
		const entry = { ...cur, hideAccomplishments: [...set].sort((a, b) => a - b) };
		const next = { ...config, [key]: entry };
		setConfig(next);
		writeConfig(next);
	};

	// ── Derived counts ────────────────────────────────────────────────────────────────────
	const workApproved = WORK_ORDER.filter((k) => work[k]?.approved).length;
	const projApproved = PROJ_ORDER.filter((k) => proj[k]?.approved).length;
	const expById = (id: number) => experiences.find((e) => e.id === id);
	const projById = (id: number) => projects.find((p) => p.id === id);

	// ── Render ──────────────────────────────────────────────────────────────────────────────
	return (
		<div className="cg-root">
			{/* TOP BAR (shared component) */}
			<TopBar
				crumb="~/content-generation"
				brandHref="/"
				brandLabel="Back to site"
				links={[
					{ href: '#how', label: 'How it works' },
					{ href: '#editor', label: 'Editor' },
					{ href: '/', label: '← Back to site', variant: 'contact' },
				]}
			/>

			{/* HERO */}
			<section className="section cg-hero">
				<div className="cg-hero__inner">
					<div className="cg-hero__prompt">
						<span className="hero__prompt-sign">$</span> cat ./how-content-is-generated
						<span className="caret" aria-hidden />
					</div>
					<h1 className="cg-hero__h1">
						CONTENT
						<br />
						PIPELINE
					</h1>
					<p className="cg-hero__intro">
						The résumé and project copy on this site isn&apos;t hand-typed into components. A single LaTeX master résumé
						is parsed into data, an LLM drafts the prose, taglines and commit subjects, and every draft is reviewed and
						approved before it ships. Below: how it flows — then the console to drive it.
					</p>
					<div className="cg-hero__meta">
						<span>
							source of truth <span className="cg-strong">{CONTENT_FILES.masterResume}</span>
						</span>
						<span className="cg-pipe-sep">|</span>
						<span>
							drafts by <span className="cg-strong">{modelObj.label}</span>
						</span>
						<span className="cg-pipe-sep">|</span>
						<span>
							<span className="dot-green">●</span> approve-to-publish
						</span>
					</div>
				</div>
			</section>

			{/* 01 · HOW IT WORKS */}
			<section id="how" className="section section--warm cg-section">
				<div className="cg-section__inner">
					<div className="cg-section__head">
						<span className="cg-section__num">[ 01 ]</span>
						<span className="cg-section__label">HOW IT WORKS</span>
						<span className="cg-section__cmd">$ ./pipeline --watch</span>
					</div>
					<PipelineDiagram modelLabel={modelObj.label} modelShort={modelObj.short} />
				</div>
			</section>

			{/* 02 · EDITOR */}
			<section id="editor" className="section cg-section">
				<div className="cg-section__inner">
					<div className="cg-section__head">
						<span className="cg-section__num">[ 02 ]</span>
						<span className="cg-section__label">EDITOR</span>
						<span className="cg-section__cmd">$ sudo edit ./data</span>
					</div>

					{/* AUTH BAR */}
					<div className={`cg-auth${unlocked ? ' is-unlocked' : ''}`}>
						<div className="cg-auth__status">
							<span className={`cg-lockdot${unlocked ? ' is-on' : ''}`} aria-hidden />
							<div>
								<div className="cg-auth__title">
									{unlocked ? 'EDIT MODE' : production ? 'READ-ONLY SHOWCASE' : 'READ-ONLY'}
								</div>
								<div className="cg-auth__sub">
									{unlocked ? (
										'Authenticated — editing and generation are enabled (localhost).'
									) : production ? (
										<>
											This console is a live authoring tool. Run locally, it lets the owner edit the master résumé,
											re-run the parser, review &amp; approve the AI-drafted copy, switch the Gemini model, and
											regenerate everything. It&apos;s <span className="cg-strong">read-only in production</span>{' '}&mdash; the
											public site can&apos;t be edited here, only viewed.
										</>
									) : (
										'Enter the password to edit the résumé, review & approve AI drafts, pick the model, and generate content.'
									)}
								</div>
							</div>
						</div>
						<div className="cg-auth__actions">
							{unlocked ? (
								<>
									<span className="cg-auth__ok">● authenticated</span>
									<button className="cg-btn cg-btn--ghost" onClick={onLock}>
										lock
									</button>
								</>
							) : production ? (
								<span className="cg-auth__ro" title="Editing works only when the site runs on localhost">
									◆ editable on localhost only
								</span>
							) : (
								<>
									<input
										type="password"
										className="cg-input cg-input--pw"
										placeholder="CONTENT_GENERATION_PASSWORD"
										value={pwInput}
										onChange={(e) => {
											setPwInput(e.target.value);
											setPwError('');
										}}
										onKeyDown={(e) => {
											if (e.key === 'Enter') onUnlock();
										}}
									/>
									<button className="cg-btn cg-btn--primary" onClick={onUnlock}>
										unlock ↵
									</button>
								</>
							)}
						</div>
						{pwError && <div className="cg-auth__err">✕ {pwError}</div>}
					</div>

					{/* MODEL SELECTOR */}
					<div className="cg-model">
						<div>
							<div className="cg-model__label">AI MODEL</div>
							<div className="cg-model__sub">used by every generate:* run — Google Gemini</div>
						</div>
						<div className="cg-model__pick">
							<span className="cg-model__eq">GEMINI_MODEL =</span>
							<ModelSelect value={model} options={MODELS} disabled={locked} onChange={onModel} />
						</div>
					</div>

					{/* TABS */}
					<div className="cg-tabs">
						{([
							['resume', CONTENT_FILES.masterResume],
							['work', CONTENT_FILES.workContent],
							['projects', CONTENT_FILES.projectContent],
						] as const).map(([id, label]) => (
							<button
								key={id}
								className={`cg-tab${activeTab === id ? ' is-active' : ''}`}
								onClick={() => setActiveTab(id)}
							>
								{label}
							</button>
						))}
					</div>

					{!loaded && <div className="cg-loading">loading content state…</div>}

					{loaded && activeTab === 'resume' && renderResumeTab()}
					{loaded && activeTab === 'work' && renderWorkTab()}
					{loaded && activeTab === 'projects' && renderProjectsTab()}

					{/* GENERATE ALL */}
					<div className="cg-genall">
						<div>
							<div className="cg-genall__label">GENERATE ALL CONTENT</div>
							<div className="cg-genall__body">
								Runs <span className="cg-strong">npm run generate:content</span> with{' '}
								<span className="cg-strong">GEMINI_MODEL={model}</span> — drafts every unapproved or source-changed role
								&amp; project (approved + unchanged entries are skipped), each landing as{' '}
								<span className="cg-accent">approved: false</span> for review above.
							</div>
							<div className="cg-genall__count">
								{workApproved}/{WORK_ORDER.length} roles · {projApproved}/{PROJ_ORDER.length} projects approved · commit the
								changed files from your editor when done
							</div>
						</div>
						<button
							className="cg-btn cg-btn--primary cg-btn--lg"
							disabled={locked || isRunning}
							onClick={() => generate('all', false)}
						>
							{running === 'all' ? 'generating…' : '$ npm run generate:content'}
						</button>
					</div>

					{/* TERMINAL */}
					<div className="cg-term" id="cg-console">
						<div className="cg-term__bar">
							<span className="cg-term__dot cg-term__dot--r" />
							<span className="cg-term__dot cg-term__dot--y" />
							<span className="cg-term__dot cg-term__dot--g" />
							<span className="cg-term__title">ariq@muldi — content-console</span>
						</div>
						<div className="cg-term__body" ref={termRef}>
							{log.map((l, i) => (
								<div key={i} className="cg-term__line" style={{ color: l.c }}>
									{l.t}
								</div>
							))}
						</div>
					</div>

					<p className="cg-note">
						local-development authoring tool — each button hits a Next.js route that runs the matching script
						(parse:resume · generate:* with <span className="cg-strong">GEMINI_MODEL</span>) and writes the files on your
						machine; you then commit them with git. Editing only works on <span className="cg-strong">localhost</span>: the
						unlock route checks the password against <span className="cg-strong">CONTENT_GENERATION_PASSWORD</span>{' '}
						server-side and refuses in production, so the deployed site stays read-only.
					</p>
				</div>
			</section>

			{/* FOOTER (shared component) */}
			<Footer
				items={[
					<>
						<span className="dot-green">●</span> content pipeline
					</>,
					<a className="site-footer__link" href="/" key="back">
						← ariqmuldi.com
					</a>,
				]}
			/>

			{/* Bottom-right toast: persistent 'busy' (click → jump to console) or auto-dismissing result. */}
			{flash && (
				<div
					className={`cg-toast cg-toast--${flash.kind}${flashLeaving ? ' is-leaving' : ''}`}
					role="status"
					aria-live="polite"
					onClick={flash.kind === 'busy' ? scrollToConsole : dismissFlash}
					title={flash.kind === 'busy' ? 'Jump to the console' : 'Dismiss'}
				>
					<span className={`cg-toast__dot${flash.kind === 'busy' ? ' cg-toast__dot--pulse' : ''}`} aria-hidden />
					<span className="cg-toast__text">{flash.text}</span>
					<span className="cg-toast__close" aria-hidden>
						{flash.kind === 'busy' ? '↓' : '✕'}
					</span>
				</div>
			)}
		</div>
	);

	// ── Tab renderers (closures over state) ──────────────────────────────────────────────────
	function renderResumeTab() {
		return (
			<div className="cg-tabpanel">
				<div className="cg-tex-grid">
					<div>
						<div className="cg-field-head">
							<span className="cg-field-head__label">{CONTENT_PATHS.masterResume.toUpperCase()}</span>
							<span className={`cg-dirty${texDirty ? ' is-dirty' : ''}`}>
								{texDirty ? '● unsaved — run parse' : '✓ in sync'}
							</span>
						</div>
						<textarea
							className="cg-code"
							value={tex}
							spellCheck={false}
							disabled={locked}
							onChange={(e) => {
								setTex(e.target.value);
								setTexDirty(true);
							}}
						/>
						<div className="cg-tex-actions">
							<button className="cg-btn cg-btn--primary" disabled={locked || parsing} onClick={onParse}>
								{parsing ? 'parsing…' : '$ parse:resume'}
							</button>
							<span className="cg-hint">
								runs <span className="cg-hint__cmd">npm run parse:resume</span> → regenerates the 4 data files
							</span>
						</div>
					</div>
					<div>
						<div className="cg-field-head__label cg-mb">PREVIEW YOUR CHANGES</div>
						<div className="cg-preview-card">
							<div className="cg-preview-card__body">
								Editing the résumé regenerates the data files. To see how the changes look, open the live site — the
								Experience &amp; Projects sections render straight from this data.
							</div>
							<a
								className="cg-btn cg-btn--primary cg-preview-card__link"
								href="/"
								target="_blank"
								rel="noopener"
							>
								view on ariqmuldi.com ↗
							</a>
							<div className="cg-preview-card__note">
								opens the site · local edits show after a re-parse; the deployed site updates once you commit &amp; push
							</div>
						</div>
						<div className="cg-lastparse">
							<div className="cg-lastparse__label">LAST PARSE</div>
							<div>
								experiences <span className="cg-strong">{experiences.length}</span> · projects{' '}
								<span className="cg-strong">{projects.length}</span> · skills <span className="cg-strong">{skillsCount}</span>{' '}
								· education <span className="cg-strong">1</span>
							</div>
							<div className="cg-lastparse__hint">
								changed source flips affected AI entries back to <span className="cg-accent">approved: false</span> for
								re-review.
							</div>
						</div>
					</div>
				</div>

				{/* resume-config visibility */}
				<div className="cg-config">
					<div className="cg-field-head__label">{CONTENT_PATHS.resumeConfig.toUpperCase()} — VISIBILITY</div>
					<div className="cg-config__lead">
						Hide an experience, all/specific accomplishments, or its technologies. Applied by the parser on next run.
					</div>
					{CONFIG_KEYS.map(({ key, expId }) => {
						const c = cfgOf(key);
						const exp = expById(expId);
						const accCount = exp?.accomplishments.length ?? 0;
						const hiddenSet = new Set(c.hideAccomplishments ?? []);
						const showChips = accCount > 0 && !c.hideAllAccomplishments;
						return (
							<div className="cg-config__row" key={key}>
								<div>
									<div className={`cg-config__title${c.hidden ? ' is-hidden' : ''}`}>{key}</div>
									<div className="cg-config__meta">
										experienceId {expId} · {accCount} accomplishments
									</div>
									{showChips && (
										<div className="cg-chips">
											<span className="cg-chips__label">hide #</span>
											{Array.from({ length: accCount }, (_, i) => i + 1).map((n) => (
												<button
													key={n}
													className={`cg-chip${hiddenSet.has(n) ? ' is-on' : ''}`}
													disabled={locked}
													onClick={() => toggleAcc(key, n)}
												>
													{n}
												</button>
											))}
										</div>
									)}
								</div>
								<div className="cg-config__toggles">
									<button
										className={`cg-toggle${c.hidden ? ' is-on-dark' : ''}`}
										disabled={locked}
										onClick={() => toggleCfg(key, 'hidden')}
									>
										{c.hidden ? '● hidden' : 'hide role'}
									</button>
									<button
										className={`cg-toggle${c.hideAllAccomplishments ? ' is-on' : ''}`}
										disabled={locked}
										onClick={() => toggleCfg(key, 'hideAllAccomplishments')}
									>
										hide all bullets
									</button>
									<button
										className={`cg-toggle${c.hideTechnologies ? ' is-on' : ''}`}
										disabled={locked}
										onClick={() => toggleCfg(key, 'hideTechnologies')}
									>
										hide tech
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	function renderWorkTab() {
		return (
			<div className="cg-tabpanel">
				<div className="cg-genbar">
					<span className="cg-genbar__cmd">
						$ npm run <span className="cg-strong">generate:work-experience-content</span>
					</span>
					<span className="cg-genbar__count">
						{workApproved}/{WORK_ORDER.length} approved
					</span>
						{running?.startsWith('work') && <span className="cg-genbar__running">● generating…</span>}
					<div className="cg-genbar__actions">
						<button className="cg-btn cg-btn--primary" disabled={locked || isRunning} onClick={() => generate('work', false)}>
							{running === 'work:drafts' ? 'generating…' : 'generate (drafts)'}
						</button>
						<button className="cg-btn cg-btn--ghost" disabled={locked || isRunning} onClick={() => generate('work', true)}>
							{running === 'work:force' ? 'generating…' : '--force (redraft all)'}
						</button>
					</div>
				</div>

				{WORK_ORDER.map((key) => {
					const w = work[key];
					if (!w) return null;
					const meta = ROLE_META[key];
					const exp = expById(meta.experienceId);
					const { role, context } = exp ? splitTitle(exp) : { role: key, context: '' };
					const at = exp ? shortCompany(exp.company) + (context ? ` · ${context}` : '') : '';
					const expandable = (exp?.accomplishments.length ?? 0) > 0;
					const insertions = exp?.accomplishments.length ?? 0;
					const techLine = (w.technologies ?? []).join(' · ');
					const idx = WORK_ORDER.indexOf(key);
					const workNum = String(idx + 1).padStart(2, '0');

					return (
						<div className="cg-card" key={key}>
							{/* edit side */}
							<div>
								<div className="cg-card__head">
									<span className="cg-card__key">{key}</span>
									<span className="cg-card__meta">experienceId {w.experienceId}</span>
									<span className="cg-card__meta">#{w.sourceHash}</span>
									<span className={`cg-badge${w.approved ? ' is-approved' : ''}`}>
										{w.approved ? '● approved' : '○ draft'}
									</span>
								</div>
								{w.sourceChanged && (
									<div className="cg-warn">⚠ source changed since approval — needs re-review</div>
								)}

								<div className="cg-lbl">
									COMMIT SUBJECT <span className="cg-lbl__dim">· Experience row</span>
								</div>
								<input
									className="cg-input"
									value={w.commitSubject ?? ''}
									spellCheck={false}
									disabled={locked}
									onChange={(e) => editCommit(key, e.target.value)}
								/>

								<div className="cg-lbl cg-lbl--gap">
									TECHNOLOGIES <span className="cg-lbl__dim">· comma-separated · shared by Work + Experience</span>
								</div>
								<input
									className="cg-input"
									value={(w.technologies ?? []).join(', ')}
									spellCheck={false}
									disabled={locked}
									onChange={(e) => editTech(key, e.target.value)}
								/>

								{meta.hasDescription ? (
									<>
										<div className="cg-lbl cg-lbl--gap">
											DESCRIPTION <span className="cg-lbl__dim">· Work case-study card</span>
										</div>
										<textarea
											className="cg-input cg-textarea"
											value={w.description ?? ''}
											spellCheck={false}
											disabled={locked}
											onChange={(e) => editDesc(key, e.target.value)}
										/>
									</>
								) : (
									<div className="cg-nodesc">{NO_DESC_NOTE[key]}</div>
								)}

								<div className="cg-card__actions">
									<button
										className={`cg-btn ${w.approved ? 'cg-btn--ghost' : 'cg-btn--approve'}`}
										disabled={locked}
										onClick={() => approveWork(key)}
									>
										{w.approved ? '✓ approved — unlock' : 'approve & lock'}
									</button>
									<button className="cg-btn cg-btn--ghost" disabled={locked || isRunning} onClick={() => generate('work', true, key)}>
										{running === `work:regen:${key}` ? 'generating…' : `regenerate --force ${key}`}
									</button>
								</div>
							</div>

							{/* preview side */}
							<div className="cg-card__preview">
								<div className="cg-preview__label">LIVE PREVIEW</div>
								<div className="cg-prev-exp">
									<span className="cg-prev-exp__hash">{fakeCommitHash(meta.experienceId)}</span>
									<div>
										<div className="cg-prev-exp__title">
											{role} <span className="cg-prev-exp__at">@ {at}</span>
										</div>
										{expandable ? (
											<>
												{w.commitSubject && <div className="cg-prev-exp__summary">{w.commitSubject}</div>}
												<div className="cg-prev-exp__hint">
													<span className="cg-ins">+{insertions} insertions</span> · git show ▸
												</div>
											</>
										) : (
											<div className="cg-prev-exp__active">
												<span className="dot-green">●</span> in active development
											</div>
										)}
										{techLine && <div className="cg-prev-exp__tech">{techLine}</div>}
									</div>
								</div>

								{meta.hasDescription && (
									<div className="cg-prev-work">
										<div className="cg-prev-work__meta">
											<span className="cg-prev-work__num">{workNum}</span>
											<span>{(shortCompany(exp?.company ?? '') + ' · ' + role).toUpperCase()}</span>
											<span className="cg-prev-work__live">● LIVE</span>
										</div>
										<div className="cg-prev-work__title">{role}</div>
										<div className="cg-prev-work__body">{w.description}</div>
										<div className="cg-prev-work__tech">{techLine}</div>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	function renderProjectsTab() {
		return (
			<div className="cg-tabpanel">
				<div className="cg-genbar">
					<span className="cg-genbar__cmd">
						$ npm run <span className="cg-strong">generate:project-content</span>
					</span>
					<span className="cg-genbar__count">
						{projApproved}/{PROJ_ORDER.length} approved
					</span>
						{running?.startsWith('project') && <span className="cg-genbar__running">● generating…</span>}
					<div className="cg-genbar__actions">
						<button className="cg-btn cg-btn--primary" disabled={locked || isRunning} onClick={() => generate('project', false)}>
							{running === 'project:drafts' ? 'generating…' : 'generate (drafts)'}
						</button>
						<button className="cg-btn cg-btn--ghost" disabled={locked || isRunning} onClick={() => generate('project', true)}>
							{running === 'project:force' ? 'generating…' : '--force (redraft all)'}
						</button>
					</div>
				</div>

				{PROJ_ORDER.map((key) => {
					const p = proj[key];
					if (!p) return null;
					const pd = projById(p.projectId);
					const num = String(PROJ_ORDER.indexOf(key) + 1).padStart(2, '0');
					const title = pd?.title ?? key;
					const techLine = (pd?.technologies ?? []).join(' · ');
					const tagline = p.tagline || (pd ? firstSentence(pd.description) : '');

					return (
						<div className="cg-card" key={key}>
							<div>
								<div className="cg-card__head">
									<span className="cg-card__key">{key}</span>
									<span className="cg-card__meta">projectId {p.projectId}</span>
									<span className="cg-card__meta">#{p.sourceHash}</span>
									<span className={`cg-badge${p.approved ? ' is-approved' : ''}`}>
										{p.approved ? '● approved' : '○ draft'}
									</span>
								</div>
								{p.sourceChanged && <div className="cg-warn">⚠ source changed since approval — needs re-review</div>}

								<div className="cg-lbl">
									TAGLINE <span className="cg-lbl__dim">· collapsed Projects row</span>
								</div>
								<input
									className="cg-input"
									value={p.tagline ?? ''}
									spellCheck={false}
									disabled={locked}
									onChange={(e) => editTagline(key, e.target.value)}
								/>
								<div className="cg-subhint">fallback: first sentence of the parsed description</div>

								<div className="cg-card__actions">
									<button
										className={`cg-btn ${p.approved ? 'cg-btn--ghost' : 'cg-btn--approve'}`}
										disabled={locked}
										onClick={() => approveProj(key)}
									>
										{p.approved ? '✓ approved — unlock' : 'approve & lock'}
									</button>
									<button className="cg-btn cg-btn--ghost" disabled={locked || isRunning} onClick={() => generate('project', true, key)}>
										{running === `project:regen:${key}` ? 'generating…' : `regenerate --force ${key}`}
									</button>
								</div>
							</div>

							<div className="cg-card__preview">
								<div className="cg-preview__label">LIVE PREVIEW</div>
								<div className="cg-prev-proj">
									<span className="cg-prev-proj__num">[{num}]</span>
									<div>
										<div className="cg-prev-proj__title">{title}</div>
										{tagline && <div className="cg-prev-proj__tagline">{tagline}</div>}
										{techLine && <div className="cg-prev-proj__tech">{techLine}</div>}
									</div>
									<span className="cg-prev-proj__link">↗</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}
