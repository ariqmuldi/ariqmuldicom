import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { requireEditable } from '@/app/lib/content-guard';

// Streams the generator's stdout/stderr live (newline-delimited) so the in-page console fills in
// as Gemini drafts each role/project, instead of dumping everything at the end. A final
// `__CG_DONE__:{json}` line carries the outcome. `target:'all'` runs both generators in sequence.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED = new Set(['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash']);
const SCRIPT = {
	work: 'generate:work-experience-content',
	project: 'generate:project-content',
} as const;

export async function POST(req: Request) {
	const denied = await requireEditable();
	if (denied) return denied;

	const body = await req.json().catch(() => ({}));
	const target: 'work' | 'project' | 'all' = ['work', 'project', 'all'].includes(body.target) ? body.target : 'all';
	const model = ALLOWED.has(body.model) ? body.model : process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
	const flags: string[] = [];
	if (body.force) {
		flags.push('--force');
		if (typeof body.key === 'string' && body.key) flags.push(body.key);
	}
	const targets: ('work' | 'project')[] = target === 'all' ? ['work', 'project'] : [target];

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			const send = (s: string) => {
				try {
					controller.enqueue(encoder.encode(s));
				} catch {
					/* controller may already be closed on abort */
				}
			};
			let ok = true;
			let aborted = req.signal.aborted;
			req.signal.addEventListener('abort', () => {
				aborted = true;
			});

			for (const t of targets) {
				if (aborted) {
					ok = false;
					break;
				}
				const args = ['run', SCRIPT[t], ...(flags.length ? ['--', ...flags] : [])];
				const code = await new Promise<number>((resolve) => {
					const child = spawn('npm', args, {
						cwd: process.cwd(),
						env: { ...process.env, GEMINI_MODEL: model },
						shell: false,
					});
					const kill = () => child.kill();
					req.signal.addEventListener('abort', kill);
					child.stdout.on('data', (d) => send(d.toString()));
					child.stderr.on('data', (d) => send(d.toString()));
					child.on('error', (e) => send(`${e}\n`));
					child.on('close', (c) => {
						req.signal.removeEventListener('abort', kill);
						resolve(c ?? 1);
					});
				});
				if (code !== 0) ok = false;
			}

			send(`\n__CG_DONE__:${JSON.stringify({ ok: ok && !aborted, model })}\n`);
			controller.close();
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'no-cache, no-transform',
			'X-Accel-Buffering': 'no',
		},
	});
}
