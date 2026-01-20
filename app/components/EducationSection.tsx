"use client";

import { motion } from "framer-motion";
import { education } from "@/app/data/education";

export default function EducationSection() {
  const achievements = [
    { title: "2x Dean's List", description: "Academic Excellence" },
    { title: "Top 5%", description: "Class Ranking" },
    { title: "1x Dean's Scholar", description: "Academic Excellence" },
  ];

  return (
    <section className="py-20 md:py-32 px-4 relative" id="education">
      {/* Background elements */}
      <div className="absolute inset-0 section-gradient" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-purple/20 to-transparent" />

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
              Academic Background
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-alt">
              Education
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Pursuing excellence in Computer Science and Data Science with a
              focus on practical application and innovation
            </p>
          </motion.div>
        </div>

        {/* Main Education Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="card-glass rounded-2xl overflow-hidden">
            {/* University Header with gradient background */}
            <div className="bg-gradient-to-r from-accent-purple to-accent-purple-light p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    University of British Columbia
                  </h3>
                  <p className="text-white/90 text-lg">
                    Kelowna, BC • Expected Graduation: May 2026
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div>
                      <p className="font-bold text-lg">{education.gpa} GPA</p>
                      <p className="text-xs text-white/80">
                        {education.gpaPercentage} Average
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Degree Information */}
            <div className="p-8">
              <div className="mb-8">
                <h4 className="text-xl font-bold text-text-primary mb-2">
                  Bachelor of Science in Computer Science
                </h4>
                <p className="text-lg text-accent-purple font-medium">
                  Minor in Data Science
                </p>
              </div>

              {/* Academic Achievements Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-accent-beige/20 rounded-xl p-4 text-center hover:bg-accent-beige/30 transition-colors"
                  >
                    <p className="font-semibold text-sm text-text-primary">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {achievement.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Relevant Coursework */}
              <div>
                <h5 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-accent-purple"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Relevant Coursework
                </h5>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {education.relevantCoursework.map((course, index) => (
                    <motion.div
                      key={course}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="group"
                    >
                      <div className="px-3 py-2 bg-white/50 hover:bg-white/70 rounded-lg border border-accent-purple/10 hover:border-accent-purple/30 transition-all duration-300 cursor-default h-12 flex items-center">
                        <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors leading-tight">
                          {course}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
