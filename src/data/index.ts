import education from "./education.json";
import experience from "./experience.json";
import meta from "./meta.json";
import nav from "./nav.json";
import profile from "./profile.json";
import projects from "./projects.json";
import skills from "./skills.json";
import type { Accent, SiteData } from "./types";

function asAccent(value: string): Accent {
  if (value === "primary" || value === "secondary" || value === "tertiary") {
    return value;
  }
  throw new Error(`Invalid accent token: ${value}`);
}

export const site: SiteData = {
  meta,
  profile,
  nav,
  education,
  experience: experience.map((item) => ({ ...item, accent: asAccent(item.accent) })),
  projects: projects.map((item) => ({ ...item, accent: asAccent(item.accent) })),
  skills: skills.map((item) => ({ ...item, accent: asAccent(item.accent) })),
};

export type {
  Accent,
  Collaborator,
  EducationItem,
  ExperienceItem,
  NavItem,
  Period,
  Profile,
  ProjectItem,
  SiteData,
  SkillGroup,
} from "./types";
