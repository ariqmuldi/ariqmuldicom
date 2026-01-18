# LaTeX Resume Data

This directory contains the LaTeX source file for your master resume, which serves as the single source of truth for experience data displayed on your portfolio website.

## Files

- **master-resume.tex** - Your master resume LaTeX file from Overleaf
- **resume-config.json** - Configuration file to control which experiences and accomplishments are shown
- **README.md** - This file

## How It Works

The Experience section on your website is automatically generated from your LaTeX resume:

1. Edit your resume on **Overleaf**
2. **Download** the updated `.tex` file
3. **Replace** `/data/master-resume.tex` with the new file
4. **Commit** to Git or just run `npm run dev` or `npm run build`
5. The parser automatically runs and updates `/app/data/experiences.ts`
6. Your website's Experience section now reflects the latest resume

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

The parser generates `/app/data/experiences.ts`:

```typescript
// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from: /data/master-resume.tex
// Last updated: 2026-01-17T15:30:00Z

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

**Do not edit this file manually** - it will be overwritten on the next parse.

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
    ↓
Website displays latest experience
```

## Notes

- The LaTeX file in this directory should match your Overleaf master resume
- Keep this file in sync with your actual resume for accuracy
- Technologies are auto-extracted, but you can manually add keywords to the parser if needed
- The parser removes LaTeX formatting commands (`\textbf`, `\textcolor`, etc.) automatically
- Generated IDs are sequential (1, 2, 3...) based on order in LaTeX file
