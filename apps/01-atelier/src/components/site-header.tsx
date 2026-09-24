import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

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
          <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
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
