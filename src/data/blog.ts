/**
 * Blog articles → /blog and /blog/[slug]
 *
 * Content is stored as structured blocks (not HTML strings) so it can be
 * rendered safely without dangerouslySetInnerHTML, and later migrated to a
 * CMS (Sanity, Contentful, Strapi, MDX...) with a simple mapping.
 *
 * Author is the brand team — do not attribute articles to invented people.
 */

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date. */
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  image: { src: string; alt: string };
  tags: string[];
  body: BlogBlock[];
  /** Internal links shown at the end of the article (blog → categories/products). */
  links: { href: string; label: string }[];
  relatedProductSlugs: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "custom-tshirts-for-birthdays",
    title: "Custom T-Shirt Ideas for Birthdays",
    excerpt:
      "Name and age prints, photo throwbacks, squad tees and inside jokes — practical birthday T-shirt ideas for kids, partners and friends.",
    publishedAt: "2026-06-10",
    readingMinutes: 5,
    image: { src: "/images/blog/custom-tshirts-for-birthdays.webp", alt: "Birthday T-shirts with names and ages" },
    tags: ["Birthday", "Ideas", "Gifting"],
    body: [
      { type: "p", text: "A custom birthday T-shirt does two jobs at once: it makes the birthday person feel special, and it makes every photo from the day instantly recognisable. The best designs are simple, personal and easy to read from across the room." },
      { type: "h2", text: "1. Name + age (the classic)" },
      { type: "p", text: "The most reliable birthday design is the person's name with the age they are turning. It works for a 3-year-old and a 30-year-old. Use a bold font for the name and a smaller line for the age, or flip it and make the number the hero." },
      { type: "h2", text: "2. The throwback photo" },
      { type: "p", text: "Print a baby photo or an old family picture on the front. Guests love it, and it becomes a keepsake. Scan printed photos at a high resolution and crop out busy backgrounds before uploading." },
      { type: "h2", text: "3. Squad tees for the party" },
      { type: "p", text: "Give the birthday person a unique design and give everyone else a matching \"squad\" version — same colour, different text. For a family function, add each person's role: Birthday Girl, Chief Cake Officer, Official Photographer." },
      { type: "h2", text: "4. Inside jokes and nicknames" },
      { type: "p", text: "A nickname only your friends understand is often funnier than any ready-made slogan. Keep it short — four to six words — so it reads well on the chest." },
      { type: "h2", text: "Plan the timing" },
      { type: "ul", items: ["Finalise the design early — custom prints are made to order.", "Check delivery availability for your pincode before ordering.", "Order one size up for kids if the tee is meant to last."] },
      { type: "tip", text: "Tip: for a group order, collect everyone's sizes in one message before placing the order. It saves a lot of back-and-forth." },
    ],
    links: [
      { href: "/collections/birthday-t-shirts", label: "Shop birthday T-shirts" },
      { href: "/custom-tshirt/name-t-shirts", label: "Design a name T-shirt" },
      { href: "/shop/kids-t-shirts", label: "Kids T-shirts" },
    ],
    relatedProductSlugs: ["kids-name-tee", "custom-name-tee", "custom-photo-print-tee", "funny-graphic-tee"],
  },
  {
    slug: "how-to-create-a-custom-tshirt",
    title: "How to Create a Custom T-Shirt (Step by Step)",
    excerpt: "From choosing the right base tee to preparing your image and picking a placement — a simple walkthrough for your first custom T-shirt.",
    publishedAt: "2026-05-22",
    readingMinutes: 6,
    image: { src: "/images/blog/how-to-create-a-custom-tshirt.webp", alt: "Designing a custom T-shirt on a laptop" },
    tags: ["Guide", "Customisation"],
    body: [
      { type: "p", text: "Creating a custom T-shirt is easier than it looks. The difference between a good result and a great one usually comes down to three things: the right base tee, a print-ready image and sensible placement." },
      { type: "h2", text: "Step 1: Choose the base T-shirt" },
      { type: "p", text: "Start with fit. A classic regular-fit tee suits most people and most designs. Oversized tees give a relaxed street-style look and suit bigger back prints. Full-sleeve tees and hoodies work well for cooler months." },
      { type: "h2", text: "Step 2: Pick a colour that suits the design" },
      { type: "ul", items: ["Photos look most accurate on white and light colours.", "Bright, bold graphics pop on black and navy.", "Yellow and pastel tees suit playful, kids and event designs."] },
      { type: "h2", text: "Step 3: Prepare your image" },
      { type: "p", text: "Use the highest-resolution version you have. As a rule of thumb, aim for at least 1500 pixels on the longest side. PNG files with transparent backgrounds give the cleanest result for logos and artwork." },
      { type: "tip", text: "Avoid screenshots of photos from social apps — they are usually compressed and can print blurry." },
      { type: "h2", text: "Step 4: Add text" },
      { type: "p", text: "Names, dates and short quotes are the easiest way to personalise. Keep text short, choose one font, and check spelling twice — especially names." },
      { type: "h2", text: "Step 5: Choose placement and preview" },
      { type: "p", text: "Front prints are the most common. Back prints suit names and numbers. Front + back lets you put a small mark on the chest and a bigger design behind. Always preview before ordering." },
      { type: "h2", text: "Step 6: Order and confirm" },
      { type: "p", text: "Add the design to your cart, choose quantity and size, and check out. For 10 or more pieces, a bulk quote is usually the better route." },
    ],
    links: [
      { href: "/custom-tshirt", label: "Open the T-shirt customiser" },
      { href: "/shop/custom-t-shirts", label: "Browse custom T-shirts" },
      { href: "/bulk-orders", label: "Request a bulk quote" },
    ],
    relatedProductSlugs: ["custom-photo-print-tee", "custom-quote-tee", "custom-name-tee", "custom-hoodie"],
  },
  {
    slug: "oversized-vs-regular-fit",
    title: "Oversized vs Regular Fit T-Shirts: Which Should You Pick?",
    excerpt: "How oversized and regular fit tees differ, who each suits, how to size them and how to style both.",
    publishedAt: "2026-04-30",
    readingMinutes: 4,
    image: { src: "/images/blog/oversized-vs-regular-fit.webp", alt: "Oversized and regular fit T-shirts side by side" },
    tags: ["Fit guide", "Style"],
    body: [
      { type: "p", text: "Oversized and regular fit T-shirts can share the same design and still look completely different. Here is how to decide." },
      { type: "h2", text: "Regular fit" },
      { type: "p", text: "A regular-fit T-shirt follows the body without clinging. Shoulder seams sit on your shoulders and the hem sits around the hip. It is the safe, versatile choice — easy to tuck, layer or wear on its own." },
      { type: "h2", text: "Oversized fit" },
      { type: "p", text: "Oversized tees have dropped shoulders, a wider body and usually a longer length. They create a relaxed street-style silhouette and give large back prints more room." },
      { type: "h2", text: "How to size" },
      { type: "ul", items: ["Want a true oversized look? Take your usual size.", "Want something in between? Size down once in oversized.", "Compare the chest measurement in the size chart with a tee you already own."] },
      { type: "h2", text: "How to style them" },
      { type: "ol", items: ["Regular fit: straight denims, chinos or shorts — tucked or untucked.", "Oversized: cargos, joggers or slim bottoms to balance the volume.", "Both: an open overshirt or jacket on top for cooler evenings."] },
      { type: "tip", text: "Designs with a big back print usually look best on oversized tees." },
    ],
    links: [
      { href: "/shop/oversized-t-shirts", label: "Shop oversized T-shirts" },
      { href: "/shop/printed-t-shirts", label: "Shop printed T-shirts" },
      { href: "/blog/how-to-choose-the-right-tshirt-size", label: "T-shirt size guide" },
    ],
    relatedProductSlugs: ["black-oversized-graphic-tee", "white-oversized-tee", "street-graphic-oversized-tee", "minimal-graphic-tee"],
  },
  {
    slug: "best-tshirts-for-events",
    title: "Choosing the Best T-Shirts for Events",
    excerpt: "Marathons, college fests, weddings and meet-ups: how to plan colours, designs, sizes and quantities for event T-shirts.",
    publishedAt: "2026-04-12",
    readingMinutes: 5,
    image: { src: "/images/blog/best-tshirts-for-events.webp", alt: "Group of people in matching event T-shirts" },
    tags: ["Events", "Bulk"],
    body: [
      { type: "p", text: "Event T-shirts help a group look like a group. Done well, they become souvenirs people keep wearing long after the event." },
      { type: "h2", text: "Start with the purpose" },
      { type: "ul", items: ["Identification (volunteers, staff, teams) → bright colours and big back text.", "Souvenir (runs, fests, trips) → a design people want to wear again.", "Celebration (weddings, reunions) → names, dates and a fun theme."] },
      { type: "h2", text: "Colours that work" },
      { type: "p", text: "Bright yellow, red and sky blue are easy to spot in a crowd. Black and white are the most wearable afterwards. If you have multiple teams, give each one its own colour with the same design." },
      { type: "h2", text: "Keep the design simple" },
      { type: "p", text: "A small front logo with the event name and date on the back is a proven layout. Limit yourself to two or three print colours for a cleaner look." },
      { type: "h2", text: "Get sizes right" },
      { type: "p", text: "Collect sizes in a shared form rather than guessing. Share the size chart with everyone and add a few extra pieces in M and L for last-minute changes." },
      { type: "h2", text: "Timeline" },
      { type: "p", text: "Share your deadline when you request a quote so production can be planned. Confirm your design and size list first — changes after printing starts are not always possible." },
    ],
    links: [
      { href: "/bulk-orders", label: "Request a bulk quote" },
      { href: "/shop/bulk-event-t-shirts", label: "Bulk & event T-shirts" },
      { href: "/collections/college-t-shirts", label: "College T-shirts" },
    ],
    relatedProductSlugs: ["team-event-tee", "family-event-tee", "company-logo-tee"],
  },
  {
    slug: "custom-tshirts-for-corporate-teams",
    title: "Custom T-Shirts for Corporate Teams",
    excerpt: "Logo placement, colour choices, polos vs tees and how to plan a smooth corporate apparel order.",
    publishedAt: "2026-03-28",
    readingMinutes: 5,
    image: { src: "/images/blog/custom-tshirts-for-corporate-teams.webp", alt: "Corporate team T-shirts with a company logo" },
    tags: ["Corporate", "Bulk"],
    body: [
      { type: "p", text: "Branded apparel is one of the most visible things a company gives its team. A good corporate T-shirt is comfortable, on-brand and something people actually want to wear." },
      { type: "h2", text: "T-shirt or polo?" },
      { type: "p", text: "Crew-neck T-shirts suit offsites, launches, hackathons and casual Fridays. Polos look smarter for client-facing teams, events and uniforms." },
      { type: "h2", text: "Logo placement" },
      { type: "ul", items: ["Left chest: subtle and professional — the most popular choice.", "Centre chest: bolder, good for events and launches.", "Back: great for team names, event names or a tagline."] },
      { type: "h2", text: "Send print-ready files" },
      { type: "p", text: "Vector logos (SVG, AI, PDF) print sharpest. If you only have a PNG, send the largest version you have with a transparent background. Share your brand colour codes too." },
      { type: "h2", text: "Plan quantities by size" },
      { type: "p", text: "Collect sizes from your team before ordering. A size split usually looks like more M and L than S and XXL, but it varies — ask rather than assume." },
      { type: "tip", text: "Ordering for a larger team? Use the bulk quote form and include your deadline, colours and size split." },
    ],
    links: [
      { href: "/shop/corporate-t-shirts", label: "Corporate T-shirts" },
      { href: "/bulk-orders", label: "Request a bulk quote" },
      { href: "/custom-tshirt/corporate-t-shirts", label: "Preview your logo on a tee" },
    ],
    relatedProductSlugs: ["company-logo-tee", "bulk-corporate-polo", "custom-corporate-tee", "team-event-tee"],
  },
  {
    slug: "couple-tshirt-ideas",
    title: "Couple T-Shirt Ideas You'll Actually Wear",
    excerpt: "Subtle and fun couple T-shirt ideas — names, dates, split designs and matching colours.",
    publishedAt: "2026-02-10",
    readingMinutes: 4,
    image: { src: "/images/blog/couple-tshirt-ideas.webp", alt: "Matching couple T-shirts" },
    tags: ["Couples", "Ideas", "Gifting"],
    body: [
      { type: "p", text: "Couple T-shirts don't have to be loud. The best ones feel personal and still look good when worn separately." },
      { type: "h2", text: "Ideas that work" },
      { type: "ol", items: ["Both names with a small heart — the classic.", "Your anniversary date in simple numerals.", "Split designs: one tee says \"Partner\", the other \"In Crime\".", "Matching minimal marks on the chest with different colours.", "A photo from your first trip together on the back."] },
      { type: "h2", text: "Pick colours" },
      { type: "p", text: "Matching colours look coordinated in photos. One black and one white tee with the same design looks modern and is easier to wear separately." },
      { type: "h2", text: "Sizes" },
      { type: "p", text: "Add each tee to the cart separately so each person gets the right size. Check the size chart — unisex sizing can run larger for some people." },
    ],
    links: [
      { href: "/shop/couple-t-shirts", label: "Shop couple T-shirts" },
      { href: "/custom-tshirt/couple-t-shirts", label: "Design couple T-shirts" },
    ],
    relatedProductSlugs: ["couple-name-tee", "partner-quote-tee", "custom-couple-tee", "personalized-hoodie"],
  },
  {
    slug: "custom-gym-tshirts",
    title: "Custom Gym T-Shirts: Designs for Training and Teams",
    excerpt: "Motivation quotes, gym team tees and what to look for in a training T-shirt.",
    publishedAt: "2026-01-18",
    readingMinutes: 4,
    image: { src: "/images/blog/custom-gym-tshirts.webp", alt: "Gym T-shirts with motivation quotes" },
    tags: ["Fitness", "Ideas"],
    body: [
      { type: "p", text: "Gym T-shirts are part uniform, part motivation. Whether you are designing one for yourself or for a whole fitness studio, a few simple choices make a big difference." },
      { type: "h2", text: "Fit for training" },
      { type: "p", text: "A regular fit gives freedom of movement for most workouts. Oversized tees are popular for warm-ups and rest days. Avoid anything too tight across the shoulders." },
      { type: "h2", text: "Design ideas" },
      { type: "ul", items: ["A short motivation line: \"No Excuses\", \"One More Rep\".", "Your gym or running club name on the back.", "A personal goal or date — your first marathon, for example.", "A simple graphic like a dumbbell or crown mark."] },
      { type: "h2", text: "Colours" },
      { type: "p", text: "Black, grey and maroon hide sweat marks better than light colours. Bright colours are great for group runs where visibility matters." },
      { type: "tip", text: "Running a gym or studio? Team tees are a great way to build community — request a bulk quote." },
    ],
    links: [
      { href: "/shop/gym-t-shirts", label: "Shop gym T-shirts" },
      { href: "/bulk-orders", label: "Bulk quotes for gyms & clubs" },
    ],
    relatedProductSlugs: ["gym-quote-tee", "fitness-motivation-tee", "workout-graphic-tee"],
  },
  {
    slug: "how-to-choose-the-right-tshirt-size",
    title: "How to Choose the Right T-Shirt Size",
    excerpt: "Measure once, order right: how to use a size chart, what changes between fits and tips for kids and gifts.",
    publishedAt: "2025-12-20",
    readingMinutes: 4,
    image: { src: "/images/blog/how-to-choose-the-right-tshirt-size.webp", alt: "Measuring a T-shirt with a measuring tape" },
    tags: ["Fit guide"],
    body: [
      { type: "p", text: "The easiest way to get the right size is to measure a T-shirt you already love and compare it to the size chart." },
      { type: "h2", text: "How to measure" },
      { type: "ol", items: ["Lay your favourite tee flat on a table.", "Chest: measure straight across, 1 inch below the armholes, then double it.", "Length: measure from the highest point of the shoulder down to the hem.", "Compare with the size chart on the product page."] },
      { type: "h2", text: "Between two sizes?" },
      { type: "ul", items: ["Regular fit: pick the larger size for a relaxed feel, the smaller for a closer fit.", "Oversized: take your usual size for the full oversized look.", "Hoodies: take your usual size if you layer underneath."] },
      { type: "h2", text: "Kids sizes" },
      { type: "p", text: "Kids grow fast. If the tee is for everyday wear, going one size up is common. For a one-day event like a birthday, stick to the current size." },
      { type: "h2", text: "Buying as a gift" },
      { type: "p", text: "If you can, quietly check the size label on something they already wear. Unisex T-shirts are the most forgiving choice for gifts." },
    ],
    links: [
      { href: "/faq", label: "Read our FAQs" },
      { href: "/shop", label: "Shop all T-shirts" },
      { href: "/blog/oversized-vs-regular-fit", label: "Oversized vs regular fit" },
    ],
    relatedProductSlugs: ["minimal-graphic-tee", "black-oversized-graphic-tee", "kids-custom-tee"],
  },
];
