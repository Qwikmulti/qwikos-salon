import type { Metadata } from "next";
import Script from "next/script";
import { prisma } from "@/lib/prisma/client";
import { BookingCTA } from "@/components/marketing/BookingCTA";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES } from "@/lib/utils/images";
import { ServicesPageClient } from "@/components/marketing/ServicesPageClient";
import { ServicesHero } from "@/components/marketing/ServicesHero";

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
    <main className="bg-charcoal min-h-screen relative overflow-hidden">
      <Script
        id="json-ld-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.localBusiness) }}
      />

      {/* Aesthetic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-white/5 blur-[100px] rounded-full" />
      </div>

      <ServicesHero />

      {/* Interactive Client Section */}
      <ServicesPageClient services={services} categories={categories as any} />

      <BookingCTA />
    </main>
  );
}