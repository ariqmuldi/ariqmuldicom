import { redirect } from 'next/navigation';
import { isUnlocked } from '../non-routes/lib/adzra-auth';
import { getEntry } from '../non-routes/data/entries';
import LimeExperience from '../non-routes/components/LimeExperience';

// Cookie-gated → always rendered per-request; never statically prerendered.
export const dynamic = 'force-dynamic';

// "For Sayang, Working in the UK" — the one-off. This is the original /adzra lime experience,
// preserved exactly (it brings its own full-screen layout), with a back arrow to the collection.
export default async function July4Page() {
	if (!(await isUnlocked())) redirect('/adzra');
	const entry = getEntry('july4-2026')!;
	return <LimeExperience message={entry.limeMessage ?? ''} />;
}
