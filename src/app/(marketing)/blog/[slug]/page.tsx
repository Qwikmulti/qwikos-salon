import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button }   from "@/components/ui/button";
import { pageMeta, JSON_LD, BASE_URL } from "@/lib/seo/metadata";
import { IMAGES }   from "@/lib/utils/images";
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight } from "lucide-react";

const POSTS: Record<string, {
  title: string; excerpt: string; author: string; authorRole: string; authorImg: string;
  date: string; readTime: string; category: string; tags: string[];
  coverImg: string; content: string[];
}> = {
  "how-to-maintain-box-braids": {
    title: "How to Maintain Box Braids for 8+ Weeks",
    excerpt: "Our lead braiding specialist Fatima shares her top secrets for keeping your protective style fresh, moisturised, and tangle-free from week one to week eight.",
    author: "Fatima Hassan", authorRole: "Lead Braiding Specialist", authorImg: IMAGES.stylists.fatima,
    date: "April 14, 2026", readTime: "5 min", category: "Hair Care",
    tags: ["Braiding","Protective Styles","Maintenance","Natural Hair"],
    coverImg: IMAGES.blog.braids,
    content: [
      "Box braids are one of the most versatile and long-lasting protective styles — but only if you care for them properly. At SalonOS, we've helped thousands of clients keep their braids looking salon-fresh for the full duration. Here's everything you need to know.",
      "## Keep Your Scalp Moisturised",
      "The biggest mistake most people make is neglecting their scalp once the braids are in. Use a lightweight oil — jojoba or sweet almond work beautifully — and apply it directly to your scalp every 2–3 days. Focus on the parts and hairline where dryness shows first.",
      "## Sleep with a Satin Scarf or Bonnet",
      "Cotton pillowcases are the enemy of braids. They cause friction and absorb the moisture from your hair overnight. A satin or silk bonnet takes 10 seconds to put on and will make your braids last weeks longer. This single change makes a dramatic difference.",
      "## Refresh the Edges",
      "Your edges will show wear before the rest of the braids do. Use a light edge control to lay them down after washing your face or working out. Don't over-do it — product buildup along the hairline can cause thinning and tension over time.",
      "## How to Wash Your Braids",
      "Yes, you can — and should — wash your braids every 2 weeks. Fill a spray bottle with diluted shampoo (1 part shampoo, 3 parts water) and apply it section by section, massaging your scalp gently. Rinse thoroughly, then follow with a lightweight leave-in conditioner applied to the scalp.",
      "## Know When to Take Them Down",
      "Eight weeks is generally the maximum for most braid styles. Beyond that, the hair shed during the style's wear gets matted into the base of the braids and can cause unnecessary tension and breakage when removed. Taking them down on time is one of the most important forms of care.",
    ],
  },
  "balayage-vs-highlights": {
    title: "Balayage vs. Highlights: Which is Right for You?",
    excerpt: "Breaking down the key differences between balayage, traditional foil highlights, and babylights — so you can walk into your appointment with total confidence.",
    author: "Amara Diallo", authorRole: "Senior Colorist", authorImg: IMAGES.stylists.amara,
    date: "April 8, 2026", readTime: "4 min", category: "Color",
    tags: ["Color","Balayage","Highlights","Hair Color"],
    coverImg: IMAGES.blog.color,
    content: [
      "If you've ever sat in a consultation trying to explain what you want and ended up with something completely different, this guide is for you. Understanding the difference between balayage and highlights means you'll walk into your next color appointment with complete confidence.",
      "## What is Balayage?",
      "Balayage (from the French word meaning 'to sweep') is a freehand coloring technique where color is painted directly onto the hair in sweeping strokes. The result is a sun-kissed, naturally graduated look — darker at the roots, lighter toward the ends. Because it's freehand, no two balayage results are identical.",
      "## What are Traditional Highlights?",
      "Foil highlights involve sectioning the hair and wrapping each section in foil with bleach or color. This creates a more uniform, all-over lightness and tends to be brighter and more evenly distributed than balayage. The regrowth line is more visible, requiring touch-ups every 8–12 weeks.",
      "## The Maintenance Difference",
      "This is where balayage really shines. Because the color starts below the roots, regrowth is barely noticeable. Most clients return every 4–6 months, compared to every 8–12 weeks for foil highlights. For a busy London lifestyle, the lower maintenance of balayage is often the deciding factor.",
      "## Which One Should You Choose?",
      "Choose balayage if you want a natural, sun-kissed look that grows out gracefully and requires fewer salon visits. Choose highlights if you want brighter, more dramatic, consistent lightness throughout the hair. When in doubt, book a consultation — our colorists will assess your natural color, texture, and lifestyle to find the perfect approach.",
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: "Post Not Found" };
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.coverImg,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const articleJsonLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImg,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author, jobTitle: post.authorRole },
    publisher: { "@type": "Organization", name: "SalonOS", url: BASE_URL },
    url: `${BASE_URL}/blog/${slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <Script id="schema-article" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLD) }} />
      <Script id="schema-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.breadcrumb([
          { name:"Home",  url: BASE_URL },
          { name:"Blog",  url: `${BASE_URL}/blog` },
          { name: post.title, url: `${BASE_URL}/blog/${slug}` },
        ])) }} />

      {/* Hero — full bleed cover */}
      <section className="relative h-[65vh] min-h-[460px] flex items-end overflow-hidden bg-obsidian">
        <Image src={post.coverImg} alt={post.title} fill priority
          className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/10" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-14 w-full">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-1 text-silver/70 hover:text-pearl">
            <Link href="/blog"><ArrowLeft className="h-4 w-4" /> Back to Journal</Link>
          </Button>

          <span className="inline-block font-body text-2xs px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-light uppercase tracking-widest mb-5">
            {post.category}
          </span>

          <h1 className="font-display text-4xl md:text-6xl font-light text-white leading-[1.05] mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <Image src={post.authorImg} alt={post.author} width={40} height={40} className="object-cover object-top" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-pearl">{post.author}</p>
                <p className="font-body text-xs text-mist">{post.authorRole}</p>
              </div>
            </div>
            <div className="h-4 w-px bg-ash/40 hidden sm:block" />
            <span className="flex items-center gap-1.5 font-body text-xs text-silver/70">
              <Calendar className="h-3.5 w-3.5" />{post.date}
            </span>
            <span className="flex items-center gap-1.5 font-body text-xs text-silver/70">
              <Clock className="h-3.5 w-3.5" />{post.readTime} read
            </span>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="bg-charcoal py-16">
        <div className="max-w-3xl mx-auto px-6">

          {/* Excerpt callout */}
          <p className="font-display text-xl text-silver/80 leading-relaxed border-l-2 border-gold pl-5 mb-10 italic">
            {post.excerpt}
          </p>

          {/* Body */}
          <article className="space-y-5">
            {post.content.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-heading text-2xl text-white mt-10 mb-3">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              return (
                <p key={i} className="font-body text-base text-silver leading-[1.8]">{block}</p>
              );
            })}
          </article>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-white/[0.06]">
            <Tag className="h-3.5 w-3.5 text-mist shrink-0" />
            {post.tags.map(tag => (
              <span key={tag}
                className="font-body text-xs px-3 py-1 rounded-full bg-smoke border border-ash/40 text-silver hover:border-gold/30 hover:text-gold transition-colors">
                {tag}
              </span>
            ))}
          </div>

          {/* Author card */}
          <div className="mt-10 bg-graphite border border-white/[0.07] rounded-2xl p-6 flex items-start gap-5">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
              <Image src={post.authorImg} alt={post.author} width={64} height={64} className="object-cover object-top" />
            </div>
            <div>
              <p className="font-body text-2xs uppercase tracking-widest text-mist mb-1">Written by</p>
              <p className="font-heading text-lg text-white">{post.author}</p>
              <p className="font-body text-xs text-mist">{post.authorRole} at SalonOS</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 relative rounded-3xl overflow-hidden">
            <Image src={post.coverImg} alt="" fill className="object-cover opacity-20" sizes="800px" />
            <div className="relative z-10 bg-obsidian/80 border border-gold/20 rounded-3xl p-8 md:p-10 text-center">
              <p className="font-display text-3xl text-white mb-2">
                Ready to book with {post.author.split(" ")[0]}?
              </p>
              <p className="font-body text-sm text-mist mb-6">
                Apply what you've learned — experience the expertise in person.
              </p>
              <Button asChild>
                <Link href="/book" className="group">
                  Book an Appointment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
