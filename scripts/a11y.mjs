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
      [
        "dlx",
        "--allow-build",
        "chromedriver",
        "@axe-core/cli",
        url,
        "--tags",
        "wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa",
        "--exit",
      ],
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
