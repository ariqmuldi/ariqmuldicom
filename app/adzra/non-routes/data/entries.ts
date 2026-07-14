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
	/** Carousel photos (first is usually the cover). The detail page shows ‹ / › arrows only when
	 * there is more than one — add photos here to enable paging. */
	photos: StaticImageData[];
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
		noteBlurb:
			'its our picture from the day you said yes to me (even though it took a long time for you to say yes) and the flowers I gave you that day 🌷. and of course, my whatsapp text (below) to you when it had been a month (yea I remember you being surprised i sent, but just remember, I love you more)',
		mainType: 'message',
		mainEyebrow: 'the message I sent',
		message: {
			dateChip: 'May 17, 2026',
			bubbles: [
				{
					// Time shown in Kelowna time (PDT). Sent at 12:35 AM Jakarta (UTC+7) → 10:35 AM Kelowna.
					text: 'Hello sayang\n\nIt’s not May 17 for me but it is for you. But happy one month anniversary HAHAHA ❤️. Thank you for coming into my life, it is so hard for me to even consider people (in a significant way) into my life, especially as a girlfriend but I just knew from your character and you as a person I needed you (just meeting criteria was just the first step 🤓) I don’t lie when I say the things I say and I hope as time goes on we will get to know each other more and eventually build that trust (which I’m also working on). Sleep well sayang I know what I just happened is hard on you but hopefully you’ll feel better when u wake up',
					time: '10:35 am',
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
		noteBlurb:
			'two months in — and this time I sent you lilies 🌷. i cooked so hard on figuring out how to get those flowers delivered to you in literally less than an hour (finding the place and ordering it)',
		mainType: 'message',
		mainEyebrow: 'the message I sent',
		message: {
			dateChip: 'June 17, 2026',
			// Times shown in Kelowna time (PDT). Sent ~12:19–12:24 AM Jakarta (UTC+7) → ~10:19–10:24 AM Kelowna.
			bubbles: [
				{ text: 'Wat whyyyy', time: '10:19 am' },
				{
					text: 'Sayang I have to prepare for my meeting a bit okay so I will call u after oke I wanted to send u this msg after the call but heh I think u hate me rn for some reason so',
					time: '10:23 am',
				},
				{
					text: 'Hey sayang, oh my god it’s 2 months. Isn’t it crazy sayang. My sayang. I can’t believe it. The first month I called u sayang and now the second month I call u my sayang now. Look at the progress heh. You like it don’t you? I’ll call you that anytime\n\nI still find it crazy how much I fell in love with you. And how deeply I did. I told you that in a relationship I look for peace. A place where I can return to where I feel safe and secured. Even tho u are a war, a transparent sheep, etc, you bring me peace. A gemash potato, avocado, olive brings me peace. It sucks that we are LDR. But I love that the only thing we have to worry about is missing each other. I miss you so much everyday and I continue to love you more and more where words cannot explain how much I do\n\nI was scared that I could never find such peace but here I am now. I really hope you choose me sayang. I promise to give it my all to always win you over. Over and over again. I will literally do whatever it takes. I need you my sayang. You are my finish line my sayang. You always have been. There has not been a single time where I havent considered you in my future. I think about you all the time. The thought of you possibly being my forever. I can’t even imagine it. I need it to be a reality and I can’t wait for when that time comes. Don’t worry, I will be asking you and your parents blessing. Just wait for me\n\nMy sayang, I really love how easy this relationship is and how we grow together. When I say I’m proud of the things you do sayang I really am. I really hope I can be there for all your victories and your ambitions. I wish you could understand how I feel about you. It is something words cannot explain. I just feel so inspired and strongly of you. You really do impress me sayang. My beautiful, pretty, smart, funny, kind sayang. I can’t wait to see what else you do that will impress me\n\nOn everyday where I come home from a long day of work, the thought of you calms me and softens the world around me. I hope that one day I can do the same for you, where I can also become your peace and protects your peace. Someone who can add comfort into your life. Every future plan, it becomes so exciting since I imagine you by my side. Throughout this relationship I hope to always be by your side always supporting you my sayang. Even in the moments where it becomes difficult, I know that id choose you all the time, every single time\n\nI hope that this relationship lasts forever. There is no one I want to be with but you. I am slowly building up that trust with you and I promise you, I’ll give it my all. The effort, the sabr, and the prayers will all be worth it. Happy 2 months my sayang',
					time: '10:24 am',
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
