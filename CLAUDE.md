# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for **Maître Baigneur**, a swimming school in the Aix-en-Provence area (France). All content is in French.

**Business vocabulary**: bassins (pools), cours de natation (swimming lessons), bébé nageur (baby swimmer, from 3 months), aquaversaire (pool birthday party), surveillance / événements (lifeguard services for private events), prestations (services), maître-nageur (qualified swimming instructor).

## Commands

```bash
pnpm dev          # dev server on port 3000
pnpm build        # production build (clears Astro asset cache first)
pnpm preview      # preview production build
pnpm format       # Prettier on all .{js,jsx,ts,tsx,css,scss,astro,md,json}
```

No test suite, no linter configured.

## Architecture

**Framework**: Astro v6 with React islands, deployed on Vercel.

**Two layouts**:
- `src/layouts/BaseLayout.astro` — standard pages, includes AOS animation init (animations declared via `data-aos` attributes in markup, not in JS)
- `src/layouts/PoolLayout.astro` — pool detail pages, adds Glide.js carousel CSS and per-pool geo meta tags

**Pool pages — dual data source (keep in sync)**:
Pool pages are generated via `src/pages/bassins/[slug].astro` using `getStaticPaths()` + Astro content collections. Each pool has two manual entries:
1. `src/content/bassins/<slug>.md` — drives the individual page content (name, description, address, gallery, services)
2. `src/assets/data/pools.ts` — drives the pools grid on `/bassins` and the "related pools" widget on each pool page

Both must be updated when adding or removing a pool. They are not auto-synced.

**Services pages**: Individual `.astro` files under `src/pages/prestations/` (manually created). Service metadata is in `src/assets/data/services.ts`.

**Other static data** in `src/assets/data/`:
- `levels.ts` — swimmer level progression data
- `prices.json`, `data.json`, `formOptions.json` — pricing, site info, form select options

**Forms**: React components in `src/components/forms/` using `react-hook-form` + Zod. Submissions go to FormCarry via `src/utils/formcarry.ts`. Endpoints are `PUBLIC_FORMCARRY_*` env vars. Note: `just-validate` is in `package.json` but appears to be a legacy dependency — do not use it for new forms.

**Icons**: `astro-icon` configured to use `src/assets/images/icons/` as the icon directory. Reference icons by filename without extension. These are custom SVG icons — do not use Lucide or any other icon library without asking first.

**Path aliases** (defined in `tsconfig.json`):
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@assets/*` → `src/assets/*`
- `@utils/*` → `src/utils/*`

**Styling**: Custom SCSS in `src/assets/styles/` organized as `base/`, `layouts/`, `pages/`, `utils/`. CSS custom properties (design tokens) are defined in `utils/_variables.scss` — colors, fluid spacing scale, font sizes, border radius. Always use `var(--token-name)`, never hardcoded values.

**SEO**: `astro-seo` handles meta tags in both layouts. Geo meta tags per pool are in a `switch` in `PoolLayout.astro` — update it when adding a new pool.

## Adding a pool (bassin)

1. Add `src/content/bassins/<slug>.md` following the existing schema (metaTitle, metaDesc, pool object with name, location, desc, image, address, link, services, gallery)
2. Add an entry to `src/assets/data/pools.ts` with image import and services list
3. Add per-pool geo coordinates to the switch in `src/layouts/PoolLayout.astro`
4. Add pool images to `src/assets/images/pools/<slug>/` and page title image to `src/assets/images/page-title/`

## Working principles

### Posture

I'm an assistant, not a decision-maker. I don't choose libraries, approaches, or patterns without asking first. If a request is ambiguous, I ask rather than assume and produce something wrong or incoherent. If I don't know something, I say so clearly instead of guessing.

### React

React is allowed but not the default. Its use is currently limited to forms (`src/components/forms/`). Before introducing a new React component, ask for confirmation — an Astro component handles most cases.

### Dependencies

Do not add any new dependency without asking first.

### Security

- All user input sent to an external API must be validated client-side (Zod) before submission
- FormCarry endpoints are intentionally public (`PUBLIC_*`) — do not expose other secrets client-side
- Never log personal data or tokens, even in dev mode

### Accessibility

- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, etc.)
- All visual content must have a text alternative (`alt`, `aria-label`, `aria-describedby`)
- Keyboard interactions must work (visible focus, consistent tabindex)
- Respect color contrast (WCAG AA minimum)
- Mentally walk through the screen reader path for any new interactive component

## AI model usage

- **Opus 4.6** (`claude-opus-4-6`) for thinking, planning, and brainstorming: architecture plans, feature exploration, complex trade-offs, anything requiring deep reasoning before writing code
- **Sonnet 4.6** (`claude-sonnet-4-6`) for execution: implementing validated plans, fixing identified bugs, targeted edits on known files, well-defined repetitive tasks

Use Opus where quality of reasoning matters, Sonnet for efficient execution.

## Skill routing

When the request matches an available skill, invoke it with the Skill tool as the first action — before any other tool or response.

| Situation | Skill |
|-----------|-------|
| Product ideas, brainstorming, "is this worth building" | `office-hours` |
| Bug, error, "why is this broken", 500 | `investigate` |
| Deploy, push, create a PR | `ship` |
| QA, test the site, find bugs | `qa` |
| Code review, check a diff | `review` |
| Update docs after shipping | `document-release` |
| Weekly retro | `retro` |
| Design system, brand identity | `design-consultation` |
| Visual audit, design polish | `design-review` |
| Architecture review | `plan-eng-review` |
| Save progress, resume later | `checkpoint` |
| Code quality, health check | `health` |

## Environment variables

All FormCarry endpoints are `PUBLIC_FORMCARRY_*` (accessible client-side by design). The site URL is hardcoded as `https://maitrebaigneur.com` in `astro.config.mjs`.
