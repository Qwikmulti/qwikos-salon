import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma/client";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES } from "@/lib/utils/images";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = pageMeta({
  title: "Hair & Beauty Blog — Tips, Guides & Inspiration",
  description: "Expert hair care tips, styling guides, and beauty inspiration from the SalonOS team. Natural hair, braiding, color, and grooming advice for London.",
  path: "/blog",
  keywords: ["hair care tips London","box braids maintenance","balayage guide United Kingdom","natural hair tips","salon blog London"],
});

const categoryColors: Record<string, string> = {
  "Hair Care": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Color": "text-violet-400 bg-violet-400/10 border-violet-400/20",
  "Wellness": "text-sky-400 bg-sky-400/10 border-sky-400/20",
  "Men's Grooming": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Treatments": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Natural Hair": "text-green-400 bg-green-400/10 border-green-400/20",
};

async function getPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  const blogListJsonLD = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SalonOS Journal",
    description: "Expert hair care tips, styling guides, and beauty inspiration from the SalonOS team.",
    blogPost: posts.map(p => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.publishedAt?.toISOString(),
      url: `https://salonos.co.uk/blog/${p.slug}`,
    })),
  };

  const featured = posts[0];
  const recent = posts.slice(1);

  return (
    <main className="bg-charcoal min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLD) }}
      />

      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-30" />
        <div className="absolute inset-0 bg-card-gradient opacity-50" />
        <div className="max-w-5xl mx-auto relative">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">The Journal</p>
          <h1 className="font-display text-6xl text-white mb-4">SalonOS Blog</h1>
          <p className="font-body text-lg text-mist max-w-2xl">
            Expert tips, styling guides, and inspiration from our team.
          </p>
        </div>
      </section>

      {featured && (
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <Link href={`/blog/${featured.slug}`} className="group block relative rounded-2xl overflow-hidden">
              <Image
                src={featured.coverImageUrl ?? IMAGES.blog.braids}
                alt={featured.title}
                width={1200}
                height={600}
                className="w-full h-[500px] object-cover group-hover:scale-[1.02] transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="font-body text-xs uppercase tracking-widest text-gold mb-2">Featured</span>
                <h2 className="font-display text-4xl text-white mb-3 group-hover:text-gold transition-colors">
                  {featured.title}
                </h2>
                <p className="font-body text-mist mb-4 max-w-2xl line-clamp-2">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-ash">
                  <span>{featured.publishedAt?.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span>·</span>
                  <span>{featured.tags.join(", ")}</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-heading text-xl text-white mb-6">Recent Posts</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-graphite border border-ash/30 rounded-xl overflow-hidden hover:border-gold/30 transition-all">
                <div className="relative h-48">
                  <Image src={post.coverImageUrl ?? IMAGES.blog.braids} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="font-body text-xs text-mist mb-2">
                    {post.publishedAt?.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <h4 className="font-heading text-lg text-white mb-2 group-hover:text-gold transition-colors">
                    {post.title}
                  </h4>
                  <p className="font-body text-xs text-mist line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}