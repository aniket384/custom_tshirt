/** /blog/[slug] — article with BlogPosting + BreadcrumbList JSON-LD. */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { BlogCard } from "@/components/blog/BlogCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/config/site";
import { getProductsBySlugs } from "@/lib/commerce/catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd, graph } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    image: { src: post.image.src, alt: post.image.alt, width: 1200, height: 750 },
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  const products = await getProductsBySlugs(post.relatedProductSlugs);
  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <article className="container-page py-8 md:py-12">
        <Breadcrumbs items={crumbs} />
        <header className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} min read · By the {siteConfig.name} team
          </p>
          <h1 className="heading-display mt-4 text-5xl md:text-6xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
        </header>
        <Image src={post.image.src} alt={post.image.alt} width={1200} height={750} preload sizes="(min-width: 1024px) 64rem, 100vw" className="mx-auto mt-10 aspect-[16/10] w-full max-w-5xl rounded-card bg-surface object-cover" />
        <div className="mx-auto mt-10 max-w-2xl">
          <ArticleBody blocks={post.body} />
          <nav aria-label="Related pages" className="mt-12 rounded-card bg-ink p-6 text-white on-dark">
            <h2 className="heading-display text-2xl text-brand">Keep exploring</h2>
            <ul className="mt-3 space-y-1">
              {post.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-10 items-center font-semibold underline underline-offset-4">
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </article>

      {products.length > 0 && (
        <section aria-labelledby="shop-post-h" className="container-page py-10">
          <h2 id="shop-post-h" className="heading-display mb-6 text-3xl">
            Shop the article
          </h2>
          <ProductGrid products={products} label="Products mentioned in this article" />
        </section>
      )}

      <section aria-labelledby="more-h" className="container-page py-12">
        <h2 id="more-h" className="heading-display mb-6 text-3xl">
          More from the blog
        </h2>
        <ul className="grid gap-8 md:grid-cols-3">
          {more.map((p) => (
            <li key={p.slug}>
              <BlogCard post={p} headingLevel="h3" />
            </li>
          ))}
        </ul>
      </section>
      <JsonLd data={graph(articleJsonLd(post), breadcrumbJsonLd(crumbs))} />
    </>
  );
}
