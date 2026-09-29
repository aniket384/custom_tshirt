# Custom T-Shirt Wala — Storefront Prototype

Frontend e-commerce prototype for **Custom T-Shirt Wala** ("Apna Design Apni Style") — custom and printed T-shirts, hoodies, couple/family/kids/gym/corporate apparel and bulk orders. Based in Datia, Madhya Pradesh, with delivery across India.

> **Prototype status:** every product, price, order, testimonial and payment in this app is demo data. No real payments, authentication, database, shipping or uploads are connected. See [`docs/BACKEND-INTEGRATION.md`](docs/BACKEND-INTEGRATION.md) for how to connect them.

## Tech stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4** (design tokens in `src/app/globals.css`)
- `next/image` (AVIF/WebP) and `next/font` (self-hosted Google fonts)
- No UI framework, state library or animation library. Client state uses a small `useSyncExternalStore` store.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_SITE_URL etc.
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | Generates route types, then runs `tsc --noEmit` |
| `npm run images:generate` | Regenerates the placeholder product and marketing images |

## Project structure

```
src/
├── app/                      # Routes (App Router). Each folder = a URL.
│   ├── layout.tsx            # Fonts, header/footer, site-wide JSON-LD
│   ├── page.tsx              # Homepage
│   ├── shop/                 # /shop and /shop/[category]
│   ├── product/[slug]/       # Product detail page
│   ├── custom-tshirt/        # T-shirt customiser + /custom-tshirt/[category] landing pages
│   ├── collections/          # /collections and /collections/[slug]
│   ├── cart, checkout, wishlist, account/, track-order/   (noindex)
│   ├── bulk-orders, about, contact, faq, blog/, policy pages
│   ├── sitemap.ts, robots.ts, manifest.ts
│   └── feeds/google-merchant.xml/   # Merchant Center feed (demo)
├── components/
│   ├── layout/               # SiteHeader, Footer, Logo, AnnouncementBar, ContentPage
│   ├── navigation/           # DesktopNavigation, MobileNavigation, SearchDialog, Breadcrumbs
│   ├── home/                 # Homepage sections (Hero, CustomiseFeature, ...)
│   ├── product/              # ProductCard, ProductGrid, ProductGallery, selectors, PDP panel
│   ├── ecommerce/            # Filters, sort, wishlist/quick-add buttons, category cards
│   ├── cart/                 # CartDrawer, CartLineItem, OrderSummary, CouponForm
│   ├── checkout/             # CheckoutForm (demo)
│   ├── customizer/           # CustomTshirtEditor, TshirtPreview, UploadDesign, controls
│   ├── account/              # Orders, OrderTimeline, profile, tracking
│   ├── blog/, forms/, seo/ (JsonLd), ui/ (icons, Drawer, Section, FAQAccordion...)
├── config/                   # site.ts (brand facts + env), navigation.ts
├── data/                     # Editable mock content: products, categories, collections,
│                             # customiser options, blog posts, FAQs, policies
└── lib/
    ├── commerce/             # Catalog service, pricing, orders, checkout, delivery,
    │                         # facets, merchant feed, types  ← swap for real APIs here
    ├── seo/                  # buildMetadata() + JSON-LD builders
    ├── store/                # Cart, wishlist, recently viewed, toast (localStorage)
    ├── analytics/track.ts    # trackEvent() abstraction
    ├── uploads/upload.ts     # Upload validation + mock upload
    └── utils/                # formatting, sanitising
scripts/generate-placeholder-images.mts   # draws demo images with sharp
docs/                                     # SEO, performance, agent-browsing, backend guides
```

### Where to change things

| I want to... | Edit |
| --- | --- |
| Change brand facts, WhatsApp, email, logo | `src/config/site.ts` + `.env.local` |
| Change the menu or footer links | `src/config/navigation.ts` |
| Add or edit products | `src/data/products.ts` (then `npm run images:generate` for demo images) |
| Edit categories or collections | `src/data/categories.ts`, `src/data/collections.ts` |
| Change customiser options or prices | `src/data/customizer.ts` |
| Edit homepage copy, FAQs, announcements | `src/data/content.ts` |
| Change colours or fonts | `src/app/globals.css` (`@theme`) and `src/app/layout.tsx` |
| Connect a real backend | `src/lib/commerce/*` — see `docs/BACKEND-INTEGRATION.md` |

### Replacing the logo and images

- **Logo:** add `/public/brand/logo.svg` (or `.png`) and set `siteConfig.logo.src`.
- **Product photos:** keep the paths `public/images/products/<slug>/front-<color>.webp`, `back.webp`, `model.webp`, `detail.webp` and `closeup.webp`, or change `buildImages()` in `src/lib/commerce/catalog.ts`. Use a 4:5 ratio.
- **Instagram grid:** update `instagramPosts` in `src/data/content.ts`. Do not hotlink Instagram.

## Honesty rules (please keep)

- Do not invent a phone number, address, GST number, delivery times, return windows, ratings, reviews or order counts. Unknown values stay `null` and the UI hides them.
- Sample testimonials are labelled as samples and are never marked up as `Review` schema.
- `gtin` / `mpn` stay `null` until real identifiers exist.

## Docs

- [`docs/SEO-CHECKLIST.md`](docs/SEO-CHECKLIST.md)
- [`docs/PERFORMANCE-CHECKLIST.md`](docs/PERFORMANCE-CHECKLIST.md)
- [`docs/AGENT-BROWSING.md`](docs/AGENT-BROWSING.md)
- [`docs/BACKEND-INTEGRATION.md`](docs/BACKEND-INTEGRATION.md)
