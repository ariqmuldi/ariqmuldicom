'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HeroSection() {
	const [showAllSkills, setShowAllSkills] = useState(false);

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
			<div className={`relative z-10 max-w-4xl w-full mx-4 ${showAllSkills ? 'max-h-[85vh] overflow-y-auto' : ''}`}>
				<motion.div
					initial={{ opacity: 0, y: 20, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="card-glass backdrop-blur-lg rounded-lg border border-accent-red-dark/30 p-4 shadow-glow-lg"
				>
					{/* Terminal header with dots */}
					<div className="flex items-center gap-2 mb-4">
						<div className="w-3 h-3 rounded-full bg-accent-red-dark" />
						<div className="w-3 h-3 rounded-full bg-accent-red-medium" />
						<div className="w-3 h-3 rounded-full bg-accent-red" />
						<span className="ml-4 text-text-muted text-sm font-mono">~/portfolio</span>
					</div>

					{/* Terminal content */}
					<div className="font-mono space-y-3">
						{/* whoami command */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<p className="text-accent-red">$ whoami</p>
							<h1 className="text-3xl md:text-5xl font-bold mt-2 mb-2 gradient-text">
								Ariq Muldi
							</h1>
							<p className="text-text-secondary mb-3">Full Stack Developer & Computer Science Student</p>
						</motion.div>

						{!showAllSkills ? (
							/* Top Skills - Initial View */
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.8 }}
							>
								<p className="text-accent-red">$ cat top-skills.txt</p>
								<div className="flex flex-wrap gap-2 mt-2 mb-4">
									<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">JavaScript</span>
									<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">React</span>
									<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">Python</span>
									<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">Node.js</span>
									<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">TypeScript</span>
									<span className="px-3 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-sm">SQL</span>
								</div>
								<button 
									onClick={() => setShowAllSkills(true)}
									className="text-accent-red hover:text-accent-red-medium transition-colors underline"
								>
									$ show --all-skills
								</button>
							</motion.div>
						) : (
							/* All Skills - Expanded View */
							<>
								{/* Programming Languages */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.2 }}
								>
									<p className="text-accent-red">$ cat programming-languages.txt</p>
									<div className="flex flex-wrap gap-1.5 mt-2 mb-3">
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">JavaScript</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">TypeScript</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Python</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Java</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">C</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">PHP</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">SQL</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">HTML/CSS</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">MIPS</span>
									</div>
								</motion.div>

								{/* Frameworks & Libraries */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.4 }}
								>
									<p className="text-accent-red">$ cat frameworks-and-libraries.txt</p>
									<div className="flex flex-wrap gap-1.5 mt-2 mb-3">
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">React</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Node.js</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Express.js</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Prisma</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">React Router v7</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Redux.js</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Flask</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Laravel</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Tailwind CSS</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Bootstrap</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">jQuery</span>
									</div>
								</motion.div>

								{/* Developer Tools */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.6 }}
								>
									<p className="text-accent-red">$ cat developer-tools.txt</p>
									<div className="flex flex-wrap gap-1.5 mt-2 mb-3">
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Git</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">GitHub</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Docker</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Vite</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Zod</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Vitest</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Postman</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">VS Code</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Eclipse</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Figma</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Selnenium</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">BeautifulSoup</span>
										
									</div>
								</motion.div>

								{/* Data Science & Visualization */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.8 }}
								>
									<p className="text-accent-red">$ cat data-science-and-visualization.txt</p>
									<div className="flex flex-wrap gap-1.5 mt-2 mb-4">
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Pandas</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">NumPy</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Matplotlib</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Plotly</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">smtplib</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Jupyter Notebook</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">REST APIs</span>
									</div>
								</motion.div>


								{/* Scripting & Utilities */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.8 }}
								>
									<p className="text-accent-red">$ cat scripting-and-utilities.txt</p>
									<div className="flex flex-wrap gap-1.5 mt-2 mb-4">
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">REST APIs</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">JSON</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Turtle</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Tkinter</span>
									</div>
								</motion.div>

								{/* Cloud & Deploymen */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.8 }}
								>
									<p className="text-accent-red">$ cat cloud-and-deployment.txt</p>
									<div className="flex flex-wrap gap-1.5 mt-2 mb-4">
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Firebase</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Vercel</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Fly.io</span>
										<span className="px-2 py-1 bg-accent-red-dark/20 rounded-md border border-accent-red-dark/30 text-xs">Tkinter</span>
									</div>
								</motion.div>

								{/* Hide skills button */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.6, delay: 1.0 }}
									className="mb-4"
								>
									<button 
										onClick={() => setShowAllSkills(false)}
										className="text-accent-red hover:text-accent-red-medium transition-colors underline"
									>
										$ hide --all-skills
									</button>
								</motion.div>
							</>
						)}

						{/* status command */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: showAllSkills ? 1.2 : 1.2 }}
						>
							<p className="text-accent-red">$ status</p>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 mb-4">
								<div className="text-center p-2 bg-accent-red-dark/10 rounded-md border border-accent-red-dark/20">
									<div className="text-xl font-bold gradient-text mb-1">3+</div>
									<div className="text-xs text-text-muted">Years Experience</div>
								</div>
								<div className="text-center p-2 bg-accent-red-dark/10 rounded-md border border-accent-red-dark/20">
									<div className="text-xl font-bold gradient-text mb-1">6+</div>
									<div className="text-xs text-text-muted">Projects Completed</div>
								</div>
								<div className="text-center p-2 bg-accent-red-dark/10 rounded-md border border-accent-red-dark/20">
									<div className="text-xl font-bold gradient-text mb-1">3+</div>
									<div className="text-xs text-text-muted">Professional Roles</div>
								</div>
							</div>
						</motion.div>

						

						{/* Blinking cursor */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: showAllSkills ? 1.6 : 1.6 }}
							className="flex items-center"
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
					transition={{ duration: 0.8, delay: showAllSkills ? 1.6 : 1.8 }}
					className="flex justify-center mt-4"
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