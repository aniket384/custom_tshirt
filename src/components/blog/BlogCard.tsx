/** Blog listing card. */
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { formatDate } from "@/lib/utils/format";

export function BlogCard({ post, eager = false, headingLevel = "h2" }: { post: BlogPost; eager?: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <Image src={post.image.src} alt={post.image.alt} width={1200} height={750} loading={eager ? "eager" : "lazy"} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw" className="aspect-[16/10] w-full rounded-card bg-surface object-cover" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} min read
        </p>
        <Heading className="mt-2 text-xl font-semibold leading-snug group-hover:underline underline-offset-4">{post.title}</Heading>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>
      </Link>
    </article>
  );
}
