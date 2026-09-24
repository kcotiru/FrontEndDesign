import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How a twelve-seat counter in the first arrondissement came to be.",
};

export default function StoryPage() {
  return (
    <article className="mx-auto max-w-2xl px-gutter py-section">
      <h1 className="text-3xl">Our Story</h1>
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-pretty">
        <p>
          Atelier opened in 2019 in a room that had been a bookbinder&apos;s
          workshop for sixty years. We kept the benches. They are now the counter.
        </p>
        <p>
          There is one menu because there is one cook at the pass, and he would
          rather do ten things exactly than forty things adequately. The menu is
          written each morning after the Rungis delivery, which means we cannot
          tell you in advance what you will eat — only that it arrived this week.
        </p>
        <p>
          We seat twelve. We serve once. When the last plate goes out, we sit
          down and eat what is left.
        </p>
      </div>
    </article>
  );
}
