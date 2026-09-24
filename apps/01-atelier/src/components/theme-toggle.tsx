"use client";

import { useState, useSyncExternalStore } from "react";
import { readStoredTheme, storeTheme, type Theme } from "@/lib/theme";

// No external change events for the stored override; useSyncExternalStore
// is used purely for its hydration-safe snapshot (server: null, client:
// actual stored value) without a setState-in-effect render pass.
function subscribeNone() {
  return () => {};
}

// The system preference genuinely changes at runtime, so it gets a real
// subscription. getServerSnapshot always returns false so the server render
// and the client's first hydration pass agree; React re-syncs to the live
// value right after, the same guarantee useSyncExternalStore gives storage.
function subscribeSystemDark(onChange: () => void) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getSystemDarkServer() {
  return false;
}

export default function ThemeToggle() {
  const stored = useSyncExternalStore(subscribeNone, readStoredTheme, () => null);
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    getSystemDark,
    getSystemDarkServer,
  );
  const [override, setOverride] = useState<Theme | null>(null);
  const theme = override ?? stored;

  function apply(next: Theme) {
    setOverride(next);
    storeTheme(next);
    document.documentElement.dataset.theme = next;
  }

  const isDark = theme === "dark" || (theme === null && systemDark);

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
