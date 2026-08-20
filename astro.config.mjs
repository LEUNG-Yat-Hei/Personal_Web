// @ts-check
import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const siteBase = "/Personal_Web";

/** @param {string} url */
function withSiteBase(url) {
  if (!url.startsWith("/") || url.startsWith("//")) return url;
  if (url === siteBase || url.startsWith(`${siteBase}/`)) return url;
  return `${siteBase}${url}`;
}

/**
 * Prefix root-relative Markdown links and images with the GitHub Pages base
 * so authors can write `/blog` and `/favicon.svg` without the repo prefix.
 */
/** @typedef {{ url: string }} MarkdownResource */
/** @typedef {{ setProperty: (node: MarkdownResource, key: "url", value: string) => void }} MdastCtx */

const prefixSiteBase = {
  name: "prefix-site-base",
  /** @param {MarkdownResource} node @param {MdastCtx} ctx */
  link(node, ctx) {
    ctx.setProperty(node, "url", withSiteBase(node.url));
  },
  /** @param {MarkdownResource} node @param {MdastCtx} ctx */
  image(node, ctx) {
    ctx.setProperty(node, "url", withSiteBase(node.url));
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://leung-yat-hei.github.io",
  base: siteBase,
  markdown: {
    processor: satteri({
      mdastPlugins: [prefixSiteBase],
    }),
    shikiConfig: {
      theme: "github-light",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
