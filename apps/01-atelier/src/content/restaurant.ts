export type Dish = { name: string; description: string; price: number };
export type MenuSection = { id: string; title: string; dishes: Dish[] };

export type Restaurant = {
  name: string;
  tagline: string;
  description: string;
  address: { street: string; locality: string; postalCode: string; country: string };
  telephone: string;
  priceRange: string;
  hours: { days: string[]; opens: string; closes: string }[];
};

export const formatDays = (d: string[]) => (d.length > 1 ? `${d[0]} – ${d.at(-1)}` : d[0] ?? "");

export const restaurant: Restaurant = {
  name: "Atelier",
  tagline: "Twelve seats. One menu. Every evening.",
  description:
    "A twelve-seat counter in the first arrondissement where the menu is written each morning around whatever arrived from Rungis before dawn. There is no à la carte, no substitutions, and no second sitting.",
  address: {
    street: "14 Rue Saint-Honoré",
    locality: "Paris",
    postalCode: "75001",
    country: "FR",
  },
  telephone: "+33142608200",
  priceRange: "$$$$",
  hours: [
    {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "19:00",
      closes: "23:00",
    },
  ],
};

export const menu: MenuSection[] = [
  {
    id: "ouverture",
    title: "Ouverture",
    dishes: [
      { name: "Oyster, cucumber, elderflower", description: "Gillardeau no. 3, iced cucumber consommé, elderflower vinegar.", price: 28 },
      { name: "Sourdough, cultured butter", description: "Three-day levain, butter churned in house, Guérande salt.", price: 14 },
    ],
  },
  {
    id: "milieu",
    title: "Milieu",
    dishes: [
      { name: "Turbot, beurre blanc, sorrel", description: "Line-caught Breton turbot, aged on the bone eight days.", price: 62 },
      { name: "Pigeon, cherry, lavender", description: "Racan pigeon roasted on the crown, morello cherries, wild lavender jus.", price: 68 },
    ],
  },
  {
    id: "fin",
    title: "Fin",
    dishes: [
      { name: "Tarte au citron", description: "Menton lemon, torched meringue, thyme shortbread.", price: 22 },
    ],
  },
];
