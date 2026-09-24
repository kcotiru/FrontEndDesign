import { restaurant } from "@/content/restaurant";

// French national format: strip the +33 country code, restore the trunk 0,
// group in pairs. "+33142608200" -> "01 42 60 82 00".
const localPhone = restaurant.telephone
  .replace("+33", "0")
  .match(/.{1,2}/g)
  ?.join(" ");

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-gutter py-12 text-sm text-muted">
        <p>
          {restaurant.address.street} · Reservations {localPhone}
        </p>
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
