"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "MSYK Membership System",
    description:
      "Automated membership management system built for Makerspace Yellowknife serving 1,000+ users. Features user authentication with Prisma ORM, workshop registration, equipment bookings, Stripe payment processing, and comprehensive admin dashboard with real-time settings and report generation capabilities.",
    image: "/msykpicture.png",
    technologies: [
      "TypeScript",
      "React Router v7",
      "PostgreSQL",
      "Docker",
      "Prisma",
      "Vitest",
      "Zod",
    ],
    featured: true,
    github:
      "https://github.com/University-of-British-Columbia-Okanagan/MSYK_Membership",
  },
  {
    id: 2,
    title: "LearnCoding Platform",
    description:
      "Adaptive learning platform adopted by UBC's Faculty of Applied Science, benefiting 500+ students with code visualizers, sandboxes, and courseware. Integrated UBC Canvas API for automated grading, Matomo Analytics for user tracking, and secure authentication for 60+ faculty members.",
    image: "/learncodingpicture.png",
    technologies: [
      "PHP",
      "JavaScript",
      "Laravel",
      "Blade",
      "jQuery",
      "MySQL",
      "CSS",
    ],
    featured: true,
    github: "#",
  },
  {
    id: 3,
    title: "Ponotodoro",
    description:
      "Full-stack productivity application integrating Pomodoro technique with note-taking and to-do lists functionality. Combines time management and task tracking techniques to improve personal productivity for 10+ users with efficient data management and secure user authentication.",
    image: "/ponotodoropicture.jpg",
    technologies: [
      "JavaScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "Bootstrap",
      "HTML/CSS",
    ],
    featured: false,
    github: "https://github.com/ariqmuldi/ponotodoro",
  },
  {
    id: 4,
    title: "Flight Hub",
    description:
      "Full-stack web application that streamlines flight offers by integrating Amadeus and Twilio APIs. Features a comprehensive blog system enabling users to create, edit, and manage flight-related posts with secure authentication and responsive design.",
    image: "/flighthubpicture.jpg",
    technologies: [
      "Python",
      "JavaScript",
      "Flask",
      "React",
      "SQLite",
      "Bootstrap",
      "HTML/CSS",
      "REST APIs",
    ],
    featured: false,
    github: "https://github.com/ariqmuldi/flight-hub",
  },
  {
    id: 5,
    title: "ChatterBox",
    description:
      "Full-stack chat application replicating core Discord functionalities with real-time messaging, user authentication, and channel management. Facilitates communication for 5+ active users across 5+ channels, managing 100+ messages with Firebase backend.",
    image: "/chatterboxpicture.jpg",
    technologies: [
      "JavaScript",
      "React",
      "Firebase",
      "Tailwind CSS",
      "HTML/SCSS",
    ],
    featured: false,
    github: "https://github.com/namekeptanonymous/Error404",
  },
  {
    id: 6,
    title: "MoodiJawoodi",
    description:
      "Full-stack e-commerce platform facilitating the purchase of 100+ Middle Eastern products. Features responsive interface with Java JDBC API integration and optimized MySQL backend for efficient data handling and product processing.",
    image: "/moodijawoodipicture.jpg",
    technologies: ["Java", "HTML/CSS", "MySQL", "Docker", "JDBC API"],
    featured: false,
    github: "https://github.com/ariqmuldi/moodi-jawoodi-grocery",
  },
];

export default function ProjectsSection() {
  return (
    <section className="py-20 md:py-32 px-4 relative" id="projects">
      {/* Background gradient */}
      <div className="absolute inset-0 section-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-purple/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-accent-purple mb-4 block tracking-wider uppercase">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-alt">
              Featured Projects
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Software applications built during my Computer Science journey,
              featuring real-world solutions that have served thousands of users
            </p>
          </motion.div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full card-glass card-glass-hover rounded-2xl overflow-hidden flex flex-col">
                {/* Project image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-accent-purple/5 to-accent-purple-light/5">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-accent-purple text-white text-xs font-medium rounded-full shadow-lg">
                      Featured
                    </div>
                  )}
                </div>

                {/* Project content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-accent-purple transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-text-secondary mb-4 text-sm leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-accent-purple/10 text-accent-purple text-xs rounded-md border border-accent-purple/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action button */}
                  <div className="pt-4 border-t border-accent-purple/10">
                    {project.github !== "#" ? (
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-accent-purple hover:text-accent-purple-dark font-medium text-sm transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View on GitHub
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-text-muted text-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Private Repository
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View more on GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/ariqmuldi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View More Projects on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}