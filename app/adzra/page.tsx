import { isUnlocked } from './non-routes/lib/adzra-auth';
import { ENTRIES } from './non-routes/data/entries';
import Lock from './non-routes/components/Lock';
import Collection, { type CollectionCard } from './non-routes/components/Collection';

// Cookie-gated → always rendered per-request; never statically prerendered.
export const dynamic = 'force-dynamic';

// The entry point to The Sayang Collection. On the server we decide what this request is allowed
// to see: the lock gate until authenticated, the collection after. Collection data (covers, titles)
// is only assembled and sent once the session cookie is valid — never before.
export default async function AdzraPage() {
	if (!(await isUnlocked())) return <Lock />;

	const cards: CollectionCard[] = ENTRIES.map((e) => ({
		slug: e.slug,
		no: e.no,
		plateTitle: e.plateTitle,
		tapHint: e.tapHint,
		cover: e.cover,
		ringColor: e.ringColor,
		objectPosition: e.objectPosition,
	}));

	return <Collection cards={cards} />;
}
