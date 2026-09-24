export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-gutter py-12 text-sm text-muted">
        <p>14 Rue Saint-Honoré · Reservations 01 42 60 82 00</p>
        <p className="mt-4">
          Photography via{" "}
          <a href="https://unsplash.com" className="focus-ring underline">
            Unsplash
          </a>
          . Demonstration site; not a real restaurant.
        </p>
      </div>
    </footer>
  );
}
