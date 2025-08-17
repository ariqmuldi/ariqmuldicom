"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    id: 1,
    title: "IT Support and Development",
    company: "Capilano University",
    department: "Bosa Centre for Film and Animation",
    location: "North Vancouver, BC",
    period: "July 2022 -- August 2024",
    current: false,
    accomplishments: [
      "Managed 10,000+ records using Python automation and PowerShell scripts, improving data processing efficiency by 25%",
      "Provided technical support for 20+ faculty members and 500+ students, resolving 100+ hardware/software issues weekly",
      "Deployed software and updates across 100+ workstations using centralized management tools",
      "Documented technical processes and created training materials, reducing support ticket volume by 30%",
    ],
    technologies: ["Python", "PowerShell", "Windows Server", "Active Directory"],
  },
  {
    id: 2,
    title: "Undergraduate Research Assistant",
    company: "University of British Columbia",
    department: "Computer Science Department",
    location: "Kelowna, BC",
    period: "Jan. 2025 -- Present",
    current: true,
    accomplishments: [
      "Developed an automated membership management system using TypeScript, React Router v7, PostgreSQL, and Docker, optimizing user data tracking, user workshop registration and equipment bookings, Stripe payment processing, and event scheduling for 1,000+ users",
      "Implemented a membership portal, enabling admins to manage workshops and equipments and for users to manage their memberships, view/register for workshops, and update personal details, reducing overhead for 10+ admins",
      "Developed user authentication with Prisma ORM, ensuring secure access control for different user roles",
      "Conducted testing with Vitest and validation with Zod, improving system adoption and reducing user onboarding time",
      "Created admin control panel with real-time settings management and data export capabilities, reducing administrative overhead by enabling 10+ admins to configure user experiences and generate presentation-ready reports",
      "Refactored LearnCoding's UI, a UBC learning platorm, using PHP, JavaScript, and CSS, improving user experience for 500+ students",
      "Developed comprehensive landing page with platform features, FAQs, and contact info, enhancing onboarding for 60+ faculty",
      "Built admin functionality with PHP and MySQL, enabling instructors to toggle platform settings dynamically",
      "Completed Privacy and Risk Assessment documentation, transitioning LearnCoding from UBC VPN to public deployment",
      "Tested Matomo Analytics and CSV export across dev/production environments, ensuring data accuracy for academic reporting",
    ],
    technologies: [
      "TypeScript",
      "React Router v7",
      "PostgreSQL",
      "Docker",
      "Prisma",
      "Vitest",
      "Zod",
      "PHP",
      "JavaScript",
      "CSS",
      "MySQL",
    ],
  },
  {
    id: 3,
    title: "Software Developer",
    company: "University of British Columbia",
    department: "Directed Studies",
    location: "Kelowna, BC",
    period: "Sept. 2024 -- Dec. 2024",
    current: false,
    accomplishments: [
      "Improved adaptive learning platform called LearnCoding, adopted by UBC's Faculty of Applied Science and UBC's largest computer science sections, benefiting 500+ students with tools like code visualizers, sandboxes, parallel courseware, and badges",
      "Integrated UBC Canvas API and Matomo Analytics for automated grading, multi-platform access between LearnCoding and UBC systems, and user behavior tracking, replacing manual CSV processes and reducing instructor overhead",
      "Developed authentication features using PHP, JavaScript, Laravel, Blade, jQuery, and MySQL, securing access for 60+ faculty members",
    ],
    technologies: [
      "PHP",
      "JavaScript",
      "Laravel",
      "Blade",
      "jQuery",
      "MySQL",
      "UBC Canvas API",
      "Matomo Analytics",
    ],
  },
  {
    id: 4,
    title: "Undergraduate Teaching Assistant",
    company: "University of British Columbia",
    department: "",
    location: "Kelowna, BC",
    period: "Sept. 2024 -- Present",
    current: true,
    accomplishments: [
      "Facilitated interactive lab sessions and tutoring for over 60+ students, employing hands-on exercises and real-time coding challenges to enhance understanding of machine architecture, Java programming, and general coding concepts",
      "Designed and graded assignments and exams for 300+ students for the two largest computer science courses at UBC",
    ],
    technologies: ["Java", "Machine Architecture", "Educational Technology"],
  },
];

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
                      {experience.accomplishments.slice(0, 3).map((accomplishment, idx) => (
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
                      {experience.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-accent-beige/20 text-accent-purple text-xs rounded-md border border-accent-beige/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {experience.technologies.length > 6 && (
                        <span className="px-3 py-1 text-text-muted text-xs">
                          +{experience.technologies.length - 6} more
                        </span>
                      )}
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
            { value: "4", label: "Active Roles" },
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