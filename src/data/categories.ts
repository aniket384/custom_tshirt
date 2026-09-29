/**
 * Shop categories → /shop/[category]
 *
 * Categories are the primary product taxonomy (one product = one primary
 * category, optionally listed in more). Copy here is written for real search
 * intent — edit freely, but keep one clear H1 and a unique description each.
 */
import type { Category } from "@/lib/commerce/types";

export const categories: Category[] = [
  {
    slug: "printed-t-shirts",
    name: "Printed T-Shirts",
    shortName: "Printed",
    h1: "Printed T-Shirts",
    description:
      "Graphic, typography, funny and minimal printed T-shirts in regular and oversized fits.",
    intro:
      "Ready-to-wear printed T-shirts for everyday outfits — clean minimal designs, bold typography and playful graphics. Pick your colour and size, or use any design as a starting point in the customiser.",
    image: { src: "/images/categories/printed-t-shirts.webp", alt: "Folded black printed T-shirt with a bold graphic" },
    seo: {
      title: "Printed T-Shirts Online in India",
      description:
        "Shop printed T-shirts — graphic, typography, funny and minimal designs in regular and oversized fits. Delivery across India.",
    },
  },
  {
    slug: "custom-t-shirts",
    name: "Custom T-Shirts",
    shortName: "Custom",
    h1: "Custom T-Shirts",
    description: "Personalised T-shirts with your photo, name, quote or artwork.",
    intro:
      "Turn your own idea into a T-shirt. Upload a photo or artwork, add a name or quote, choose front or back placement and preview it before you order. Every custom T-shirt is printed for you.",
    image: { src: "/images/categories/custom-t-shirts.webp", alt: "White T-shirt with a custom photo print" },
    seo: {
      title: "Custom T-Shirts — Photo, Name & Quote Printing",
      description:
        "Design custom T-shirts online: upload a photo, add names or quotes and preview your print. Personalised T-shirts with delivery across India.",
    },
  },
  {
    slug: "oversized-t-shirts",
    name: "Oversized T-Shirts",
    shortName: "Oversized",
    h1: "Oversized T-Shirts",
    description: "Relaxed, dropped-shoulder oversized tees with street-style prints.",
    intro:
      "Dropped shoulders, a roomier body and a longer line — oversized T-shirts made for layering and street-style looks. Size down if you prefer a closer oversized fit.",
    image: { src: "/images/categories/oversized-t-shirts.webp", alt: "Black oversized T-shirt with a street graphic" },
    seo: {
      title: "Oversized T-Shirts — Graphic & Plain",
      description:
        "Shop oversized T-shirts with graphic and minimal prints. Dropped-shoulder, relaxed fit tees for everyday street style.",
    },
  },
  {
    slug: "couple-t-shirts",
    name: "Couple T-Shirts",
    shortName: "Couple",
    h1: "Couple T-Shirts",
    description: "Matching couple T-shirts with names, dates and partner quotes.",
    intro:
      "Matching tees for two — add both names, an anniversary date or a partner quote. Couple T-shirts make an easy gift for anniversaries, trips and Valentine's Day.",
    image: { src: "/images/categories/couple-t-shirts.webp", alt: "Pair of matching couple T-shirts" },
    seo: {
      title: "Couple T-Shirts — Matching & Personalised",
      description:
        "Matching couple T-shirts with names, dates and quotes. Personalised couple tees for anniversaries, trips and gifting.",
    },
  },
  {
    slug: "kids-t-shirts",
    name: "Kids T-Shirts",
    shortName: "Kids",
    h1: "Kids T-Shirts",
    description: "Custom and printed T-shirts for kids, from 2 to 13 years.",
    intro:
      "Soft, easy-wear T-shirts for kids with their name, age or a favourite picture. Great for birthdays, school events and matching family outfits.",
    image: { src: "/images/categories/kids-t-shirts.webp", alt: "Kids yellow T-shirt with a name print" },
    seo: {
      title: "Kids Custom T-Shirts — Name & Birthday Tees",
      description:
        "Personalised kids T-shirts with names, ages and photos. Birthday and everyday tees for ages 2 to 13.",
    },
  },
  {
    slug: "family-t-shirts",
    name: "Family T-Shirts",
    shortName: "Family",
    h1: "Family T-Shirts",
    description: "Matching family T-shirts for trips, functions and celebrations.",
    intro:
      "Matching T-shirts for the whole family — adult and kids sizes in the same design. Perfect for family trips, reunions, birthdays and festive functions.",
    image: { src: "/images/categories/family-t-shirts.webp", alt: "Set of matching family T-shirts in adult and kids sizes" },
    seo: {
      title: "Matching Family T-Shirts",
      description:
        "Matching family T-shirts in adult and kids sizes. Personalise with names or a family tag for trips, reunions and celebrations.",
    },
  },
  {
    slug: "gym-t-shirts",
    name: "Gym T-Shirts",
    shortName: "Gym",
    h1: "Gym & Fitness T-Shirts",
    description: "Workout T-shirts with motivation quotes and training graphics.",
    intro:
      "Training tees with motivation quotes and bold graphics — for the gym, running club or your own fitness brand. Add your gym name for a team look.",
    image: { src: "/images/categories/gym-t-shirts.webp", alt: "Black gym T-shirt with a motivation quote" },
    seo: {
      title: "Gym T-Shirts — Fitness & Workout Tees",
      description:
        "Gym and fitness T-shirts with motivation quotes and workout graphics. Custom gym tees for teams and fitness studios.",
    },
  },
  {
    slug: "corporate-t-shirts",
    name: "Corporate T-Shirts",
    shortName: "Corporate",
    h1: "Corporate T-Shirts",
    description: "Company logo T-shirts and polos for teams, offsites and launches.",
    intro:
      "Branded T-shirts and polos for your team — company logo tees, offsite and launch merchandise and uniforms. Order a few pieces or request a bulk quote for larger quantities.",
    image: { src: "/images/categories/corporate-t-shirts.webp", alt: "Navy corporate polo T-shirt with a chest logo" },
    seo: {
      title: "Corporate T-Shirts with Company Logo",
      description:
        "Corporate T-shirts and polos printed with your company logo. Team apparel for offices, offsites and product launches, with bulk quotes available.",
    },
  },
  {
    slug: "bulk-event-t-shirts",
    name: "Bulk & Event T-Shirts",
    shortName: "Bulk / Event",
    h1: "Bulk & Event T-Shirts",
    description: "Team, club, college and event T-shirts ordered in bulk.",
    intro:
      "Printed T-shirts for marathons, college fests, club meet-ups, weddings and group trips. Choose a base design or share your own and request a bulk quote.",
    image: { src: "/images/categories/bulk-event-t-shirts.webp", alt: "Stack of event T-shirts printed for a team" },
    seo: {
      title: "Bulk T-Shirt Printing for Events & Teams",
      description:
        "Bulk T-shirt printing for events, teams, colleges and clubs. Choose a design or upload yours and request a bulk quote.",
    },
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    shortName: "Hoodies",
    h1: "Custom & Graphic Hoodies",
    description: "Printed and personalised hoodies for cooler days.",
    intro:
      "Warm, easy hoodies with graphic prints or your own personalisation — names, logos or artwork. A good pick for winter gifting and team merchandise.",
    image: { src: "/images/categories/hoodies.webp", alt: "Black hoodie with a yellow graphic print" },
    seo: {
      title: "Custom Hoodies & Graphic Hoodies",
      description:
        "Shop graphic hoodies or design custom hoodies with your name, logo or artwork. Personalised hoodies with delivery across India.",
    },
  },
];
