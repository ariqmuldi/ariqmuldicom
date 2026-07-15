import { redirect } from 'next/navigation';
import { isUnlocked } from '../non-routes/lib/adzra-auth';
import { getEntry } from '../non-routes/data/entries';
import StandardDetail from '../non-routes/components/StandardDetail';

// Cookie-gated → always rendered per-request; never statically prerendered.
export const dynamic = 'force-dynamic';

// "1 Month" — the standard memory layout. Each month is its own route so it can grow its own
// design over time (see july17-2026); today this one uses the shared StandardDetail.
export default async function OneMonthPage() {
	if (!(await isUnlocked())) redirect('/adzra');
	return <StandardDetail entry={getEntry('may17-2026')!} />;
}
