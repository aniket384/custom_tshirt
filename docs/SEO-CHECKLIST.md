# SEO Checklist

What is implemented, and what to do before launch.

## Implemented

### Metadata (`src/lib/seo/metadata.ts`)
- [x] Every page builds metadata through `buildMetadata()`: a unique title and description, a canonical URL, Open Graph tags and Twitter/X tags.
- [x] The title template is `%s | Custom T-Shirt Wala`. The homepage uses an absolute title.
- [x] The canonical URL is always the clean path without query parameters. Filtered, sorted, UTM-tagged and `?variant=` URLs therefore consolidate to one URL.
- [x] Filtered or sorted listing URLs get `noindex, follow`.
- [x] These pages are always `noindex, follow`: `/cart`, `/checkout`, `/wishlist`, `/account/**`, `/search`, `/track-order`.
- [x] Set `NEXT_PUBLIC_DISALLOW_INDEXING=true` on staging to noindex everything and disallow all paths in robots.txt.

### Crawlability
- [x] All navigation uses real `<a href>` links. Menus, filters, category tiles and product cards work without JavaScript.
- [x] Filters are GET forms rendered on the server, so every filtered result is HTML.
- [x] `/sitemap.xml` lists the homepage, shop, categories, collections, customiser landing pages, products (with images), blog posts and content pages. Private pages and query URLs are left out.
- [x] `/robots.txt` disallows private paths and `utm_`, `sort=` and `variant=` query URLs, and points to the sitemap.

### Structured data (`src/lib/seo/jsonld.ts`)

Each entity is rendered once per page:

| Page | JSON-LD |
| --- | --- |
| Every page (root layout) | `Organization` + `WebSite` (with `SearchAction`) |
| Category / collection / shop | `BreadcrumbList` + `ItemList` |
| Product | `ProductGroup` with a `hasVariant` `Product` per SKU, each with an `Offer`, plus `BreadcrumbList` |
| Blog post | `BlogPosting` + `BreadcrumbList` |
| `/faq` only | `FAQPage` + `BreadcrumbList` |
| Other content pages | `BreadcrumbList` |

- [x] No `AggregateRating` or `Review` is emitted because no verified reviews exist. The builder accepts verified data later.
- [x] No GTIN or MPN values are invented. The Organization entity has no street address or phone number.
- [x] Prices and availability come from the same data that the page shows.

### Content and internal links
- [x] Unique H1 and SEO intro on each category and collection page.
- [x] Homepage links to categories, collections, the customiser and bulk orders.
- [x] Categories link to products and to other categories.
- [x] Product pages link to their category, a collection and related products.
- [x] Blog posts link to categories, products and the customiser.
- [x] The bulk orders page links to corporate products.
- [x] Collections never duplicate a category 1:1 (for example, "Couples" links to `/shop/couple-t-shirts`).
- [x] Eight useful blog articles are stored as structured blocks, not HTML strings.
- [x] Every product image has alt text generated from the product name, colour and view.

### Merchant Center readiness
- [x] `src/lib/commerce/merchant-feed.ts` maps each variant to Merchant Center fields: `id`, `item_group_id`, `title`, `description`, `link`, `image_link`, `additional_image_link`, `availability`, `price`/`sale_price`, `brand`, `condition`, `color`, `size`, `gender`, `age_group` and `material`.
- [x] `identifier_exists: no` is set while GTIN and MPN are unknown.
- [x] A demo feed is served at `/feeds/google-merchant.xml`. **Do not submit it**: it uses placeholder images and demo prices.

## Before launch (manual)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain.
- [ ] Replace placeholder images with real photography, keeping the 4:5 ratio and descriptive alt text.
- [ ] Confirm product materials. They are marked "(placeholder — confirm with supplier)".
- [ ] Replace the size chart with real measurements.
- [ ] Write and legally review the shipping, returns, privacy and terms pages. Sections marked "Placeholder" need confirmation.
- [ ] Connect verified reviews, then pass them to `productGroupJsonLd()`.
- [ ] Verify the site in Google Search Console and submit the sitemap. The site verification token goes in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- [ ] Validate key templates in the Rich Results Test and the Schema Markup Validator.
- [ ] Add the real logo and a real Open Graph image (1200×630) at `siteConfig.ogImage`.
- [ ] Set up Merchant Center shipping and return settings before submitting the feed.
