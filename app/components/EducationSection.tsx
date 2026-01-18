"use client";

import { motion } from "framer-motion";

export default function EducationSection() {
  const coursework = [
    "Software Engineering",
    "Software Development and Maintenance", 
    "Data Structures",
    "Database System Implementation",
    "Introduction to Databases",
    "Machine Learning",
    "Analysis of Algorithms",
    "Introduction to Networks",
    "Machine Architecture",
    "Human Computer Interaction",
    "Introduction to Discrete Structures",
    "Computer Programming I & II",
    "Making Predictions with Data",
    "Computer Ethics",
    "Applied Regression Analysis",
    "Introduction to Data Analytics",
    "Applied Time Series and Forecasting",
    "Sampling and Design",
  ];

  const achievements = [
    { title: "2x Dean's List", description: "Academic Excellence" },
    { title: "Top 5%", description: "Class Ranking" },
    { title: "1x Dean's Scholar", description: "Academic Excellence" },
    { title: "4.21/4.33 GPA", description: "90.6% Average" },
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
              Pursuing excellence in Computer Science and Data Science with a focus on practical application and innovation
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
                {/* <div className="mt-4 md:mt-0">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div>
                      <p className="font-bold text-lg">4.21/4.33</p>
                      <p className="text-xs text-white/80">Current GPA</p>
                    </div>
                  </div>
                </div> */}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-accent-beige/20 rounded-xl p-4 text-center hover:bg-accent-beige/30 transition-colors"
                  >
                    <p className="font-semibold text-sm text-text-primary">{achievement.title}</p>
                    <p className="text-xs text-text-muted mt-1">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Relevant Coursework */}
              <div>
                <h5 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  Relevant Coursework
                </h5>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {coursework.map((course, index) => (
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

        {/* Certifications */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center mb-6 gradient-text">
            Certifications & Additional Learning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-glass rounded-xl p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-purple-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    The Complete Python Pro Bootcamp
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Udemy Certification
                  </p>
                </div>
              </div>
            </div>

            <div className="card-glass rounded-xl p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-purple-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    The Complete 2024 Web Development Bootcamp
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Udemy Certification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}