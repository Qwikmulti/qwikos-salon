import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES }            from "@/lib/utils/images";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = pageMeta({
  title: "Hair & Beauty Blog — Tips, Guides & Inspiration",
  description: "Expert hair care tips, styling guides, and beauty inspiration from the SalonOS team. Natural hair, braiding, color, and grooming advice for London.",
  path: "/blog",
  keywords: ["hair care tips London","box braids maintenance","balayage guide United Kingdom","natural hair tips","salon blog London"],
});

const posts = [
  { slug:"how-to-maintain-box-braids",     title:"How to Maintain Box Braids for 8+ Weeks",          excerpt:"Our lead braiding specialist Fatima shares her top secrets for keeping your style fresh from week one to week eight.",                    img: IMAGES.blog.braids,   category:"Hair Care",      categoryColor:"text-emerald-400 bg-emerald-400/10 border-emerald-400/20", readTime:"5 min", date:"Apr 14, 2026", author:"Fatima Hassan",    featured:true  },
  { slug:"balayage-vs-highlights",          title:"Balayage vs. Highlights: Which is Right for You?", excerpt:"Breaking down the key differences so you can walk into your appointment with total confidence.",                                         img: IMAGES.blog.color,    category:"Color",          categoryColor:"text-violet-400 bg-violet-400/10 border-violet-400/20",   readTime:"4 min", date:"Apr 8, 2026",  author:"Amara Diallo",     featured:false },
  { slug:"scalp-health-guide",              title:"The Complete Guide to Scalp Health in London Heat",  excerpt:"United Kingdom's humidity creates unique scalp challenges. Here's how to combat dryness and buildup with the right routine.",                  img: IMAGES.blog.scalp,    category:"Wellness",       categoryColor:"text-sky-400 bg-sky-400/10 border-sky-400/20",           readTime:"6 min", date:"Mar 30, 2026", author:"Amara Diallo",     featured:false },
  { slug:"mens-grooming-routine-2026",      title:"The Modern Man's Grooming Routine for 2026",        excerpt:"From skin fade maintenance to beard care between cuts — Emeka's weekly routine for staying sharp every day.",                           img: IMAGES.blog.grooming, category:"Men's Grooming", categoryColor:"text-blue-400 bg-blue-400/10 border-blue-400/20",        readTime:"5 min", date:"Mar 22, 2026", author:"Emeka Nwachukwu",  featured:false },
  { slug:"keratin-treatment-faq",           title:"Keratin Treatment: Everything You Need to Know",    excerpt:"Cost, process, aftercare, and how long it truly lasts — 10 most common questions answered before your first session.",                 img: IMAGES.blog.keratin,  category:"Treatments",     categoryColor:"text-amber-400 bg-amber-400/10 border-amber-400/20",     readTime:"7 min", date:"Mar 15, 2026", author:"Amara Diallo",     featured:false },
  { slug:"natural-hair-porosity",           title:"Understanding Your Natural Hair Porosity",           excerpt:"Low, medium, or high — knowing your hair's porosity is the single most important step to a working moisture routine.",                 img: IMAGES.blog.porosity, category:"Natural Hair",   categoryColor:"text-green-400 bg-green-400/10 border-green-400/20",     readTime:"5 min", date:"Mar 5, 2026",  author:"Fatima Hassan",    featured:false },
];

const blogListJsonLD = {
  "@context": "https://schema.org", "@type": "Blog",
  name: "SalonOS Journal",
  description: "Expert hair care tips, styling guides, and beauty inspiration from the SalonOS team.",
  blogPost: posts.map(p => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    author: { "@type": "Person", name: p.author },
    datePublished: p.date,
    url: `https://salonos.co.uk/blog/${p.slug}`,
  })),
};

export default function BlogPage() {
  const featured = posts.find(p => p.featured)!;
  const rest     = posts.filter(p => !p.featured);

  return (
    <>
      <Script id="schema-blog" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLD) }} />
      <Script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.breadcrumb([{ name:"Home", url:"https://salonos.co.uk" },{ name:"Blog", url:"https://salonos.co.uk/blog" }])) }} />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[380px] flex items-end overflow-hidden bg-obsidian">
        <Image src={IMAGES.hero.color} alt="SalonOS blog" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-gold" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">Knowledge & Inspiration</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.0]">
            The <em className="not-italic text-gold-gradient">Journal</em>
          </h1>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Featured post */}
          <Link href={`/blog/${featured.slug}`} className="group block mb-12">
            <article className="grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/[0.07] hover:border-gold/25 hover:shadow-gold transition-all duration-300">
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <Image src={featured.img} alt={featured.title} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-obsidian/40 lg:to-obsidian/60" />
                <div className="absolute top-5 left-5">
                  <span className={`font-body text-2xs px-3 py-1.5 rounded-full border uppercase tracking-widest ${featured.categoryColor}`}>✦ Featured</span>
                </div>
              </div>
              <div className="bg-graphite p-8 md:p-12 flex flex-col justify-center">
                <span className={`inline-block font-body text-2xs px-3 py-1 rounded-full border uppercase tracking-widest mb-4 ${featured.categoryColor}`}>
                  {featured.category}
                </span>
                <h2 className="font-heading text-2xl md:text-3xl text-white mb-3 group-hover:text-gold-light transition-colors leading-snug">{featured.title}</h2>
                <p className="font-body text-sm text-mist leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 font-body text-xs text-ash">
                    <span>{featured.author}</span><span>·</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{featured.readTime}</span><span>·</span>
                    <span>{featured.date}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </article>
          </Link>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-graphite border border-white/[0.06] rounded-2xl overflow-hidden hover:border-gold/25 hover:-translate-y-1 hover:shadow-gold transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <Image src={post.img} alt={post.title} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className={`font-body text-2xs px-2.5 py-1 rounded-full border uppercase tracking-widest ${post.categoryColor}`}>{post.category}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="font-heading text-lg text-white mb-2 group-hover:text-gold-light transition-colors leading-snug flex-1">{post.title}</h2>
                    <p className="font-body text-xs text-mist leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between font-body text-2xs text-ash mt-auto">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{post.readTime} · {post.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{post.date}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
