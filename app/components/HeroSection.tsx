"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { skills } from "@/app/data/skills";

export default function HeroSection() {
  const [showAllSkills, setShowAllSkills] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary" />

      {/* Floating orbs for visual interest */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent-purple-light/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main content - Terminal Window */}
      <div
        className={`relative z-10 max-w-4xl w-full ${showAllSkills ? "max-h-[85vh] overflow-y-auto custom-scrollbar" : ""}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
          className="terminal-window p-4 shadow-2xl relative"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-accent-purple/20">
            <div className="w-3 h-3 rounded-full terminal-dot-red" />
            <div className="w-3 h-3 rounded-full terminal-dot-yellow" />
            <div className="w-3 h-3 rounded-full terminal-dot-green" />
            <span className="ml-4 text-accent-cream text-sm font-mono opacity-70">
              ~/ariq-muldi-portfolio
            </span>
          </div>

          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              transition: { duration: 0.5, delay: 0.5, type: "spring" }
            }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              borderColor: "rgba(152, 161, 188, 0.8)",
              boxShadow: "0 0 25px rgba(152, 161, 188, 0.4)",
              transition: { duration: 0.2 }
            }}
            className="absolute top-16 right-4 w-20 h-20 md:top-20 md:right-8 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-accent-purple/30 shadow-xl z-10 cursor-pointer"
          >
            <Image
              src="/profile-photo.jpg"
              alt="Ariq Muldi"
              fill
              className="object-cover object-[50%_15%]"
            />
          </motion.div>

          {/* Terminal content */}
          <div className="font-mono space-y-4 text-accent-cream">
            {/* Introduction command */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-accent-purple-light mb-2">$ whoami</p>
              <div className="pl-4 space-y-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Ariq Muldi
                </h1>
                <p className="text-accent-cream/90">
                  Software Engineer | Full Stack Developer | Cloud & DevOps Specialist
                </p>
                <p className="text-accent-cream/70 text-sm mt-2">
                  5+ Years of Experience, 15+ Projects Completed, 5+ Professional
                  Roles
                </p>
              </div>
            </motion.div>

            {/* Status command */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-accent-purple-light mb-2">$ git status</p>
              <div className="pl-4 space-y-1 text-sm">
                <p className="text-blue-400">
                  <span className="text-green-400">● Currently:</span> SWE @
                  DOUBL, Undergraduate Research Assistant @ UBC
                </p>
                {/* <p className="text-green-400">● Incoming: SWE @ DOUBL</p>
                <p className="text-blue-400">● Currently: Undergraduate Research Assistant @ UBC</p> */}
                {/* <p className="text-blue-400">● Teaching: 60+ students in Computer Science courses</p>
                <p className="text-yellow-400">● Graduating: May 2026 | GPA: 4.21/4.33</p> */}
              </div>
            </motion.div>

            {/* Skills section */}
            {!showAllSkills ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p className="text-accent-purple-light mb-3">
                  $ ls top-skills/
                </p>
                <div className="pl-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="skill-badge">TypeScript</span>
                    <span className="skill-badge">React</span>
                    <span className="skill-badge">Python</span>
                    <span className="skill-badge">Google Cloud Platform</span>
                    <span className="skill-badge">Node.js</span>
                    <span className="skill-badge">SQL</span>
                  </div>
                  <button
                    onClick={() => setShowAllSkills(true)}
                    className="text-accent-purple-light hover:text-white transition-colors underline text-sm"
                  >
                    $ show --all-skills
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Expanded skills view */
              <div className="space-y-4">
                {skills.categories.map((category, index) => {
                  // Convert category name to slug for terminal command
                  const categorySlug = category.name
                    .toLowerCase()
                    .replace(/\s+&\s+/g, '-')
                    .replace(/\s+/g, '-');

                  return (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <p className="text-accent-purple-light mb-2">
                        $ cat {categorySlug}.txt
                      </p>
                      <div className="pl-4 flex flex-wrap gap-1.5">
                        {category.skills.map((skill) => (
                          <span key={skill} className="skill-badge-small">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}

                <button
                  onClick={() => setShowAllSkills(false)}
                  className="text-accent-purple-light hover:text-white transition-colors underline text-sm pl-4"
                >
                  $ clear
                </button>
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="pt-4 border-t border-accent-purple/20"
            >
              <p className="text-accent-purple-light mb-3">$ next --action</p>
              <div className="pl-4 flex flex-wrap gap-3">
                <a
                  href="#contributions"
                  className="px-4 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 rounded-lg border border-accent-purple/40 hover:border-accent-purple/60 transition-all duration-300 text-sm"
                >
                  View Contributions
                </a>
                <a
                  href="#projects"
                  className="px-4 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 rounded-lg border border-accent-purple/40 hover:border-accent-purple/60 transition-all duration-300 text-sm"
                >
                  View Projects
                </a>
                <a
                  href="#experience"
                  className="px-4 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 rounded-lg border border-accent-purple/40 hover:border-accent-purple/60 transition-all duration-300 text-sm"
                >
                  View Experience
                </a>
                <a
                  href="#education"
                  className="px-4 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 rounded-lg border border-accent-purple/40 hover:border-accent-purple/60 transition-all duration-300 text-sm"
                >
                  View Education
                </a>
                <a
                  href="#contact"
                  className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg border border-green-600/40 hover:border-green-600/60 transition-all duration-300 text-sm text-green-400"
                >
                  Contact Me
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex justify-center mt-8"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-accent-purple/60 text-sm font-medium"
          >
            <svg
              className="w-6 h-6 mx-auto mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            Scroll to explore
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
