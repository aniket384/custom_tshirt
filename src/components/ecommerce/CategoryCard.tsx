/**
 * Image tile linking to a category / collection / moment.
 * Text is real HTML over the image (never baked into the picture).
 */
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/format";
import { ArrowRightIcon } from "@/components/ui/icons";

interface CategoryCardProps {
  href: string;
  title: string;
  image: string;
  alt?: string;
  description?: string;
  sizes?: string;
  aspect?: "portrait" | "square" | "landscape";
  className?: string;
}

export function CategoryCard({
  href,
  title,
  image,
  alt = "",
  description,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  aspect = "portrait",
  className,
}: CategoryCardProps) {
  const ratio = { portrait: "aspect-[4/5]", square: "aspect-square", landscape: "aspect-[16/10]" }[aspect];
  return (
    <Link href={href} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden rounded-card bg-surface", ratio)}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4 pt-12 text-white">
          <h3 className="heading-display text-2xl md:text-3xl">{title}</h3>
          {description && <p className="mt-1 line-clamp-2 text-sm text-white/85">{description}</p>}
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand">
            Explore <ArrowRightIcon size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Collection card — same visual language, reused on /collections. */
export { CategoryCard as CollectionCard };
