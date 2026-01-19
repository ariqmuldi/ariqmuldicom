// @/app/data/professional-contributions.ts
// This file is manually curated and is not auto-generated.
// It showcases specific high-impact projects from work experience.

export interface Contribution {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  websiteUrl?: string;
  experienceAnchor: string;
}

export interface ContributionGroup {
  id: number;
  organization: string;
  logo?: string;
  contributions: Contribution[];
}

export const contributionGroups: ContributionGroup[] = [
  {
    id: 1,
    organization: "University of British Columbia",
    logo: "/ubc-logo.png",
    contributions: [
      {
        id: 1,
        title: "Makerspace Platform",
        description: "A comprehensive membership and equipment management system serving 1,000+ members. Features include digital workshop enrollment, Stripe payment processing with tokenization, automated IoT access control via ESP32, and an admin dashboard for operational metrics.",
        image: "/msykpicture.png",
        technologies: ["TypeScript", "React Router v7", "PostgreSQL", "Prisma", "Node.js", "Stripe", "IoT (ESP32)", "Docker", "Zod", "Jest"],
        githubUrl: "https://github.com/University-of-British-Columbia-Okanagan/MSYK_Membership",
        websiteUrl: "https://my.makerspaceyk.com",
        experienceAnchor: "#experience-3"
      },
      {
        id: 2,
        title: "LearnCoding Platform",
        description: "An adaptive learning platform serving 500+ students with code visualizers, sandbox environments, and AI-powered content generation. Integrated with the UBC Canvas gradebook for automated assessment syncing and features role-based access control for faculty management.",
        image: "/learncodingpicture.png",
        technologies: ["PHP", "Laravel", "MySQL", "JavaScript", "Docker", "UBC Canvas API", "Matomo Analytics", "AI (LLMs)", "Apache"],
        websiteUrl: "https://learncoding.ok.ubc.ca",
        experienceAnchor: "#experience-4"
      },
      {
        id: 3,
        title: "MDS Application",
        description: "A full-stack admissions management platform automating workflows for 1,000+ annual applicants. Features include a 3-tier role-based authentication system, AJAX-driven applicant filtering, atomic CSV batch processing, and an automated reporting dashboard.",
        image: "/mdsapppicture.png",
        technologies: ["Python", "PostgreSQL", "JavaScript", "Flask", "Tailwind CSS", "Flask Blueprints", "bcrypt", "AJAX", "HTML/CSS"],
        githubUrl: "https://github.com/marga120/mds-application",
        experienceAnchor: "#experience-2"
      }
    ]
  }
];
