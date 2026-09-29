/**
 * /feeds/google-merchant.xml — Google Merchant Center product feed (RSS 2.0).
 * Built at build time from the catalogue. DEMO DATA: do not submit to
 * Merchant Center until real images, prices and policies are in place.
 */
import { siteConfig } from "@/config/site";
import { getAllProducts } from "@/lib/commerce/catalog";
import { merchantFeedXml, toMerchantItems } from "@/lib/commerce/merchant-feed";

export const dynamic = "force-static";

export async function GET() {
  const items = toMerchantItems(await getAllProducts());
  return new Response(merchantFeedXml(items, siteConfig.name, siteConfig.url), {
    headers: { "Content-Type": "application/xml; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
