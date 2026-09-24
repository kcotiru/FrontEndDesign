# Execution Decisions — Foundation + 01-atelier

**Date:** 2026-09-24 · **Branch:** `feat/foundation-atelier` · **Plan:** `docs/superpowers/plans/2026-09-24-portfolio-foundation-and-atelier.md`

Decisions taken during execution without stopping to ask, each with what it costs if wrong.
Sites 02-05 inherit these; revisit any of them deliberately rather than by drift.

Ruling: work proceeds on branch `feat/foundation-atelier` in place rather than a
separate git worktree — the tree was clean, there is no concurrent work to isolate
from, and an in-repo branch keeps the user oriented in their own project directory.
Cost if wrong: none material; a worktree can be created later from the same branch.

Ruling 1: **Removed `overflow-x: hidden` from `packages/tw-preset/base.css`**, keeping
`max-width: 100%`. The rule would have hidden horizontal overflow on all six sites and
made Task 12 Step 4's "no horizontal scrollbar" verification pass vacuously — a check
that cannot fail. A visible scrollbar is the signal that an element inside is too wide.
Cost if wrong: a site could ship with a horizontal scrollbar that the hidden rule would
have concealed. That is the intended trade — the bug becomes visible instead of silent.

Ruling 2: **Added `packages/ui/src/index.ts` to Task 3's Files block.** It was created
in Step 2 but unlisted, so the reviewer's file-scope check would have flagged it as
unplanned. Cost if wrong: none, bookkeeping only.

Ruling 3: **Added the two missing imports to Task 11 Step 3.** The root `metadata`
export referenced `restaurant` and `Metadata` with no import shown; a fresh implementer
following the task literally would have hit a compile error. Cost if wrong: none.

Ruling 4: **Atelier's no-JS obligation covers content and navigation, not the
reservation form.** Spec section 5 assigns no-JS form operation to `05-commons` as its
headline capability; atelier's stated capability is SSR/SEO/LCP. Task 12 Step 3 now
names both accepted degradations explicitly. Cost if wrong: if you wanted every site's
forms working without JS, atelier needs a server action added later — roughly one extra
task, no rework of what exists.

Ruling: batching 1-3 rather than three dispatches — each is transcription of complete
brief content with no independent judgment or test surface, and they share one review
surface. Cost if wrong: a defect in one is caught in the same review as the others,
so the blast radius is one extra fix round, not a missed bug.
Review package: review-b5b9ce0..f39d350.diff (3 commits, 32796 bytes). Reviewer dispatched.

Ruling 5: **Accept deletion of the nested pnpm-workspace.yaml and pnpm-lock.yaml that
create-next-app generated inside apps/01-atelier.** Left in place, the nested workspace
file makes the app resolve as its own pnpm root for any command run from inside it,
breaking `workspace:*` resolution of @portfolio/tw-preset. The deletion is required for
the monorepo to work at all. Cost if wrong: none — a nested lockfile in a workspace
member is never correct.

Ruling 6: **Accept `allowBuilds: {unrs-resolver: false}` added to the ROOT
pnpm-workspace.yaml**, despite root files being outside the task's stated scope. Denying
an unreviewed native postinstall script is the safe default and matches the scaffolder's
own choice. Cost if wrong: eslint's resolver may fall back to WASM or fail; the review
is instructed to run `pnpm lint` and `pnpm build:atelier` to find out. If it breaks,
the fix is to approve that one build explicitly, not to blanket-allow.

Ruling 7: **Accept React 19.2.8 rather than the 19.3.0 I cited as target.** That is what
create-next-app@16.3.6 pins, and the version Next 16.3.6 is tested against. Cost if
wrong: negligible; overriding the framework's own pin is the riskier move.

Ruling 8: **Accept Turbopack as the dev bundler.** It is Next 16's default regardless of
the scaffold-time --no-turbopack flag, and the Tailwind v4 integration was verified
working under it. Cost if wrong: if a later site hits a Turbopack-specific issue, adding
`--webpack` to that app's dev script is a one-line change.

Ruling 9: **The scaffolder's default color tokens in globals.css must be deleted, not
left alongside theme.css.** create-next-app emits --background/--foreground, an
`@theme inline` block mapping them, its own prefers-color-scheme dark block, and a
`body` rule applying them. All four directly collide with theme.css's palette and its
own body rule — two competing dark-mode systems on one page. The plan never mentioned
them because it was written before the scaffold existed. Cost if wrong: none; they are
placeholder values with no design intent.

Ruling 10: **Load Cormorant Garamond and Inter via `next/font/google`, not a <link> to
Google Fonts.** theme.css names both families but the plan never said how to load them.
next/font self-hosts, eliminates the render-blocking external request, and applies
`font-display: swap` with a size-adjusted fallback — which is what protects the CLS <
0.1 and LCP < 2.5s budgets this site exists to demonstrate. A stylesheet <link> would
undercut the site's stated capability. Cost if wrong: minimal; swapping loaders later
is a two-file change.

Ruling 11: **Accept the `useSyncExternalStore` rewrite of theme-toggle.tsx, overriding
the plan's own code.** The plan's version was defective in two ways the implementer
confirmed empirically: `useEffect(() => setState(...), [])` trips this repo's
`react-hooks/set-state-in-effect` rule, and the `isDark` fallback reads
`matchMedia` live during the first client render, producing an actual hydration
mismatch whenever the OS is in dark mode. The plan is the spec's argument, not its
authority — and here the argument was wrong. `useSyncExternalStore` is the correct
primitive for reading external state (storage + media query) without tearing.
The public contract (readStoredTheme/storeTheme/Theme, the 5 tests) is unchanged.
Cost if wrong: the toggle is more code than the plan's version; if the rewrite has its
own flaw the 5 existing tests still pin the storage contract, and the component is one
file to revise.

Ruling 12: **Accept `--font-display`/`--font-body` pointing at next/font CSS variables
rather than the brief's literal family strings.** next/font generates hashed, self-hosted
family names and exposes them only through a CSS variable; the literal strings the brief
wrote cannot reach those files. This is a direct consequence of Ruling 10. Cost if
wrong: none — the rendered typeface is identical, the indirection is how next/font works.

Ruling 13: **Task 7's brief contains a layout.tsx snippet that omits the next/font
wiring Tasks 5-6 added.** Copied verbatim it would silently delete the font setup and
break Rulings 10/12. Dispatch instructs the implementer to MERGE into the existing
layout.tsx, never replace it. Cost if wrong: caught immediately — fonts would visibly
fall back to Georgia/system-ui.
Ruling 14: **No mobile nav component.** The header has four targets (three links plus
the toggle) and the plan specifies no hamburger. With `overflow-x: hidden` removed per
Ruling 1, a 360px overflow is now visible rather than masked, so the dispatch requires
verification at 360px and, if it overflows, the smallest fix that works (wrap or
tighter gap) — not a disclosure-menu component for four items. Cost if wrong: if the
nav grows past four items a real mobile menu is needed; at four, it is not.

Ruling 15: **Accept `tabIndex={-1}` added to `<main id="main">`, beyond the brief's
code.** Without it the skip link scrolls to main but leaves focus on <body>, failing the
brief's own "Enter moves focus into main" criterion. A skip link that moves the viewport
but not focus is broken for exactly the keyboard and screen-reader users it exists for.
Accessibility is on the never-simplify list. Cost if wrong: none — a negative tabindex
makes an element programmatically focusable without adding it to the tab order.

Ruling 16: **Accept `next.config.ts` left unmodified, against the brief's stale Files
list.** My own self-review edit removed the `images.remotePatterns` block from Task 8's
steps (the hero uses <picture>, not next/image) but left "Modify: next.config.ts" in the
Files block. The implementer followed the explicit step text over the stale list, which
is correct. Plan defect, not an implementation defect. Cost if wrong: none.

Ruling 17: **Require focus to move to the first invalid field on a failed submit.** The
plan's form renders error text and wires aria-invalid/aria-describedby, but never moves
focus, and only the success message is in a live region. A screen-reader user who submits
an invalid form therefore gets no announcement at all — the errors render silently above
where focus still sits. Moving focus to the first invalid field is the standard fix and
makes the existing aria-describedby actually get read. Accessibility is on the
never-simplify list, so this is not optional. Cost if wrong: none; it is the documented
WCAG 3.3.1 pattern and adds a few lines.

Ruling 18: **CONTROLLER-FOUND REGRESSION — `suppressHydrationWarning` is missing from
<html> in layout.tsx.** Task 7's brief specified `<html lang="en" suppressHydrationWarning>`.
It was lost during the Ruling 13 merge into the font-carrying layout. Root cause is mine:
Ruling 13 enumerated what to preserve (fonts, pre-paint script, preconnect, skip link,
tabIndex) and omitted this attribute, so neither the Task 7 implementer nor its reviewer
was looking for it. Confirmed by direct inspection: layout.tsx line 34-37 has lang and
className, no suppressHydrationWarning. This is why the Task 10 implementer saw a
dev-mode hydration overlay on <html data-theme>.
Impact: the pre-paint script mutates data-theme on <html> before React hydrates —
precisely the case the attribute exists for. Dev logs a mismatch on every page load.
Not visible in production builds, which is why it survived four reviews.
Routing: NOT fixed in the controller session. Folded into Task 12's dispatch as a
required one-line fix plus a console-clean verification, since Task 12 is the
verification gate and layout.tsx was off-limits to Task 10.
Cost if wrong: if suppressHydrationWarning turns out not to silence it, the real cause
is a different attribute mismatch and Task 12 reports it rather than papering over it.

Ruling 19: **Fix the header wordmark's tap target; exempt the footer's inline link.**
Measured: header "Atelier" link 32.4px, footer "Unsplash" link 16.8px, against the
project's 44px floor.
 - The header wordmark is a standalone primary navigation target, not running text.
   32.4px is a real failure of the stated constraint and gets fixed.
 - The footer "Unsplash" link is inline within a sentence. WCAG 2.2 SC 2.5.8 explicitly
   exempts targets in a sentence or block of text, which is why axe reported zero
   violations at both sites. Padding an inline link to 44px would break the paragraph's
   line flow to satisfy a number that does not apply to it. Exempt, and the constraint
   is hereby read as "44px for standalone controls; inline text links follow the
   SC 2.5.8 sentence exception."
Cost if wrong: if you want a blanket 44px with no exceptions, the footer sentence needs
restructuring into a standalone link — a small change to one component, not a rework.
Task 12: fix round 1/5 (1 addressed, 0 open — header wordmark 32.4px -> 44px per
Ruling 19; commits 3717d45..ed13dc5). Re-verified: a11y 0 violations all 4 routes,
360px scrollWidth===clientWidth===360 all 4 routes, lint 0, build 0, 16/16 tests.
README's Verified line now states the SC 2.5.8 inline-link exemption explicitly rather
than leaving the tap-target claim unqualified.
Note: the fix round was entered directly from the implementer's DONE_WITH_CONCERNS
report, before the task review — per the skill, correctness concerns are addressed
before review rather than after. Task review now covers 24a147b..ed13dc5 (gate + fix).

Ruling 20: **Gap 1 — keep `<picture>`, amend the SPEC, and correct the README, which is
factually wrong.** The reviewer is right that my README's stated reason ("next/image
cannot express two crops without preloading both") is false — `getImageProps()` exists
for exactly this. But adopting it would route images through Next's optimizer in front
of an already-optimizing CDN, adding a hop and a runtime dependency for no measured gain
(LCP is already 756ms against a 2500ms budget). The implementation stays; the false
justification does not. Spec §5 bullet changes from "next/image with art-directed
sources" to "art-directed responsive images", and the README's reason is rewritten to
the true one. Cost if wrong: if you want next/image demonstrated for its own sake on a
Next.js showcase, it is a ~5-line swap plus a remotePatterns entry.

Ruling 21: **Gap 2 — amend the spec to "Metadata API"; keep static `metadata` exports.**
`generateMetadata` is for dynamic routes; all four here are static, so static exports are
the correct call and I will not pessimise working code to match a word I wrote. The spec
bullet was over-specific. Cost if wrong: none.

Ruling 22: **Gap 3 — delete `favicon.ico` and the five unused scaffolder SVGs.** The
favicon is a 25,931-byte binary committed against spec §2's explicit "no binary image
assets in git", AND it is still create-next-app's Vercel triangle — wrong branding on a
fine-dining site. Twelve reviews missed it because no task's diff drew attention to
scaffolder leftovers. Cost if wrong: none; Next falls back cleanly.

Ruling 23: **Deferred #5 — adopt the REVIEWER'S fix shape, not the one I framed.** My
ledger said "derive dayOfWeek from restaurant.hours[].days", which means parsing
"Tuesday – Saturday" (with an en dash) into a day array: a range parser, more failure
modes, and it enshrines prose as canonical. The reviewer inverts it correctly — store the
machine-readable array, derive the display string with a one-line formatter. ~15 lines,
and it closes all three single-source violations plus the footer's hardcoded address and
phone in one edit. My framing was wrong; theirs is right.


---

## Carried, not fixed

Triaged "carry" by the final whole-branch review. None block merge.

- `tw-preset/package.json` omits `"type":"module"` while `ui` includes it. Inert for a CSS-only package.
- No `vitest.config.ts`. Both test files are pure logic with relative imports and need no jsdom. Add one when a site needs DOM-rendering tests.
- `theme-toggle` uses `MediaQueryList.addEventListener`, not the legacy `addListener`. Matters only for Safari <14.
- `pnpm lint` can emit a spurious JSON-parse error through the `rtk` token-filter hook; `rtk proxy pnpm lint` is clean. **Relevant to CI without rtk in the loop.**
- `reservation-form` omits `aria-invalid` on valid fields rather than setting it `false`. Absence implies false per ARIA.
- `scripts/a11y.mjs` hardcodes atelier's four routes and needs `--allow-build chromedriver`, a local Chrome, and network access. **Sites 02-05 inherit this file** — make `ROUTES` an argv fallback when the second site lands.
- Footer's inline "Unsplash" link is 16.8px, formally exempt under WCAG 2.2 SC 2.5.8 (see Ruling 19).
- `apps/01-atelier/.gitignore` retains `.vercel` though nothing deploys via Vercel CLI today.

## Open item requiring a human

**The JSON-LD has never been seen by Google's parser.** It was validated structurally
twice (every nested node carries its `@type`; 5 MenuItems with `Offer`/`price`/`priceCurrency`),
but `validator.schema.org` and the Rich Results Test cannot reach a localhost URL.
Paste the `application/ld+json` block from `/` into one of them before any real deploy.
