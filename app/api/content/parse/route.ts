import { requireEditable } from '@/app/lib/content-guard';
import { spawn } from 'child_process';

// Streams `npm run parse:resume` stdout/stderr live (newline-delimited) into the in-page console,
// with a trailing `__CG_DONE__:{json}` line carrying the outcome. parse:resume rewrites
// app/data/*.ts and auto-updates app/data/resume-config.json; the client re-GETs /state after.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
	const denied = await requireEditable();
	if (denied) return denied;

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		start(controller) {
			const send = (s: string) => {
				try {
					controller.enqueue(encoder.encode(s));
				} catch {
					/* closed on abort */
				}
			};
			const child = spawn('npm', ['run', 'parse:resume'], { cwd: process.cwd(), env: process.env, shell: false });
			const kill = () => child.kill();
			req.signal.addEventListener('abort', kill);
			child.stdout.on('data', (d) => send(d.toString()));
			child.stderr.on('data', (d) => send(d.toString()));
			child.on('error', (e) => send(`${e}\n`));
			child.on('close', (c) => {
				req.signal.removeEventListener('abort', kill);
				send(`\n__CG_DONE__:${JSON.stringify({ ok: (c ?? 1) === 0 })}\n`);
				controller.close();
			});
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
