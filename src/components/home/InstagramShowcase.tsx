/**
 * Instagram-inspired grid using LOCAL placeholder images (no scraping or
 * hotlinking). Swap `instagramPosts` in data/content.ts for exported posts,
 * CMS media or the official Instagram API later.
 */
import Image from "next/image";
import { instagramPosts } from "@/data/content";
import { siteConfig } from "@/config/site";
import { buttonClass } from "@/components/ui/button-styles";
import { InstagramIcon } from "@/components/ui/icons";

export function InstagramShowcase() {
  return (
    <div>
      <ul className="grid grid-cols-3 gap-1.5 md:grid-cols-6 md:gap-3">
        {instagramPosts.map((p) => (
          <li key={p.id}>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-lg"
            >
              <Image src={p.image} alt={p.alt} width={800} height={800} sizes="(min-width: 768px) 16vw, 33vw" className="aspect-square w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
              <span className="sr-only">(opens Instagram in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={buttonClass("dark", "lg")}>
          <InstagramIcon /> See More on Instagram<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
