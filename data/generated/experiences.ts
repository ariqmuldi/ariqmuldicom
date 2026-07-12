// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from: /data/source/master-resume.tex

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
    "title": "Lead Software Developer",
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
    "period": "Jan. 2025 -- Jan. 2026",
    "current": false,
    "accomplishments": [
      "Architected a full-stack membership platform in TypeScript, React Router v7, PostgreSQL, and Tailwind CSS serving 1,000+ members, digitizing workshop enrollments, equipment reservations, and membership management",
      "Integrated Stripe to process $1,000+ monthly revenue via checkout sessions and tokenized one-click payments, generating waivers by overlaying digital signatures using pdf-lib with AES-256 encryption",
      "Built a service that automatically 100+ syncs every workshop, equipment item, and membership plan into Stripe products, enabling discount codes for specific items, with an admin panel to link all items",
      "Engineered an equipment booking engine with a time-slot visualization grid, enforcing a 4-tier role-based access system and prerequisite chains to prevent unauthorized usage across 200+ daily reservations",
      "Developed a centralized admin dashboard consolidating space closure management, per-occurrence workshop cancellations with automatic member notifications, CSV financial reporting, and access-limit enforcement into a single operator interface",
      "Implemented a Mailgun email pipeline delivering 700+ monthly notifications with iCalendar attachments, JWT-secured password reset links, and live Google Calendar syncing via a custom OAuth2 flow with AES-encrypted token storage",
      "Programmed ESP32 firmware in C++ to authenticate RFID scans via HTTPS and log access events for restricted equipment and doors, with an admin interface for assigning per-card permissions",
      "Automated physical building access for 1,000+ members by integrating the Brivo Enterprise API to provision digital key passes and validate 500+ daily door-scan events using tamper-proof HMAC webhook signatures",
      "Designed a Node.js background job system to automate membership payment audits, access tier synchronization, and workshop lifecycle transitions, eliminating recurring manual administrative tasks",
      "Enforced platform-wide data integrity with Zod validation, case-insensitive email normalization, 3-hour session timeouts with per-request validation, and 100+ version-controlled Prisma schema migrations",
      "Established production reliability with Jest integration tests, Docker deployments over OpenVPN, and Winston structured logging with an in-browser admin log viewer for real-time production diagnostics",
      "Engineered a recurring billing engine supporting 4 subscription cycles with prorated upgrade charges, GST calculation, automated Stripe refunds on cancellation, and a member-controlled auto-renew toggle",
      "Designed multi-tier workshop pricing with independent seat limits per price level (e.g., Student, Member, General), automatically blocking purchases when any tier sells out",
      "Built multi-day workshop series support with automatic enrollment for newly added sessions and a re-offer system for recurring workshops, preserving all historical registration data across scheduling cycles",
      "Implemented an atomic admin suspension system that cancels all active plans, blocks re-enrollment, logs the admin's reason and timestamp, and notifies the member by email in a single fail-safe database transaction",
      "Developed a physical access analytics dashboard pairing IoT entry and exit scans to measure per-member machine usage time, with a searchable raw scan log filterable by user, equipment, and timestamp"
    ],
    "technologies": [
      "AES",
      "AES-256",
      "API",
      "Brivo",
      "C",
      "CSS",
      "CSV",
      "Data Integrity",
      "Docker",
      "ESP32",
      "Google Calendar",
      "HMAC",
      "HTTPS",
      "IoT",
      "JWT",
      "Jest",
      "Mailgun",
      "Node.js",
      "OAuth2",
      "OpenVPN",
      "PostgreSQL",
      "Prisma",
      "RFID",
      "React",
      "React Router",
      "React Router v7",
      "Schema Migrations",
      "Stripe",
      "Tailwind CSS",
      "TypeScript",
      "Webhook",
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
    "period": "Sept. 2024 -- Sept. 2025",
    "current": false,
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
    "period": "Sept. 2024 -- Sept. 2025",
    "current": false,
    "accomplishments": [
      "Facilitated lab sessions and tutoring for over 60+ students, employing exercises and coding challenges to enhance understanding of machine architecture using MIPS Assembly, Java programming, and general coding concepts",
      "Designed and graded assignments and exams for 300+ students for the two largest computer science courses at UBC"
    ],
    "technologies": [
      "Assembly",
      "Java",
      "MIPS Assembly"
    ]
  }
];
