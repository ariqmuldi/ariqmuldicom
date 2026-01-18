import * as fs from 'fs';
import * as path from 'path';

interface Experience {
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

interface SkillCategory {
  name: string;
  skills: string[];
}

interface Skills {
  categories: SkillCategory[];
}

interface Education {
  school: string;
  location: string;
  degree: string;
  minor: string;
  graduationDate: string;
  gpa: string;
  gpaPercentage: string;
  relevantCoursework: string[];
  certifications: string[];
}

// Common technology keywords to extract from accomplishments
const TECH_KEYWORDS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'C#', 'PHP',
  'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'R', 'Perl', 'Bash',
  'Shell', 'PowerShell', 'Liquid', 'Deluge', 'MIPS Assembly', 'Assembly',

  // SQL & Databases
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'MariaDB',
  'Oracle', 'Microsoft SQL Server', 'Cassandra', 'DynamoDB', 'Neo4j',
  'Elasticsearch', 'Firestore', 'Firebase Realtime Database', 'Supabase',

  // Web Technologies
  'HTML', 'CSS', 'HTML/CSS', 'SCSS', 'SASS', 'Less', 'Stylus',
  'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Chakra UI', 'Ant Design',
  'Bulma', 'Foundation', 'Semantic UI',

  // JavaScript Frameworks & Libraries
  'React', 'React.js', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Ember.js',
  'Backbone.js', 'Meteor', 'Gatsby', 'Nuxt.js', 'Remix',
  'React Router', 'React Router v7', 'Redux', 'Redux.js', 'MobX', 'Recoil',
  'Zustand', 'React Query', 'SWR', 'Framer Motion',

  // Backend Frameworks
  'Node.js', 'Express.js', 'Flask', 'Django', 'Laravel', 'Ruby on Rails',
  'Spring Boot', 'ASP.NET', 'FastAPI', 'NestJS', 'Koa', 'Hapi', 'Fastify',
  'Flask Blueprints',

  // Build Tools & Module Bundlers
  'Webpack', 'Vite', 'Rollup', 'Parcel', 'esbuild', 'Turbopack', 'Babel',
  'SWC', 'Gulp', 'Grunt',

  // Testing Frameworks
  'Jest', 'Vitest', 'Mocha', 'Chai', 'Jasmine', 'Cypress', 'Playwright',
  'Selenium', 'Puppeteer', 'Testing Library', 'Enzyme', 'pytest', 'JUnit',
  'TestNG', 'RSpec', 'PHPUnit',

  // ORM & Database Tools
  'Prisma', 'TypeORM', 'Sequelize', 'Mongoose', 'SQLAlchemy', 'Hibernate',
  'Entity Framework', 'Eloquent', 'Active Record', 'Knex.js',

  // Version Control
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial', 'GitHub Pages',
  'GitHub Actions',

  // Cloud Platforms
  'Google Cloud', 'Google Cloud Platform', 'GCP', 'AWS', 'Azure',
  'Google Cloud Run', 'Cloud Run', 'Cloud Functions', 'Cloud Scheduler',
  'Cloud Tasks', 'Cloud Build', 'API Gateway', 'Firebase', 'Vercel', 'Netlify',
  'Heroku', 'DigitalOcean', 'Linode', 'Render', 'Fly.io', 'Railway',

  // DevOps & Containerization
  'Docker', 'Kubernetes', 'Jenkins', 'CircleCI', 'Travis CI', 'GitLab CI',
  'ArgoCD', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Vagrant',

  // API & Protocols
  'REST', 'REST API', 'REST APIs', 'RESTful', 'GraphQL', 'gRPC', 'SOAP',
  'WebSockets', 'WebSocket', 'SSE', 'Server-Sent Events', 'WebRTC',
  'API', 'APIs', 'AJAX', 'Fetch API', 'Axios',

  // Authentication & Security
  'OAuth', 'OAuth2', 'JWT', 'SAML', 'OpenID Connect', 'Auth0', 'Passport.js',
  'bcrypt', 'AES-256', 'AES', 'RSA', 'HMAC', 'HMAC signature', 'SSL', 'TLS',
  'HTTPS', 'VPN', 'OpenVPN', 'firewalls', 'WAF',

  // E-commerce & Payment
  'Stripe', 'PayPal', 'Square', 'Braintree', 'Shopify', 'Shopify App Proxy',
  'Shopify Editor', 'WooCommerce', 'Magento',

  // CMS & Platforms
  'WordPress', 'Contentful', 'Strapi', 'Sanity', 'Ghost', 'Drupal',
  'Canvas API', 'Canvas LMS', 'UBC Canvas', 'Moodle', 'Blackboard',

  // Data Science & ML
  'Pandas', 'NumPy', 'Matplotlib', 'Plotly', 'Seaborn', 'Scikit-learn',
  'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'NLTK', 'spaCy',
  'Jupyter Notebook', 'Jupyter', 'JupyterLab', 'Machine Learning', 'ML',
  'Deep Learning', 'AI', 'Artificial Intelligence', 'Generative AI', 'LLM', 'LLMs',
  'Natural Language Processing', 'NLP', 'Computer Vision',

  // Mobile Development
  'React Native', 'Flutter', 'Swift', 'SwiftUI', 'Kotlin', 'Java',
  'Objective-C', 'Ionic', 'Cordova', 'Xamarin', 'iOS', 'Android',

  // Monitoring & Analytics
  'Google Analytics', 'Matomo', 'Matomo Analytics', 'Mixpanel', 'Amplitude',
  'Sentry', 'Datadog', 'New Relic', 'Prometheus', 'Grafana', 'Kibana',
  'Winston', 'Morgan', 'Pino', 'Log4j', 'Splunk',

  // Communication & Collaboration
  'Slack', 'Discord', 'Microsoft Teams', 'Zoom', 'Jira', 'Trello',
  'Asana', 'Monday.com', 'Notion', 'Confluence', 'Linear',

  // Email & Notifications
  'Mailgun', 'SendGrid', 'Postmark', 'Amazon SES', 'Twilio', 'Twilio API',
  'Nodemailer', 'smtplib', 'iCalendar',

  // Web Servers & Reverse Proxies
  'Apache', 'Nginx', 'Caddy', 'IIS', 'Tomcat', 'Lighttpd',

  // Package Managers
  'npm', 'Yarn', 'pnpm', 'pip', 'Poetry', 'Composer', 'Maven', 'Gradle',
  'Cargo', 'NuGet', 'Homebrew', 'apt', 'yum',

  // Data Formats
  'JSON', 'XML', 'YAML', 'TOML', 'CSV', 'Markdown', 'Protobuf', 'Avro',
  'Parquet',

  // CRM & Business Tools
  'Salesforce', 'HubSpot', 'Zoho', 'Zoho CRM', 'Zoho Flow', 'Zoho Inventory',
  'Zoho WorkDrive', 'Zoho Deluge', 'Microsoft Dynamics',

  // Design & Prototyping
  'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Framer', 'Axure', 'Balsamiq',
  'Canva', 'Photoshop', 'Illustrator',

  // IDE & Editors
  'Visual Studio', 'Visual Studio Code', 'VS Code', 'IntelliJ IDEA',
  'PyCharm', 'WebStorm', 'Eclipse', 'NetBeans', 'Sublime Text', 'Atom',
  'Vim', 'Emacs', 'Xcode', 'Android Studio',

  // API Testing & Development
  'Postman', 'Insomnia', 'cURL', 'Swagger', 'OpenAPI', 'Paw', 'HTTPie',

  // Scraping & Automation
  'BeautifulSoup', 'Scrapy', 'Cheerio', 'Puppeteer', 'Selenium',

  // IoT & Hardware
  'IoT', 'ESP32', 'Arduino', 'Raspberry Pi', 'MQTT', 'RFID', 'Bluetooth',
  'LoRa', 'Zigbee',

  // Methodologies & Practices
  'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD', 'Microservices',
  'Serverless', 'JAMstack', 'REST', 'GraphQL',

  // Validation & Schemas
  'Zod', 'Yup', 'Joi', 'Ajv', 'JSON Schema', 'Validator.js',

  // State Management
  'Context API', 'Pinia', 'Vuex', 'NgRx', 'XState',

  // UI Component Libraries
  'jQuery', 'Lodash', 'Underscore', 'Ramda', 'Moment.js', 'Day.js', 'date-fns',

  // Calendar & Scheduling
  'Google Calendar', 'FullCalendar', 'react-big-calendar', 'iCal',

  // Access Control & Permissions
  'Role-based Access Control', 'RBAC', 'ACL', 'ABAC', 'Casbin',

  // Logging & Auditing
  'Audit Logging', 'Event Sourcing', 'CQRS',

  // File Processing
  'CSV Processing', 'PDF Generation', 'Excel', 'XLSX', 'Multer', 'Busboy',
  'Sharp', 'ImageMagick',

  // Other Technologies & Tools
  'Linter', 'ESLint', 'Prettier', 'TSLint', 'Stylelint', 'RuboCop',
  'Black', 'autopep8', 'Pylint', 'Flake8',
  'Tkinter', 'Turtle', 'PyGame', 'cron', 'cron jobs', 'systemd',
  'Webhooks', 'webhooks', 'Webhook', 'Size Stream', 'Brivo',
  'Amadeus API', 'JDBC', 'JDBC API', 'ODBC',

  // Miscellaneous
  'Data Validation', 'Data Integrity', 'Schema Migrations', 'ORM',
  'Third-party APIs', 'RESTful APIs', 'API Integration', 'Middleware',
  'Proxy', 'Load Balancer', 'CDN', 'Cloudflare', 'FastlyEdge Computing'
];

function cleanLatexText(text: string): string {
  // Remove LaTeX color commands
  text = text.replace(/\\textcolor\{[^}]+\}\{([^}]+)\}/g, '$1');

  // Remove other common LaTeX commands but keep their content
  text = text.replace(/\\textbf\{([^}]+)\}/g, '$1');
  text = text.replace(/\\textit\{([^}]+)\}/g, '$1');
  text = text.replace(/\\emph\{([^}]+)\}/g, '$1');
  text = text.replace(/\\underline\{([^}]+)\}/g, '$1');
  text = text.replace(/\\href\{[^}]+\}\{([^}]+)\}/g, '$1');

  // Remove custom commands like \githubLink and \faLink
  text = text.replace(/\\githubLink\{[^}]+\}/g, '');
  text = text.replace(/\\faLink/g, '');
  text = text.replace(/\\faGithub/g, '');

  // Remove special LaTeX characters
  text = text.replace(/\\&/g, '&');
  text = text.replace(/\\%/g, '%');
  text = text.replace(/\\\$/g, '$');
  text = text.replace(/\\#/g, '#');

  // Clean up extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

function extractTechnologies(accomplishments: string[]): string[] {
  const foundTech = new Set<string>();
  const allText = accomplishments.join(' ');

  // Check for each technology keyword
  for (const tech of TECH_KEYWORDS) {
    // Case-insensitive search with word boundaries
    const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(allText)) {
      foundTech.add(tech);
    }
  }

  // Sort technologies alphabetically and return
  return Array.from(foundTech).sort();
}

function parseResume(latexContent: string): Experience[] {
  const experiences: Experience[] = [];

  // Find the Experience section
  const experienceSectionMatch = latexContent.match(/\\section\{Experience\}([\s\S]*?)(?=\\section|\\end\{document\})/);

  if (!experienceSectionMatch) {
    throw new Error('Could not find Experience section in LaTeX file');
  }

  const experienceSection = experienceSectionMatch[1];

  // Extract all resumeSubheading blocks
  // Pattern: \resumeSubheading{title}{date}{company}{location}
  // Note: Arguments may span multiple lines, and nested braces need special handling
  const subheadingRegex = /\\resumeSubheading\s*\n?\s*\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}\s*\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}\s*\n?\s*\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}\s*\{([^}]+)\}/g;

  let match;
  let currentIndex = 0;
  let id = 1;

  while ((match = subheadingRegex.exec(experienceSection)) !== null) {
    const title = cleanLatexText(match[1]);
    const dateRaw = cleanLatexText(match[2]);
    const companyRaw = cleanLatexText(match[3]);
    const location = cleanLatexText(match[4]);

    // Check if this is a current role (contains "Present")
    const current = /present/i.test(dateRaw);

    // Parse company and department
    // Company field sometimes has format: "Company, Department"
    let company = companyRaw;
    let department = '';

    if (companyRaw.includes(',')) {
      const parts = companyRaw.split(',').map(p => p.trim());
      company = parts[0];
      department = parts.slice(1).join(', ');
    }

    // Find the accomplishments for this experience
    // They appear between \resumeItemListStart and \resumeItemListEnd after the subheading
    const startPos = match.index + match[0].length;
    const nextSubheadingMatch = subheadingRegex.exec(experienceSection);
    const endPos = nextSubheadingMatch ? nextSubheadingMatch.index : experienceSection.length;

    // Reset regex to continue from where we were
    subheadingRegex.lastIndex = match.index + match[0].length;

    const blockContent = experienceSection.substring(startPos, endPos);

    // Extract accomplishments
    const accomplishments: string[] = [];
    const itemRegex = /\\resumeItem\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;

    let itemMatch;
    while ((itemMatch = itemRegex.exec(blockContent)) !== null) {
      const accomplishment = cleanLatexText(itemMatch[1]);
      if (accomplishment) {
        accomplishments.push(accomplishment);
      }
    }

    // Extract technologies from accomplishments
    const technologies = extractTechnologies(accomplishments);

    // Validate required fields
    if (!title) {
      throw new Error(`Missing title for experience at position ${id}`);
    }
    if (!company) {
      throw new Error(`Missing company for experience: ${title}`);
    }
    if (accomplishments.length === 0) {
      throw new Error(`No accomplishments found for experience: ${title}`);
    }

    experiences.push({
      id,
      title,
      company,
      department,
      location,
      period: dateRaw,
      current,
      accomplishments,
      technologies
    });

    id++;
  }

  if (experiences.length === 0) {
    throw new Error('No experience entries found in resume');
  }

  return experiences;
}

function parseSkills(latexContent: string): Skills {
  // Find the Technical Skills section
  const skillsSectionMatch = latexContent.match(/\\section\{Technical Skills\}([\s\S]*?)(?=\\section|\\end\{document\})/);

  if (!skillsSectionMatch) {
    throw new Error('Could not find Technical Skills section in LaTeX file');
  }

  const skillsSection = skillsSectionMatch[1];

  // Extract categories using regex pattern
  // Pattern: \textbf{Category Name}{: skill1, skill2, skill3}
  const categoryRegex = /\\textbf\{([^}]+)\}\{:\s*([^}]+)\}/g;

  const categories: SkillCategory[] = [];
  let match;

  while ((match = categoryRegex.exec(skillsSection)) !== null) {
    const categoryName = cleanLatexText(match[1]);
    const skillsRaw = match[2];

    // Split skills by comma, but preserve commas inside parentheses
    const skills: string[] = [];
    let currentSkill = '';
    let parenDepth = 0;

    for (let i = 0; i < skillsRaw.length; i++) {
      const char = skillsRaw[i];

      if (char === '(') {
        parenDepth++;
        currentSkill += char;
      } else if (char === ')') {
        parenDepth--;
        currentSkill += char;
      } else if (char === ',' && parenDepth === 0) {
        // Only split on commas outside of parentheses
        const cleanedSkill = cleanLatexText(currentSkill.trim());
        if (cleanedSkill.length > 0) {
          skills.push(cleanedSkill);
        }
        currentSkill = '';
      } else {
        currentSkill += char;
      }
    }

    // Don't forget the last skill
    const cleanedSkill = cleanLatexText(currentSkill.trim());
    if (cleanedSkill.length > 0) {
      skills.push(cleanedSkill);
    }

    if (categoryName && skills.length > 0) {
      categories.push({
        name: categoryName,
        skills
      });
    }
  }

  if (categories.length === 0) {
    throw new Error('No skill categories found in Technical Skills section');
  }

  return { categories };
}

function parseEducation(latexContent: string, skills: Skills): Education {
  // Find the Education section
  const educationSectionMatch = latexContent.match(/\\section\{Education\}([\s\S]*?)(?=\\section|\\end\{document\})/);

  if (!educationSectionMatch) {
    throw new Error('Could not find Education section in LaTeX file');
  }

  const educationSection = educationSectionMatch[1];

  // Extract school name and location from \resumeSubheading
  // Pattern: \resumeSubheading{School Name}{Location}{Degree Info}{Graduation Date}
  const subheadingRegex = /\\resumeSubheading\s*\n?\s*\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}\s*\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}\s*\n?\s*\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}\s*\{([^}]+)\}/;

  const subheadingMatch = educationSection.match(subheadingRegex);
  if (!subheadingMatch) {
    throw new Error('Could not parse education subheading');
  }

  const school = cleanLatexText(subheadingMatch[1]);
  const location = cleanLatexText(subheadingMatch[2]);
  const degreeInfo = cleanLatexText(subheadingMatch[3]);
  const graduationDate = cleanLatexText(subheadingMatch[4]);

  // Parse degree info: "Bachelor of Science Major in Computer Science, Minor in Data Science"
  let degree = '';
  let minor = '';

  const degreeMatch = degreeInfo.match(/^([^,]+)(?:,\s*(.+))?$/);
  if (degreeMatch) {
    degree = degreeMatch[1].trim();
    minor = degreeMatch[2] ? degreeMatch[2].trim() : '';
  } else {
    degree = degreeInfo;
  }

  // Extract GPA from \resumeItem
  let gpa = '';
  let gpaPercentage = '';
  const gpaRegex = /\\textbf\{GPA:\}\s*([0-9.]+\/[0-9.]+)\s*\(([0-9.]+)\\?%\)/;
  const gpaMatch = educationSection.match(gpaRegex);
  if (gpaMatch) {
    gpa = gpaMatch[1];
    gpaPercentage = gpaMatch[2] + '%';
  }

  // Extract relevant coursework from \resumeItem
  let relevantCoursework: string[] = [];
  // Pattern: \resumeItem{\textbf{Relevant Coursework:} course1, course2, ...}
  const courseworkRegex = /\\resumeItem\{\\textbf\{Relevant Coursework:\}\s*([^}]+)\}/;
  const courseworkMatch = educationSection.match(courseworkRegex);
  if (courseworkMatch) {
    const courseworkText = courseworkMatch[1];
    // Split by commas and clean each course
    relevantCoursework = courseworkText
      .split(',')
      .map(course => cleanLatexText(course.trim()))
      .filter(course => course.length > 0);
  }

  // Extract certifications from the Skills object (Certifications & Courses category)
  const certifications: string[] = [];
  const certificationsCategory = skills.categories.find(
    cat => cat.name === 'Certifications & Courses'
  );
  if (certificationsCategory) {
    certifications.push(...certificationsCategory.skills);
  }

  return {
    school,
    location,
    degree,
    minor,
    graduationDate,
    gpa,
    gpaPercentage,
    relevantCoursework,
    certifications
  };
}

interface ExperienceConfig {
  hidden?: boolean;
  hideAllAccomplishments?: boolean;
  hideAccomplishments?: number[];
  hideTechnologies?: boolean;
}

interface ResumeConfig {
  experiences: Record<string, ExperienceConfig>;
}

function getExperienceKey(exp: Experience): string {
  // Create a key that matches the config file format: "Title" or "Title (Department)"
  if (exp.department) {
    return `${exp.title} (${exp.department})`;
  }
  return exp.title;
}

function loadConfig(configPath: string): ResumeConfig | null {
  try {
    if (!fs.existsSync(configPath)) {
      console.log('No config file found, will create one with default settings');
      return null;
    }

    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent) as ResumeConfig;
    return config;
  } catch (error) {
    console.warn('Warning: Failed to load config file, showing all experiences');
    console.warn(error instanceof Error ? error.message : String(error));
    return null;
  }
}

function updateConfigFile(configPath: string, experiences: Experience[], existingConfig: ResumeConfig | null): void {
  const newConfig: ResumeConfig = {
    experiences: {}
  };

  // For each experience in the LaTeX file, add to config
  for (const exp of experiences) {
    const key = getExperienceKey(exp);

    // If config already exists for this experience, preserve it
    if (existingConfig?.experiences[key]) {
      newConfig.experiences[key] = existingConfig.experiences[key];
    } else {
      // New experience - add with defaults
      newConfig.experiences[key] = {
        hidden: false,
        hideAllAccomplishments: false,
        hideAccomplishments: [],
        hideTechnologies: false
      };
    }
  }

  // Build the full config object with instructions
  const fullConfig = {
    experiences: newConfig.experiences,
    _instructions: {
      description: "Configuration file to control which experiences and accomplishments are shown on the website",
      usage: {
        hidden: "Set to true to hide the entire experience entry. Applies to all experiences matching this title/department.",
        hideAllAccomplishments: "Set to true to hide ALL accomplishments for this experience. Technologies remain visible unless hideTechnologies is also true.",
        hideAccomplishments: "Array of accomplishment indices (1-based) to hide. Example: [1, 3, 5] hides the 1st, 3rd, and 5th accomplishments. Ignored if hideAllAccomplishments is true.",
        hideTechnologies: "Set to true to hide the technologies section for this experience."
      },
      examples: {
        hideEntireExperience: {
          "Undergraduate Teaching Assistant": {
            hidden: true,
            hideAllAccomplishments: false,
            hideAccomplishments: [],
            hideTechnologies: false
          }
        },
        hideAllAccomplishmentsKeepTech: {
          "Junior Software Developer": {
            hidden: false,
            hideAllAccomplishments: true,
            hideAccomplishments: [],
            hideTechnologies: false
          }
        },
        hideAccomplishmentsAndTech: {
          "Junior Software Developer": {
            hidden: false,
            hideAllAccomplishments: true,
            hideAccomplishments: [],
            hideTechnologies: true
          }
        },
        hideSpecificAccomplishments: {
          "Software Developer (Work Study Program)": {
            hidden: false,
            hideAllAccomplishments: false,
            hideAccomplishments: [2, 4, 6, 8],
            hideTechnologies: false
          }
        }
      },
      notes: [
        "Experience keys should match: 'Title' or 'Title (Department)'",
        "Keys are case-sensitive and must match exactly",
        "If multiple experiences have the same title/department, the config applies to all of them",
        "Accomplishment indices are 1-based (first accomplishment is 1, not 0)",
        "Changes to this file require re-running the parser: npm run parse:resume",
        "This file is auto-updated when new experiences are added to your LaTeX resume",
        "Your existing settings are preserved when the config is updated",
        "Current experience keys:",
        ...Object.keys(newConfig.experiences).map(key => `  - ${key}`)
      ]
    }
  };

  const configJson = JSON.stringify(fullConfig, null, 2);
  fs.writeFileSync(configPath, configJson, 'utf-8');

  // Check if anything changed
  const addedKeys = Object.keys(newConfig.experiences).filter(
    key => !existingConfig?.experiences[key]
  );
  const removedKeys = existingConfig
    ? Object.keys(existingConfig.experiences).filter(
        key => !newConfig.experiences[key]
      )
    : [];

  if (addedKeys.length > 0) {
    console.log(`   Added ${addedKeys.length} new experience(s) to config:`);
    addedKeys.forEach(key => console.log(`     + ${key}`));
  }
  if (removedKeys.length > 0) {
    console.log(`   Removed ${removedKeys.length} old experience(s) from config:`);
    removedKeys.forEach(key => console.log(`     - ${key}`));
  }
  if (addedKeys.length === 0 && removedKeys.length === 0) {
    console.log('   Config file is up to date');
  }
}

function applyConfig(experiences: Experience[], config: ResumeConfig | null): Experience[] {
  if (!config) {
    return experiences;
  }

  const filtered: Experience[] = [];

  for (const exp of experiences) {
    const key = getExperienceKey(exp);
    const expConfig = config.experiences[key];

    // Skip if entire experience is hidden
    if (expConfig?.hidden === true) {
      console.log(`   Hiding experience: ${key}`);
      continue;
    }

    // Determine accomplishments based on config
    let accomplishments = exp.accomplishments;
    let technologies = exp.technologies;

    // Check if we should hide all accomplishments
    if (expConfig?.hideAllAccomplishments === true) {
      console.log(`   Hiding all accomplishments from: ${key}`);
      accomplishments = [];
      // Keep original technologies - they should still be visible
    }
    // Filter specific accomplishments if specified
    else if (expConfig?.hideAccomplishments && expConfig.hideAccomplishments.length > 0) {
      const indicesToHide = new Set(expConfig.hideAccomplishments);
      accomplishments = exp.accomplishments.filter((_, index) => {
        // hideAccomplishments is 1-based, convert to 0-based
        return !indicesToHide.has(index + 1);
      });

      console.log(`   Filtered ${exp.accomplishments.length - accomplishments.length} accomplishments from: ${key}`);

      // Update technologies based on filtered accomplishments
      technologies = extractTechnologies(accomplishments);
    }

    // Check if we should hide technologies
    if (expConfig?.hideTechnologies === true) {
      console.log(`   Hiding technologies from: ${key}`);
      technologies = [];
    }

    filtered.push({
      ...exp,
      accomplishments,
      technologies
    });
  }

  return filtered;
}

function generateTypeScriptFile(experiences: Experience[], outputPath: string): void {
  const content = `// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from: /data/master-resume.tex

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

export const experiences: Experience[] = ${JSON.stringify(experiences, null, 2)};
`;

  fs.writeFileSync(outputPath, content, 'utf-8');
}

function generateSkillsTypeScriptFile(skills: Skills, outputPath: string): void {
  const content = `// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from: /data/master-resume.tex

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Skills {
  categories: SkillCategory[];
}

export const skills: Skills = ${JSON.stringify(skills, null, 2)};
`;

  fs.writeFileSync(outputPath, content, 'utf-8');
}

function generateEducationTypeScriptFile(education: Education, outputPath: string): void {
  const content = `// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from: /data/master-resume.tex

export interface Education {
  school: string;
  location: string;
  degree: string;
  minor: string;
  graduationDate: string;
  gpa: string;
  gpaPercentage: string;
  relevantCoursework: string[];
  certifications: string[];
}

export const education: Education = ${JSON.stringify(education, null, 2)};
`;

  fs.writeFileSync(outputPath, content, 'utf-8');
}

function main() {
  try {
    console.log('Reading LaTeX resume file...');

    const projectRoot = path.resolve(__dirname, '..');
    const latexPath = path.join(projectRoot, 'data', 'master-resume.tex');
    const configPath = path.join(projectRoot, 'data', 'resume-config.json');
    const outputPath = path.join(projectRoot, 'app', 'data', 'experiences.ts');
    const skillsOutputPath = path.join(projectRoot, 'app', 'data', 'skills.ts');
    const educationOutputPath = path.join(projectRoot, 'app', 'data', 'education.ts');

    if (!fs.existsSync(latexPath)) {
      throw new Error(`LaTeX file not found at: ${latexPath}`);
    }

    const latexContent = fs.readFileSync(latexPath, 'utf-8');

    console.log('Parsing experience data...');
    const parsedExperiences = parseResume(latexContent);

    console.log(`Successfully parsed ${parsedExperiences.length} experience entries from LaTeX\n`);

    // Load existing configuration
    console.log('Loading configuration...');
    const existingConfig = loadConfig(configPath);

    // Update config file with any new/removed experiences
    console.log('Updating configuration file...');
    updateConfigFile(configPath, parsedExperiences, existingConfig);

    // Reload the updated config
    const config = loadConfig(configPath);

    // Apply configuration filters
    console.log('\nApplying configuration filters...');
    const experiences = applyConfig(parsedExperiences, config);

    console.log(`\nFinal output: ${experiences.length} experience entries:`);
    experiences.forEach(exp => {
      console.log(`   - ${exp.title} at ${exp.company}`);
      console.log(`     ${exp.accomplishments.length} accomplishments, ${exp.technologies.length} technologies`);
    });

    console.log('\nGenerating TypeScript file...');
    generateTypeScriptFile(experiences, outputPath);

    console.log(`Successfully generated: ${outputPath}`);

    // Parse and generate skills
    console.log('\nParsing skills data...');
    const skills = parseSkills(latexContent);

    console.log(`Successfully parsed ${skills.categories.length} skill categories from LaTeX:`);
    skills.categories.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat.skills.length} skills`);
    });

    console.log('\nGenerating skills TypeScript file...');
    generateSkillsTypeScriptFile(skills, skillsOutputPath);

    console.log(`Successfully generated: ${skillsOutputPath}`);

    // Parse and generate education
    console.log('\nParsing education data...');
    const education = parseEducation(latexContent, skills);

    console.log('Successfully parsed education:');
    console.log(`   - School: ${education.school}`);
    console.log(`   - Degree: ${education.degree}`);
    console.log(`   - Minor: ${education.minor}`);
    console.log(`   - GPA: ${education.gpa} (${education.gpaPercentage})`);
    console.log(`   - Coursework: ${education.relevantCoursework.length} courses`);
    console.log(`   - Certifications: ${education.certifications.length} certifications`);

    console.log('\nGenerating education TypeScript file...');
    generateEducationTypeScriptFile(education, educationOutputPath);

    console.log(`Successfully generated: ${educationOutputPath}`);
    console.log('\nResume parsing completed successfully!');

  } catch (error) {
    console.error('ERROR: Resume parsing failed:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
