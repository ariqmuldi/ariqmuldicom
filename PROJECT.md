# Project Documentation

## Project Overview

This is a personal portfolio website for Ariq Muldi built with Next.js 16 (App Router) and React 19. The site features a modern terminal-themed design with animations powered by Framer Motion and styling via Tailwind CSS. It showcases projects, experience, education, and contact information in a single-page application format.

## Tech Stack

- **Framework**: Next.js 16.1.3 with App Router and Turbopack for development
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 3.4.1 with custom color palette and animations
- **Animations**: Framer Motion 12.0.6
- **Language**: TypeScript 5
- **Fonts**: Geist Sans and Geist Mono (from next/font/google)

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture

### App Structure

The application uses Next.js App Router with all components in the `app/` directory:

- `app/page.tsx` - Main page that composes all sections (client component using 'use client')
- `app/layout.tsx` - Root layout with metadata, fonts, and global HTML structure
- `app/globals.css` - Global styles with Tailwind directives, CSS variables, and custom components
- `app/components/` - Section components (HeroSection, ProjectsSection, ExperienceSection, EducationSection, ContactSection)

### Single-Page Application Pattern

The entire portfolio is a single-page application with anchor-based navigation (`#projects`, `#experience`, `#education`, `#contact`). All sections are rendered on the main page with smooth scroll behavior enabled via CSS.

### Component Patterns

1. **All section components are client components** - They use Framer Motion for animations and React hooks, requiring 'use client' directive
2. **Motion wrapper pattern** - Each section and card uses `motion.div` from Framer Motion with `initial`, `animate`, `whileInView`, and `transition` props
3. **Viewport-triggered animations** - Most animations use `whileInView` with `viewport={{ once: true }}` to trigger on scroll
4. **Staggered animations** - Use delay multiplied by index (e.g., `delay: index * 0.1`) for sequential item reveals

### Design System

The site uses a cohesive purple-beige-cream color palette defined in both `tailwind.config.ts` and `app/globals.css`:

**Primary Colors**:
- Purple: `#555879` (primary), `#3d3f5c` (dark), `#98A1BC` (light)
- Backgrounds: `#F4EBD3` (primary cream), `#faf7f0` (secondary), `#DED3C4` (tertiary beige)
- Text: `#2c2e3f` (primary dark)

**Custom Tailwind Classes** (defined in globals.css):
- `.terminal-window` - Dark terminal-style container
- `.card-glass` / `.card-glass-hover` - Glassmorphism effect cards
- `.gradient-text` / `.gradient-text-alt` - Gradient text effects
- `.skill-badge` / `.skill-badge-small` - Skill tag styling
- `.btn-primary` / `.btn-secondary` - Button styles
- `.section-gradient` - Section background gradient

### Terminal Theme

The hero section features a terminal-style design:
- Terminal window with colored dots (red/yellow/green)
- Terminal commands as UI elements (`$ whoami`, `$ git status`, `$ ls top-skills/`)
- Monospace font (Geist Mono) for terminal text
- Dark background (`#2c2e3f`) with cream text (`#F4EBD3`)

### Image Configuration

Next.js images are configured with `unoptimized: true` in `next.config.ts`, likely for static export compatibility.

### TypeScript Configuration

- Target: ES2017
- JSX: react-jsx (React 19's automatic JSX transform)
- Path alias: `@/*` maps to root directory
- Module resolution: bundler (Next.js default)

## LaTeX Resume Parser

The Experience section, Hero Section skills display, Education section, and Projects section are automatically generated from a LaTeX master resume file, ensuring the website stays in sync with the canonical resume.

### Overview

- **Source of Truth**: `/data/master-resume.tex` (LaTeX resume from Overleaf)
- **Generated Output**:
  - `/app/data/experiences.ts` (Experience data)
  - `/app/data/skills.ts` (Skills data)
  - `/app/data/education.ts` (Education data)
  - `/app/data/projects.ts` (Projects data)
  - **Note:** `/app/data/professional-contributions.ts` is **manually curated** and NOT auto-generated.
- **Parser Script**: `/scripts/parse-resume.ts` (Build-time parser)
- **Configuration**: `/data/resume-config.json` (Control visibility of experiences and accomplishments)

### How It Works

1. LaTeX resume is stored in `/data/master-resume.tex`
2. Parser runs automatically on `npm run dev` and `npm run build` (via prebuild/predev hooks)
3. **Experience extraction**:
   - Extracts experience data: title, company, department, location, dates, accomplishments
   - Auto-detects technologies from accomplishments using 300+ keyword matching
   - Generates type-safe TypeScript file at `/app/data/experiences.ts` (without timestamps)
   - ExperienceSection component imports and renders the data
4. **Skills extraction**:
   - Extracts all skill categories from Technical Skills section
   - Preserves nested skills with parentheses (e.g., "SQL (PostgreSQL, MySQL)")
   - Generates type-safe TypeScript file at `/app/data/skills.ts` (without timestamps)
   - HeroSection component imports and renders in "show all skills" view
5. **Education extraction**:
   - Extracts education data: school, location, degree, minor, graduation date, GPA, coursework
   - Pulls certifications from Skills section (Certifications & Courses category)
   - Generates type-safe TypeScript file at `/app/data/education.ts` (without timestamps)
   - EducationSection component imports and renders the data dynamically
6. **Projects extraction**:
   - Extracts project data: title, GitHub link, technologies, accomplishments
   - Joins accomplishments with ". " to create flowing paragraph descriptions
   - Auto-generates image paths from project titles (e.g., "/ponotodoropicture.jpg")
   - Generates type-safe TypeScript file at `/app/data/projects.ts` (without timestamps)
   - ProjectsSection component imports and renders the data

### Configuration System

The parser supports fine-grained control over what appears on the website via `/data/resume-config.json`:

- **Hide entire experiences**: `hidden: true`
- **Hide all accomplishments**: `hideAllAccomplishments: true` (keeps technologies visible)
- **Hide specific accomplishments**: `hideAccomplishments: [1, 3, 5]` (1-based indices)
- **Hide technologies**: `hideTechnologies: true`

**Auto-update feature**: Configuration file automatically updates when new experiences are added to the LaTeX resume, preserving existing settings.

### Workflow

1. Edit resume on Overleaf (Experience, Technical Skills, Education, and/or Projects sections)
2. Download updated `.tex` file
3. Replace `/data/master-resume.tex`
4. Run `npm run dev` or `npm run build`
5. Parser automatically extracts and updates:
   - Experience data → `/app/data/experiences.ts`
   - Skills data → `/app/data/skills.ts`
   - Education data → `/app/data/education.ts`
   - Projects data → `/app/data/projects.ts`
6. Website reflects latest resume content in Experience, Education, Projects sections and Hero Section skills

### Technology Extraction

The parser includes 300+ technology keywords covering:
- Programming languages (JavaScript, TypeScript, Python, Java, C++, PHP, etc.)
- Frameworks (React, Next.js, Flask, Django, Laravel, etc.)
- Databases (PostgreSQL, MySQL, MongoDB, Firebase, etc.)
- Cloud platforms (Google Cloud, AWS, Azure, Vercel, etc.)
- Tools and platforms (Docker, Git, Stripe, Shopify, etc.)

Technologies are extracted using case-insensitive word boundary matching from accomplishment text.

### Manual Parser Execution

```bash
npm run parse:resume
```

This command:
- Parses Experience section → generates `/app/data/experiences.ts`
- Parses Technical Skills section → generates `/app/data/skills.ts`
- Parses Education section → generates `/app/data/education.ts`
- Parses Projects section → generates `/app/data/projects.ts`
- Applies configuration filters from `/data/resume-config.json`
- Prints summary of parsed entries

For detailed documentation, see [`/data/README.md`](/data/README.md).

## Key Development Notes

1. **Client Components**: All interactive components require 'use client' directive due to Framer Motion and hooks usage
2. **Animation Delays**: When adding new items to lists, maintain consistent stagger delay patterns (typically 0.1s intervals)
3. **Color Consistency**: Always use the custom Tailwind classes or CSS variables rather than hardcoded colors
4. **Smooth Scrolling**: The site uses `scroll-behavior: smooth` globally for anchor navigation
5. **Responsive Design**: Components use Tailwind's responsive modifiers (md:, lg:, xl:) extensively
6. **Font Variables**: Geist fonts are loaded in layout.tsx and applied via CSS variables (--font-geist-sans, --font-geist-mono)

## Metadata & SEO

Comprehensive SEO metadata is defined in `app/layout.tsx`:
- Open Graph tags for social sharing
- Twitter Card metadata
- Keywords array for search optimization
- Images: `/for-metadata-picture.jpg` (OG) and `/for-metadata-picture-photo.jpg` (Twitter)
- Site URL: https://ariqmuldi.com
- Twitter handle: @ariqmuldi

## Custom Animations

Tailwind config defines custom animations:
- `float` / `float-slow` - Vertical floating motion
- `pulse-glow` - Pulsing shadow effect
- `gradient-shift` - Animated gradient background position
- `fade-in` / `slide-up` - Entry animations

When adding new animations, follow the existing pattern in `tailwind.config.ts` keyframes section.
