import { redirect } from 'next/navigation';
import { isUnlocked } from '../non-routes/lib/adzra-auth';
import { getEntry } from '../non-routes/data/entries';
import StandardDetail from '../non-routes/components/StandardDetail';

// Cookie-gated → always rendered per-request; never statically prerendered.
export const dynamic = 'force-dynamic';

// "3 Months" — its own route, so when the day comes this page can take on a different design from
// the earlier months (a new layout, extra sections, etc.). For now it reuses StandardDetail, which
// renders a soft "to be written & pressed" placeholder for the message.
export default async function ThreeMonthsPage() {
	if (!(await isUnlocked())) redirect('/adzra');
	return <StandardDetail entry={getEntry('july17-2026')!} />;
}
