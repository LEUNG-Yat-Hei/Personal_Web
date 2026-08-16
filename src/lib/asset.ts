/** Prefix a public/ file path with Astro's base (e.g. /Personal_Web/ on GitHub Pages). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith("/") ? base : `${base}/`;
  const clean = path.replace(/^\//, "");
  return `${prefix}${encodeURI(clean)}`;
}
