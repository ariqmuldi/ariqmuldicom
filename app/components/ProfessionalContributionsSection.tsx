// @/app/components/ProfessionalContributionsSection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { contributionGroups } from "@/app/data/professional-contributions";

export default function ProfessionalContributionsSection() {
  return (
    <section className="py-20 md:py-32 px-4 relative" id="contributions">
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
              Impactful Work
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-alt">
              Professional Contributions
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Key platforms I have engineered and deployed in a professional capacity,
              delivering significant value to users and organizations.
            </p>
          </motion.div>
        </div>

        {contributionGroups.map((group, groupIndex) => (
          <div key={group.id} className="mb-24 last:mb-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: groupIndex * 0.2 }}
              className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10"
            >
              {group.logo && (
                <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
                  <Image
                    src={group.logo}
                    alt={`${group.organization} logo`}
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>
              )}
              <h3 className="text-2xl md:text-3xl font-bold text-center md:text-left text-text-primary hover:text-accent-purple transition-colors duration-300">
                {group.organization}
              </h3>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto lg:[&>*:last-child:nth-child(2n+1)]:col-span-2 lg:[&>*:last-child:nth-child(2n+1)]:justify-self-center lg:[&>*:last-child:nth-child(2n+1)]:w-[calc(50%-1rem)]">
              {group.contributions.map((contribution, contribIndex) => (
                <motion.div
                  key={contribution.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: contribIndex * 0.15 }}
                  className="w-full"
                >
                  <div className="group h-full card-glass card-glass-hover rounded-2xl overflow-hidden flex flex-col">
                    {/* Contribution image */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-accent-purple/5 to-accent-purple-light/5">
                      <Image
                        src={contribution.image}
                        alt={contribution.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {contribution.comingSoon && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-accent-purple text-white text-xs font-medium rounded-full shadow-lg">
                          Coming Soon
                        </div>
                      )}
                    </div>

                    {/* Contribution content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-2xl font-bold mb-3 text-text-primary group-hover:text-accent-purple transition-colors">
                        {contribution.title}
                      </h4>
                      <p className="text-text-secondary mb-4 text-sm leading-relaxed flex-1">
                        {contribution.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-6 min-h-[3.5rem] content-start">
                        {contribution.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-accent-purple/10 text-accent-purple text-xs rounded-md border border-accent-purple/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-accent-purple/10 flex flex-wrap gap-4 items-center">
                        <Link
                          href={contribution.experienceAnchor}
                          className="btn-secondary text-sm"
                        >
                          Learn More
                        </Link>
                        {contribution.comingSoon ? (
                          <span className="inline-flex items-center gap-2 text-text-muted text-sm italic">
                            Showcase Coming Soon
                          </span>
                        ) : (
                          <>
                            {contribution.websiteUrl ? (
                              <Link
                                href={contribution.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-accent-purple hover:text-accent-purple-dark font-medium text-sm transition-colors"
                              >
                                View Website
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                              </Link>
                            ) : (
                              <span className="inline-flex items-center gap-2 text-text-muted text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Private Website
                              </span>
                            )}
                            {contribution.githubUrl ? (
                               <Link
                               href={contribution.githubUrl}
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
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
