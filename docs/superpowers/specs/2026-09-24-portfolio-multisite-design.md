# Multi-Site Frontend Portfolio — Design Spec

**Date:** 2026-09-24
**Status:** Approved (conversational), pending written review
**Repo:** `D:\Github\FrontEnd\FrontEndDesign`

## 1. Purpose

A portfolio repository containing five draft-ready websites plus an index site, built to demonstrate frontend range to recruiters and prospective clients who are evaluating **the author**, not shopping for a template.

The audience reads two surfaces: the rendered site, and the source. Both must hold up. A site that looks good but whose code is undifferentiated from the other four fails the brief, and so does clean code behind a generic-looking page.

**Success criteria**

- Five sites that a reviewer would not guess came from one repo, on sight.
- Each site demonstrates one clearly-identifiable technical capability, visible in its source without a guided tour.
- Every site: Lighthouse a11y >= 95, no WCAG 2.2 AA contrast failures, keyboard-complete.
- A reviewer can clone, `pnpm install`, and run any site with one command.

### Stated vs. assumed

**Stated by the user:** skill-showcase purpose; pnpm monorepo; variety across industry, art direction and technical capability; polished-static fidelity; stack drawn from React / Next.js / Vite / Tailwind.

**Assumed by Claude, approved in conversation:** the specific five industries and their art directions; stack assigned per-site by need rather than for variety; headless shared primitives starting empty; Unsplash hotlinking; per-app Vercel deploys; CI out of scope.

## 2. Non-goals

- No database, auth, or persistence. Forms validate and simulate submission.
- No application backend. The one exception is site 05, whose no-JS donation flow requires a server route to POST to; that route validates input and renders a result page, and stores nothing. This is a progressive-enhancement requirement, not a data layer.
- No CMS integration. Content is co-located with each app as typed TS data modules.
- No CI/CD pipeline in this phase.
- No shared visual design system (see section 4 — this is a deliberate rejection).
- No binary image assets committed to git.

## 3. Repository structure

```
FrontEndDesign/
├─ package.json              workspaces root, scripts only
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ docs/superpowers/specs/
├─ packages/
│  ├─ tw-preset/             Tailwind base: spacing, fluid type, focus rings. NO colors.
│  └─ ui/                    headless a11y primitives. STARTS EMPTY.
└─ apps/
   ├─ 00-index/              Next.js — the front door
   ├─ 01-atelier/            Next.js — fine dining
   ├─ 02-forge/              Next.js — developer-tool SaaS
   ├─ 03-kinetic/            Vite   — creative agency
   ├─ 04-ledger/             Vite   — fintech analytics
   └─ 05-commons/            Next.js — nonprofit / civic
```

`pnpm` is obtained via `corepack enable pnpm` (bundled with the installed Node 22.23.2); no global install required. pnpm is chosen over npm workspaces for its strict `node_modules` layout, which prevents one app from resolving a dependency it does not declare — a class of bug that is invisible locally and fatal on a fresh clone.

**Root scripts:** `dev:<app>`, `build:<app>`, `build:all`, `lint`, `test`, `a11y`.

## 4. The shared layer

Approach selected: **shared headless primitives with per-app skins**, amended so that the primitive package starts empty.

**Shared from day one:**

- `packages/tw-preset` — spacing scale, fluid type ramp, focus-ring utility, `prefers-reduced-motion` helpers. Explicitly excludes color tokens, component classes, and shadows, all of which are art direction and belong to the app.
- `tsconfig.base.json` — compiler options only.

**Shared on demand:** `packages/ui` exports unstyled, accessible behavior — focus trapping, ARIA wiring, roving tabindex, escape handling. It ships no classNames and no markup opinions beyond semantics.

**Promotion rule:** a primitive enters `packages/ui` only when a **second** app needs it. The first app builds it locally. This is deliberate: an API guessed at before two real consumers exist is an API that will be wrong, and five apps is too small a sample to justify speculative abstraction.

**Rejected:** a shared styled component library. It would satisfy DRY at the cost of the art-direction axis, converging all five sites on one house style in five palettes — the exact failure mode that makes multi-site portfolios read as padded.

## 5. The five sites

| # | App | Industry | Art direction | Capability | Stack |
|---|-----|----------|---------------|------------|-------|
| 01 | `atelier` | Fine dining | Editorial luxe: high-contrast serif display, full-bleed photography, generous whitespace | SSR, SEO, LCP discipline | Next.js |
| 02 | `forge` | Developer-tool SaaS | Technical dark: mono accents, strict 4px grid, dark-native | Static MDX docs, interactive code blocks | Next.js |
| 03 | `kinetic` | Creative agency | Kinetic maximalist: oversized type, deliberate asymmetry | Scroll-driven animation, View Transitions | Vite |
| 04 | `ledger` | Fintech analytics | Swiss minimal: dense, tabular, high contrast | Accessible data visualization | Vite |
| 05 | `commons` | Nonprofit / civic | Warm humane: photography-led, soft, unhurried | Accessibility as headline feature | Next.js |

### 01 — atelier (Next.js)

Pages: home, menu, reservations, story. Demonstrates `generateMetadata`, JSON-LD structured data for `Restaurant` and `Menu`, `next/image` with art-directed sources, and an LCP hero held under 2.5s on a simulated 4G profile. Reservation form validates but posts nowhere.

### 02 — forge (Next.js)

Pages: home, pricing, docs (MDX, multi-page), changelog. Demonstrates `generateStaticParams` over an MDX content tree, a docs shell with a sticky table-of-contents synced to scroll position, copy-to-clipboard code blocks with syntax highlighting, and command-palette navigation. Dark is the primary palette; light is a designed alternate.

### 03 — kinetic (Vite)

Single long-scroll page plus three case-study routes. Demonstrates scroll-driven animation, View Transitions between case studies, and staged reveal choreography. `prefers-reduced-motion` is honored by substituting instant state changes that preserve meaning — not by disabling the feature and leaving dead layout behind.

### 04 — ledger (Vite)

Dashboard shell with overview, transactions, and reports views. Demonstrates charts that encode by shape and label as well as color, a transactions table that is fully keyboard-navigable with proper `aria-sort`, and a text-alternative summary for every chart. Data is a static fixture module. Chart construction follows the `dataviz` skill.

### 05 — commons (Next.js)

Pages: home, programs, impact, donate (multi-step). Demonstrates a donation flow that completes without JavaScript via progressive enhancement, WCAG 2.2 AA verified against axe with zero violations, visible skip links, correct landmark structure, and copy structured for translation. This site is the accessibility proof.

### 00 — index (Next.js)

Catalogues the five: screenshot, one-sentence capability statement, live link, source link. This is the artifact that gets sent to a reviewer.

## 6. Cross-cutting standards

**Accessibility (non-negotiable, per ponytail's exclusion list):** semantic landmarks, visible focus indicators on every interactive element, keyboard-complete flows, `axe` clean, AA contrast. Site 05 additionally targets AA+ and no-JS operation.

**Responsive:** 360px to 1920px, no horizontal scroll at any width, 16px minimum side gutter, touch targets >= 44px.

**Dark mode:** all six ship dark and light. Each dark palette is art-directed independently — not a programmatic inversion of the light one. Theme follows `prefers-color-scheme` with a manual override persisted to `localStorage` behind try/catch.

**Performance budget per site:** LCP < 2.5s, CLS < 0.1, INP < 200ms on simulated 4G / 4x CPU throttle. Route JS budget 150KB gzipped, excepting `kinetic` (250KB, animation) and `ledger` (250KB, charts).

**Content:** real written copy, not lorem ipsum. Photography hotlinked from Unsplash with attribution in each app's README. No binary assets in git.

## 7. Testing

Following ponytail: tests cover logic that can break, not presentational markup.

- `packages/ui` primitives — Vitest + Testing Library. Focus trap, escape, ARIA state, roving tabindex. These are the shared contracts; they get real coverage.
- Site 05 multi-step form validation — Vitest, including the no-JS path's server logic.
- Site 04 data transforms — Vitest.
- Every site — one `axe` assertion per route, automated.

No snapshot tests, no per-component suites for static sections, no E2E framework.

## 8. Deployment

Each app deploys independently to Vercel; Vite apps build to static output. The index site links to the five live URLs. No deploy automation is configured in this phase.

## 9. Risks

- **Visual convergence.** Five sites built in sequence by one author drift toward one aesthetic. Mitigation: art direction is fixed per-site in this spec before any code, and each app's type and color choices are committed before its layout work begins.
- **Scope per site.** Five polished sites is the largest risk to completion. Mitigation: page counts are capped in section 5 and treated as fixed, not minimums.
- **`packages/ui` staying empty.** Acceptable outcome. If no primitive earns promotion, the package is deleted rather than filled.
