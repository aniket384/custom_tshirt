/**
 * Collections → /collections/[slug]
 *
 * Collections are RULE-BASED groupings that cut across categories (a style,
 * a moment or a merchandising flag). To avoid duplicate content, we do NOT
 * create collections that would mirror a category 1:1 (e.g. "Couple",
 * "Hoodies", "Oversized") — homepage tiles for those link to the category.
 */
import type { Collection } from "@/lib/commerce/types";

export const collections: Collection[] = [
  // --- Style collections ----------------------------------------------------
  {
    slug: "graphic-prints",
    name: "Graphic Prints",
    kind: "style",
    h1: "Graphic Print T-Shirts",
    description: "Bold artwork, retro graphics and statement prints.",
    intro:
      "Statement artwork for people who like their T-shirt to say something. Retro badges, street graphics and illustration-led prints across regular and oversized fits.",
    image: { src: "/images/collections/graphic-prints.webp", alt: "Graphic print T-shirt with retro artwork" },
    rule: { printTypes: ["graphic-print", "screen-print"], tags: ["graphic"] },
    seo: {
      title: "Graphic Print T-Shirts",
      description: "Graphic print T-shirts with retro, street and illustration artwork in regular and oversized fits.",
    },
  },
  {
    slug: "minimal-prints",
    name: "Minimal Prints",
    kind: "style",
    h1: "Minimal Print T-Shirts",
    description: "Small chest prints and clean typography.",
    intro: "Quiet, clean designs — small chest marks, fine lines and simple words. Easy to style and easy to wear every day.",
    image: { src: "/images/collections/minimal-prints.webp", alt: "White T-shirt with a small minimal chest print" },
    rule: { tags: ["minimal"] },
    seo: {
      title: "Minimal Print T-Shirts",
      description: "Minimal print T-shirts with small chest prints and clean typography for everyday wear.",
    },
  },
  {
    slug: "funny-prints",
    name: "Funny Prints",
    kind: "style",
    h1: "Funny T-Shirts",
    description: "Witty lines and desi humour on a T-shirt.",
    intro: "Witty one-liners and everyday desi humour. Funny T-shirts make easy gifts for friends, birthdays and college gangs.",
    image: { src: "/images/collections/funny-prints.webp", alt: "Yellow T-shirt with a funny slogan" },
    rule: { tags: ["funny"] },
    seo: {
      title: "Funny T-Shirts — Witty Slogan Tees",
      description: "Funny slogan T-shirts with witty lines and desi humour. Easy gifts for friends and birthdays.",
    },
  },
  {
    slug: "name-and-quote",
    name: "Name & Quote",
    kind: "style",
    h1: "Name & Quote T-Shirts",
    description: "Personalised name prints and quote T-shirts.",
    intro:
      "Your name, your line. Add a name, nickname, number or a favourite quote to a T-shirt — or pick one of our quote designs as a starting point.",
    image: { src: "/images/collections/name-and-quote.webp", alt: "Black T-shirt with a personalised name print" },
    rule: { printTypes: ["name-print", "quote-print"] },
    seo: {
      title: "Custom Name & Quote T-Shirts",
      description: "Personalised name T-shirts and custom quote T-shirts. Add names, nicknames, numbers or your favourite line.",
    },
  },
  {
    slug: "photo-prints",
    name: "Photo Prints",
    kind: "style",
    h1: "Photo Print T-Shirts",
    description: "Custom photo T-shirts with your favourite pictures.",
    intro:
      "Put a favourite photo on a T-shirt — a family picture, a pet, a trip memory or a birthday throwback. Upload a clear, high-resolution image for the best print.",
    image: { src: "/images/collections/photo-prints.webp", alt: "White T-shirt with a custom photo print" },
    rule: { printTypes: ["photo-print"] },
    seo: {
      title: "Custom Photo T-Shirts",
      description: "Custom photo T-shirts printed with your pictures. Upload a photo, preview it and order online.",
    },
  },

  // --- Moment collections ---------------------------------------------------
  {
    slug: "birthday-t-shirts",
    name: "Birthday",
    kind: "moment",
    h1: "Birthday T-Shirts",
    description: "Birthday tees for the birthday person and the whole squad.",
    intro:
      "Birthday T-shirts with names, ages and inside jokes — for the birthday person, the family or the whole party. Plan a little ahead so custom prints arrive in time.",
    image: { src: "/images/collections/birthday-t-shirts.webp", alt: "Birthday T-shirt with a name and age print" },
    rule: { occasions: ["birthday"] },
    seo: {
      title: "Custom Birthday T-Shirts",
      description: "Custom birthday T-shirts with names, ages and photos — for the birthday person, family and friends.",
    },
  },
  {
    slug: "friends-t-shirts",
    name: "Friends",
    kind: "moment",
    h1: "T-Shirts for Friends & Squads",
    description: "Matching tees for your gang, trips and reunions.",
    intro: "Matching T-shirts for your gang — reunions, bachelor trips, college farewells or just because. Add everyone's nickname for a personal touch.",
    image: { src: "/images/collections/friends-t-shirts.webp", alt: "Matching friends group T-shirts" },
    rule: { occasions: ["friends"] },
    seo: {
      title: "Friends Group T-Shirts",
      description: "Matching friends group T-shirts for trips, reunions and farewells. Personalise with names and nicknames.",
    },
  },
  {
    slug: "travel-t-shirts",
    name: "Travel",
    kind: "moment",
    h1: "Travel T-Shirts",
    description: "Trip tees for road trips, treks and group holidays.",
    intro: "Trip T-shirts for road trips, treks and group holidays. Print the destination, the date or the group name and make the photos match.",
    image: { src: "/images/collections/travel-t-shirts.webp", alt: "Travel T-shirt with a mountain road-trip graphic" },
    rule: { occasions: ["travel"] },
    seo: {
      title: "Travel & Trip T-Shirts",
      description: "Travel T-shirts for road trips, treks and group holidays. Personalise with your destination and dates.",
    },
  },
  {
    slug: "college-t-shirts",
    name: "College",
    kind: "moment",
    h1: "College T-Shirts",
    description: "Fest, batch and farewell T-shirts for students.",
    intro: "Batch tees, fest merchandise and farewell T-shirts. Add your college, batch year or society name — and request a bulk quote for the whole class.",
    image: { src: "/images/collections/college-t-shirts.webp", alt: "College batch T-shirt with a varsity-style print" },
    rule: { occasions: ["college"] },
    seo: {
      title: "College Batch & Fest T-Shirts",
      description: "College T-shirts for batches, fests and farewells. Personalise and order in bulk for your class or society.",
    },
  },

  // --- Merchandising collections -------------------------------------------
  {
    slug: "best-sellers",
    name: "Best Sellers",
    kind: "merch",
    h1: "Best Sellers",
    description: "Our most-picked designs right now.",
    intro: "The designs shoppers pick most often — a good place to start if you are new here.",
    image: { src: "/images/collections/best-sellers.webp", alt: "Best selling printed T-shirts" },
    rule: { flag: "bestseller" },
    seo: {
      title: "Best Selling T-Shirts",
      description: "Shop our best selling printed and custom T-shirts, hoodies and couple tees.",
    },
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    kind: "merch",
    h1: "New Arrivals",
    description: "Fresh designs, just added.",
    intro: "The latest designs added to the store. New prints are added regularly — check back often.",
    image: { src: "/images/collections/new-arrivals.webp", alt: "New arrival T-shirts" },
    rule: { flag: "new" },
    seo: {
      title: "New Arrivals — Latest T-Shirt Designs",
      description: "See the newest printed and custom T-shirt designs, oversized tees and hoodies.",
    },
  },
];
