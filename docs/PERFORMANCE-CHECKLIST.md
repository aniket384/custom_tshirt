# Performance Checklist (Core Web Vitals)

Targets: LCP ≤ 2.5 s, INP < 200 ms, CLS < 0.1 — for mid-range Android on slow 4G.

## Implemented
- [x] Server Components by default. Client islands only for: header actions, drawers, wishlist/quick-add buttons, filters/sort, PDP purchase panel + gallery, customiser, cart/checkout/account forms.
- [x] Filtering, sorting and search run on the server → no catalogue JSON shipped to the browser. The header search index is a small list of names/URLs.
- [x] State via a tiny `useSyncExternalStore` store (no Redux/Zustand); only subscribed components re-render.
- [x] `next/image` everywhere with explicit width/height or fixed aspect boxes → no image CLS. AVIF/WebP, short `deviceSizes`, tight `sizes` hints.
- [x] LCP image preloaded: homepage hero, PDP main image, first row of listing cards, blog cover.
- [x] Below-the-fold images lazy-load (default). Hover images lazy.
- [x] `next/font` self-hosted fonts with `display: swap` and size-adjusted fallbacks. Brush font not preloaded.
- [x] No animation library; CSS transitions only; `prefers-reduced-motion` respected globally.
- [x] No third-party scripts. Analytics is a no-op abstraction until configured.
- [x] Filter/sort navigation wrapped in `useTransition` → responsive input (INP).
- [x] **No `loading.tsx` on static routes.** A route-level `loading.tsx` streams a skeleton first and swaps content in after; on static pages this caused CLS 0.654 (footer jump) and a late LCP. Only `/search` keeps one.

## Measured (Lighthouse 12, mobile preset with simulated slow 4G, local `next start`, 2026-09-29)

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 93 | 100 | 100 | 100 | 3.1 s | 0 | 30 ms |
| `/shop` | 92 | 100 | 100 | 100 | 3.3 s | 0 | 30 ms |
| `/shop/hoodies` | 94 | 100 | 100 | 100 | 3.0 s | 0 | 20 ms |
| `/product/black-oversized-graphic-tee` | 94 | 100 | 100 | 100 | 3.0 s | 0 | 20 ms |
| `/custom-tshirt` | 95 | 100 | 100 | 100 | 2.9 s | 0 | 20 ms |
| `/collections/best-sellers` | 94 | 100 | 100 | 100 | 3.0 s | 0 | 20 ms |
| `/bulk-orders` | 97 | 100 | 100 | 100 | 2.5 s | 0 | 10 ms |
| `/blog/oversized-vs-regular-fit` | 95 | 100 | 100 | 100 | 3.0 s | 0 | 20 ms |

These are lab numbers, not field data. Simulated LCP is above the 2.5 s target on most pages. Unthrottled local runs observed LCP of 60–712 ms. Tried without improvement (reverted): `font-display: optional`, `experimental.inlineCss`. Measured before the real logo was added — re-measure.

## Before launch
- [ ] Re-run Lighthouse on the deployed site (real CDN, HTTP/2/3, image cache warm).
- [ ] Collect field data (CrUX / Vercel Speed Insights / `web-vitals`) — only field data proves CWV.
- [ ] Real photography: export at 4:5, ≤ 1600 px, let `next/image` serve AVIF.
- [ ] Load any analytics/chat/payment script with `next/script` `afterInteractive` or `lazyOnload`, only on pages that need it (Razorpay only on `/checkout`).
- [ ] If adding a backend, keep product/listing pages static or cached (`revalidate` / `"use cache"`); add `loading.tsx` only where data is genuinely slow.
- [ ] Investigate remaining simulated LCP (JS chunk chain ~200 KB); consider trimming client islands on listing pages.
