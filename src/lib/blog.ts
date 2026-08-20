import { getCollection, type CollectionEntry } from "astro:content";
import { asset } from "./asset";

export type BlogPost = CollectionEntry<"blog">;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );

  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postHref(post: BlogPost): string {
  return asset(`blog/${post.id}`);
}

export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function readingTime(body: string | undefined): string {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min.`;
}