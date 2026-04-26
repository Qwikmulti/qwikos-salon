import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/marketing/BookingCTA";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES } from "@/lib/utils/images";
import { Clock, ArrowRight } from "lucide-react";
import type { ServiceCategory } from "@/types";

export const metadata: Metadata = pageMeta({
  title: "Hair & Beauty Services — Prices & Durations",
  description: "Browse all SalonOS services with transparent pricing. Box braids from £12,000, balayage from £25,000, precision cuts from £4,000. Book online today.",
  path: "/services",
  keywords: ["salon services London prices","box braids price London","balayage price London","keratin treatment London","beard trim London"],
});

const categories = [
  { key:"HAIR_CUT", label:"Hair Cuts", emoji:"✂️", img: IMAGES.services.haircut, desc:"Shape, style, and refine — from classic cuts to creative transformations." },
  { key:"HAIR_COLOR", label:"Color", emoji:"🎨", img: IMAGES.services.color, desc:"Balayage, highlights, full color, and creative toning by expert colorists." },
  { key:"BRAIDING", label:"Braiding", emoji:"🫶", img: IMAGES.services.braiding, desc:"Knotless braids, cornrows, faux locs, and protective styles done right." },
  { key:"NATURAL_HAIR", label:"Natural Hair", emoji:"🌿", img: IMAGES.services.natural, desc:"Wash, style, twist-outs, and specialist care for natural textures." },
  { key:"TREATMENT", label:"Treatments", emoji:"✨", img: IMAGES.services.treatment, desc:"Keratin, deep conditioning, scalp therapy, and strengthening masks." },
  { key:"BEARD", label:"Beard", emoji:"🪒", img: IMAGES.services.beard, desc:"Shape-ups, lineups, hot towel shaves, and full beard grooming." },
] as const;

const categoryLabels: Record<string, string> = {
  HAIR_CUT: "Hair Cuts", HAIR_COLOR: "Color", BRAIDING: "Braiding",
  NATURAL_HAIR: "Natural Hair", TREATMENT: "Treatments", BEARD: "Beard",
};

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export default async function ServicesPage() {
  const services = await getServices();

  const servicesByCategory = categories.reduce((acc, cat) => {
    acc[cat.key] = services.filter(s => s.category === cat.key);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <main className="bg-charcoal min-h-screen">
      <Script strategy="afterInteractive" id="json-ld" dangerouslySetInnerHTML={{ __html: JSON_LD }} />

      {/* Hero */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-30" />
        <div className="absolute inset-0 bg-card-gradient opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute left-[16.66%] top-0 bottom-0 w-px bg-gold/[0.06]" />
          <div className="absolute left-[33.33%] top-0 bottom-0 w-px bg-gold/[0.06]" />
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gold/[0.06]" />
          <div className="absolute left-[66.66%] top-0 bottom-0 w-px bg-gold/[0.06]" />
          <div className="absolute left-[83.33%] top-0 bottom-0 w-px bg-gold/[0.06]" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">Our Services</p>
          <h1 className="font-display text-6xl text-white mb-4">Hair & Beauty</h1>
          <p className="font-body text-lg text-mist max-w-2xl">
            Transparent pricing on every service. No hidden fees, no surprise upsells.
            Just great hair, done right.
          </p>
        </div>
      </section>

      {/* Category sections */}
      {categories.map(cat => {
        const catServices = servicesByCategory[cat.key];
        if (!catServices?.length) return null;

        return (
          <section key={cat.key} className="py-20 px-6 border-t border-white/[0.06]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-start gap-8 mb-8">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                  <Image src={cat.img} alt={cat.label} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-gold mb-2">{cat.emoji}</p>
                  <h2 className="font-display text-4xl text-white mb-2">{cat.label}</h2>
                  <p className="font-body text-mist">{cat.desc}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catServices.map(s => (
                  <div
                    key={s.id}
                    className="bg-graphite border border-white/[0.06] rounded-xl p-5 hover:border-gold/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-heading text-lg text-white">{s.name}</h3>
                      <span className="font-display text-xl text-gold-light">
                        £{(Number(s.price) / 100).toFixed(0)}
                      </span>
                    </div>
                    <p className="font-body text-xs text-mist mb-3 line-clamp-2">{s.description}</p>
                    <div className="flex items-center gap-4 text-xs text-ash">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{s.durationMin} min
                      </span>
                    </div>
                    <Button size="sm" className="w-full mt-4" asChild>
                      <Link href={`/book?service=${s.id}`}>Book Now</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <BookingCTA />
    </main>
  );
}