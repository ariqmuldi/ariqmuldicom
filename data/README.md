# LaTeX Resume Data

This directory contains the LaTeX source file for your master resume, which serves as the single source of truth for experience data displayed on your portfolio website.

## Files

- **master-resume.tex** - Your master resume LaTeX file from Overleaf
- **resume-config.json** - Configuration file to control which experiences and accomplishments are shown
- **README.md** - This file

## How It Works

The Experience section, Skills display, Education section, and Projects section on your website are automatically generated from your LaTeX resume:

1. Edit your resume on **Overleaf** (Experience, Technical Skills, Education, and/or Projects sections)
2. **Download** the updated `.tex` file
3. **Replace** `/data/master-resume.tex` with the new file
4. **Commit** to Git or just run `npm run dev` or `npm run build`
5. The parser automatically runs and updates:
   - `/app/data/experiences.ts` - Experience data
   - `/app/data/skills.ts` - Skills data
   - `/app/data/education.ts` - Education data
   - `/app/data/projects.ts` - Projects data
   - **Note:** `/app/data/professional-contributions.ts` is **manually curated** and NOT auto-generated.
6. Your website's Experience, Education, Projects sections and Skills display now reflect the latest resume

## Expected LaTeX Structure

The parser expects your Experience section to follow this structure:

```latex
\section{Experience}
\resumeSubHeadingListStart

\resumeSubheading
{Job Title}{\textcolor{sectionblue}{Date Range}}
{Company Name, Department (optional)}{Location}
\resumeItemListStart
    \resumeItem{Accomplishment 1...}
    \resumeItem{Accomplishment 2...}
    \resumeItem{Accomplishment 3...}
\resumeItemListEnd

% More experience entries...

\resumeSubHeadingListEnd
```

### Key Requirements

1. **Title and Date**: First line of `\resumeSubheading`
2. **Company and Location**: Second line of `\resumeSubheading`
3. **Department (optional)**: Include after company name with a comma: `Company Name, Department`
4. **Accomplishments**: Each `\resumeItem{...}` becomes an accomplishment bullet point
5. **Technologies**: Automatically extracted from accomplishment text based on keyword matching

## Data Extraction

### What Gets Extracted

| Field | Source | Example |
|-------|--------|---------|
| **Title** | 1st argument of `\resumeSubheading` | "Software Developer" |
| **Period** | 2nd argument of `\resumeSubheading` | "Jan. 2025 -- Present" |
| **Company** | 3rd argument (before comma if present) | "University of British Columbia" |
| **Department** | 3rd argument (after comma if present) | "Work Study Program" |
| **Location** | 4th argument of `\resumeSubheading` | "Kelowna, BC" |
| **Current** | Auto-detected if period contains "Present" | true or false |
| **Accomplishments** | All `\resumeItem{...}` entries | Array of strings |
| **Technologies** | Auto-extracted keywords from accomplishments | Array of technology names |

### Technology Extraction

Technologies are automatically detected from your accomplishment text using keyword matching. The parser recognizes 100+ common technologies including:

- **Languages**: JavaScript, TypeScript, Python, Java, C++, PHP, SQL, HTML/CSS
- **Frameworks**: React, Next.js, Flask, Django, Laravel, Node.js, Express.js
- **Databases**: PostgreSQL, MySQL, MongoDB, Redis, Firestore
- **Tools**: Docker, Git, GitHub, Stripe, Firebase, Prisma, Jest
- **Cloud**: Google Cloud, AWS, Azure, Vercel, Heroku
- **And many more...**

Technologies are case-insensitive and extracted using word boundary matching (so "JavaScript" in text becomes "JavaScript" in the output).

## Education Extraction

The Education section is automatically generated from your LaTeX resume, displaying school information, degree details, GPA, relevant coursework, and certifications dynamically.

### Overview

- **Source**: Education section in `/data/master-resume.tex`
- **Generated Output**: `/app/data/education.ts`
- **Component**: `EducationSection.tsx` imports and displays education data
- **Certifications**: Extracted from Skills section (Certifications & Courses category)

### What Gets Extracted

| Field | Description | Example |
|-------|-------------|---------|
| **school** | University name | "University of British Columbia" |
| **location** | School location | "Kelowna, BC" |
| **degree** | Degree program | "Bachelor of Science Major in Computer Science" |
| **minor** | Minor program (if applicable) | "Minor in Data Science" |
| **graduationDate** | Graduation date | "Expected Graduation, May 2026" |
| **gpa** | GPA value | "4.21/4.33" |
| **gpaPercentage** | GPA percentage | "90.6%" |
| **relevantCoursework** | Array of courses | ["Software Engineering", "Machine Learning", ...] |
| **certifications** | Array of certifications | ["Udemy Web Development Bootcamp", ...] |

### Expected LaTeX Structure for Education

```latex
\section{Education}
\resumeSubHeadingListStart

\resumeSubheading
{University of British Columbia}{Kelowna, BC}
{Bachelor of Science Major in Computer Science, Minor in Data Science}{Expected Graduation, May 2026}
\resumeItemListStart
    \resumeItem{\textbf{GPA:} 4.21/4.33 (90.6\%)}
    \resumeItem{\textbf{Relevant Coursework:} Software Engineering, Data Structures, Machine Learning, etc.}
\resumeItemListEnd

\resumeSubHeadingListEnd
```

### How Education Is Parsed

1. Parser finds `\section{Education}` in your LaTeX resume
2. Extracts school name and location from `\resumeSubheading` (1st and 2nd arguments)
3. Parses degree info from 3rd argument, splitting on comma for degree and minor
4. Extracts graduation date from 4th argument
5. Finds GPA from `\resumeItem{\textbf{GPA:} ...}` pattern
6. Extracts relevant coursework from `\resumeItem{\textbf{Relevant Coursework:} ...}` pattern
7. Pulls certifications from Skills section (Certifications & Courses category)
8. Generates `/app/data/education.ts` with all data

### Dynamic Display in EducationSection

The EducationSection component imports education data and displays:

- **GPA Achievement Card**: Shows `{education.gpa} GPA` with `{education.gpaPercentage} Average`
- **Degree Information**: Shows `{education.degree}` and `{education.minor}`
- **School Header**: Shows `{education.school}` and `{education.location}` with `{education.graduationDate}`
- **Relevant Coursework Grid**: Maps over `education.relevantCoursework` array dynamically
- **Certifications**: Available in education object (currently not displayed in component)

### Editing Education Data

To update education information on your website:

1. Edit your LaTeX resume's Education section on Overleaf
2. Update school, degree, GPA, coursework, or other fields
3. Download and replace `/data/master-resume.tex`
4. Run `npm run parse:resume` or `npm run build`
5. The EducationSection component automatically reflects the changes

### Adding/Removing Coursework

Simply edit your LaTeX resume's Relevant Coursework list:

```latex
\resumeItem{\textbf{Relevant Coursework:} Software Engineering, Machine Learning, Data Structures}
```

- Add courses: Append to comma-separated list
- Remove courses: Delete from list
- Reorder courses: Change order in list (display order matches LaTeX order)

Run `npm run parse:resume` to regenerate `/app/data/education.ts`.

### Certifications Source

Certifications are automatically pulled from your Technical Skills section. The parser looks for a category named "Certifications & Courses":

```latex
\section{Technical Skills}
\begin{itemize}[leftmargin=0.15in, label={}]
  \small{\item{
    \textbf{Certifications & Courses}{: Udemy Web Development Bootcamp, Python Pro Bootcamp} \\
  }}
\end{itemize}
```

The certifications are available in the education object but are not currently displayed in the EducationSection component.

### Education Parsing Notes

- GPA format: Must match pattern `\textbf{GPA:} X.XX/X.XX (XX.X\%)`
- Coursework: Comma-separated list automatically split into array
- LaTeX formatting automatically removed from all fields
- Single education entry supported (parser takes first `\resumeSubheading` in Education section)
- Certifications pulled from Skills section eliminate duplication
- No configuration needed - education displayed as-is from LaTeX resume

## Projects Extraction

The Projects section is automatically generated from your LaTeX resume's Projects section, displaying project titles, descriptions, technologies, GitHub links, and images dynamically.

### Overview

- **Source**: Projects section in `/data/master-resume.tex`
- **Generated Output**: `/app/data/projects.ts`
- **Component**: `ProjectsSection.tsx` imports and displays projects data
- **Description**: Automatically created by joining accomplishment bullets with periods

### What Gets Extracted

| Field | Description | Example |
|-------|-------------|---------|
| **id** | Sequential ID | 1, 2, 3, 4 |
| **title** | Project name from `\textbf{...}` | "Ponotodoro" |
| **description** | Accomplishments joined with ". " | "Developed a full-stack app..." |
| **image** | Auto-generated path | "/ponotodoropicture.jpg" |
| **technologies** | Tech stack from `\emph{...}` | ["JavaScript", "React", "Node.js"] |
| **featured** | Featured flag (defaults to false) | false |
| **github** | GitHub link or "#" for private | "https://github.com/..." or "#" |

### Expected LaTeX Structure for Projects

```latex
\section{Projects}
\resumeSubHeadingListStart

\resumeProjectHeading
{\textbf{Ponotodoro} \githubLink{https://github.com/ariqmuldi/ponotodoro} $|$ \emph{JavaScript, React, Node.js, PostgreSQL, Bootstrap, HTML/CSS}}{Aug. 2024 -- Oct. 2024}
\resumeItemListStart
    \resumeItem{Developed a full-stack app integrating the Pomodoro technique with note-taking and to-do lists functionality}
    \resumeItem{Engineered frontend with React and Bootstrap to structure the platform's task management system}
    \resumeItem{Designed backend using Node.js and PostgreSQL for efficient data management}
\resumeItemListEnd

% More projects...

\resumeSubHeadingListEnd
```

### How Projects Are Parsed

1. Parser finds `\section{Projects}` in your LaTeX resume
2. Extracts all `\resumeProjectHeading` blocks
3. For each project:
   - Extracts title from `\textbf{Project Name}`
   - Extracts GitHub link from `\githubLink{url}` (defaults to "#" if missing)
   - Extracts technologies from `\emph{tech1, tech2, ...}` after `$|$` separator
   - Finds all `\resumeItem{...}` accomplishments
   - Joins accomplishments with ". " to create a flowing paragraph description
   - Generates image path as `/{projectname}picture.jpg` (lowercase, no spaces)
4. Generates `/app/data/projects.ts` with all projects

### Description Generation

Project descriptions are automatically created by joining accomplishment bullets:

**LaTeX Input:**
```latex
\resumeItem{Developed a full-stack app integrating the Pomodoro technique}
\resumeItem{Engineered frontend with React and Bootstrap}
\resumeItem{Designed backend using Node.js and PostgreSQL}
```

**Generated Description:**
```
"Developed a full-stack app integrating the Pomodoro technique. Engineered frontend with React and Bootstrap. Designed backend using Node.js and PostgreSQL."
```

### Image Path Generation

Image paths are automatically generated from project titles:

- **Ponotodoro** → `/ponotodoropicture.jpg`
- **Flight Hub** → `/flighthubpicture.jpg`
- **ChatterBox** → `/chatterboxpicture.jpg`
- **MoodiJawoodi** → `/moodijawoodipicture.jpg`

**Pattern**: Lowercase title with spaces/special characters removed + "picture.jpg"

Place project images in `/public/` directory with these exact filenames.

### GitHub Link Handling

- **With GitHub link**: `\githubLink{https://github.com/user/repo}` → Displays "View on GitHub" button
- **Without GitHub link**: No `\githubLink{...}` command → Defaults to "#", displays "Private Repository"

### Technologies Display

Technologies are extracted from the inline `\emph{...}` tag after the `$|$` separator:

```latex
{\textbf{Ponotodoro} \githubLink{...} $|$ \emph{JavaScript, React, Node.js, PostgreSQL}}
```

This extracts: `["JavaScript", "React", "Node.js", "PostgreSQL"]`

Technologies appear as colored badges in the project card.

### Editing Projects Data

To update projects on your website:

1. Edit your LaTeX resume's Projects section on Overleaf
2. Update project names, accomplishments, technologies, or GitHub links
3. Download and replace `/data/master-resume.tex`
4. Run `npm run parse:resume` or `npm run build`
5. The ProjectsSection component automatically reflects the changes

### Adding/Removing Projects

Simply edit your LaTeX resume's Projects section:

- **Add project**: Add new `\resumeProjectHeading` block with accomplishments
- **Remove project**: Delete the entire project block
- **Reorder projects**: Move blocks up/down (display order matches LaTeX order)

Run `npm run parse:resume` to regenerate `/app/data/projects.ts`.

### Projects Parsing Notes

- Description automatically cleans up double periods
- LaTeX formatting automatically removed from all fields
- Technologies extracted from inline `\emph{...}` tag (not from accomplishment text)
- GitHub links default to "#" for private/unavailable repos
- Image paths must match generated pattern (place images in `/public/`)
- Featured flag defaults to `false` for all projects
- No configuration needed - projects displayed as-is from LaTeX resume
- Projects are shown in the order they appear in your LaTeX file

## Skills Extraction

The Hero Section "show all skills" view is automatically generated from your LaTeX resume's Technical Skills section.

### Expected LaTeX Structure for Skills

```latex
\section{Technical Skills}
\begin{itemize}[leftmargin=0.15in, label={}]
  \small{\item{
    \textbf{Programming Languages}{: JavaScript, TypeScript, Python, Java, C++, C, PHP, SQL (PostgreSQL, MySQL), HTML/CSS} \\
    \textbf{Frameworks & Libraries}{: React, Node.js, Next.js, Express.js, Flask, Laravel} \\
    \textbf{Developer Tools & Platforms}{: Git, GitHub, Docker, Postman, VS Code} \\
    \textbf{Cloud & Deployment}{: Google Cloud Platform, Firebase, Vercel} \\
  }}
\end{itemize}
```

### How Skills Are Parsed

1. Parser finds `\section{Technical Skills}` in your LaTeX resume
2. Extracts all `\textbf{Category Name}{: skill1, skill2, skill3}` patterns
3. Preserves nested skills with parentheses (e.g., "SQL (PostgreSQL, MySQL)" stays together)
4. Generates `/app/data/skills.ts` with all categories and skills
5. Hero Section displays all categories dynamically in the "show all skills" view

### What Gets Extracted

| Field | Source | Example |
|-------|--------|---------|
| **Category Name** | `\textbf{...}` first argument | "Programming Languages" |
| **Skills** | `{: ...}` content split by commas | ["JavaScript", "TypeScript", "Python"] |
| **Nested Skills** | Parentheses preserved | "SQL (PostgreSQL, MySQL)" |

### Skills Display Behavior

- **Top Skills**: Remain hardcoded in HeroSection (TypeScript, React, Python, GCP, Node.js, SQL)
- **Show All Skills**: Dynamically displays all categories from your LaTeX resume
- **Terminal Formatting**: Each category appears as a terminal command (e.g., `$ cat programming-languages.txt`)
- **Staggered Animations**: Categories animate in sequence with 0.1s delays

### Profile Picture Display

The Hero Section now features a responsive profile picture:
- **Source**: `/public/profile-photo.jpg`
- **Location**: Top-right corner of the terminal window
- **Responsive Behavior**:
  - **Mobile**: Smaller (20x20), positioned at top-16 right-4
  - **Desktop**: Larger (32x32), positioned at top-20 right-8
- **Interactions**:
  - **Entrance Animation**: Spring-based pop-in effect (0.5s delay)
  - **Hover Effect**: Scales up, rotates slightly, glows, and brightens border
  - **Positioning**: Uses `object-[50%_15%]` to perfectly frame face and upper body

### Favicon Generation

The website uses a dynamically generated favicon:
- **Source**: `/app/icon.tsx` (Next.js ImageResponse)
- **Output**: Generates `favicon.ico` / `icon.png` automatically
- **Design**:
  - Circular badge with "AM" initials
  - Dark purple background (`#2c2e3f`)
  - Cream text (`#F4EBD3`)
  - Border: 1px solid `#555879`
  - Font: Bold (900 weight), 12px size

### Adding/Removing Skill Categories

Simply edit your LaTeX resume's Technical Skills section:

1. Add new category: `\textbf{New Category}{: Skill1, Skill2, Skill3} \\`
2. Remove category: Delete the entire `\textbf{...}{: ...}` line
3. Reorder categories: Move lines up/down (display order matches LaTeX order)
4. Update skills: Edit the comma-separated list after the colon

Run `npm run parse:resume` or `npm run build` to regenerate `/app/data/skills.ts`.

### Skills Parsing Notes

- Skills with parentheses are preserved: "SQL (PostgreSQL, MySQL)" stays as one skill
- LaTeX formatting is automatically removed: `\textbf`, `\textit`, etc.
- Empty categories are skipped
- Category names are converted to slugs for terminal commands: "Frameworks & Libraries" → "frameworks-libraries"
- No configuration needed - skills are displayed as-is from your LaTeX resume

## Configuration: Hiding Experiences and Accomplishments

You can control which experiences and accomplishments appear on your website using the `resume-config.json` file.

**Auto-Update Feature**: The config file is automatically updated when you run the parser:
- New experiences from your LaTeX are automatically added with default settings (show everything)
- Your existing settings are preserved
- Removed experiences are automatically cleaned up

### Configuration File: `/data/resume-config.json`

```json
{
  "experiences": {
    "Junior Software Developer": {
      "hidden": false,
      "hideAccomplishments": []
    },
    "Undergraduate Teaching Assistant": {
      "hidden": true,
      "hideAccomplishments": []
    }
  }
}
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `hidden` | boolean | Set to `true` to completely hide this experience entry from your website |
| `hideAllAccomplishments` | boolean | Set to `true` to hide ALL accomplishment bullets for this experience. **Technologies remain visible** unless `hideTechnologies` is also `true`. Takes precedence over `hideAccomplishments`. |
| `hideAccomplishments` | number[] | Array of accomplishment indices (1-based) to hide. Example: `[1, 3, 5]` hides the 1st, 3rd, and 5th bullets. Ignored if `hideAllAccomplishments` is `true`. |
| `hideTechnologies` | boolean | Set to `true` to hide the technologies section for this experience. Works independently of accomplishment settings. |

### Experience Keys

Experience keys must match the format: `"Title"` or `"Title (Department)"`

**Current keys in your resume:**
- `"Junior Software Developer"`
- `"Software Developer (Work Study Program)"`
- `"Software Developer (Undergraduate Research Assistant & Directed Studies)"`
- `"Undergraduate Teaching Assistant"`

### Examples

#### Hide an Entire Experience

```json
{
  "experiences": {
    "Undergraduate Teaching Assistant": {
      "hidden": true,
      "hideAccomplishments": []
    }
  }
}
```

This will completely remove the Teaching Assistant role from your website.

#### Hide All Accomplishments (Keep Technologies)

```json
{
  "experiences": {
    "Junior Software Developer": {
      "hidden": false,
      "hideAllAccomplishments": true,
      "hideAccomplishments": [],
      "hideTechnologies": false
    }
  }
}
```

This will hide ALL accomplishment bullets from the Junior Software Developer role, but keep the experience entry (title, company, dates, location) and **technologies visible**.

#### Hide All Accomplishments AND Technologies

```json
{
  "experiences": {
    "Junior Software Developer": {
      "hidden": false,
      "hideAllAccomplishments": true,
      "hideAccomplishments": [],
      "hideTechnologies": true
    }
  }
}
```

This will hide ALL accomplishment bullets AND technologies from the Junior Software Developer role.

#### Hide Specific Accomplishments

```json
{
  "experiences": {
    "Junior Software Developer": {
      "hidden": false,
      "hideAllAccomplishments": false,
      "hideAccomplishments": [2, 4, 6, 8, 10],
      "hideTechnologies": false
    }
  }
}
```

This will hide the 2nd, 4th, 6th, 8th, and 10th accomplishment bullets from the Junior Software Developer role. Technologies are automatically re-extracted from the remaining accomplishments.

#### Hide Only Technologies

```json
{
  "experiences": {
    "Junior Software Developer": {
      "hidden": false,
      "hideAllAccomplishments": false,
      "hideAccomplishments": [],
      "hideTechnologies": true
    }
  }
}
```

This will hide only the technologies section, keeping all accomplishments visible.

#### Combine Multiple Options

```json
{
  "experiences": {
    "Junior Software Developer": {
      "hidden": false,
      "hideAllAccomplishments": true,
      "hideAccomplishments": [],
      "hideTechnologies": false
    },
    "Software Developer (Work Study Program)": {
      "hidden": false,
      "hideAllAccomplishments": false,
      "hideAccomplishments": [2, 4, 6],
      "hideTechnologies": true
    },
    "Undergraduate Teaching Assistant": {
      "hidden": true,
      "hideAllAccomplishments": false,
      "hideAccomplishments": [],
      "hideTechnologies": false
    }
  }
}
```

This configuration:
- Hides all accomplishments from Junior Software Developer (but keeps the job entry and technologies)
- Hides specific accomplishments (2, 4, 6) from Software Developer (Work Study Program) and hides its technologies
- Completely hides the Undergraduate Teaching Assistant experience

### Important Notes

- **Indices are 1-based**: The first accomplishment is `1`, not `0`
- **Keys are case-sensitive**: Must match exactly
- **Multiple matches**: If multiple experiences have the same title/department, the config applies to all of them
- **Technology behavior**:
  - When `hideAllAccomplishments: true`, technologies are **preserved** (visible by default)
  - When hiding specific accomplishments with `hideAccomplishments`, technologies are **re-extracted** from remaining accomplishments
  - Use `hideTechnologies: true` to explicitly hide technologies
- **hideAllAccomplishments takes precedence**: If `hideAllAccomplishments` is `true`, the `hideAccomplishments` array is ignored
- **Hiding all accomplishments vs hiding entire experience**:
  - `hideAllAccomplishments: true` → Keeps job entry and technologies visible, removes all bullets
  - `hidden: true` → Removes the entire experience from the website
- **Changes require re-parsing**: After editing the config, run `npm run parse:resume` or `npm run dev`

### Workflow for Updating Configuration

1. Edit `/data/resume-config.json` to change visibility settings
2. Run `npm run parse:resume` (or `npm run dev`)
3. Check the console output to see what was filtered
4. Verify the website displays correctly

### Workflow When Adding New Experiences to LaTeX

1. Edit your LaTeX resume on Overleaf, add new job/experience
2. Download and replace `/data/master-resume.tex`
3. Run `npm run parse:resume` (or `npm run dev`)
4. The config file automatically updates with the new experience (set to visible by default)
5. If needed, edit the config to hide the new experience or specific accomplishments
6. Run the parser again to apply your changes

**Your settings are safe**: Existing configuration settings are always preserved during auto-updates.

## Manual Parser Execution

To manually run the parser without building or starting dev server:

```bash
npm run parse:resume
```

This will:
- Read `/data/master-resume.tex`
- Read `/data/resume-config.json` (if it exists)
- Parse experience entries
- Apply configuration filters
- Generate `/app/data/experiences.ts`
- Parse skills from Technical Skills section
- Generate `/app/data/skills.ts`
- Parse education from Education section
- Generate `/app/data/education.ts`
- Parse projects from Projects section
- Generate `/app/data/projects.ts`
- Print a summary of parsed and filtered entries

## Automatic Execution

The parser runs automatically:

- **Before dev**: `npm run dev` → runs `predev` → runs `parse:resume`
- **Before build**: `npm run build` → runs `prebuild` → runs `parse:resume`

This ensures your website always displays the latest resume data.

## Troubleshooting

### Parser Fails: "No experience entries found"

**Problem**: The LaTeX structure doesn't match expected format.

**Solution**:
- Ensure you have `\section{Experience}` in your LaTeX
- Verify `\resumeSubheading` commands are properly formatted
- Check that braces `{...}` are balanced

### Parser Fails: "Missing title/company"

**Problem**: One of the required fields is empty.

**Solution**:
- Every `\resumeSubheading` must have all 4 arguments
- Check for typos in LaTeX commands
- Ensure no arguments are completely empty

### Technologies Not Detected

**Problem**: Expected technologies aren't showing up.

**Solution**:
- Ensure technology names appear in accomplishment text
- Check spelling matches the keyword list (case-insensitive)
- If a technology isn't in the keyword list, edit `/scripts/parse-resume.ts` and add it to `TECH_KEYWORDS`

### Nested Braces Issues

**Problem**: LaTeX commands like `\textcolor{sectionblue}{Sept. 2024}` cause parsing errors.

**Solution**: The parser handles nested braces automatically. If you see issues:
- Ensure braces are balanced
- Check for unescaped special characters
- Test with `npm run parse:resume` to see detailed error messages

### Build Fails After Updating Resume

**Problem**: Build or dev server won't start after updating LaTeX file.

**Solution**:
1. Run `npm run parse:resume` manually to see the error
2. Fix the LaTeX structure based on error message
3. Verify required fields are present
4. Try again with `npm run dev`

## Validation

The parser validates:
- All required fields are present (title, company, date, location)
- At least one accomplishment per experience
- Valid LaTeX structure
- Balanced braces

If validation fails, the build will fail with a clear error message.

## Generated Output

The parser generates four files:

### `/app/data/experiences.ts`

```typescript
// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
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

export const experiences: Experience[] = [
  // ... your parsed experiences
];
```

### `/app/data/skills.ts`

```typescript
// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from: /data/master-resume.tex

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Skills {
  categories: SkillCategory[];
}

export const skills: Skills = {
  categories: [
    // ... your parsed skill categories
  ]
};
```

### `/app/data/education.ts`

```typescript
// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
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

export const education: Education = {
  // ... your parsed education data
};
```

### `/app/data/projects.ts`

```typescript
// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from: /data/master-resume.tex

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  featured: boolean;
  github: string;
}

export const projects: Project[] = [
  // ... your parsed projects
];
```

**Do not edit these files manually** - they will be overwritten on the next parse.

## Workflow Summary

```
Overleaf (edit resume)
    ↓
Download .tex file
    ↓
Replace data/master-resume.tex
    ↓
npm run dev (or build)
    ↓
Parser runs automatically
    ↓
app/data/experiences.ts updated
app/data/skills.ts updated
app/data/education.ts updated
app/data/projects.ts updated
    ↓
Website displays latest experience, skills, education & projects
```

## Notes

- The LaTeX file in this directory should match your Overleaf master resume
- Keep this file in sync with your actual resume for accuracy
- **Experience data**: Technologies are auto-extracted, but you can manually add keywords to the parser if needed
- **Skills data**: All categories from Technical Skills section are automatically extracted and displayed
- **Education data**: School, degree, GPA, and coursework are extracted from Education section; certifications come from Skills section
- **Projects data**: Descriptions are generated from accomplishments; technologies come from inline `\emph{...}` tag; images auto-generated from project title
- The parser removes LaTeX formatting commands (`\textbf`, `\textcolor`, etc.) automatically
- Generated IDs for experiences and projects are sequential (1, 2, 3...) based on order in LaTeX file
- Skills maintain the category order from your LaTeX resume
- Top skills in Hero Section remain hardcoded; "show all skills" view is dynamic
- Education section displays all extracted data dynamically from your LaTeX resume
- Projects section displays all projects from your LaTeX resume with auto-generated descriptions
