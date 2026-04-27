import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button }   from "@/components/ui/button";
import { pageMeta, JSON_LD, BASE_URL } from "@/lib/seo/metadata";
import { IMAGES }   from "@/lib/utils/images";
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma/client";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug }
  });

  if (!post) return { title: "Post Not Found" };
  
  return pageMeta({
    title: post.title,
    description: post.excerpt || "",
    path: `/blog/${slug}`,
    image: post.coverImageUrl || IMAGES.blog.braids,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug }
  });

  if (!post) notFound();

  // Fetch author profile if available
  let authorProfile = null;
  if (post.authorId) {
    authorProfile = await prisma.profile.findUnique({
      where: { id: post.authorId }
    });
  }

  const authorName = authorProfile?.fullName || "SalonOS Team";
  const authorRole = authorProfile?.role === "STYLIST" ? "Stylist" : "Editor";
  const authorAvatarUrl = authorProfile?.avatarUrl;
  const category = post.tags[0] || "Hair Care";
  const readTimeMin = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));

  const articleJsonLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    image: post.coverImageUrl || "",
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Person", name: authorName, jobTitle: authorRole },
    publisher: { "@type": "Organization", name: "SalonOS", url: BASE_URL },
    url: `${BASE_URL}/blog/${slug}`,
    keywords: post.tags.join(", "),
  };

  const paragraphs = post.content.split("\n\n").filter(Boolean);

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
        <Image src={post.coverImageUrl || IMAGES.blog.braids} alt={post.title} fill priority
          className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/10" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-14 w-full">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-1 text-silver/70 hover:text-pearl">
            <Link href="/blog"><ArrowLeft className="h-4 w-4" /> Back to Journal</Link>
          </Button>

          <span className="inline-block font-body text-2xs px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-light uppercase tracking-widest mb-5">
            {category}
          </span>

          <h1 className="font-display text-4xl md:text-6xl font-light text-white leading-[1.05] mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <Image src={authorAvatarUrl || IMAGES.stylists.fatima} alt={authorName} width={40} height={40} className="object-cover object-top" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-pearl">{authorName}</p>
                <p className="font-body text-xs text-mist">{authorRole}</p>
              </div>
            </div>
            <div className="h-4 w-px bg-ash/40 hidden sm:block" />
            <span className="flex items-center gap-1.5 font-body text-xs text-silver/70">
              <Calendar className="h-3.5 w-3.5" />{post.publishedAt?.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5 font-body text-xs text-silver/70">
              <Clock className="h-3.5 w-3.5" />{readTimeMin} min read
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
            {paragraphs.map((para: string, i: number) => {
              if (para.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-heading text-2xl text-white mt-10 mb-3">
                    {para.replace("## ", "")}
                  </h2>
                );
              }
              return (
                <p key={i} className="font-body text-base text-silver leading-[1.8]">{para}</p>
              );
            })}
          </article>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-white/[0.06]">
            <Tag className="h-3.5 w-3.5 text-mist shrink-0" />
            {post.tags.map((tag: string) => (
              <span key={tag}
                className="font-body text-xs px-3 py-1 rounded-full bg-smoke border border-ash/40 text-silver hover:border-gold/30 hover:text-gold transition-colors">
                {tag}
              </span>
            ))}
          </div>

          {/* Author card */}
          <div className="mt-10 bg-graphite border border-white/[0.07] rounded-2xl p-6 flex items-start gap-5">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
              <Image src={authorAvatarUrl || IMAGES.stylists.fatima} alt={authorName} width={64} height={64} className="object-cover object-top" />
            </div>
            <div>
              <p className="font-body text-2xs uppercase tracking-widest text-mist mb-1">Written by</p>
              <p className="font-heading text-lg text-white">{authorName}</p>
              <p className="font-body text-xs text-mist">{authorRole} at SalonOS</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 relative rounded-3xl overflow-hidden">
            <Image src={post.coverImageUrl || IMAGES.blog.braids} alt="" fill className="object-cover opacity-20" sizes="800px" />
            <div className="relative z-10 bg-obsidian/80 border border-gold/20 rounded-3xl p-8 md:p-10 text-center">
              <p className="font-display text-3xl text-white mb-2">
                Ready to book with {authorName.split(" ")[0]}?
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
