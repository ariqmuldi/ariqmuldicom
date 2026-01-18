// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from: /data/master-resume.tex
// Last updated: 2026-01-18T08:04:26.710Z

export interface Experience {
  id: number;
  title: string;
  company: string;
  department: string;
  location: string;
  period: string;
  current: boolean;
  accomplishments: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    "id": 1,
    "title": "Junior Software Developer",
    "company": "DOUBL",
    "department": "",
    "location": "Remote",
    "period": "Sept. 2025 -- Present",
    "current": true,
    "accomplishments": [],
    "technologies": [
      "API",
      "API Gateway",
      "APIs",
      "Agile",
      "Android",
      "CSS",
      "Cloud Run",
      "Deluge",
      "Firestore",
      "GitHub",
      "GitHub Pages",
      "Google Cloud",
      "Google Cloud Run",
      "HMAC",
      "HMAC signature",
      "HTML",
      "JavaScript",
      "Liquid",
      "Machine Learning",
      "Middleware",
      "Next.js",
      "Proxy",
      "Python",
      "React",
      "Shopify",
      "Shopify App Proxy",
      "Shopify Editor",
      "Size Stream",
      "Trello",
      "TypeScript",
      "Webhooks",
      "Zoho",
      "Zoho Deluge",
      "Zoho Flow",
      "Zoho Inventory",
      "iOS",
      "webhooks"
    ]
  },
  {
    "id": 2,
    "title": "Software Developer",
    "company": "University of British Columbia",
    "department": "Work Study Program",
    "location": "Kelowna, BC",
    "period": "Jul. 2025 -- Sept. 2025",
    "current": false,
    "accomplishments": [
      "Developed full-stack Masters of Data Science application management platform using Python, PostgreSQL, and JavaScript, automating graduate admissions workflow for 1,000+ annual student applications and eliminating manual CSV-based processes on ranking applicants",
      "Structured backend using Flask Blueprints to segregate APIs for distinct services, implementing a 3-tier role-based authentication system with session management and bcrypt encryption to secure data for 50+ faculty",
      "Designed a normalized PostgreSQL database schema with foreign key constraints and performance indexing to maintain data integrity across applicant records, test scores, and institutional transcripts",
      "Built frontend using JavaScript and Tailwind CSS, implementing an AJAX-driven table for 1,000+ records that features real-time multi-field filtering, inline status editing, and mobile-responsive design for 50+ reviewers",
      "Constructed a CSV batch processing engine with validation pipelines to sanitize and ingest 1,000+ application records, utilizing atomic database transactions to ensure all-or-nothing data integrity during bulk uploads",
      "Implemented an automated reporting dashboard and comprehensive audit logging system, tracking 500+ user interactions and reducing administrative reporting time from 8 hours to 2 hours weekly",
      "Orchestrated a 7-stage review engine enabling faculty to rate and comment on applications, utilizing automated ranking logic to prioritize candidates and streamline academic record maintenance",
      "Engineered a CSV export module using Python, enabling administrators to generate custom datasets of ranked applicants, test scores, and demographics to facilitate final committee decision-making"
    ],
    "technologies": [
      "AJAX",
      "APIs",
      "Audit Logging",
      "CSS",
      "CSV",
      "Data Integrity",
      "Flask",
      "Flask Blueprints",
      "JavaScript",
      "PostgreSQL",
      "Python",
      "Tailwind CSS",
      "bcrypt"
    ]
  },
  {
    "id": 3,
    "title": "Software Developer -- Makerspace Platform",
    "company": "University of British Columbia",
    "department": "Undergraduate Research Assistant & Directed Studies",
    "location": "Remote",
    "period": "Jan. 2025 -- Present",
    "current": true,
    "accomplishments": [
      "Built membership management platform using TypeScript, React Router v7, PostgreSQL, and Prisma, serving 1,000+ members by digitizing workshop enrollments, equipment reservations, membership plans, user profiles, and volunteer workflows",
      "Integrated Stripe processing $1,000+ monthly revenue via checkout sessions and a custom one-click payment system with tokenization, and implemented AES-256 encryption to securely store signed digital agreements",
      "Developed equipment booking engine with a time-slot visualization grid, enforcing level-based access and prerequisites to prevent unauthorized usage, handling 200+ daily reservations using conflict detection algorithms",
      "Engineered a centralized admin dashboard to configure system parameters and generate CSV reports for financial and operational metrics, secured by admin-only middleware to control user access and interaction limits",
      "Implemented an email notification system using Mailgun to process 700+ monthly emails for workshops, equipment, and memberships, generating iCalendar attachments and integrating Google Calendar for live schedules",
      "Programmed ESP32 firmware in C++ for an IoT access control system, scanning RFIDs to authenticate via secure HTTPS and logging entry events for restricted equipment and physical doors",
      "Automated physical access provisioning by integrating the Brivo Enterprise API via OAuth2, handling 500+ security events based on safety orientations, membership status, and administrative approval",
      "Orchestrated a Node.js background job system to audit membership payments, synchronize access tiers, and automatically transition workshop lifecycle states, ensuring data integrity and reducing manual oversight",
      "Enforced system-wide data integrity using Zod for type-safe form validation and Prisma ORM to manage 30+ version-controlled schema migrations, ensuring domain-constrained inputs and reliable schema updates",
      "Established reliability workflows writing Jest integration tests and managing Docker deployments via OpenVPN, monitoring system health via Winston structured logging to resolve production issues"
    ],
    "technologies": [
      "AES",
      "AES-256",
      "API",
      "Brivo",
      "C",
      "CSV",
      "Data Integrity",
      "Docker",
      "ESP32",
      "Google Calendar",
      "HTTPS",
      "IoT",
      "Jest",
      "Mailgun",
      "Middleware",
      "Node.js",
      "OAuth2",
      "ORM",
      "OpenVPN",
      "PostgreSQL",
      "Prisma",
      "React",
      "React Router",
      "React Router v7",
      "Schema Migrations",
      "Stripe",
      "TypeScript",
      "Winston",
      "Zod",
      "iCalendar"
    ]
  },
  {
    "id": 4,
    "title": "Software Developer -- LearnCoding Platform",
    "company": "University of British Columbia",
    "department": "Undergraduate Research Assistant & Directed Studies",
    "location": "Remote",
    "period": "Sept. 2024 -- Present",
    "current": true,
    "accomplishments": [
      "Developed adaptive learning platform serving 500+ students with code visualizers, multi-language switching, sandbox environments, and badge-based gamification to solidify coding concepts across UBC's Faculty of Science",
      "Integrated UBC Canvas API to automatically post assessment scores to official gradebooks, replacing manual CSV grade imports for 1,000+ monthly submissions and reducing grading overhead by 6 hours weekly",
      "Established secure routing authentication using Laravel and MySQL to enforce role-based access control, securing access to system-wide resources and API endpoints for 60+ faculty members",
      "Redesigned user interface using HTML, CSS, and JavaScript to implement responsive layouts, restructuring navigation patterns and interactive elements to enhance usability across mobile and desktop devices",
      "Created a landing page showcasing the platform's core capabilities, video demos, and centralized onboarding resources, driving 20+ monthly institutional inquiries and accelerating faculty adoption",
      "Constructed granular access controls using PHP and MySQL to dynamically configure instructor permissions for lesson and quiz management, streamlining administrative workflows",
      "Deployed Matomo Analytics, a self-hosted analytics platform using Docker across development and production environments to capture user navigation patterns, enabling CSV exports for route frequency analysis and institutional assessments",
      "Engineered an AI-powered content generator orchestrating industry-leading models to automate cross-language code translation and personalize student learning paths",
      "Migrated platform from VPN to public access by transferring the MySQL database, Docker services, and application storage, while reconfiguring Apache, firewalls, and cron jobs in compliance with UBC protocols",
      "Maintained production and development servers managing Apache, MySQL, and Docker for 500+ daily sessions, performing updates and security patches, and resolving 10+ incidents via log analysis to reduce resolution time"
    ],
    "technologies": [
      "AI",
      "API",
      "Apache",
      "CSS",
      "CSV",
      "Canvas API",
      "Docker",
      "HTML",
      "JavaScript",
      "Laravel",
      "Matomo",
      "Matomo Analytics",
      "MySQL",
      "PHP",
      "Role-based Access Control",
      "UBC Canvas",
      "VPN",
      "cron",
      "cron jobs",
      "firewalls"
    ]
  },
  {
    "id": 5,
    "title": "Undergraduate Teaching Assistant",
    "company": "University of British Columbia",
    "department": "",
    "location": "Kelowna, BC",
    "period": "Sept. 2024 -- Present",
    "current": true,
    "accomplishments": [
      "Facilitated interactive lab sessions and tutoring for over 60+ students, employing hands-on exercises and real-time coding challenges to enhance understanding of machine architecture, Java programming, and general coding concepts",
      "Designed and graded assignments and exams for 300+ students for the two largest computer science courses at UBC"
    ],
    "technologies": [
      "Java"
    ]
  }
];
