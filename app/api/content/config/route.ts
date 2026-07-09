import { NextResponse } from 'next/server';
import { requireEditable } from '@/app/lib/content-guard';
import { PATHS, readJson, writeText } from '@/app/lib/content-files';

// Visibility toggles → data/source/resume-config.json. Merges into the `experiences` block (the parser
// regenerates the `_instructions` block on the next run). Changes apply on the NEXT parse, so the
// UI prompts a re-parse after changing them.
interface ConfigEntry {
	hidden: boolean;
	hideAllAccomplishments: boolean;
	hideAccomplishments: number[];
	hideTechnologies: boolean;
}

export async function PUT(req: Request) {
	const denied = await requireEditable();
	if (denied) return denied;

	const body = await req.json().catch(() => ({}));
	const incoming = body.experiences as Record<string, ConfigEntry> | undefined;
	if (!incoming || typeof incoming !== 'object') {
		return NextResponse.json({ ok: false, error: 'missing experiences' }, { status: 400 });
	}

	const config = await readJson<{ experiences?: Record<string, ConfigEntry> } & Record<string, unknown>>(
		PATHS.config,
		{}
	);
	config.experiences = { ...(config.experiences ?? {}), ...incoming };
	await writeText(PATHS.config, JSON.stringify(config, null, 2) + '\n');
	return NextResponse.json({ ok: true });
}
