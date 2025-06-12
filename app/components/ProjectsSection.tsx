"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A modern e-commerce platform built with Next.js and Stripe integration, featuring advanced product filtering and seamless checkout experience.",
    image: "/code.jpg",
    technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind"],
    featured: true,
  },
  {
    id: 2,
    title: "AI Chat Application",
    description:
      "Real-time chat application powered by OpenAI with intelligent conversation routing and context-aware responses.",
    image: "/laptop.jpg",
    technologies: ["React", "Node.js", "OpenAI", "Socket.io"],
    featured: true,
  },
  {
    id: 3,
    title: "Task Management System",
    description:
      "Collaborative task management tool with real-time updates, team collaboration features, and advanced analytics.",
    image: "/code.jpg",
    technologies: ["Vue.js", "Express", "MongoDB", "WebSocket"],
    featured: false,
  },
  {
    id: 4,
    title: "Portfolio Generator",
    description:
      "Dynamic portfolio generator for developers with customizable themes, drag-and-drop interface, and SEO optimization.",
    image: "/laptop.jpg",
    technologies: ["React", "GraphQL", "AWS", "PostgreSQL"],
    featured: false,
  },
];

export default function ProjectsSection() {
  return (
    <section className="py-20 md:py-32 px-4 relative">
      {/* Background elements */}
      <div className="absolute inset-0 section-gradient" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-red-dark/30 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="text-sm font-medium text-accent-red-medium mb-4 block tracking-wider uppercase">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Featured Projects
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              A collection of my recent work showcasing modern web development
              practices and innovative solutions
            </p>
          </motion.div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative ${
                project.featured ? "lg:col-span-1" : "lg:col-span-1"
              }`}
            >
              <div className="card-glass card-glass-hover rounded-2xl overflow-hidden h-full">
                {/* Project image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 via-transparent to-transparent" />

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-accent-red-dark text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-accent-red-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3">
                      <Link
                        href="#"
                        className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                      <Link
                        href="#"
                        className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Project content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-accent-red-medium transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-text-secondary mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-accent-red-dark/20 text-accent-red-medium text-sm rounded-full border border-accent-red-dark/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <Link
                      href="#"
                      className="flex-1 text-center py-2 px-4 bg-gradient-to-r from-accent-red-dark to-accent-red-medium hover:from-accent-red-medium hover:to-accent-red text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      View Project
                    </Link>
                    <Link
                      href="#"
                      className="py-2 px-4 border border-accent-red-dark/30 hover:border-accent-red-dark text-text-secondary hover:text-text-primary text-sm font-medium rounded-lg transition-colors"
                    >
                      Code
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all projects button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="#"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View All Projects
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
