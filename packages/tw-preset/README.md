# @portfolio/tw-preset

Shared Tailwind v4 base. Import after `@import "tailwindcss"`:

```css
@import "tailwindcss";
@import "@portfolio/tw-preset/base.css";
```

**Deliberately excluded:** colors, shadows, component classes, border radii.
Those are art direction. Each app owns them so the sites do not converge on
one house style. See spec section 4.
