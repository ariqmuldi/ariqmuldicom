"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    id: 1,
    title: "Software Developer",
    company: "University of British Columbia",
    department: "Undergraduate Research Assistant",
    location: "Makerspace Yellowknife, Remote",
    period: "Jan. 2025 -- Present",
    current: true,
    accomplishments: [
      "Developed an automated membership management system using TypeScript, React Router v7, PostgreSQL, and Docker, optimizing user data tracking, user workshop registration and equipment bookings, Stripe payment processing, and event scheduling for 1,000+ users",
      "Implemented a membership portal, enabling admins to manage workshops and equipments and for users to manage their memberships, view/register for workshops, and update personal details, reducing overhead for 10+ admins",
      "Developed user authentication with Prisma ORM, ensuring secure access control for different user roles",
      "Conducted testing with Vitest and validation with Zod, improving system adoption and reducing user onboarding time",
      "Created admin control panel with real-time settings management and data export capabilities, reducing administrative overhead by enabling 10+ admins to configure user experiences and generate presentation-ready reports",
      "Refactored LearnCoding's UI using PHP, JavaScript, and CSS, improving user experience for 500+ students",
      "Developed comprehensive landing page with platform features, FAQs, and contact info, enhancing onboarding for 60+ faculty",
      "Built admin functionality with PHP and MySQL, enabling instructors to toggle platform settings dynamically",
      "Completed Privacy and Risk Assessment documentation, transitioning LearnCoding from UBC VPN to public deployment",
      "Tested Matomo Analytics and CSV export across dev/production environments, ensuring data accuracy for academic reporting"
    ],
    technologies: ["TypeScript", "React Router v7", "PostgreSQL", "Docker", "Prisma", "Vitest", "Zod", "PHP", "JavaScript", "CSS", "MySQL"]
  },
  {
    id: 2,
    title: "Software Developer",
    company: "University of British Columbia",
    department: "Directed Studies",
    location: "Kelowna, BC",
    period: "Sept. 2024 -- Dec. 2024",
    current: false,
    accomplishments: [
      "Improved adaptive learning platform called LearnCoding, adopted by UBC's Faculty of Applied Science and UBC's largest computer science sections, benefiting 500+ students with tools like code visualizers, sandboxes, parallel courseware, and badges",
      "Integrated UBC Canvas API and Matomo Analytics for automated grading, multi-platform access between LearnCoding and UBC systems, and user behavior tracking, replacing manual CSV processes and reducing instructor overhead",
      "Developed authentication features using PHP, JavaScript, Laravel, Blade, jQuery, and MySQL, securing access for 60+ faculty members"
    ],
    technologies: ["PHP", "JavaScript", "Laravel", "Blade", "jQuery", "MySQL", "UBC Canvas API", "Matomo Analytics"]
  },
  {
    id: 3,
    title: "Undergraduate Teaching Assistant",
    company: "University of British Columbia",
    department: "",
    location: "Kelowna, BC",
    period: "Sept. 2024 -- Present",
    current: true,
    accomplishments: [
      "Facilitated interactive lab sessions and tutoring for over 60+ students, employing hands-on exercises and real-time coding challenges to enhance understanding of machine architecture, Java programming, and general coding concepts",
      "Designed and graded assignments and exams for 300+ students for the two largest computer science courses at UBC"
    ],
    technologies: ["Java", "Machine Architecture", "Educational Technology"]
  }
];

export default function ExperienceSection() {
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
              Professional Journey
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Experience
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Building systems and mentoring students while pursuing my Computer Science degree
            </p>
          </motion.div>
        </div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-red-dark via-accent-red-medium to-accent-red hidden md:block" />

          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-8 w-4 h-4 bg-gradient-to-br from-accent-red-dark to-accent-red-medium rounded-full border-4 border-background-primary hidden md:block" />
                
                <div className="md:ml-20">
                  <div className="card-glass card-glass-hover rounded-2xl p-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div className="mb-4 lg:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-text-primary">
                            {experience.title}
                          </h3>
                          {experience.current && (
                            <span className="px-3 py-1 bg-gradient-to-r from-accent-red-dark to-accent-red-medium text-white text-xs font-medium rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-semibold text-accent-red-medium mb-1">
                          {experience.company}
                        </h4>
                        {experience.department && (
                          <p className="text-text-secondary font-medium">
                            {experience.department}
                          </p>
                        )}
                        <p className="text-text-muted text-sm">
                          {experience.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent-red font-semibold text-lg">
                          {experience.period}
                        </p>
                      </div>
                    </div>

                    {/* Accomplishments */}
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-accent-red-medium" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Key Accomplishments
                      </h5>
                      <div className="space-y-3">
                        {experience.accomplishments.map((accomplishment, accIndex) => (
                          <motion.div
                            key={accIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 + accIndex * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div className="w-2 h-2 bg-accent-red-medium rounded-full flex-shrink-0 mt-2" />
                            <p className="text-text-secondary leading-relaxed text-sm">
                              {accomplishment}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h5 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-accent-red-medium" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Technologies Used
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.2 + techIndex * 0.05 }}
                            className="px-3 py-1 bg-accent-red-dark/20 text-accent-red-medium text-sm rounded-full border border-accent-red-dark/30 hover:bg-accent-red-dark/30 transition-colors"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
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
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card-glass rounded-2xl p-8 mt-16"
        >
          <h3 className="text-2xl font-bold mb-8 text-center gradient-text">
            Impact Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">1,000+</div>
              <div className="text-sm text-text-muted">Users Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">500+</div>
              <div className="text-sm text-text-muted">Students Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">60+</div>
              <div className="text-sm text-text-muted">Faculty Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">3</div>
              <div className="text-sm text-text-muted">Active Roles</div>
            </div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mt-12"
        >
          <p className="text-text-secondary mb-6">
            Ready to bring this experience to your next project
          </p>
          <a href="#contact" className="btn-primary">
            Let's Work Together
          </a>
        </motion.div>
      </div>
    </section>
  );
}