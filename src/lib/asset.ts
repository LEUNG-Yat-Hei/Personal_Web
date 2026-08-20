function basePrefix(): string {
  const base = import.meta.env.BASE_URL;
  return base.endsWith("/") ? base : `${base}/`;
}

/** Prefix a public/ file path with Astro's base (e.g. /Personal_Web/ on GitHub Pages). */
export function asset(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${basePrefix()}${encodeURI(clean)}`;
}

/** Resolve an in-site href. Hash links stay on the homepage so they work from /blog. */
export function href(path: string): string {
  if (path.startsWith("#")) {
    return `${basePrefix()}${path}`;
  }
  if (/^(https?:|mailto:|tel:)/.test(path)) {
    return path;
  }
  return asset(path);
}
