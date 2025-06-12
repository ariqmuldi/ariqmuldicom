"use client";

import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section className="py-20 md:py-32 px-4 relative" id="contact">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background-secondary via-background-primary to-background-primary" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-red-dark/30 to-transparent" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-accent-red-dark/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent-red-medium/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-accent-red-medium mb-4 block tracking-wider uppercase">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Let's Connect
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? I'd love to hear about it. Let's create
              something amazing together.
            </p>
          </motion.div>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-glass card-glass-hover rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 gradient-text">
              Contact Information
            </h3>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-red-dark to-accent-red-medium rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary">Location</p>
                  <p className="text-text-secondary">San Francisco, CA</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-red-dark to-accent-red-medium rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary">Email</p>
                  <a
                    href="mailto:john@example.com"
                    className="text-accent-red-medium hover:text-accent-red transition-colors"
                  >
                    john@example.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-red-dark to-accent-red-medium rounded-lg flex items-center justify-center">
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary">Phone</p>
                  <a
                    href="tel:+1234567890"
                    className="text-accent-red-medium hover:text-accent-red transition-colors"
                  >
                    +1 (234) 567-8900
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-glass card-glass-hover rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 gradient-text">
              Quick Actions
            </h3>

            <div className="space-y-4">
              {/* Email button */}
              <a
                href="mailto:john@example.com"
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-accent-red-dark to-accent-red-medium hover:from-accent-red-medium hover:to-accent-red text-white rounded-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="font-medium">Send Email</span>
                <svg
                  className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1"
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
              </a>

              {/* Resume button */}
              <a
                href="/resume.pdf"
                target="_blank"
                className="w-full flex items-center gap-4 p-4 bg-background-card-hover hover:bg-accent-red-dark/20 border border-accent-red-dark/30 hover:border-accent-red-dark/50 text-text-primary rounded-xl transition-all duration-300 group"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  <path d="M8 11a1 1 0 100 2h4a1 1 0 100-2H8z" />
                  <path d="M8 7a1 1 0 100 2h4a1 1 0 100-2H8z" />
                </svg>
                <span className="font-medium">Download Resume</span>
                <svg
                  className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </a>

              {/* Schedule meeting */}
              <a
                href="#"
                className="w-full flex items-center gap-4 p-4 bg-background-card-hover hover:bg-accent-red-dark/20 border border-accent-red-dark/30 hover:border-accent-red-dark/50 text-text-primary rounded-xl transition-all duration-300 group"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Schedule Meeting</span>
                <svg
                  className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1"
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
              </a>
            </div>
          </motion.div>
        </div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-text-secondary mb-6">
            Follow me on social media for updates and insights
          </p>
          <div className="flex justify-center gap-4">
            {[
              {
                name: "GitHub",
                url: "https://github.com",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                ),
              },
              {
                name: "LinkedIn",
                url: "https://linkedin.com",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                ),
              },
              {
                name: "Twitter",
                url: "https://twitter.com",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
              {
                name: "Dribbble",
                url: "https://dribbble.com",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm9.568 7.375c.77 1.423 1.216 3.041 1.216 4.763 0 .619-.061 1.224-.166 1.812-.247-.053-2.73-.612-5.232-.612-1.043 0-2.056.082-3.017.22-.058-.141-.114-.283-.174-.426-.194-.469-.401-.933-.621-1.393 3.014-1.228 4.381-2.97 4.994-3.364zm-1.595-1.595c-.498.317-1.717 1.788-4.512 2.847C14.225 4.885 12.146 2.408 12 2.204c3.965.321 7.322 2.84 8.973 5.576zM10.56 2.508c.183.239 2.235 2.681 3.475 6.406C11.023 9.75 7.646 10.045 4.5 10.045c-.301 0-.591-.008-.877-.021C4.61 6.998 7.196 4.174 10.56 2.508zM3.375 12c0-.099.008-.198.015-.297.315.015.651.024 1.006.024 3.662 0 7.403-.344 10.329-1.22.173.341.335.686.483 1.033-.069.021-.141.046-.211.069C11.65 12.657 8.469 16.87 6.905 19.407 4.781 17.637 3.375 14.979 3.375 12zm4.125 8.625c1.168-2.016 3.838-5.604 7.244-6.906 2.93-.112 5.503.465 5.89.583-.421 3.061-2.567 5.651-5.49 6.843-.316-.896-.711-1.896-1.128-2.946-.388.885-.787 1.727-1.194 2.528-1.674-.344-3.174-1.213-4.322-2.102z" />
                  </svg>
                ),
              },
            ].map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className="w-12 h-12 bg-background-card-hover hover:bg-gradient-to-br hover:from-accent-red-dark hover:to-accent-red-medium border border-accent-red-dark/30 hover:border-accent-red-dark/50 rounded-full flex items-center justify-center text-text-secondary hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
