import type { Metadata } from "next";
import Script from "next/script";
import { prisma } from "@/lib/prisma/client";
import { BookingCTA } from "@/components/marketing/BookingCTA";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES } from "@/lib/utils/images";
import { ServicesPageClient } from "@/components/marketing/ServicesPageClient";

export const metadata: Metadata = pageMeta({
  title: "Hair & Beauty Services — Prices & Durations",
  description: "Browse all SalonOS services with transparent pricing. Box braids, balayage, precision cuts, and more. Book online today.",
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

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" },
  });
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="bg-charcoal min-h-screen">
      <Script
        id="json-ld-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.localBusiness) }}
      />

      {/* Static Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-30" />
        <div className="absolute inset-0 bg-card-gradient opacity-40" />
        <div className="max-w-7xl mx-auto relative text-center">
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-6">Our Services</p>
          <h1 className="font-display text-6xl md:text-8xl text-white mb-8 tracking-tight">
            The <em className="not-italic text-gold-shimmer">Menu</em>
          </h1>
          <p className="font-body text-lg text-mist max-w-2xl mx-auto leading-relaxed">
            From precision cuts to luxury braids. Discover our full range of services with transparent pricing and durations.
          </p>
        </div>
      </section>

      {/* Interactive Client Section */}
      <ServicesPageClient services={services} categories={categories as any} />

      <BookingCTA />
    </main>
  );
}