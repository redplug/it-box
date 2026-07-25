# AdSense 콘텐츠 품질 보강 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make it-box.dev substantially more useful, trustworthy, and content-rich before requesting another AdSense review.

**Architecture:** Keep the existing Vue SPA. Add structured service content and reusable tool guidance inside the current pages/components, then add static discovery files for crawlers. Avoid adding dependencies or changing the tool processing model.

**Tech Stack:** Vue 3, TypeScript, Vite, Vue Router, existing i18n, static public assets.

## Global Constraints

- Use Korean as the primary monetization-review content language.
- Do not invent legal claims, operator details, or data-processing behavior.
- Do not bulk-generate shallow pages or duplicate text.
- Keep ads disabled in code unless the existing Production environment explicitly enables them.

### Task 1: Trust and service information

**Files:**
- Modify: `locales/ko.yml`
- Modify: `src/pages/About.vue`
- Modify: `src/layouts/base.layout.vue`

- [ ] Replace the placeholder operator/privacy copy with the supplied operator name, email, effective date, data-handling explanation, advertising disclosure, cookie explanation, deletion/contact path, and GPL attribution.
- [ ] Make the footer label specific and link to the trust page.
- [ ] Verify the rendered markdown contains all required sections.

### Task 2: Original guides and home context

**Files:**
- Modify: `src/pages/Guides.page.vue`
- Modify: `src/pages/Home.page.vue`

- [ ] Expand the guide catalog with practical Korean guides covering JSON, JWT, Base64, regex, Cron, URL encoding, hashing, QR/data URLs, timestamps, SQL formatting, YAML/TOML, and browser privacy.
- [ ] Give each guide a concrete problem, safe workflow, failure case, and related tool link.
- [ ] Add service purpose, browser-processing policy, safety notice, and guide navigation to the home page.

### Task 3: Tool-level explanatory content

**Files:**
- Create: `src/components/ToolUsageGuide.vue`
- Modify: `src/layouts/tool.layout.vue`
- Create: `src/content/tool-guides.ts`

- [ ] Define typed guide records keyed by stable tool path.
- [ ] Render only records that exist, with purpose, steps, example, limitations, and safety note.
- [ ] Add records for the highest-value tools first and keep missing tools functional without a blank placeholder.

### Task 4: Crawl and metadata hygiene

**Files:**
- Modify: `index.html`
- Modify: `public/robots.txt`
- Create: `public/sitemap.xml`

- [ ] Add publisher metadata and complete site-level description without exposing credentials.
- [ ] Allow normal crawling and publish canonical sitemap location.
- [ ] Include stable home, guides, about, and major tool URLs in sitemap.

### Task 5: Verify and ship

- [ ] Run `npm run build` or the repository package-manager equivalent.
- [ ] Inspect the generated static files and git diff for placeholders.
- [ ] Deploy the tool Production project and verify `/about`, `/guides`, `/robots.txt`, `/sitemap.xml`.
- [ ] Do not request AdSense review automatically; user submits after reviewing the live content.
