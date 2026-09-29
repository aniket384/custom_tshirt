import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * Images: all catalogue imagery is served locally from /public/images so the
 * prototype never depends on third-party hosts. When product media moves to a
 * CDN / DAM (Cloudinary, S3 + CloudFront, Shopify CDN...), add the host to
 * `images.remotePatterns` instead of disabling optimisation.
 */
const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller on mobile), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Keep the srcset list short: fewer variants = better CDN cache hit rate.
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [70, 75, 85],
  },

  // Small security / hygiene headers. Extend with a CSP once third-party
  // scripts (payments, analytics) are decided.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
