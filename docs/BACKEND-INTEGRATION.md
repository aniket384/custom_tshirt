# Backend Integration Guide

The prototype keeps every data source behind a small module in `src/lib`. To go live, replace the implementation inside each module and keep the exported function signatures. Components and pages should not need to change.

> **Rule:** the server is the source of truth for prices, stock, discounts and totals. Client-side calculations exist only for instant UI feedback. Always re-validate and re-price on the server.

## 1. Mock products → catalogue API

**Today:** `src/data/products.ts` holds seed data. `src/lib/commerce/catalog.ts` normalises it into `Product` objects with variants, SKUs and images.

**Replace with:** Shopify Storefront API, Medusa, Saleor, a headless CMS or your own API.

1. Keep the types in `src/lib/commerce/types.ts`. Write a `mapApiProduct(api) → Product` function.
2. Reimplement `getAllProducts`, `getProductBySlug`, `getProductsInCategory`, `getProductsInCollection`, `searchProducts` and the others in `catalog.ts`. They are already `async`.
3. Add caching: Next.js `fetch` with `next: { revalidate, tags }` or `"use cache"`. Call `revalidateTag('products', 'max')` from a webhook when products change.
4. `generateStaticParams` in `app/product/[slug]` keeps working. For large catalogues, remove `dynamicParams = false` so new products render on demand.
5. Move search to Algolia, Meilisearch or Typesense by changing only `searchProducts()`.
6. Fill `gtin` and `mpn` only with real identifiers.
7. Delete `art` from the seed data and `scripts/generate-placeholder-images.mts` once real photography exists.

## 2. Cart persistence

**Today:** `src/lib/store/cart.ts` stores lines in localStorage (`ctw.cart.v1`).

**Replace with a server cart:**
1. Create a cart on the first add (`POST /api/cart`). Store the cart ID in an httpOnly cookie.
2. In each `cartActions.*` method, call the API optimistically, then reconcile with the server response. The prices the server returns win.
3. Keep the local store as a UI cache so the header count renders instantly.
4. On login, merge the guest cart into the customer cart.

## 3. Checkout and payments (Razorpay)

**Today:** `src/lib/commerce/checkout.ts` has `placeDemoOrder()` and a `PaymentProvider` interface. The demo provider always succeeds and never collects card data.

**Razorpay flow:**
1. Add a server action or route `POST /api/checkout`. It validates the address and contact details, re-prices the cart from the catalogue and creates the order in your DB with status `pending_payment`.
2. The same route creates a Razorpay Order: `amount` in **paise** (rupees × 100), `currency: "INR"`, `receipt: orderId`. It returns `{ razorpayOrderId, keyId, amount }`. Keep `RAZORPAY_KEY_SECRET` server-only.
3. The client loads `checkout.razorpay.com/v1/checkout.js` lazily with `next/script` on the checkout page only, then opens it with the order ID.
4. On success, POST `razorpay_payment_id`, `razorpay_order_id` and `razorpay_signature` to `/api/checkout/verify`. Verify the HMAC signature on the server, then mark the order `paid`.
5. Also handle the `payment.captured` and `payment.failed` **webhooks**, since the client callback can be lost.
6. Cash on delivery: skip the payment step, create the order as `cod_pending` and apply any COD rules (pincode eligibility, limits) on the server.
7. Implement `PaymentProvider` for Razorpay and pass it to `placeDemoOrder` (rename it to `placeOrder`).

## 4. Authentication

**Today:** there is no auth. `/account` reads demo orders from localStorage, and the profile is saved locally.

**Replace with:** Auth.js (NextAuth), Clerk, Supabase Auth, Firebase, or Shopify customer accounts. Phone OTP is common for Indian D2C stores.
1. Protect `/account/**` in `src/proxy.ts` (Next 16 renamed `middleware` to `proxy`) or in the account layout on the server.
2. Replace `useDemoOrders()` in `components/account/AccountClient.tsx` with a server fetch of the customer's orders.
3. Store the profile in the DB. Remove `profileStore`.

## 5. Order tracking

**Today:** `trackOrder()` in `src/lib/commerce/orders.ts` matches local demo orders, or returns a clearly labelled *sample* timeline.

**Replace with:** `POST /api/track` that looks up the order by ID and verifies the phone or email. Rate-limit this endpoint. Merge shipping events from the courier or aggregator API (Shiprocket, Delhivery...) into `OrderEvent[]`. `OrderTimeline` renders any `OrderStatus` with timestamps.

## 6. Uploads (custom designs)

**Today:** `src/lib/uploads/upload.ts` validates type (PNG, JPG, WEBP, SVG) and size (≤ 10 MB) and simulates progress. Previews use `URL.createObjectURL`. Only the file **name** is stored on the cart line (`custom.uploadedFileName`). No image data goes into localStorage.

**Replace with:**
1. `POST /api/uploads/sign` returns a pre-signed S3 or R2 PUT URL, or Cloudinary signed parameters. Validate the MIME type, extension and size on the server too.
2. Upload directly from the browser with progress (XHR `upload.onprogress`). Return the permanent URL and store it in `custom.uploadedFileUrl`.
3. **Sanitise SVGs** on the server (for example, DOMPurify in a worker) or rasterise them before print. The client only ever renders uploads through `<img>`, which does not execute scripts.
4. Optionally save the preview transform (`design.x`, `design.y`, `design.scale`) and text settings for the print team. They are in the builder state (`components/customizer/types.ts`).
5. Scan uploads for malware if your storage provider supports it.

## 7. Delivery / pincode lookup

**Today:** `checkDelivery()` in `src/lib/commerce/delivery.ts` validates the pincode format and returns a generic "we deliver across India" message. It **never** returns an ETA.

**Replace with:** a server call to your shipping aggregator's serviceability API. Return COD availability and a real estimated delivery date only once it is confirmed.

## 8. Reviews

**Today:** there are no reviews. `ReviewSection` shows an honest empty state on product pages, plus labelled sample testimonials on the homepage.

**Replace with:** Judge.me, Yotpo or your own DB of **verified** reviews.
1. Fetch the reviews on the product page (server) and render them in `ReviewSection`.
2. Pass the same data to `productGroupJsonLd(product, reviews)`. It then emits `aggregateRating` and `review`. Never mark up the homepage samples.

## 9. Bulk quotes

**Today:** `submitBulkQuote()` in `src/lib/commerce/quotes.ts` simulates success. Nothing is sent anywhere.

**Replace with:** a server action that re-validates the input, stores the lead (DB, CRM, Google Sheet), uploads the design file (see §6) and sends a notification email or WhatsApp message. Add spam protection (honeypot or Turnstile) and rate limiting.

## 10. Analytics

`trackEvent()` in `src/lib/analytics/track.ts` pushes to `window.dataLayer` if one exists. To go live, load GTM or GA4 with `next/script` using `strategy="afterInteractive"`, then get consent where required. Event names already follow the GA4 e-commerce conventions.

## Environment variables

See `.env.example`. Only `NEXT_PUBLIC_*` values reach the browser. Payment, storage and shipping secrets must stay server-only.
