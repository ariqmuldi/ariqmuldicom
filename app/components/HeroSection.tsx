'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
			className="h-screen flex items-center justify-center relative overflow-hidden"
		>
			{/* Background gradient layers */}
			<div className="absolute inset-0 bg-gradient-to-br from-background-secondary via-background-primary to-background-secondary" />
			<div className="absolute inset-0 bg-gradient-to-t from-transparent via-accent-red-dark/5 to-transparent" />
			
			{/* Animated background elements */}
			<div className="absolute inset-0">
				<div className="absolute top-20 left-20 w-72 h-72 bg-accent-red-dark/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-red-medium/10 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent-red-dark/5 to-transparent rounded-full" />
			</div>

			{/* Grid pattern overlay */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
			</div>

			{/* Main content - Terminal Window */}
			<div className="relative z-10 max-w-4xl w-full mx-4">
				<motion.div
					initial={{ opacity: 0, y: 20, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="card-glass backdrop-blur-lg rounded-lg border border-accent-red-dark/30 p-6 shadow-glow-lg"
				>
					{/* Terminal header with dots */}
					<div className="flex items-center gap-2 mb-6">
						<div className="w-3 h-3 rounded-full bg-accent-red-dark" />
						<div className="w-3 h-3 rounded-full bg-accent-red-medium" />
						<div className="w-3 h-3 rounded-full bg-accent-red" />
						<span className="ml-4 text-text-muted text-sm font-mono">~/portfolio</span>
					</div>

					{/* Terminal content */}
					<div className="font-mono space-y-4">
						{/* whoami command */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<p className="text-accent-red">$ whoami</p>
							<h1 className="text-4xl md:text-6xl font-bold mt-2 mb-2 gradient-text">
								Ariq Muldi
							</h1>
							<p className="text-text-secondary mb-4">Full Stack Developer</p>
						</motion.div>

						{/* skills command */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.8 }}
						>
							<p className="text-accent-red">$ cat skills.txt</p>
							<div className="flex flex-wrap gap-2 mt-3 mb-6">
								<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">React</span>
								<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">Next.js</span>
								<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">TypeScript</span>
								<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">Node.js</span>
								<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">Python</span>
								<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">MongoDB</span>
							</div>
						</motion.div>

						{/* status command */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 1.2 }}
						>
							<p className="text-accent-red">$ status</p>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 mb-6">
								<div className="text-center p-3 bg-accent-red-dark/10 rounded-md border border-accent-red-dark/20">
									<div className="text-2xl font-bold gradient-text mb-1">5+</div>
									<div className="text-xs text-text-muted">Years Experience</div>
								</div>
								<div className="text-center p-3 bg-accent-red-dark/10 rounded-md border border-accent-red-dark/20">
									<div className="text-2xl font-bold gradient-text mb-1">50+</div>
									<div className="text-xs text-text-muted">Projects Completed</div>
								</div>
								<div className="text-center p-3 bg-accent-red-dark/10 rounded-md border border-accent-red-dark/20">
									<div className="text-2xl font-bold gradient-text mb-1">20+</div>
									<div className="text-xs text-text-muted">Happy Clients</div>
								</div>
							</div>
						</motion.div>

						{/* contact command */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 1.6 }}
							className="flex flex-col sm:flex-row gap-3"
						>
							<button className="btn-primary group font-sans">
								<span className="flex items-center gap-2">
									<span className="font-mono text-sm">$</span>
									View Projects
									<svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</span>
							</button>
							<button className="btn-secondary group font-sans">
								<span className="flex items-center gap-2">
									<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
									Contact Me
								</span>
							</button>
						</motion.div>

						{/* Blinking cursor */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 2 }}
							className="flex items-center mt-4"
						>
							<span className="text-accent-red">$ </span>
							<span className="inline-block w-2 h-5 bg-accent-red ml-1 animate-pulse"></span>
						</motion.div>
					</div>
				</motion.div>

				{/* Available for work badge */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.8, delay: 2.2 }}
					className="flex justify-center mt-6"
				>
					<span className="inline-block px-4 py-2 bg-gradient-to-r from-accent-red-dark/20 to-accent-red-medium/20 backdrop-blur-sm border border-accent-red-dark/30 rounded-full text-sm font-medium text-text-secondary">
						<span className="inline-block w-2 h-2 bg-accent-red rounded-full mr-2 animate-pulse"></span>
						Available for new opportunities
					</span>
				</motion.div>
			</div>

			
		</motion.section>
	);
}