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
                className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-x-8 gap-y-1 border-b border-line py-5"
              >
                <dt className="col-start-1 row-start-1 text-lg">{dish.name}</dt>
                <dd className="col-start-1 row-start-2 text-sm text-muted">
                  {dish.description}
                </dd>
                <dd className="col-start-2 row-span-2 row-start-1 shrink-0 self-center tabular-nums text-muted">
                  €{dish.price}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
