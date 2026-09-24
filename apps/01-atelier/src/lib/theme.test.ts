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
