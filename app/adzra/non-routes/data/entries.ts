// The Sayang Collection — the single source of truth for every memory.
//
// The lock, the collection, and all detail routes are generated from this list, so adding a new
// memory is a one-object edit (that's the "growing collection" goal). Order here is the order in
// the press (no. 01 first). Each entry's `slug` becomes its route: /adzra/<slug>.
//
// Route-local assets in `non-routes/public/` — a plain folder (NOT the Next.js root /public static
// dir, and named so it's clearly not a route segment). Importing the images as modules lets webpack
// bundle them into hashed, unguessable URLs instead of exposing them at a predictable public path,
// which keeps the /adzra route self-contained and its photos unguessable in production.
import type { StaticImageData } from 'next/image';

import confessionFlowers from '../public/adzra-and-i-pic-with-confession-flowers.jpeg';
import bloomed1 from '../public/adzra-2-months-bloomed-flowers-1.jpeg';
import bloomed2 from '../public/adzra-2-months-bloomed-flowers-2.jpeg';
import beforeBloom from '../public/adzra-2-months-before-bloom.jpeg';
import limeCloseup from '../public/lime-closeup.jpeg';
import oxford from '../public/adzra-in-oxford.jpeg';

// The "main thing" on a detail page:
//  - 'message'     → a chat mockup (the message I sent)
//  - 'lime'        → the click-to-reveal lime experience (the July 4 one-off)
//  - 'placeholder' → a soft dashed "to be written & pressed" box (not yet lived)
export type MainType = 'message' | 'lime' | 'placeholder';

export interface ChatBubble {
	/** The bubble text. The long ones flow/wrap naturally. */
	text: string;
	/** Small timestamp shown under the bubble, e.g. "9:41 pm". */
	time: string;
}

export interface ChatMessage {
	/** Centered date chip at the top of the thread. */
	dateChip: string;
	/** Right-aligned outgoing bubbles, top → bottom. */
	bubbles: ChatBubble[];
}

export interface Entry {
	slug: string;
	no: number;
	/** Big serif title on the collection plate (e.g. "1 Month"). */
	plateTitle: string;
	/** Full serif title on the detail page (may differ / include an emoji). */
	detailTitle: string;
	/** Mono eyebrow date on the detail page, e.g. "may 17, 2026". */
	dateEyebrow: string;
	/** Handwritten "tap to open" flourish on the plate. */
	tapHint: string;
	cover: StaticImageData;
	/** Per-entry inset ring colour on the plate + active thumbnail accent. */
	ringColor: string;
	/** CSS object-position for the cover/carousel crop (e.g. "center 30%" to show a subject that
	 * sits high or low in the frame). Defaults to "center" when omitted. */
	objectPosition?: string;
	/** Carousel photos (first is usually the cover). */
	photos: StaticImageData[];
	/** Extra empty "+ another photo" hatch slots appended after `photos`. */
	extraPhotoSlots: number;
	/** The Caveat "a little note" blurb. */
	noteBlurb: string;
	/** Shows the "🌷 came with flowers" pill under the note. */
	cameWithFlowers?: boolean;
	mainType: MainType;
	/** Eyebrow above the main thing (message entries), e.g. "the message I sent". */
	mainEyebrow?: string;
	message?: ChatMessage;
	/** Reveal note for the lime entry (mainType 'lime'). */
	limeMessage?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  ✏️  The memories. Replace any [ bracketed ] copy with your own words, sayang.
// ─────────────────────────────────────────────────────────────────────────────
export const ENTRIES: Entry[] = [
	{
		slug: 'may17-2026',
		no: 1,
		plateTitle: '1 Month',
		detailTitle: 'One Month 🤍',
		dateEyebrow: 'may 17, 2026',
		tapHint: 'tap to open 🤍',
		cover: confessionFlowers,
		ringColor: '#A9BE8A',
		photos: [confessionFlowers],
		extraPhotoSlots: 2,
		noteBlurb:
			'[ a short blurb about this memory — what one month meant, where we were, how I felt. Replace with your own words, sayang. ]',
		mainType: 'message',
		mainEyebrow: 'the message I sent',
		message: {
			dateChip: 'May 17, 2026',
			bubbles: [
				{ text: 'Happy one month, sayang 🤍', time: '9:41 pm' },
				{
					text: '[ paste your long one-month message here — it will flow inside this bubble exactly like the real thread. Keep it as long as you like. ]',
					time: '9:41 pm',
				},
			],
		},
	},
	{
		slug: 'june17-2026',
		no: 2,
		plateTitle: '2 Months',
		detailTitle: 'Two Months 🌸',
		dateEyebrow: 'june 17, 2026',
		tapHint: 'tap to open 🌸',
		cover: bloomed1,
		ringColor: '#E79ABF',
		photos: [bloomed1, bloomed2, beforeBloom],
		extraPhotoSlots: 0,
		noteBlurb:
			'[ two months in — and this time I sent you lilies 🌷. A short blurb about the flowers and the message. Replace with your words. ]',
		cameWithFlowers: true,
		mainType: 'message',
		mainEyebrow: 'the message I sent',
		message: {
			dateChip: 'June 17, 2026',
			bubbles: [
				{ text: 'happy 2 months, my sayang 🌷', time: '8:12 pm' },
				{
					text: '[ paste your two-month message here — same as the one-month page, room for as much as you want. ]',
					time: '8:12 pm',
				},
			],
		},
	},
	{
		slug: 'july4-2026',
		no: 3,
		plateTitle: 'For Sayang, Working in the UK',
		detailTitle: 'For Sayang, Working in the UK',
		dateEyebrow: 'july 4, 2026',
		tapHint: 'tap to open 🍋',
		cover: limeCloseup,
		ringColor: '#DE5551',
		photos: [limeCloseup],
		extraPhotoSlots: 0,
		noteBlurb: '',
		mainType: 'lime',
		// Ported from the original /adzra lime page — the real words, kept intact.
		limeMessage:
			'Hey sayang, I know the past couple days and the next couple days are going to be stressful for you and it might be hard on you. But sayang, I believe in you. I am genuinely so proud of what you have been doing and I am so inspired by you. I see how hard you work and how accountable and dedicated you are towards your work. It is honestly so impressive. Sayang, it will all work out okay. All of this effort that you do, it will be worth it. I believe in you sayang and no matter what I will always be proud of you my smart sayang. I can’t wait to see the accomplishments that you will achieve from the work that you put in. I am so happy to call you my gf. I love you so much it hurts and I will always support you. 💚',
	},
	{
		slug: 'july17-2026',
		no: 4,
		plateTitle: '3 Months',
		detailTitle: 'Three Months 🤍',
		dateEyebrow: 'july 17, 2026',
		tapHint: 'tap to open 🤍',
		cover: oxford,
		ringColor: '#C6A56B',
		// The subject stands low-centre in front of the Radcliffe Camera; focus the crop lower so
		// she stays in frame instead of being cut off at the top of the fence.
		objectPosition: 'center 88%',
		photos: [oxford],
		extraPhotoSlots: 1,
		noteBlurb:
			'[ same layout as one & two months — you’ll write this one when the day comes, sayang. ]',
		mainType: 'placeholder',
		mainEyebrow: 'the message I’ll send',
	},
];

export const TOTAL = ENTRIES.length;

export function getEntry(slug: string): Entry | undefined {
	return ENTRIES.find((e) => e.slug === slug);
}
