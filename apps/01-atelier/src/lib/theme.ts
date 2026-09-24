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
