/** "Make it personal" — Kids / Family / Couples tiles. */
import { CategoryCard } from "@/components/ecommerce/CategoryCard";

const tiles = [
  { title: "Kids", href: "/shop/kids-t-shirts", image: "/images/home/personal-kids.webp", description: "Names, ages and drawings on kids tees." },
  { title: "Family", href: "/shop/family-t-shirts", image: "/images/home/personal-family.webp", description: "One design for everyone, adult and kids sizes." },
  { title: "Couples", href: "/shop/couple-t-shirts", image: "/images/home/personal-couples.webp", description: "Matching tees with names, dates and quotes." },
];

export function PersonalFeature() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {tiles.map((t) => (
        <li key={t.href}>
          <CategoryCard {...t} sizes="(min-width: 768px) 31vw, 92vw" />
        </li>
      ))}
    </ul>
  );
}
