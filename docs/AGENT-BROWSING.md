# Agentic Browsing & AI-Shopping Readiness

This storefront is built so that automated agents (browser agents, AI shopping assistants and crawlers) can understand and operate it through its HTML alone, without relying on visuals.

## Principles applied

| Principle | How |
| --- | --- |
| Real links | Every destination is an `<a href>`: nav, product cards, categories, breadcrumbs, cart and checkout. The cart icon is a link to `/cart`. JavaScript only adds the drawer on top. |
| Real forms | Search, filters and sort are GET forms (`/search?q=`, `/shop?size=M,L&sort=price-asc`). Checkout, the bulk quote, order tracking and the customiser are `<form>` elements with a submit button. |
| Real controls | Colours, sizes, placements and styles are native radio groups. Quantity is `<input type="number">` with +/- buttons. Accordions use `<details>`. Dialogs use `<dialog>`. |
| Visible text | Name, price, MRP, discount, colours, availability, selected variant and cart contents are all text. Nothing important exists only in an image, tooltip, hover state or canvas. |
| Explicit labels | Examples: "Add Black Oversized Graphic Tee, Black / L, to cart", "Select size XL", "Size XXL — out of stock", "Remove uploaded design design.png", "Upload Your Design", "Request Bulk Quote", "Place Demo Order — ₹1,598". |
| Stable URLs | `/product/<slug>`, `/shop/<category>`, `/collections/<slug>`, `/custom-tshirt/<use-case>`. A specific variant can be deep-linked with `/product/<slug>?variant=<variant-id>`. |
| Structured data | Product pages expose `ProductGroup` → variant `Product` → `Offer` (price, currency, availability) in JSON-LD, generated from the same data as the page. |
| State announced | Cart count is in the cart link's accessible name ("Cart, 2 items"). Toasts, upload progress, price estimates and the customiser preview summary use live regions. |

## Common tasks for an agent

| Question | Where to look |
| --- | --- |
| What products exist? | `/shop` (all, server-rendered), `/sitemap.xml`, or the `ItemList` JSON-LD on listing pages |
| What is this product, and what does it cost? | `<h1>`, the "Price:" text and the `ProductGroup` JSON-LD on `/product/<slug>` |
| What variants exist? | The colour and size radio groups (out-of-stock sizes are `disabled` and labelled) and `hasVariant` in JSON-LD |
| Which size is selected? | The legend text "Size: L" and the checked radio input |
| What is in the cart? | `/cart`: each line is an `<article>` with colour, size, unit price and quantity as `<dl>` text |
| How do I check out? | Follow the "Proceed to Checkout" link → `/checkout` → fill the labelled fields → "Place Demo Order" |
| How do I submit a customisation? | `/custom-tshirt`: steps 1–10 are headed sections. Choose radios, upload via `#design-file`, type into `#ct-name` / `#ct-custom` / `#ct-quote`, then press "Add Custom T-Shirt to Cart". The preview has a screen-reader text summary. |
| How do I request a bulk quote? | The `/bulk-orders#quote` form → "Request Bulk Quote" |
| How do I track an order? | `/track-order`: fill Order ID + phone/email, then read the ordered-list timeline (`aria-current="step"` marks the current status) |

## Rules for future changes

1. Never replace a link with `<div onClick>`. Use `<Link>` or `<a>`.
2. Put any new purchase-critical information in visible text first, and in JSON-LD second.
3. Give every new control an accessible name that includes the product or object it acts on.
4. Keep new filters as query parameters on a GET form, rendered on the server.
5. Don't render purchase-critical content only after client-side fetching.
6. Run the axe or Lighthouse accessibility audit after UI changes. The current score is 100 on all measured templates (see `PERFORMANCE-CHECKLIST.md`).
