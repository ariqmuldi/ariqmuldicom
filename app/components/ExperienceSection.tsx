"use client";

import { motion } from "framer-motion";
import { experiences } from "@/app/data/experiences";

export default function ExperienceSection() {
  return (
    <section className="py-20 md:py-32 px-4 relative" id="experience">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-secondary via-background-primary to-background-secondary" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-purple-light/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-accent-purple mb-4 block tracking-wider uppercase">
              Professional Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-alt">
              Experience
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Building systems and mentoring students while pursuing my Computer
              Science degree at UBC
            </p>
          </motion.div>
        </div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-purple/20 via-accent-purple/40 to-accent-purple/20 hidden md:block" />

          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                id={`experience-${experience.id}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline dot - hidden on mobile */}
                <div className="absolute left-6 top-8 w-4 h-4 bg-accent-purple rounded-full border-4 border-background-primary hidden md:block shadow-glow" />

                <div className="md:ml-20">
                  <div className="card-glass card-glass-hover rounded-2xl p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="mb-4 lg:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl md:text-2xl font-bold text-text-primary">
                            {experience.title}
                          </h3>
                          {experience.current && (
                            <span className="px-3 py-1 bg-gradient-to-r from-accent-purple to-accent-purple-light text-white text-xs font-medium rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-semibold text-accent-purple mb-1">
                          {experience.company}
                        </h4>
                        {experience.department && (
                          <p className="text-text-secondary font-medium text-sm">
                            {experience.department}
                          </p>
                        )}
                        <p className="text-text-muted text-sm mt-1">
                          {experience.location}
                        </p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-accent-purple font-medium text-sm">
                          {experience.period}
                        </p>
                      </div>
                    </div>

                    {/* Accomplishments */}
                    <div className="space-y-3 mb-6">
                      {experience.accomplishments.map((accomplishment, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-accent-purple rounded-full mt-2 flex-shrink-0" />
                          <p className="text-text-secondary text-sm leading-relaxed">
                            {accomplishment}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-accent-beige/20 text-accent-purple text-xs rounded-md border border-accent-beige/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "10,000+", label: "Records Processed" },
            { value: "1,000+", label: "Users Served" },
            { value: "500+", label: "Students Impacted" },
            { value: "5", label: "Active Roles" },
          ].map((stat, index) => (
            <div key={index} className="card-glass rounded-xl p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-xs text-text-muted uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}