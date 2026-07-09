// @/data/content/work.ts
// This file is manually curated and is not auto-generated.
// It showcases specific high-impact projects from work experience (the "Work" section).
//
// `description` and `technologies` are AI-owned: generated per-role into
// work-experience-content.json by `npm run generate:content` (see
// docs/implementations/ROLE-CONTENT-AND-EXPANDABLE-EXPERIENCE.md). They are merged in at
// module load, keyed by `contentKey`. To hand-override either field for an item, just set
// it inline below — an inline value always wins over the AI value (see resolve()).

import workExperienceContent from './work-experience-content.json';

export interface WorkItem {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  websiteUrl?: string;
  experienceAnchor: string;
  comingSoon?: boolean;
  // Stable role slug joining this item to its work-experience-content.json entry (shared with the
  // Experience section, which joins the same entry by experienceId).
  contentKey?: string;
  // --- Optional presentation fields for the Selected Work section ---
  // Short role label shown in the article meta row (e.g. "Research Assistant").
  role?: string;
  // Figure caption label, e.g. "MSYK.MEMBERSHIP" → "FIG.01 / MSYK.MEMBERSHIP".
  figLabel?: string;
  // Dark gradient overlay label on the figure (e.g. "IN PRODUCTION"); omit for none.
  overlayLabel?: string;
  // How the figure image fills its 16:10 frame. Defaults to 'cover' (crop to fill, right for wide
  // screenshots). Use 'contain' for a near-square/portrait source that cover would crop — it shows
  // the whole image, letterboxed on the paper background (e.g. the DOUBL fit card).
  imageFit?: 'cover' | 'contain';
}

export interface WorkGroup {
  id: number;
  organization: string;
  // Short display name used in article meta rows (e.g. "UBC").
  shortName?: string;
  workItems: WorkItem[];
}

type RoleContent = {
  experienceId: number;
  sourceHash: string;
  approved: boolean;
  technologies: string[];
  description?: string;
};
const contentByKey = workExperienceContent as Record<string, RoleContent>;

// Curated data may omit the two AI-owned fields; the exported WorkItem keeps them required.
type CuratedWorkItem = Omit<WorkItem, 'description' | 'technologies'> & {
  description?: string;
  technologies?: string[];
};
type CuratedWorkGroup = Omit<WorkGroup, 'workItems'> & { workItems: CuratedWorkItem[] };

// Precedence: inline hand-written value → AI value → empty.
function resolve(item: CuratedWorkItem): WorkItem {
  const ai = item.contentKey ? contentByKey[item.contentKey] : undefined;
  return {
    ...item,
    description: item.description ?? ai?.description ?? '',
    technologies: item.technologies ?? ai?.technologies ?? [],
  };
}

const curatedGroups: CuratedWorkGroup[] = [
  {
    id: 2,
    organization: "DOUBL",
    shortName: "DOUBL",
    workItems: [
      {
        id: 4,
        title: "Professional Showcase (TBA)",
        // description + technologies are AI-generated (work-experience-content.json, key "doubl").
        image: "/doubl-picture.png",
        experienceAnchor: "#experience-1",
        contentKey: "doubl",
        comingSoon: true,
        role: "Lead Software Developer",
        figLabel: "DOUBL",
        overlayLabel: "IN PRODUCTION",
        imageFit: "contain"
      }
    ]
  },
  {
    id: 1,
    organization: "University of British Columbia",
    shortName: "UBC",
    workItems: [
      {
        id: 1,
        title: "Makerspace Platform",
        // description + technologies are AI-generated (work-experience-content.json, key "makerspace").
        image: "/msyk-picture.png",
        githubUrl: "https://github.com/University-of-British-Columbia-Okanagan/MSYK_Membership",
        websiteUrl: "https://my.makerspaceyk.com",
        experienceAnchor: "#experience-3",
        contentKey: "makerspace",
        role: "Software Developer",
        figLabel: "MSYK.MEMBERSHIP"
      },
      {
        id: 2,
        title: "LearnCoding Platform",
        // description + technologies are AI-generated (work-experience-content.json, key "learncoding").
        image: "/learncoding-picture.png",
        websiteUrl: "https://learncoding.ok.ubc.ca",
        experienceAnchor: "#experience-4",
        contentKey: "learncoding",
        role: "Software Developer",
        figLabel: "LEARNCODING"
      },
      {
        id: 3,
        title: "MDS Application",
        // description + technologies are AI-generated (work-experience-content.json, key "mds").
        image: "/mds-picture.png",
        githubUrl: "https://github.com/marga120/mds-application",
        experienceAnchor: "#experience-2",
        contentKey: "mds",
        role: "Software Developer",
        figLabel: "MDS.APPLICATION"
      }
    ]
  }
];

// Merge AI-owned description/technologies (work-experience-content.json) into the curated data at load.
export const workGroups: WorkGroup[] = curatedGroups.map((group) => ({
  ...group,
  workItems: group.workItems.map(resolve),
}));
