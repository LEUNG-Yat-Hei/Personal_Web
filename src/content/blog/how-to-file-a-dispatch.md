---
title: "How to file a dispatch"
description: "A proof-of-concept column that prints every Markdown shape The Ledger can set, and shows how to add the next one."
pubDate: 2026-08-17
kicker: "Style book"
tags:
  - guide
  - markdown
  - poc
draft: false
---

This file is the first dispatch on record. It lives at `src/content/blog/how-to-file-a-dispatch.md`. The site does not turn that path into a URL by itself — Astro reads the Markdown as data, then the pages under `src/pages/blog/` set the type and print the column. Drop another `.md` file in the same folder, fill in the frontmatter, and the next edition appears on the [dispatches index](/blog) and on the front page.

## What you are looking at

The **index** at `/blog` is the contents page: kicker, title, date, reading time, and deck. This **column** is the article itself — a broadsheet header, an “In this column” table of contents from the headings below, and the Markdown body set in newsprint. The same post is teasered under **Dispatches** on the [front page](/).

Root-relative links in Markdown (`/blog`, `/favicon.svg`) are prefixed with the GitHub Pages base automatically. You do not write `/Personal_Web` by hand.

## How to add a post

1. Create a file in `src/content/blog/`. The filename becomes the slug: `notes-from-aia.md` is served at `/blog/notes-from-aia`.
2. Start the file with YAML frontmatter between `---` fences. The schema is validated at build time; a missing title or date fails `npm run build`.
3. Write the body in Markdown underneath. Headings, lists, quotes, code, tables, and images are all legal copy.
4. Leave `draft: false` (or omit it) to publish. Set `draft: true` to keep a desk copy — visible in `npm run dev`, withheld from `npm run build`.

### Frontmatter

| Field | Required | What it prints |
| --- | --- | --- |
| `title` | yes | Headline on the index and the column |
| `description` | yes | Deck under the headline; also the page meta description |
| `pubDate` | yes | Dateline. `2026-08-17` or a full ISO timestamp |
| `updatedDate` | no | Printed as “Revised …” when you amend a filed piece |
| `kicker` | no | Small red label above the headline (`Style book`, `Notes`, `Wire`) |
| `tags` | no | Index chips. Use a YAML list |
| `draft` | no | Defaults to `false` |

A skeleton that will build:

```yaml
---
title: "A second dispatch"
description: "One paragraph that sells the column."
pubDate: 2026-08-18
kicker: "Notes"
tags:
  - fintech
draft: false
---

Lead paragraph. The first one on the page takes the drop cap.
```

## Markdown the press will set

The rest of this column is a specimen sheet. If a shape looks wrong here, the stylesheet — not the Markdown — is what to fix.

### Emphasis and links

Plain sentences take *italic*, **bold**, and ***both***. Strikethrough is available as ~~killed copy~~. Inline code looks like `src/content/blog/`.

Internal links use a root path: the [front page](/) and the [index](/blog). External links look the same: [Astro content collections](https://docs.astro.build/en/guides/content-collections/).

### Lists

- File the Markdown.
- Check the index.
- Read the column on a phone as well as a desk.

Numbered when the order matters:

1. Frontmatter.
2. Body.
3. `npm run dev` to proof.

Task lists work if you need a checklist in the copy:

- [x] Specimen column
- [ ] The next real dispatch

### Pull quote

> The Ledger treats Markdown as copy, not as a page. Routes stay in `src/pages/`. The folder `src/content/blog/` is the spike.

### Code

Fenced blocks keep their language. Use them for commands and snippets, not for whole files.

```ts
import { getPublishedPosts, postHref } from "../lib/blog";

const posts = await getPublishedPosts();
const latest = posts[0];
```

### Figure

Images in `public/` are referenced from the site root. This one is the tab mark already on file:

![The Ledger favicon](/favicon.svg)

A photograph that should travel with the post can sit next to the Markdown file and be referenced relatively (`./photo.jpg`). Prefer `public/` when the URL must stay stable.

### Rule

The line below is a thematic break — use it between scenes, not as decoration.

---

That is the full specimen. Delete this dispatch when a real column is ready, or leave it as the style book and file the next piece beside it.
