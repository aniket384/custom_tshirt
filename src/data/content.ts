/**
 * Editable marketing content: FAQs, testimonials, homepage blocks,
 * size charts. Kept in one place so non-developers can update copy.
 *
 * HONESTY: answers avoid promises the business has not confirmed
 * (exact delivery days, return windows, fabric certifications...).
 */

export interface Faq {
  q: string;
  a: string;
}

/** Homepage + /faq general questions. Also used for FAQPage JSON-LD on /faq. */
export const generalFaqs: Faq[] = [
  {
    q: "Can I print my own design?",
    a: "Yes. Use the T-shirt customiser to upload your own photo, logo or artwork, add text and preview it on the T-shirt before you order.",
  },
  {
    q: "What type of images can I upload?",
    a: "PNG, JPG, WEBP and SVG files up to 10 MB. For the best print, use a clear, high-resolution image — ideally 1500px or more on the longest side. PNGs with a transparent background work best for logos.",
  },
  {
    q: "Can I add text or names?",
    a: "Yes. You can add a name, a short line of text and a quote, and choose the font, size, alignment and placement. The preview updates as you type.",
  },
  {
    q: "What T-shirt sizes are available?",
    a: "Adult T-shirts are generally available from XS to XXL and kids T-shirts from 2–3 years to 12–13 years. Available sizes are listed on each product page along with a size chart.",
  },
  {
    q: "Do you accept bulk orders?",
    a: "Yes — for companies, colleges, events, clubs, teams and families. Fill in the bulk order form with your quantity, sizes, colours and deadline and we will get back to you with a quote.",
  },
  {
    q: "Can I order couple or family T-shirts?",
    a: "Yes. Choose a couple or family design (or create your own) and add one T-shirt per person in the size each person needs. Kids sizes are available for family sets.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes, we deliver across India. Enter your pincode on a product page to check delivery availability for your location.",
  },
  {
    q: "How do custom orders work?",
    a: "Choose your T-shirt, colour and size, upload your design or add text, preview it and place your order. Custom T-shirts are printed to order, so please double-check spelling and sizes before you check out.",
  },
];

/** PDP-level FAQs shown on every product page (kept generic & true). */
export const productFaqs: Faq[] = [
  { q: "How do I choose my size?", a: "Open the size chart on this page and compare it with a T-shirt you already own. For oversized styles, take your usual size for the full oversized look." },
  { q: "Can I change the design or colour?", a: "Yes — use \"Customise\" to open this style in the customiser, or pick a different colour above." },
  { q: "How long will delivery take?", a: "Delivery time depends on your location. Enter your pincode above to check delivery availability; timelines will be confirmed at checkout once delivery partners are connected." },
];

/**
 * DEVELOPMENT-ONLY SAMPLE TESTIMONIALS.
 * These are placeholders to design the layout. They are NOT real customer
 * reviews, must NOT be marked up as Review schema, and are labelled as samples
 * in the UI. Replace with verified reviews from a reviews provider.
 */
export const sampleTestimonials = [
  { id: "sample-1", quote: "Sample review: the preview matched the printed tee closely and the name print looked sharp.", author: "Sample Customer A", context: "Custom Name Tee" },
  { id: "sample-2", quote: "Sample review: ordered matching tees for a family trip — sizes for kids and adults in one go.", author: "Sample Customer B", context: "Family Squad Tee" },
  { id: "sample-3", quote: "Sample review: the bulk quote process for our team event was simple and clear.", author: "Sample Customer C", context: "Team Event Tee" },
] as const;

/** "Why Custom T-Shirt Wala" — safe, factual brand-value messages. */
export const brandValues = [
  { title: "Custom Designs", text: "Bring your own photo, name, quote or logo — or start from one of ours." },
  { title: "Multiple Print Styles", text: "Photo prints, name prints, quote prints, graphics and more." },
  { title: "Personalised Apparel", text: "T-shirts and hoodies made around your people and your moments." },
  { title: "Individual & Bulk Orders", text: "Order a single tee or request a quote for your whole team." },
  { title: "For Every Occasion", text: "Birthdays, couples, family, gym, college, events and corporate." },
  { title: "All India Delivery", text: "Based in Datia, Madhya Pradesh, delivering across India." },
] as const;

/** Homepage "How custom printing works" steps. */
export const howItWorks = [
  { step: 1, title: "Choose Your T-Shirt", text: "Pick a style — classic, oversized, full sleeve, kids or hoodie — then colour and size." },
  { step: 2, title: "Upload Your Design", text: "Add a photo, logo or artwork, or type a name, text or quote." },
  { step: 3, title: "Preview Your Customisation", text: "See your design on the T-shirt, adjust position and size." },
  { step: 4, title: "Place Your Order", text: "Add to cart, check out, and we print it for you." },
] as const;

/** Announcement bar messages (rotate or show first). No invented discounts. */
export const announcements = [
  "Custom T-Shirts. Apna Design, Apni Style.",
  "Personalised T-Shirts • Bulk Orders • All India Delivery",
] as const;

/**
 * Shop-by-moment tiles. Where a moment maps 1:1 to a category we link to the
 * category (avoids duplicate collection pages).
 */
export const moments = [
  { name: "Birthday", href: "/collections/birthday-t-shirts", image: "/images/home/moment-birthday.webp" },
  { name: "Couples", href: "/shop/couple-t-shirts", image: "/images/home/moment-couples.webp" },
  { name: "Family", href: "/shop/family-t-shirts", image: "/images/home/moment-family.webp" },
  { name: "Friends", href: "/collections/friends-t-shirts", image: "/images/home/moment-friends.webp" },
  { name: "Gym", href: "/shop/gym-t-shirts", image: "/images/home/moment-gym.webp" },
  { name: "Travel", href: "/collections/travel-t-shirts", image: "/images/home/moment-travel.webp" },
  { name: "College", href: "/collections/college-t-shirts", image: "/images/home/moment-college.webp" },
  { name: "Events", href: "/shop/bulk-event-t-shirts", image: "/images/home/moment-events.webp" },
  { name: "Corporate", href: "/shop/corporate-t-shirts", image: "/images/home/moment-corporate.webp" },
] as const;

/** Shop-by-style tiles. */
export const styles = [
  { name: "Graphic Prints", href: "/collections/graphic-prints", image: "/images/collections/graphic-prints.webp" },
  { name: "Minimal Prints", href: "/collections/minimal-prints", image: "/images/collections/minimal-prints.webp" },
  { name: "Funny Prints", href: "/collections/funny-prints", image: "/images/collections/funny-prints.webp" },
  { name: "Name & Quote", href: "/collections/name-and-quote", image: "/images/collections/name-and-quote.webp" },
  { name: "Photo Prints", href: "/collections/photo-prints", image: "/images/collections/photo-prints.webp" },
  { name: "Oversized", href: "/shop/oversized-t-shirts", image: "/images/categories/oversized-t-shirts.webp" },
  { name: "Custom Designs", href: "/custom-tshirt", image: "/images/categories/custom-t-shirts.webp" },
  { name: "Hoodies", href: "/shop/hoodies", image: "/images/categories/hoodies.webp" },
] as const;

/**
 * Instagram showcase — LOCAL placeholder images only (no hotlinking/scraping).
 * Replace with manually exported posts, the official Instagram API or CMS media.
 */
export const instagramPosts = [
  { id: "ig-1", image: "/images/instagram/post-1.webp", alt: "Custom name T-shirt flat lay" },
  { id: "ig-2", image: "/images/instagram/post-2.webp", alt: "Couple T-shirts with matching print" },
  { id: "ig-3", image: "/images/instagram/post-3.webp", alt: "Kids birthday T-shirt" },
  { id: "ig-4", image: "/images/instagram/post-4.webp", alt: "Gym motivation T-shirt" },
  { id: "ig-5", image: "/images/instagram/post-5.webp", alt: "Corporate team T-shirts" },
  { id: "ig-6", image: "/images/instagram/post-6.webp", alt: "Crown graphic hoodie" },
] as const;

/**
 * Size charts — INDICATIVE DEMO MEASUREMENTS (inches, garment laid flat ×2).
 * Replace with the manufacturer's actual spec sheet before launch.
 */
export const sizeCharts = {
  regular: {
    label: "Regular fit (indicative)",
    columns: ["Size", "Chest (in)", "Length (in)"],
    rows: [
      ["XS", "36", "26"],
      ["S", "38", "27"],
      ["M", "40", "28"],
      ["L", "42", "29"],
      ["XL", "44", "30"],
      ["XXL", "46", "31"],
    ],
  },
  oversized: {
    label: "Oversized fit (indicative)",
    columns: ["Size", "Chest (in)", "Length (in)"],
    rows: [
      ["S", "42", "28"],
      ["M", "44", "29"],
      ["L", "46", "30"],
      ["XL", "48", "31"],
      ["XXL", "50", "32"],
    ],
  },
  kids: {
    label: "Kids (indicative)",
    columns: ["Size", "Chest (in)", "Length (in)"],
    rows: [
      ["2-3Y", "22", "15"],
      ["4-5Y", "24", "17"],
      ["6-7Y", "26", "19"],
      ["8-9Y", "28", "21"],
      ["10-11Y", "30", "22"],
      ["12-13Y", "32", "24"],
    ],
  },
} as const;
