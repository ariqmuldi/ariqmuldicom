import { redirect } from 'next/navigation';
import { isUnlocked } from '../non-routes/lib/adzra-auth';
import { getEntry } from '../non-routes/data/entries';
import StandardDetail from '../non-routes/components/StandardDetail';

// Cookie-gated → always rendered per-request; never statically prerendered.
export const dynamic = 'force-dynamic';

// "2 Months" — standard layout (plus the "came with flowers" pill from its entry data).
export default async function TwoMonthsPage() {
	if (!(await isUnlocked())) redirect('/adzra');
	return <StandardDetail entry={getEntry('june17-2026')!} />;
}
