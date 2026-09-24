import { restaurant, menu } from "@/content/restaurant";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    priceRange: restaurant.priceRange,
    telephone: restaurant.telephone,
    servesCuisine: "French",
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.locality,
      postalCode: restaurant.address.postalCode,
      addressCountry: restaurant.address.country,
    },
    openingHoursSpecification: restaurant.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: menu.map((s) => ({
        "@type": "MenuSection",
        name: s.title,
        hasMenuItem: s.dishes.map((d) => ({
          "@type": "MenuItem",
          name: d.name,
          description: d.description,
          offers: { "@type": "Offer", price: d.price, priceCurrency: "EUR" },
        })),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
