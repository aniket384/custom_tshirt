/** /blog — article index. */
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BlogCard } from "@/components/blog/BlogCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPosts } from "@/data/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, graph } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Blog — Custom T-Shirt Ideas, Guides & Size Tips",
  description: "Ideas and guides for custom T-shirts: birthday and couple T-shirt ideas, how to design a custom tee, choosing sizes and fits, and planning event and corporate orders.",
  path: "/blog",
});

export default function BlogIndex() {
  const posts = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
  ];
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={crumbs} />
      <h1 className="heading-display mt-5 text-5xl md:text-6xl">The Blog</h1>
      <p className="mt-3 max-w-2xl text-muted md:text-lg">Ideas, how-tos and sizing help for custom and printed T-shirts.</p>
      <ul className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <li key={p.slug}>
            <BlogCard post={p} eager={i < 2} />
          </li>
        ))}
      </ul>
      <JsonLd data={graph(breadcrumbJsonLd(crumbs))} />
    </div>
  );
}
