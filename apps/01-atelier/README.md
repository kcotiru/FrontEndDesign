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

**Verified:** axe clean on all 4 routes (WCAG 2.2 AA, 0 violations) ·
Lighthouse a11y 100 (mobile, Slow 4G, 4x CPU) · LCP 756-811ms · CLS 0.00 ·
INP 39ms · gzipped JS for `/` 135.3KB (138,582B) · no horizontal scroll
360-1920px · full content and navigation without JavaScript (theme toggle and
reservation-form submit excluded by design — see Task 12 report). All
standalone nav targets (header wordmark, nav links, theme toggle, reserve
link) measure >=44px; the one inline text link (footer "Unsplash", 16.8px)
is formally exempt under WCAG 2.2 SC 2.5.8's inline-in-a-sentence exception,
not an oversight.

Photography hotlinked from [Unsplash](https://unsplash.com). Demonstration
site; not a real restaurant.
