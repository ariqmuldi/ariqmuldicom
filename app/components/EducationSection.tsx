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
    "Applied Time Series and Forecasting"
  ];

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
              Academic Background
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Education
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Pursuing excellence in Computer Science and Data Science with a focus on practical application and innovation
            </p>
          </motion.div>
        </div>

        {/* Education Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card-glass card-glass-hover rounded-2xl p-8 md:p-10">
            {/* University Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                  University of British Columbia
                </h3>
                <p className="text-lg text-accent-red-medium font-medium">
                  Kelowna, BC
                </p>
              </div>
              <div className="text-right">
                <p className="text-text-secondary text-sm mb-1">Expected Graduation</p>
                <p className="text-accent-red font-semibold text-lg">May 2026</p>
              </div>
            </div>

            {/* Degree Information */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-text-primary mb-3">
                Bachelor of Science Major in Computer Science
              </h4>
              <p className="text-lg text-text-secondary mb-4">
                Minor in Data Science
              </p>
              
              {/* GPA Highlight */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-red-dark/20 to-accent-red-medium/20 rounded-full border border-accent-red-dark/30 mb-6">
                <span className="font-bold text-accent-red-medium text-lg mr-2">GPA:</span>
                <span className="font-bold text-text-primary text-lg">4.21/4.33</span>
                <span className="text-text-secondary ml-2">(90.6%)</span>
              </div>
            </div>

            {/* Relevant Coursework */}
            <div>
              <h5 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-accent-red-medium" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Relevant Coursework
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {coursework.map((course, index) => (
                  <motion.div
                    key={course}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * (index % 6) }}
                    className="group"
                  >
                    <div className="px-3 py-2 bg-accent-red-dark/10 hover:bg-accent-red-dark/20 rounded-lg border border-accent-red-dark/20 hover:border-accent-red-dark/40 transition-all duration-300 cursor-default">
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                        {course}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Academic Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 pt-6 border-t border-accent-red-dark/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text mb-2">2x Dean's List</div>
                  <div className="text-sm text-text-muted">Academic Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text mb-2">Top 5%</div>
                  <div className="text-sm text-text-muted">Class Ranking</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text mb-2">1x Dean's Scholar</div>
                  <div className="text-sm text-text-muted">Academic Excellence</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Certifications & Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card-glass rounded-2xl p-8 text-center mt-12"
        >
          <h3 className="text-2xl font-bold mb-8 gradient-text">
            Certifications & Courses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="p-6 bg-background-card-hover rounded-xl border border-accent-red-dark/20 hover:border-accent-red-dark/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-accent-red-dark to-accent-red-medium rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
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
              <h4 className="font-semibold text-text-primary mb-2">The Complete 2024 Web Development Bootcamp</h4>
              <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                Udemy Certification
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="p-6 bg-background-card-hover rounded-xl border border-accent-red-dark/20 hover:border-accent-red-dark/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-accent-red-dark to-accent-red-medium rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
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
              <h4 className="font-semibold text-text-primary mb-2">The Complete Python Pro Bootcamp</h4>
              <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                Udemy Certification
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-text-secondary max-w-2xl mx-auto">
            Currently in my final year, combining rigorous academic study with hands-on research experience 
            and practical software development projects.
          </p>
        </motion.div>
      </div>
    </section>
  );
}