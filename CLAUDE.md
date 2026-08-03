# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for **DFHP** (Democracy and Federalism Hub), a Palestinian political movement/civic engagement platform, parallel to a sister Israeli movement. It is deployed via GitHub Pages at `dfh.org.ps`.

English is the canonical/default-language version of the site. The Arabic page (`/ar/`) is a **placeholder**: it was forked from an earlier Hebrew-language version of this template and its body copy is still literally in Hebrew (including the old "עתיד פדרלי" / "Federal Future" branding in the visible text) pending a real Arabic translation pass — don't assume the `/ar/` page's visible content reflects the current DFHP branding or is actually Arabic yet. Only its structural/meta fields (`lang`, canonical URL, hreflang, language-switcher label, and the Latin-script portions of `<title>`/OG/JSON-LD) have been updated to DFHP and to Arabic.

## Architecture

The site is plain static files, no build system or framework:

- `index.html` — English page (`lang="en" dir="ltr"`), served at `/`. This is the canonical/default-language version.
- `ar/index.html` — Arabic-flagged page (`lang="ar" dir="rtl"`), served at `/ar/`. A fully separate, hand-maintained HTML file — see "Bilingual System" below. Its visible body text is still the old Hebrew placeholder copy (see Project Overview).
- `style.css` — all styles, shared by both pages (linked via `<link rel="stylesheet">`)
- `script.js` — all JavaScript, shared by both pages (linked via `<script src>` at end of body)
- `resources.json` — data for the resources banner cards, fetched client-side by `script.js`
- Assets: `images/used/` for photos/logo (`.webp`), `docs/` for PDFs

## Running Locally

```bash
npm start
```

This uses `npx serve` (no prior install needed). The site will be available at `http://localhost:3000`.

You can also open `index.html` directly in a browser.

## Deployment

Pushing to `main` deploys automatically via GitHub Pages — no CI step required. The `CNAME` file at the repo root pins the custom domain (`dfh.org.ps`) for GitHub Pages.

## Design System

CSS variables defined at the top of `style.css`, sampled from the DFHP logo (`images/used/big_logo.png`) — warm gold, forest green, terracotta, and deep maroon in place of the earlier bright yellow/blue/orange/red:
- `--m-yellow`: #D9A441 (warm gold)
- `--m-blue`: #22741F (forest green — role name kept for backward compatibility with existing CSS, no longer blue)
- `--m-orange`: #B8541F (terracotta)
- `--m-red`: #7C1500 (deep maroon)
- `--m-dark`: #3A2A22 (deep umber/charcoal-brown)
- `--m-white`: #F0E6D2 (warm parchment)
- `--m-bg`: #FBF6EE (warm ivory)

Fonts: **Heebo** (body) and **Rubik** (headings) from Google Fonts. Mobile breakpoint at 968px.

## Page Sections

1. Header/nav — sticky with scroll-shrink effect; nav links (English: About, Vision, Events, More Info, Join); language switcher (`EN | AR`) always on physical left
2. Hero — yellow background
3. About (`#about`) — "who we are" diagram (two youth movements + joint HQ) + three message-cards with background images
4. Blueprint (`#plan`) — three-stage roadmap (cards + SVG arrows) + 10 aspect-cards; stage 2 links to `docs/charter/Federal Charter.pdf`
5. Events (`#events`) — 4 image-cards grid + resources banner (`#resources`) with 3 resource-cards (PDF, external article, journal article)
6. CTA (`#join`) — embedded Google Form iframe (no custom form fields)
7. Footer — logo, Instagram social link, tagline

## Bilingual System (English / Arabic)

English and Arabic are two **separate static pages** (`/index.html` and `/ar/index.html`), not a client-side translation toggle. This was a deliberate SEO decision: each language has its own crawlable URL, its own `<title>`/meta description/OG tags, and both are listed with `hreflang` alternates in each page's `<head>` and in `sitemap.xml`, so search engines can index both versions independently instead of relying on JS execution to reveal the other language's content.

There is **no shared translation data and no build step** — the two files are hand-maintained duplicates. This trades off DRY-ness for simplicity (no build tooling) per an explicit choice made when the split was introduced.

### How it works
- `index.html` (root) has English text baked directly into the markup, `<html lang="en" dir="ltr">`.
- `ar/index.html` is flagged `<html lang="ar" dir="rtl">` but its body copy is still the untranslated Hebrew placeholder text inherited from the earlier template (see Project Overview) — don't treat it as real Arabic content yet.
- The language switcher in the header (`.lang-switcher`) is a pair of plain `<a>` links: `href="/"` and `href="/ar/"` — clicking causes a real page navigation, not an in-place swap.
- Because `ar/index.html` lives one directory deep, its asset references (`style.css`, `script.js`, `images/...`, `docs/...`, favicon, lang-switcher links) use **`../`-prefixed relative paths**, while `index.html` at the root uses plain relative paths (`style.css`, `ar/`, etc.). Root-relative paths (a leading `/`) are deliberately avoided site-wide: they only resolve correctly when the site is served from a domain root, and break when served from a GitHub Pages project path like `/dfhp/` (no custom domain configured — see `CNAME` history). `resources.json`'s `link`/`logo` fields are stored as paths relative to the site root (no leading slash) and are resolved at render time in `script.js` against `SITE_ROOT` — a base URL computed from `document.currentScript.src`, so it's correct regardless of which page (or hosting path) loaded the script.
- `script.js` determines which language it's running under via `document.documentElement.lang` (`CURRENT_LANG`). Since `resources.json` still only has `he`/`en` keys (not yet translated to Arabic), `CURRENT_LANG` maps `lang="ar"` to the `'he'` data bucket — see the top of `script.js`. Update this mapping if/when `resources.json` gains real `ar` keys.

### LTR layout overrides (in `style.css`)
On `index.html` (`html[dir="ltr"]`), the following physical-direction overrides apply:
- `.stage-arrow svg` — removes `scaleX(-1)` flip so arrows point right (→)
- `.card .num` — moves stage number `01/02/03` from `left` to `right: 20px`
- `.aspect-card-body p` — `text-align: left`
- `.message-card` — `text-align: left`
- `.resource-card` — `text-align: left`
- `.lang-switcher` — `order: -1` to keep it on the physical left in LTR flex layout

These selectors key off the `dir` attribute, not `lang`, so they apply correctly to `index.html` (ltr) regardless of which language occupies root; `ar/index.html` stays `dir="rtl"` like the Hebrew page it replaced, so no CSS changes were needed for the swap.

### Adding or editing content
Since there's no shared translation source, every content change must be made **twice** — once in `index.html`, once in `ar/index.html` — keeping structure/classes/IDs identical between them so `style.css` and `script.js` behave the same on both.

## JavaScript Behavior (`script.js`)

- Fetches `/resources.json` and renders the resource-banner cards via `renderResources(CURRENT_LANG)`
- Scroll-reveal animations via `IntersectionObserver` on `.reveal` elements
- Expandable aspect cards toggled via click/keyboard on `.aspect-card--expandable`
- Sticky header shrink/shadow on scroll past 50px

## SEO

- Each page has its own `<title>`, meta description, canonical URL, `hreflang` alternates (ar/en/x-default), Open Graph and Twitter Card tags, and a JSON-LD `Organization` block.
- `sitemap.xml` lists both `https://dfh.org.ps/` and `https://dfh.org.ps/ar/`, each with `xhtml:link` hreflang annotations.
- `robots.txt` allows all crawlers and points to `sitemap.xml`.
