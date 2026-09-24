# Portfolio Foundation + 01-atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the pnpm monorepo with its shared Tailwind base, then build `01-atelier` (fine dining, Next.js) end to end as the pattern-setter whose conventions the remaining five sites copy.

**Architecture:** A pnpm workspace with `packages/tw-preset` (a Tailwind v4 CSS layer holding spacing, fluid type and focus rings — no colors) and `packages/ui` (headless a11y primitives, deliberately empty until a second app needs one). `apps/01-atelier` is a Next.js 16 App Router site demonstrating SSR, structured data, and LCP discipline. All color and component styling lives inside the app, so later sites can look nothing like it.

**Tech Stack:** Node 22.23.2, pnpm via corepack, Next.js 16.3.6, React 19.3.0, Tailwind CSS 4.3.3, TypeScript 5.x, Vitest 5.0.1, `@axe-core/cli`.

**Spec:** `docs/superpowers/specs/2026-09-24-portfolio-multisite-design.md`

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from the spec.

- Node 22.23.2; pnpm obtained via `corepack enable pnpm`, never a global install.
- `packages/tw-preset` excludes color tokens, component classes, and shadows. Those are art direction and belong to the app.
- `packages/ui` starts empty. A primitive enters it only when a **second** app needs it.
- Lighthouse a11y >= 95; no WCAG 2.2 AA contrast failures; keyboard-complete.
- Responsive 360px to 1920px, no horizontal scroll at any width, 16px minimum side gutter, touch targets >= 44px.
- Dark and light both ship. Dark is art-directed independently, not a programmatic inversion. Theme follows `prefers-color-scheme` with a manual override persisted to `localStorage` behind try/catch.
- LCP < 2.5s, CLS < 0.1, INP < 200ms on simulated 4G / 4x CPU throttle. Route JS budget 150KB gzipped for `01-atelier`.
- Real written copy, not lorem ipsum. Photography hotlinked from Unsplash with attribution in the app README. No binary assets in git.
- Tests cover logic that can break, not presentational markup. No snapshot tests, no E2E framework.

## Review Focus

Input classes the spec implies but that no task's happy path exercises. Each line's test is assigned to the task that owns the code.

1. **`localStorage` throws or is empty** (private window, blocked site data) — the theme toggle must still render and fall back to `prefers-color-scheme` rather than crashing the page. → Task 6.
2. **An Unsplash URL fails to load** (offline, rate-limited, URL rot) — reserved aspect-ratio boxes must hold layout so CLS stays under 0.1 instead of the page collapsing. → Task 8.
3. **Reservation form receives hostile input** — past dates, party size of 0 or negative, 400-character names, empty submission. Each must produce a specific field error, not a silent pass or a crash. → Task 10.
4. **`prefers-reduced-motion: reduce`** — every transition must resolve to its end state instantly while preserving meaning; no element may be left mid-animation or invisible. → Task 7.
5. **JavaScript disabled** — the site is server-rendered, so all content and navigation must work without it. The theme toggle may degrade, but nothing may disappear. → Task 12.

---

## Phase 1: Foundation

### Task 1: Workspace root

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.npmrc`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing.
- Produces: workspace globs `apps/*` and `packages/*`; root scripts `dev:atelier`, `build:atelier`, `lint`, `test`, `a11y`; `tsconfig.base.json` for apps to `extends`.

- [ ] **Step 1: Enable pnpm**

```bash
corepack enable pnpm
pnpm --version
```

Expected: a 9.x or 10.x version prints. If `corepack` is missing, stop and report — do not `npm i -g pnpm`.

- [ ] **Step 2: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: Create `.npmrc`**

```
auto-install-peers=true
strict-peer-dependencies=false
```

- [ ] **Step 4: Create root `package.json`**

```json
{
  "name": "frontend-design",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "dev:atelier": "pnpm --filter @portfolio/atelier dev",
    "build:atelier": "pnpm --filter @portfolio/atelier build",
    "build:all": "pnpm -r build",
    "lint": "pnpm -r lint",
    "test": "vitest run",
    "a11y": "node scripts/a11y.mjs"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^5.0.1"
  }
}
```

Correct `packageManager` to the exact version printed in Step 1.

- [ ] **Step 5: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  }
}
```

- [ ] **Step 6: Append to `.gitignore`**

```
node_modules/
.next/
dist/
.turbo/
*.tsbuildinfo
.env*.local
```

- [ ] **Step 7: Install and verify**

```bash
pnpm install
```

Expected: completes, creates `pnpm-lock.yaml`, no `ERR_PNPM` output.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json .npmrc .gitignore
git commit -m "chore: pnpm workspace root"
```

---

### Task 2: Shared Tailwind base

**Files:**
- Create: `packages/tw-preset/package.json`, `packages/tw-preset/base.css`, `packages/tw-preset/README.md`

**Interfaces:**
- Consumes: nothing.
- Produces: `@portfolio/tw-preset/base.css`, importable by any app after `@import "tailwindcss"`. Exposes `--spacing-*`, `--text-*` fluid sizes, `.focus-ring`, and `@media (prefers-reduced-motion: reduce)` neutralization.

- [ ] **Step 1: Create `packages/tw-preset/package.json`**

```json
{
  "name": "@portfolio/tw-preset",
  "version": "0.0.0",
  "private": true,
  "exports": { "./base.css": "./base.css" }
}
```

- [ ] **Step 2: Create `packages/tw-preset/base.css`**

Tailwind v4 is CSS-first, so the shared layer is a stylesheet, not a JS config object. Colors are intentionally absent — see the spec's section 4.

```css
/* Shared across every app. Contains NO color, NO shadows, NO component
   classes. Those are art direction and belong to the app. */

@theme {
  /* Fluid type ramp: clamp(min, preferred, max) */
  --text-xs: clamp(0.75rem, 0.71rem + 0.18vw, 0.85rem);
  --text-sm: clamp(0.875rem, 0.83rem + 0.22vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1.05rem + 0.38vw, 1.375rem);
  --text-xl: clamp(1.375rem, 1.24rem + 0.66vw, 1.75rem);
  --text-2xl: clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem);
  --text-3xl: clamp(2.25rem, 1.8rem + 2.2vw, 3.75rem);
  --text-4xl: clamp(2.75rem, 1.9rem + 4vw, 5.5rem);

  /* Layout rhythm */
  --spacing-gutter: 1rem;
  --spacing-section: clamp(3rem, 2rem + 5vw, 7rem);
  --spacing-tap: 2.75rem; /* 44px minimum touch target */
}

@layer base {
  /* Every app inherits a correct focus indicator. Overridable in colour
     only -- never remove the outline. */
  .focus-ring:focus-visible,
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  [tabindex]:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  /* Constrain the document box, but deliberately do NOT set
     `overflow-x: hidden` here. Hiding the overflow would mask the bug on all
     six sites and make the Task 12 "no horizontal scroll" check pass
     vacuously. A visible scrollbar is the signal that something inside is
     too wide -- fix that element, never this rule. */
  html, body {
    max-width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Write `packages/tw-preset/README.md`**

```markdown
# @portfolio/tw-preset

Shared Tailwind v4 base. Import after `@import "tailwindcss"`:

```css
@import "tailwindcss";
@import "@portfolio/tw-preset/base.css";
```

**Deliberately excluded:** colors, shadows, component classes, border radii.
Those are art direction. Each app owns them so the sites do not converge on
one house style. See spec section 4.
```

- [ ] **Step 4: Commit**

```bash
git add packages/tw-preset
git commit -m "feat(tw-preset): shared spacing, fluid type, focus rings"
```

---

### Task 3: Empty `packages/ui` with its promotion rule recorded

**Files:**
- Create: `packages/ui/package.json`, `packages/ui/src/index.ts`, `packages/ui/README.md`

**Interfaces:**
- Consumes: nothing.
- Produces: `@portfolio/ui` as a resolvable but empty workspace package.

This task exists to record a decision, not to ship code. The package stays empty until a second app needs a primitive.

- [ ] **Step 1: Create `packages/ui/package.json`**

```json
{
  "name": "@portfolio/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": { ".": "./src/index.ts" }
}
```

- [ ] **Step 2: Create `packages/ui/src/index.ts`**

```ts
// Intentionally empty.
//
// ponytail: this package holds headless, accessible behaviour (focus traps,
// ARIA wiring, roving tabindex) and NOTHING styled. A primitive moves here
// only when a SECOND app needs it -- the first app builds it locally.
// An API guessed at before two real consumers exist is an API that is wrong.
//
// If no primitive ever earns promotion, delete this package.
export {};
```

- [ ] **Step 3: Create `packages/ui/README.md`**

```markdown
# @portfolio/ui

Headless accessibility primitives. **Empty by design.**

A component moves here when the *second* app needs it, never on the first.
Everything here ships behaviour only: no classNames, no colors, no markup
opinions beyond semantics. Styling is the app's job.
```

- [ ] **Step 4: Commit**

```bash
git add packages/ui
git commit -m "chore(ui): empty headless primitive package with promotion rule"
```

---

## Phase 2: 01-atelier

### Task 4: Scaffold the Next.js app

**Files:**
- Create: `apps/01-atelier/**` (via scaffolder, then edited)

**Interfaces:**
- Consumes: `@portfolio/tw-preset/base.css`, `tsconfig.base.json`.
- Produces: a dev server on port 3001 under `pnpm dev:atelier`.

Use the official scaffolder rather than hand-writing Next 16 config — it emits the correct config for this exact version, which hand-written guesses will not.

- [ ] **Step 1: Scaffold**

```bash
cd apps
pnpm dlx create-next-app@16.3.6 01-atelier --ts --app --tailwind --eslint --src-dir --import-alias "@/*" --no-turbopack --use-pnpm
cd ..
```

If the flag set is rejected by this version, run it interactively and choose: TypeScript yes, App Router yes, Tailwind yes, ESLint yes, `src/` yes, import alias `@/*`.

- [ ] **Step 2: Rename the package and pin the port**

Edit `apps/01-atelier/package.json` — set `"name": "@portfolio/atelier"` and:

```json
"scripts": {
  "dev": "next dev -p 3001",
  "build": "next build",
  "start": "next start -p 3001",
  "lint": "eslint"
}
```

Add to `dependencies`: `"@portfolio/tw-preset": "workspace:*"`.

- [ ] **Step 3: Point tsconfig at the shared base**

In `apps/01-atelier/tsconfig.json`, add `"extends": "../../tsconfig.base.json"` as the first key. Keep every Next-generated `compilerOptions` and the `plugins` array — they override the base where they differ.

- [ ] **Step 4: Import the shared layer**

At the top of `apps/01-atelier/src/app/globals.css`, immediately after the existing `@import "tailwindcss";`:

```css
@import "@portfolio/tw-preset/base.css";
```

- [ ] **Step 5: Install and verify the dev server**

```bash
pnpm install
pnpm dev:atelier
```

Expected: starts on `http://localhost:3001`, default page renders, no console errors. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add apps/01-atelier package.json pnpm-lock.yaml
git commit -m "feat(atelier): scaffold Next.js app wired to shared tw-preset"
```

---

### Task 5: Art direction tokens

**Files:**
- Create: `apps/01-atelier/src/app/theme.css`
- Modify: `apps/01-atelier/src/app/globals.css`

**Interfaces:**
- Consumes: `@portfolio/tw-preset/base.css`.
- Produces: CSS custom properties `--color-surface`, `--color-ink`, `--color-muted`, `--color-accent`, `--color-line`, available as Tailwind utilities (`bg-surface`, `text-ink`, …) in both themes.

Editorial luxe: a near-black warm ink on bone white, one restrained brass accent, high-contrast serif display against a quiet sans for body. Dark is a separate palette — deep aubergine-black, not inverted bone.

- [ ] **Step 1: Create `apps/01-atelier/src/app/theme.css`**

```css
/* 01-atelier art direction. Owned by this app alone. */

@theme {
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;

  /* Light: bone paper, warm ink, brass */
  --color-surface: oklch(97.5% 0.008 85);
  --color-raised: oklch(94% 0.012 85);
  --color-ink: oklch(21% 0.015 40);
  --color-muted: oklch(48% 0.012 40);
  --color-accent: oklch(58% 0.095 75);
  --color-line: oklch(87% 0.012 85);
}

/* Dark is art-directed, NOT an inversion: deep aubergine-black with a
   warmer, brighter brass so the accent survives the darker ground. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface: oklch(16% 0.018 330);
    --color-raised: oklch(21% 0.022 330);
    --color-ink: oklch(94% 0.008 85);
    --color-muted: oklch(72% 0.012 85);
    --color-accent: oklch(72% 0.105 78);
    --color-line: oklch(30% 0.02 330);
  }
}

:root[data-theme="dark"] {
  --color-surface: oklch(16% 0.018 330);
  --color-raised: oklch(21% 0.022 330);
  --color-ink: oklch(94% 0.008 85);
  --color-muted: oklch(72% 0.012 85);
  --color-accent: oklch(72% 0.105 78);
  --color-line: oklch(30% 0.02 330);
}

@layer base {
  body {
    background-color: var(--color-surface);
    color: var(--color-ink);
    font-family: var(--font-body);
  }
  h1, h2, h3 {
    font-family: var(--font-display);
    font-weight: 300;
    letter-spacing: -0.02em;
  }
}
```

- [ ] **Step 2: Import it in `globals.css`**

```css
@import "tailwindcss";
@import "@portfolio/tw-preset/base.css";
@import "./theme.css";
```

- [ ] **Step 3: Verify contrast before building on it**

Compute the contrast ratio of `--color-ink` on `--color-surface` and `--color-muted` on `--color-surface`, in both themes, using any WCAG contrast checker.

Expected: ink/surface >= 7:1 (AAA body), muted/surface >= 4.5:1 (AA). If muted fails, darken it in light mode / lighten it in dark mode until it passes, then re-check. Record the four ratios in the commit message.

- [ ] **Step 4: Commit**

```bash
git add apps/01-atelier/src/app
git commit -m "feat(atelier): editorial luxe palette and type, AA verified"
```

---

### Task 6: Theme toggle that survives a throwing `localStorage`

**Files:**
- Create: `apps/01-atelier/src/components/theme-toggle.tsx`, `apps/01-atelier/src/lib/theme.ts`, `apps/01-atelier/src/lib/theme.test.ts`

**Interfaces:**
- Consumes: `theme.css` custom properties.
- Produces: `readStoredTheme(): "light" | "dark" | null`, `storeTheme(t: "light" | "dark"): void` from `@/lib/theme`; `<ThemeToggle />` default export.

Covers **Review Focus #1**.

- [ ] **Step 1: Write the failing test**

`apps/01-atelier/src/lib/theme.test.ts`:

```ts
import { describe, expect, it, vi, afterEach } from "vitest";
import { readStoredTheme, storeTheme } from "./theme";

function mockStorage(impl: Partial<Storage>) {
  vi.stubGlobal("localStorage", impl as Storage);
}

afterEach(() => vi.unstubAllGlobals());

describe("readStoredTheme", () => {
  it("returns null when nothing is stored", () => {
    mockStorage({ getItem: () => null });
    expect(readStoredTheme()).toBeNull();
  });

  it("returns null instead of throwing when localStorage is blocked", () => {
    mockStorage({ getItem: () => { throw new DOMException("denied"); } });
    expect(readStoredTheme()).toBeNull();
  });

  it("returns null for a corrupted value rather than passing it through", () => {
    mockStorage({ getItem: () => "purple" });
    expect(readStoredTheme()).toBeNull();
  });

  it("round-trips a valid theme", () => {
    let held: string | null = null;
    mockStorage({
      getItem: () => held,
      setItem: (_k: string, v: string) => { held = v; },
    });
    storeTheme("dark");
    expect(readStoredTheme()).toBe("dark");
  });
});

describe("storeTheme", () => {
  it("swallows a quota or security error", () => {
    mockStorage({ setItem: () => { throw new DOMException("quota"); } });
    expect(() => storeTheme("light")).not.toThrow();
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
pnpm vitest run apps/01-atelier/src/lib/theme.test.ts
```

Expected: FAIL — cannot resolve `./theme`.

- [ ] **Step 3: Implement `apps/01-atelier/src/lib/theme.ts`**

```ts
export type Theme = "light" | "dark";

const KEY = "atelier-theme";

/** Reads the stored override. Returns null on absence, corruption, or a
 *  throwing localStorage (private windows, blocked site data). */
export function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/** Persists the override. Storage failures are non-fatal: the toggle still
 *  works for this page view, it just will not be remembered. */
export function storeTheme(t: Theme): void {
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* ignore */
  }
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

```bash
pnpm vitest run apps/01-atelier/src/lib/theme.test.ts
```

Expected: 5 passed.

- [ ] **Step 5: Build the toggle component**

`apps/01-atelier/src/components/theme-toggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { readStoredTheme, storeTheme, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    storeTheme(next);
    document.documentElement.dataset.theme = next;
  }

  const isDark =
    theme === "dark" ||
    (theme === null &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      type="button"
      onClick={() => apply(isDark ? "light" : "dark")}
      aria-pressed={isDark}
      className="min-h-tap min-w-tap focus-ring text-muted hover:text-ink"
    >
      <span className="sr-only">
        {isDark ? "Switch to light theme" : "Switch to dark theme"}
      </span>
      <span aria-hidden="true">{isDark ? "☾" : "☀"}</span>
    </button>
  );
}
```

- [ ] **Step 6: Add the pre-paint script so the stored theme does not flash**

In `apps/01-atelier/src/app/layout.tsx`, inside `<head>`:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `try{var t=localStorage.getItem("atelier-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
  }}
/>
```

The `try/catch` is load-bearing: without it a blocked `localStorage` throws before first paint and blanks the page.

- [ ] **Step 7: Commit**

```bash
git add apps/01-atelier/src
git commit -m "feat(atelier): theme toggle resilient to blocked localStorage"
```

---

### Task 7: Layout shell — landmarks, skip link, reduced motion

**Files:**
- Modify: `apps/01-atelier/src/app/layout.tsx`
- Create: `apps/01-atelier/src/components/site-header.tsx`, `apps/01-atelier/src/components/site-footer.tsx`

**Interfaces:**
- Consumes: `<ThemeToggle />`.
- Produces: `<SiteHeader />`, `<SiteFooter />`; a `#main` landmark every page renders into.

Covers **Review Focus #4**.

- [ ] **Step 1: Build `site-header.tsx`**

```tsx
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/story", label: "Our Story" },
] as const;

export default function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-gutter py-6">
        <Link href="/" className="focus-ring font-display text-xl tracking-tight">
          Atelier
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring inline-flex min-h-tap items-center text-sm text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li><ThemeToggle /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Build `site-footer.tsx`**

Include the Unsplash attribution the spec requires, since photography is hotlinked.

```tsx
export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-gutter py-12 text-sm text-muted">
        <p>14 Rue Saint-Honoré · Reservations 01 42 60 82 00</p>
        <p className="mt-4">
          Photography via{" "}
          <a href="https://unsplash.com" className="focus-ring underline">
            Unsplash
          </a>
          . Demonstration site; not a real restaurant.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Wire `layout.tsx` with a skip link and landmarks**

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("atelier-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-raised focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify reduced motion by hand**

In Chrome DevTools, open Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". Reload and tab through the header.

Expected: hover and focus colour changes apply instantly with no fade; no element is stuck mid-transition, invisible, or mispositioned. The `tw-preset` media block is what delivers this — confirm it is actually in the served CSS by searching the Styles pane for `prefers-reduced-motion`.

- [ ] **Step 5: Verify the skip link**

Load `/`, press Tab once. Expected: "Skip to content" becomes visible; Enter moves focus into `<main>`.

- [ ] **Step 6: Commit**

```bash
git add apps/01-atelier/src
git commit -m "feat(atelier): layout shell with skip link and landmarks"
```

---

### Task 8: Content module and the LCP hero

**Files:**
- Create: `apps/01-atelier/src/content/restaurant.ts`, `apps/01-atelier/src/app/page.tsx`
- Modify: `apps/01-atelier/next.config.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `restaurant` (typed `Restaurant`), `menu` (typed `MenuSection[]`) from `@/content/restaurant`. Tasks 9 and 11 read these; do not duplicate the data.

Covers **Review Focus #2**.

- [ ] **Step 1: Write the content module with real copy**

`apps/01-atelier/src/content/restaurant.ts`:

```ts
export type Dish = { name: string; description: string; price: number };
export type MenuSection = { id: string; title: string; dishes: Dish[] };

export type Restaurant = {
  name: string;
  tagline: string;
  description: string;
  address: { street: string; locality: string; postalCode: string; country: string };
  telephone: string;
  priceRange: string;
  hours: { days: string; opens: string; closes: string }[];
};

export const restaurant: Restaurant = {
  name: "Atelier",
  tagline: "Twelve seats. One menu. Every evening.",
  description:
    "A twelve-seat counter in the first arrondissement where the menu is written each morning around whatever arrived from Rungis before dawn. There is no à la carte, no substitutions, and no second sitting.",
  address: {
    street: "14 Rue Saint-Honoré",
    locality: "Paris",
    postalCode: "75001",
    country: "FR",
  },
  telephone: "+33142608200",
  priceRange: "$$$$",
  hours: [{ days: "Tuesday – Saturday", opens: "19:00", closes: "23:00" }],
};

export const menu: MenuSection[] = [
  {
    id: "ouverture",
    title: "Ouverture",
    dishes: [
      { name: "Oyster, cucumber, elderflower", description: "Gillardeau no. 3, iced cucumber consommé, elderflower vinegar.", price: 28 },
      { name: "Sourdough, cultured butter", description: "Three-day levain, butter churned in house, Guérande salt.", price: 14 },
    ],
  },
  {
    id: "milieu",
    title: "Milieu",
    dishes: [
      { name: "Turbot, beurre blanc, sorrel", description: "Line-caught Breton turbot, aged on the bone eight days.", price: 62 },
      { name: "Pigeon, cherry, lavender", description: "Racan pigeon roasted on the crown, morello cherries, wild lavender jus.", price: 68 },
    ],
  },
  {
    id: "fin",
    title: "Fin",
    dishes: [
      { name: "Tarte au citron", description: "Menton lemon, torched meringue, thyme shortbread.", price: 22 },
    ],
  },
];
```

- [ ] **Step 2: Preconnect to the image host**

The hero is the LCP element and it is cross-origin, so the connection cost sits directly on the critical path. In `apps/01-atelier/src/app/layout.tsx`, inside `<head>`:

```tsx
<link rel="preconnect" href="https://images.unsplash.com" />
```

No `next.config.ts` change is needed — the hero uses `<picture>` rather than `next/image`, for the reason given in Step 3.

- [ ] **Step 3: Build the home page with an art-directed, reserved-ratio hero**

A 21:9 letterbox crop of a wide room is unreadable at 360px, so mobile gets a genuinely different crop — not the same file scaled. That is art direction, and it needs `<picture>` with `media` conditions.

`next/image` is deliberately not used here: it solves format negotiation and resizing, which Unsplash already does via URL parameters, and it cannot express two different *crops* in one element without shipping two images and preloading both — which would damage the very LCP metric this page exists to demonstrate. One `<picture>`, one request, correct crop.

`apps/01-atelier/src/app/page.tsx`:

```tsx
import Link from "next/link";
import { restaurant } from "@/content/restaurant";

const HERO = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-gutter pt-section">
        <h1 className="max-w-3xl text-4xl leading-[0.95] text-balance">
          {restaurant.tagline}
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted text-pretty">
          {restaurant.description}
        </p>
        <Link
          href="/reservations"
          className="focus-ring mt-10 inline-flex min-h-tap items-center border-b border-accent pb-1 text-accent"
        >
          Reserve a seat
        </Link>
      </section>

      {/* The aspect-ratio wrapper reserves the box before the image resolves,
          so a failed or slow Unsplash fetch cannot shift the page. */}
      <div className="mt-section aspect-[3/2] w-full bg-raised md:aspect-[21/9]">
        <picture>
          {/* Desktop: the full room, letterboxed. */}
          <source
            media="(min-width: 768px)"
            srcSet={`${HERO}?w=2400&h=1029&fit=crop&crop=entropy&q=80`}
          />
          {/* Mobile: a tighter, taller crop -- the wide room reads as a smear
              at 360px, so this frames the counter instead. */}
          <img
            src={`${HERO}?w=900&h=600&fit=crop&crop=entropy&q=80`}
            alt="The counter at Atelier, set for twelve, lit by low pendant lamps before service."
            width={900}
            height={600}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
      </div>
    </>
  );
}
```

`priority` is what keeps the LCP element off the lazy-load path; the `bg-raised` wrapper is what holds CLS at zero when the fetch fails.

- [ ] **Step 4: Verify CLS survives a failed image**

Start `pnpm dev:atelier`. In DevTools → Network, add a request-blocking rule for `images.unsplash.com`, then hard-reload `/`.

Expected: the hero area keeps its full height as an empty raised-tone block, the alt text is reachable, and nothing below it moves. If the page collapses, the wrapper's aspect ratio is not applying — fix before continuing.

- [ ] **Step 5: Commit**

```bash
git add apps/01-atelier
git commit -m "feat(atelier): content module and CLS-safe LCP hero"
```

---

### Task 9: Menu page

**Files:**
- Create: `apps/01-atelier/src/app/menu/page.tsx`

**Interfaces:**
- Consumes: `menu`, `restaurant` from `@/content/restaurant`.
- Produces: the `/menu` route.

- [ ] **Step 1: Build the page**

```tsx
import type { Metadata } from "next";
import { menu } from "@/content/restaurant";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Tonight's menu at Atelier — written each morning around what arrived from Rungis.",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-3xl px-gutter py-section">
      <h1 className="text-3xl">Ce soir</h1>
      <p className="mt-4 text-muted">
        One menu, served at a single sitting. Written this morning.
      </p>

      {menu.map((section) => (
        <section key={section.id} className="mt-16" aria-labelledby={section.id}>
          <h2 id={section.id} className="text-xl text-accent">
            {section.title}
          </h2>
          <dl className="mt-6">
            {section.dishes.map((dish) => (
              <div
                key={dish.name}
                className="flex justify-between gap-8 border-b border-line py-5"
              >
                <div>
                  <dt className="text-lg">{dish.name}</dt>
                  <dd className="mt-1 text-sm text-muted">{dish.description}</dd>
                </div>
                <dd className="shrink-0 tabular-nums text-muted">€{dish.price}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify the description list structure**

Load `/menu` and inspect. Expected: each `<div>` inside `<dl>` holds exactly one `<dt>` and its `<dd>`s — a `<dd>` must never precede its `<dt>`. Run the page through DevTools' Accessibility tree and confirm the list is announced as a definition list with the correct pairings.

- [ ] **Step 3: Commit**

```bash
git add apps/01-atelier/src/app/menu
git commit -m "feat(atelier): menu page"
```

---

### Task 10: Reservation form and its validator

**Files:**
- Create: `apps/01-atelier/src/lib/reservation.ts`, `apps/01-atelier/src/lib/reservation.test.ts`, `apps/01-atelier/src/app/reservations/page.tsx`, `apps/01-atelier/src/components/reservation-form.tsx`

**Interfaces:**
- Consumes: `restaurant` from `@/content/restaurant`.
- Produces: `validateReservation(input: ReservationInput): ReservationErrors` from `@/lib/reservation`, where `ReservationErrors` is `Partial<Record<keyof ReservationInput, string>>` — empty object means valid.

Covers **Review Focus #3**. This is the one piece of real logic in the site, so it gets real tests.

- [ ] **Step 1: Write the failing tests**

`apps/01-atelier/src/lib/reservation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateReservation, type ReservationInput } from "./reservation";

const valid: ReservationInput = {
  name: "Marguerite Yourcenar",
  email: "m@example.com",
  date: "2099-06-01",
  party: 2,
};

describe("validateReservation", () => {
  it("accepts a well-formed reservation", () => {
    expect(validateReservation(valid)).toEqual({});
  });

  it("rejects an empty name", () => {
    expect(validateReservation({ ...valid, name: "   " }).name).toBeTruthy();
  });

  it("rejects a 400-character name rather than storing it", () => {
    const r = validateReservation({ ...valid, name: "x".repeat(400) });
    expect(r.name).toBeTruthy();
  });

  it("rejects a malformed email", () => {
    expect(validateReservation({ ...valid, email: "m@" }).email).toBeTruthy();
  });

  it("rejects a date in the past", () => {
    expect(validateReservation({ ...valid, date: "2000-01-01" }).date).toBeTruthy();
  });

  it("rejects an unparseable date", () => {
    expect(validateReservation({ ...valid, date: "not-a-date" }).date).toBeTruthy();
  });

  it("rejects a party of zero", () => {
    expect(validateReservation({ ...valid, party: 0 }).party).toBeTruthy();
  });

  it("rejects a negative party", () => {
    expect(validateReservation({ ...valid, party: -3 }).party).toBeTruthy();
  });

  it("rejects a party larger than the twelve-seat counter", () => {
    expect(validateReservation({ ...valid, party: 13 }).party).toBeTruthy();
  });

  it("rejects a fractional party", () => {
    expect(validateReservation({ ...valid, party: 2.5 }).party).toBeTruthy();
  });

  it("reports every invalid field at once, not just the first", () => {
    const r = validateReservation({ name: "", email: "no", date: "nope", party: 0 });
    expect(Object.keys(r).sort()).toEqual(["date", "email", "name", "party"]);
  });
});
```

- [ ] **Step 2: Run them and confirm they fail**

```bash
pnpm vitest run apps/01-atelier/src/lib/reservation.test.ts
```

Expected: FAIL — cannot resolve `./reservation`.

- [ ] **Step 3: Implement the validator**

```ts
export type ReservationInput = {
  name: string;
  email: string;
  date: string;
  party: number;
};

export type ReservationErrors = Partial<Record<keyof ReservationInput, string>>;

const SEATS = 12;
const NAME_MAX = 120;

/** Validates every field and reports all failures together, so the form can
 *  mark each bad input at once instead of making the guest resubmit to find
 *  the next error. Returns {} when the input is good. */
export function validateReservation(input: ReservationInput): ReservationErrors {
  const errors: ReservationErrors = {};

  const name = input.name.trim();
  if (name.length === 0) errors.name = "Please give us a name for the booking.";
  else if (name.length > NAME_MAX) errors.name = `Please keep the name under ${NAME_MAX} characters.`;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))
    errors.email = "Please enter an email address we can confirm to.";

  const when = new Date(`${input.date}T00:00:00`);
  if (Number.isNaN(when.getTime())) {
    errors.date = "Please choose a date.";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (when < today) errors.date = "Please choose tonight or a later date.";
  }

  if (!Number.isInteger(input.party) || input.party < 1)
    errors.party = "Please enter how many are dining, as a whole number.";
  else if (input.party > SEATS)
    errors.party = `The counter seats ${SEATS}. Call us for a full buyout.`;

  return errors;
}
```

- [ ] **Step 4: Run and confirm they pass**

```bash
pnpm vitest run apps/01-atelier/src/lib/reservation.test.ts
```

Expected: 11 passed.

- [ ] **Step 5: Build the form with accessible error wiring**

`apps/01-atelier/src/components/reservation-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { validateReservation, type ReservationErrors } from "@/lib/reservation";

export default function ReservationForm() {
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const found = validateReservation({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      date: String(fd.get("date") ?? ""),
      party: Number(fd.get("party")),
    });
    setErrors(found);
    setSent(Object.keys(found).length === 0);
  }

  const field = (id: keyof ReservationErrors) =>
    errors[id]
      ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` }
      : {};

  return (
    <form onSubmit={onSubmit} noValidate className="mt-12 max-w-md">
      {(["name", "email", "date", "party"] as const).map((id) => (
        <p key={id} className="mb-6">
          <label htmlFor={id} className="block text-sm text-muted capitalize">
            {id === "party" ? "Guests" : id}
          </label>
          <input
            id={id}
            name={id}
            type={id === "email" ? "email" : id === "date" ? "date" : id === "party" ? "number" : "text"}
            {...(id === "party" ? { min: 1, max: 12, defaultValue: 2 } : {})}
            {...field(id)}
            className="focus-ring mt-2 min-h-tap w-full border-b border-line bg-transparent py-2"
          />
          {errors[id] && (
            <span id={`${id}-error`} className="mt-2 block text-sm text-accent">
              {errors[id]}
            </span>
          )}
        </p>
      ))}

      <button type="submit" className="focus-ring min-h-tap border-b border-accent text-accent">
        Request a seat
      </button>

      <p role="status" aria-live="polite" className="mt-6 text-sm text-muted">
        {sent ? "Thank you — we will confirm by email within the day." : ""}
      </p>
    </form>
  );
}
```

`noValidate` hands validation to our own validator so the messages are ours and consistent; `aria-invalid` plus `aria-describedby` is what makes a screen reader announce the reason rather than just "invalid entry".

- [ ] **Step 6: Build the page**

`apps/01-atelier/src/app/reservations/page.tsx`:

```tsx
import type { Metadata } from "next";
import ReservationForm from "@/components/reservation-form";
import { restaurant } from "@/content/restaurant";

export const metadata: Metadata = {
  title: "Reservations",
  description: "Request one of twelve seats at Atelier, Tuesday to Saturday.",
};

export default function ReservationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-gutter py-section">
      <h1 className="text-3xl">Reservations</h1>
      <p className="mt-4 max-w-prose text-muted">
        {restaurant.hours[0]?.days}, one sitting at{" "}
        {restaurant.hours[0]?.opens}. Requests are confirmed by email.
      </p>
      <ReservationForm />
    </div>
  );
}
```

- [ ] **Step 7: Verify keyboard-only submission**

Tab through every field, submit with Enter while leaving fields empty.

Expected: focus order matches visual order; each invalid field is announced with its specific message; the status line announces success on a valid submission.

- [ ] **Step 8: Commit**

```bash
git add apps/01-atelier/src
git commit -m "feat(atelier): reservation form with validated, announced errors"
```

---

### Task 11: Story page and structured data

**Files:**
- Create: `apps/01-atelier/src/app/story/page.tsx`, `apps/01-atelier/src/components/json-ld.tsx`
- Modify: `apps/01-atelier/src/app/layout.tsx`

**Interfaces:**
- Consumes: `restaurant`, `menu` from `@/content/restaurant`.
- Produces: `<JsonLd />`, emitting a schema.org `Restaurant` node into `<head>`.

- [ ] **Step 1: Build `json-ld.tsx`**

```tsx
import { restaurant, menu } from "@/content/restaurant";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    priceRange: restaurant.priceRange,
    telephone: restaurant.telephone,
    servesCuisine: "French",
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.locality,
      postalCode: restaurant.address.postalCode,
      addressCountry: restaurant.address.country,
    },
    openingHoursSpecification: restaurant.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: h.opens,
      closes: h.closes,
    })),
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: menu.map((s) => ({
        "@type": "MenuSection",
        name: s.title,
        hasMenuItem: s.dishes.map((d) => ({
          "@type": "MenuItem",
          name: d.name,
          description: d.description,
          offers: { "@type": "Offer", price: d.price, priceCurrency: "EUR" },
        })),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Render it from `layout.tsx`**

Add `<JsonLd />` inside `<head>`, after the theme script.

- [ ] **Step 3: Set root metadata in `layout.tsx`**

This needs two imports at the top of `layout.tsx` that earlier tasks did not add:

```tsx
import type { Metadata } from "next";
import { restaurant } from "@/content/restaurant";
```

Then:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://atelier.example.com"),
  title: { default: "Atelier — Twelve seats, Paris 1er", template: "%s · Atelier" },
  description: restaurant.description,
  openGraph: {
    type: "website",
    title: "Atelier",
    description: restaurant.tagline,
    locale: "en_GB",
  },
};
```

- [ ] **Step 4: Build the story page**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How a twelve-seat counter in the first arrondissement came to be.",
};

export default function StoryPage() {
  return (
    <article className="mx-auto max-w-2xl px-gutter py-section">
      <h1 className="text-3xl">Our Story</h1>
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-pretty">
        <p>
          Atelier opened in 2019 in a room that had been a bookbinder&apos;s
          workshop for sixty years. We kept the benches. They are now the counter.
        </p>
        <p>
          There is one menu because there is one cook at the pass, and he would
          rather do ten things exactly than forty things adequately. The menu is
          written each morning after the Rungis delivery, which means we cannot
          tell you in advance what you will eat — only that it arrived this week.
        </p>
        <p>
          We seat twelve. We serve once. When the last plate goes out, we sit
          down and eat what is left.
        </p>
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Validate the structured data**

```bash
pnpm build:atelier && pnpm --filter @portfolio/atelier start
```

Copy the `application/ld+json` block from `/`'s served HTML into Google's Rich Results Test or `validator.schema.org`.

Expected: parses as a valid `Restaurant`, zero errors. Warnings about optional properties are acceptable.

- [ ] **Step 6: Commit**

```bash
git add apps/01-atelier/src
git commit -m "feat(atelier): story page, JSON-LD restaurant schema, OG metadata"
```

---

### Task 12: Verification gate

**Files:**
- Create: `scripts/a11y.mjs`, `apps/01-atelier/README.md`
- Modify: root `package.json`

**Interfaces:**
- Consumes: a built, running `01-atelier`.
- Produces: `pnpm a11y`, reusable unchanged by sites 02–05.

Covers **Review Focus #5**. No task after this one may start until every check here passes.

- [ ] **Step 1: Add the axe runner**

`scripts/a11y.mjs`:

```js
import { execFileSync } from "node:child_process";

const BASE = process.env.A11Y_BASE ?? "http://localhost:3001";
const ROUTES = ["/", "/menu", "/reservations", "/story"];

let failed = false;
for (const route of ROUTES) {
  const url = `${BASE}${route}`;
  process.stdout.write(`axe ${url}\n`);
  try {
    execFileSync(
      "pnpm",
      ["dlx", "@axe-core/cli", url, "--tags", "wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa", "--exit"],
      { stdio: "inherit", shell: process.platform === "win32" }
    );
  } catch {
    failed = true;
  }
}

if (failed) {
  process.stderr.write("\naxe found violations\n");
  process.exit(1);
}
process.stdout.write("\nall routes clean\n");
```

- [ ] **Step 2: Run the a11y gate**

```bash
pnpm build:atelier
pnpm --filter @portfolio/atelier start &
pnpm a11y
```

Expected: `all routes clean`. Fix every violation before continuing — this is the spec's non-negotiable bar, not a target.

- [ ] **Step 3: Verify the no-JS path**

In DevTools → Settings → Debugger, check "Disable JavaScript". Reload each of the four routes.

Expected: all copy, images, and navigation links render and work; every link navigates. Nothing may be invisible or missing.

Two accepted degradations, both scoped deliberately: the theme toggle does nothing (the pre-paint script still applies a stored theme, since it is inline), and the reservation form renders but does not validate or submit. Per spec section 5, no-JS *form* operation belongs to `05-commons`, which owns progressive enhancement as its headline capability. Atelier's obligation here is that all content and navigation survive without JS — not the form.

- [ ] **Step 4: Verify the responsive range**

Check 360px, 768px, 1280px, and 1920px widths.

Expected: no horizontal scrollbar at any width; text never touches the viewport edge; every link and button is at least 44px tall.

- [ ] **Step 5: Verify performance against the budget**

Run Lighthouse (mobile preset, simulated 4G, 4x CPU throttle) against `/`.

Expected: LCP < 2.5s, CLS < 0.1, a11y >= 95. Record the three numbers in the commit message. From the Network panel, confirm total gzipped JS for `/` is under 150KB.

- [ ] **Step 6: Write `apps/01-atelier/README.md`**

```markdown
# 01-atelier

Fine dining, editorial luxe. **Next.js 16 + Tailwind 4.**

**Demonstrates:** SSR with server-rendered content that works without JS,
schema.org `Restaurant`/`Menu` structured data, Metadata API with OG tags,
and LCP discipline — an art-directed `<picture>` hero (a different crop on
mobile, not the same file scaled) in a reserved aspect-ratio box, so a failed
image fetch cannot shift layout.

`next/image` is deliberately not used for the hero: Unsplash already handles
format and resizing via URL parameters, and `next/image` cannot express two
different crops without preloading both — which would cost the LCP this page
exists to demonstrate.

```bash
pnpm dev:atelier   # http://localhost:3001
pnpm a11y          # axe, all four routes, against a running build
```

**Verified:** axe clean on all routes (WCAG 2.2 AA) · Lighthouse a11y >= 95 ·
no horizontal scroll 360–1920px · full content without JavaScript.

Photography hotlinked from [Unsplash](https://unsplash.com). Demonstration
site; not a real restaurant.
```

- [ ] **Step 7: Commit**

```bash
git add scripts apps/01-atelier/README.md package.json
git commit -m "chore: a11y gate; atelier verified against spec budgets"
```

---

## Done when

- `pnpm install && pnpm dev:atelier` runs from a clean clone.
- `pnpm test` passes (16 tests: 5 theme, 11 reservation).
- `pnpm a11y` reports all routes clean.
- All four routes render fully with JavaScript disabled.
- Lighthouse a11y >= 95, LCP < 2.5s, CLS < 0.1 recorded in Task 12's commit.
- `packages/ui` is still empty.

## Next plans

Sites 02–05 each get their own plan, written against this spec and copying this app's conventions (art-direction tokens in `theme.css`, content in `src/content/`, `pnpm a11y` with its route list swapped). `00-index` is planned last because it catalogues the other five.

The first primitive that a second app needs — most likely a `Dialog` or `Disclosure` — triggers the `packages/ui` promotion rule at that point, not before.
