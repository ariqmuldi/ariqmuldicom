'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useAnimation, useReducedMotion } from 'framer-motion';

// Route-local assets in `non-routes/public/` — a plain folder (NOT the Next.js root `/public`
// static dir, and named so it's clearly not a route segment). Importing the images as modules
// lets webpack bundle them into hashed, unguessable URLs instead of exposing them at a
// predictable public path. Keeping them here (rather than a repo-root folder) makes the /adzra
// route fully self-contained.
import lime from './non-routes/public/lime.jpeg';
import limeWithFriends from './non-routes/public/lime-with-two-friends.jpeg';

// How many clicks before the surprise. Tweak freely (she'll never count).
const CLICKS_TO_REVEAL = 7;

// Warm, reassuring one-liners shown as she clicks (clicks 1..6).
const ENCOURAGEMENTS = [
	'Hey sayang… take one slow breath 💚',
	'One thing at a time — you’ve got this',
	'I’m so proud of you',
	'You’re doing so well',
	'I believe in you',
	'May Allah (swt) ease your hardship my sayang',
];

// Gentle celebration bits that drift up on the reveal.
const FLOATERS = [
	{ emoji: '🍋', left: '8%', delay: 0, duration: 5.5, size: 'text-3xl' },
	{ emoji: '💚', left: '20%', delay: 0.8, duration: 6.2, size: 'text-2xl' },
	{ emoji: '🍋', left: '34%', delay: 0.3, duration: 5.0, size: 'text-2xl' },
	{ emoji: '💚', left: '48%', delay: 1.2, duration: 6.8, size: 'text-3xl' },
	{ emoji: '🍋', left: '62%', delay: 0.5, duration: 5.7, size: 'text-2xl' },
	{ emoji: '💚', left: '76%', delay: 1.5, duration: 6.0, size: 'text-2xl' },
	{ emoji: '🍋', left: '88%', delay: 0.2, duration: 6.5, size: 'text-3xl' },
];

export default function AdzraPage() {
	const [count, setCount] = useState(0);
	const [revealed, setRevealed] = useState(false);
	const controls = useAnimation();
	const prefersReduced = useReducedMotion();

	// Warm the cache for the second image so the reveal is instant.
	useEffect(() => {
		const img = new window.Image();
		img.src = limeWithFriends.src;
	}, []);

	// A slow "breathing" pulse invites the first click.
	useEffect(() => {
		if (prefersReduced || revealed || count > 0) return;
		controls.start({
			scale: [1, 1.025, 1],
			transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
		});
	}, [count, revealed, prefersReduced, controls]);

	const handleClick = useCallback(() => {
		if (revealed) return;

		const next = count + 1;
		setCount(next);

		if (!prefersReduced) {
			controls.stop();
			controls.start({
				rotate: [0, -4, 4, -3, 0],
				scale: [1, 1.05, 1],
				transition: { duration: 0.5, ease: 'easeInOut' },
			});
		}

		if (next >= CLICKS_TO_REVEAL) setRevealed(true);
	}, [count, revealed, prefersReduced, controls]);

	return (
		<main className="relative flex min-h-[100dvh] w-full items-center justify-center bg-gradient-to-b from-[#FFF8EC] via-[#FFF8EC] to-[#DCCCAC] px-5 py-10 font-sans sm:py-12">
			{/* Soft green background blobs — fixed layer, clipped to the viewport so they never add scroll */}
			<div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#99AD7A]/30 blur-3xl sm:h-80 sm:w-80" />
				<div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-[#546B41]/20 blur-3xl sm:h-96 sm:w-96" />
			</div>

			{/* Gentle floating limes/hearts on reveal */}
			{revealed && !prefersReduced && (
				<div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
					{FLOATERS.map((f, i) => (
						<motion.span
							key={i}
							className={`absolute bottom-0 ${f.size}`}
							style={{ left: f.left }}
							initial={{ y: '10vh', opacity: 0 }}
							animate={{ y: '-105vh', opacity: [0, 1, 1, 0] }}
							transition={{ duration: f.duration, delay: f.delay, ease: 'easeOut' }}
						>
							{f.emoji}
						</motion.span>
					))}
				</div>
			)}

			<div className="relative z-10 w-full max-w-xl">
				{/* Heading */}
				<AnimatePresence mode="wait">
					<motion.div
						key={revealed ? 'head-revealed' : 'head-asking'}
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.5 }}
						className="mb-6 text-center"
					>
						{!revealed ? (
							<>
								<h1 className="text-3xl font-semibold leading-tight text-[#546B41] sm:text-4xl">
									How are you doing, sayang? 🍋
								</h1>
								<p className="mt-3 text-base text-[#546B41]/70 sm:text-lg">
									Keep clicking lime — there&rsquo;s a little surprise waiting for you
								</p>
							</>
						) : (
							<>
								<h1 className="text-3xl font-semibold leading-tight text-[#546B41] sm:text-4xl">
									You made it, sayang 🍋💚
								</h1>
								<p className="mt-3 text-base text-[#546B41]/70 sm:text-lg">
									Look — it's lime with two friends, cheering you on
								</p>
							</>
						)}
					</motion.div>
				</AnimatePresence>

				{/* Clickable image */}
				<motion.button
					type="button"
					onClick={handleClick}
					animate={controls}
					style={{ WebkitTapHighlightColor: 'transparent', WebkitTouchCallout: 'none', touchAction: 'manipulation' }}
					aria-label={
						revealed ? 'A lime with two friends' : 'Click the lime for a surprise'
					}
					className={`relative block aspect-[16/9] w-full select-none overflow-hidden rounded-3xl border-0 bg-[#DCCCAC] p-0 shadow-[0_20px_60px_rgba(84,107,65,0.25)] outline-none ring-[#99AD7A]/50 focus-visible:ring-4 ${
						revealed ? 'cursor-default' : 'cursor-pointer'
					}`}
				>
					<AnimatePresence>
						{!revealed ? (
							<motion.div
								key="lime"
								className="absolute inset-0"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.6 }}
							>
								<Image
									src={lime}
									alt="A single lime"
									fill
									priority
									placeholder="blur"
									draggable={false}
									sizes="(max-width: 640px) 100vw, 576px"
									className="select-none object-cover"
								/>
							</motion.div>
						) : (
							<motion.div
								key="friends"
								className="absolute inset-0"
								initial={{ opacity: 0, scale: 1.06 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.8, ease: 'easeOut' }}
							>
								<Image
									src={limeWithFriends}
									alt="The lime with two friends"
									fill
									placeholder="blur"
									draggable={false}
									sizes="(max-width: 640px) 100vw, 576px"
									className="select-none object-cover"
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.button>

				{/* Encouragement + progress (asking) or message (revealed) */}
				<div className="mt-6 min-h-[4rem] text-center">
					{!revealed ? (
						<>
							<div className="flex min-h-[2rem] items-center justify-center">
								<AnimatePresence mode="wait">
									{count > 0 && (
										<motion.p
											key={count}
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -8 }}
											transition={{ duration: 0.35 }}
											className="text-base font-medium text-[#546B41] sm:text-lg"
										>
											{ENCOURAGEMENTS[Math.min(count - 1, ENCOURAGEMENTS.length - 1)]}
										</motion.p>
									)}
								</AnimatePresence>
							</div>

							{/* Progress dots */}
							<div className="mt-4 flex items-center justify-center gap-2">
								{Array.from({ length: CLICKS_TO_REVEAL }).map((_, i) => (
									<motion.span
										key={i}
										className="h-2.5 w-2.5 rounded-full"
										animate={{
											backgroundColor: i < count ? '#546B41' : '#DCCCAC',
											scale: i < count ? 1 : 0.8,
										}}
										transition={{ duration: 0.3 }}
									/>
								))}
							</div>
						</>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.35 }}
							className="rounded-3xl border border-[#99AD7A]/40 bg-[#FFF8EC]/80 p-6 text-left shadow-[0_10px_40px_rgba(84,107,65,0.12)] backdrop-blur-sm sm:p-8"
						>
							{/* ══════════════════════════════════════════════════════════
							    ✏️  YOUR MESSAGE — replace the placeholder text below.
							    This is the note she sees after the surprise reveal.
							   ══════════════════════════════════════════════════════════ */}
							<p className="text-base leading-relaxed text-[#546B41] sm:text-lg">
								[ Hey sayang, I know the past couples days and the next couple days are going to be 
								stressful for you and it might be hard on you. But sayang, I believe in you. 
								I am genuinely so proud of what you have been doing and I am so inspired 
								by you. I see how hard you work and how accountable and dedicated you are towards your 
								work. It is honestly so impressive. Sayang, it will all work out okay. All of this
								effort that you do, it will be worth it. I believe in you sayang and no matter what
								I will always be proud of you my smart sayang. I can't wait to see the accomplishments that you will achieve from
								the work that you put in. I am so happy to call you my gf. I love you so much it hurts and I will
								always support you. 💚 ]
							</p>
						</motion.div>
					)}
				</div>

				{/* Signature */}
				<p className="mt-8 text-center text-sm text-[#546B41]/50">made with 💚 just for you</p>
			</div>
		</main>
	);
}
