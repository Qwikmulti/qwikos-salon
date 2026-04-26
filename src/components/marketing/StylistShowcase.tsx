"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Globe } from "lucide-react";
import { IMAGES } from "@/lib/utils/images";

const stylists = [
  {
    name: "Fatima Hassan",
    role: "Lead Braiding Specialist",
    exp: "7 years",
    rating: 4.9, reviews: 214,
    tags: ["Braiding","Natural Hair","Locs"],
    img: IMAGES.stylists.fatima,
    instagram: "fatima.styles",
    quote: "Every strand has a story worth protecting.",
    featured: false,
  },
  {
    name: "Amara Diallo",
    role: "Senior Colorist & Treatment Expert",
    exp: "9 years",
    rating: 5.0, reviews: 312,
    tags: ["Balayage","Keratin","Color"],
    img: IMAGES.stylists.amara,
    instagram: "amara.color",
    quote: "Color is how I see personality.",
    featured: true,
  },
  {
    name: "Emeka Nwachukwu",
    role: "Master Barber & Colorist",
    exp: "5 years",
    rating: 4.8, reviews: 178,
    tags: ["Fades","Beard","Locs"],
    img: IMAGES.stylists.emeka,
    instagram: "emeka.cuts",
    quote: "Precision is a form of respect.",
    featured: false,
  },
];

export function StylistShowcase() {
  return (
    <section className="bg-obsidian py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      {/* Large decorative number */}
      <div className="absolute right-8 top-16 font-display text-[200px] leading-none text-white/[0.02] select-none pointer-events-none hidden xl:block">
        12
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-12 bg-gold" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">Meet The Team</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light text-white leading-[1.0]">
              12 Stylists.<br />
              <em className="not-italic text-gold-gradient">One Vision.</em>
            </h2>
          </div>
          <div className="md:text-right max-w-xs">
            <p className="font-body text-sm text-mist leading-relaxed mb-4">
              Each stylist is hand-picked for skill, passion, and a genuine dedication to their craft.
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/stylists" className="group">
                Meet all 12 stylists <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stylists — asymmetric grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {stylists.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className={`group relative rounded-3xl overflow-hidden border transition-all duration-500 hover:shadow-gold ${
                s.featured
                  ? "border-gold/30 lg:row-span-1"
                  : "border-white/[0.07] hover:border-gold/25"
              }`}
            >
              {/* Photo — fixed height */}
              <div className={`relative overflow-hidden ${s.featured ? "h-96" : "h-80"}`}>
                <Image
                  src={s.img} alt={s.name} fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent" />

                {/* Featured badge */}
                {s.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="font-body text-2xs px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light backdrop-blur-sm uppercase tracking-widest">
                      ✦ Featured
                    </span>
                  </div>
                )}

                {/* Quote — overlaid on photo */}
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="font-display text-lg italic text-white/80 leading-snug">"{s.quote}"</p>
                </div>
              </div>

              {/* Info strip */}
              <div className="bg-graphite p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading text-lg text-white">{s.name}</h3>
                    <p className="font-body text-xs text-mist">{s.role} · {s.exp}</p>
                  </div>
                  <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="text-ash hover:text-gold transition-colors p-1" onClick={e => e.stopPropagation()}>
                    <Globe className="h-4 w-4" />
                  </a>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`h-3.5 w-3.5 ${n <= Math.floor(s.rating) ? "fill-gold text-gold" : "text-ash"}`} />
                    ))}
                  </div>
                  <span className="font-mono text-sm text-silver">{s.rating}</span>
                  <span className="font-body text-xs text-ash">({s.reviews} reviews)</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {s.tags.map(t => (
                    <span key={t} className="font-body text-2xs px-2.5 py-1 rounded-full bg-smoke border border-ash/40 text-silver uppercase tracking-wide">{t}</span>
                  ))}
                </div>

                <Button size="sm" className="w-full" asChild>
                  <Link href={`/book?stylist=${s.name.toLowerCase().replace(/ /g, "-")}`}>
                    Book with {s.name.split(" ")[0]}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
