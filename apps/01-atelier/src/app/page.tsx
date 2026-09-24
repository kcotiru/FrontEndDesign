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
