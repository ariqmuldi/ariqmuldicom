"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React", level: 95, icon: "⚛️" },
      { name: "Next.js", level: 90, icon: "▲" },
      { name: "TypeScript", level: 88, icon: "🔷" },
      { name: "TailwindCSS", level: 92, icon: "🎨" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 85, icon: "🟢" },
      { name: "Python", level: 80, icon: "🐍" },
      { name: "GraphQL", level: 75, icon: "📊" },
      { name: "PostgreSQL", level: 82, icon: "🐘" },
    ],
  },
  {
    title: "Tools & Cloud",
    skills: [
      { name: "AWS", level: 78, icon: "☁️" },
      { name: "Docker", level: 80, icon: "🐳" },
      { name: "Git", level: 90, icon: "🔀" },
      { name: "Figma", level: 85, icon: "🎭" },
    ],
  },
];

const certifications = [
  "AWS Certified Developer",
  "Meta Frontend Developer",
  "Google Cloud Professional",
  "MongoDB Certified Developer",
];

export default function SkillsSection() {
  return (
    <section className="py-20 md:py-32 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-primary via-background-secondary to-background-primary" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-red-dark/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-red-medium/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-accent-red-medium mb-4 block tracking-wider uppercase">
              Expertise
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Skills & Technologies
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Constantly evolving skill set with focus on modern technologies
              and best practices
            </p>
          </motion.div>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className="card-glass card-glass-hover rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-6 text-center gradient-text">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: categoryIndex * 0.2 + skillIndex * 0.1,
                    }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{skill.icon}</span>
                        <span className="font-medium text-text-primary">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm text-text-muted font-medium">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-background-card rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5,
                        }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-red-dark to-accent-red-medium rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card-glass rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-8 gradient-text">
            Certifications & Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="p-4 bg-background-card-hover rounded-xl border border-accent-red-dark/20 hover:border-accent-red-dark/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-accent-red-dark to-accent-red-medium rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                  {cert}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-12"
        >
          <p className="text-text-secondary mb-6">
            Always learning and staying updated with the latest technologies
          </p>
          <a href="#contact" className="btn-primary">
            Let's Build Something Together
          </a>
        </motion.div>
      </div>
    </section>
  );
}
