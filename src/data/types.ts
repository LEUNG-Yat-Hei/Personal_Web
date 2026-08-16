export type Accent = "primary" | "secondary" | "tertiary";

export interface Period {
  start: string;
  end: string;
  label: string;
}

export interface SiteMeta {
  title: string;
  description: string;
}

export interface ResumeLink {
  href: string;
  label: string;
  filename: string;
}

export interface Profile {
  name: {
    family: string;
    given: string;
    english: string;
    display: string;
    formal: string;
    monogram: string;
  };
  handle: string;
  title: string;
  status: string;
  location: string;
  tagline: string;
  summary: string;
  email: string;
  phone: string;
  resume: ResumeLink;
}

export interface NavItem {
  id: string;
  href: string;
  label: string;
  prompt: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  institutionShort: string;
  degree: string;
  field: string;
  period: Period;
  current?: boolean;
  gpa?: {
    value: string;
    scale: string;
    label: string;
  };
  highlights: string[];
  logo?: string;
}

export interface ExperienceItem {
  id: string;
  org: string;
  orgNative?: string;
  role: string;
  team: string;
  period: Period;
  bullets: string[];
  stack: string[];
  accent: Accent;
  logo?: string;
}

export interface Collaborator {
  name: string;
  nameNative?: string;
  role?: string;
  logo?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  codename: string;
  period: Period;
  summary: string;
  bullets: string[];
  stack: string[];
  featured: boolean;
  accent: Accent;
  collaborators?: Collaborator[];
}

export interface SkillGroup {
  id: string;
  label: string;
  terminal: string;
  items: string[];
  accent: Accent;
}

export interface SiteData {
  meta: SiteMeta;
  profile: Profile;
  nav: NavItem[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
}
