import type { Metadata } from "next";
import Script from "next/script";
import { prisma } from "@/lib/prisma/client";
import { BookingCTA } from "@/components/marketing/BookingCTA";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES } from "@/lib/utils/images";
import { ServicesPageClient } from "@/components/marketing/ServicesPageClient";
import { motion } from "framer-motion";

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

      {/* Static Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-40" />
        <div className="absolute inset-0 bg-card-gradient opacity-60" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="h-px w-8 bg-gold/50" />
              <p className="font-body text-xs uppercase tracking-[0.4em] text-gold font-bold">The Experience</p>
              <span className="h-px w-8 bg-gold/50" />
            </div>
            
            <h1 className="font-display text-7xl md:text-9xl text-white mb-10 tracking-tighter leading-none">
              Luxury <br />
              <em className="not-italic text-gold-shimmer relative inline-block">
                Artistry
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute bottom-4 left-0 h-1 bg-gold/30 rounded-full"
                />
              </em>
            </h1>
            
            <p className="font-body text-xl text-mist max-w-2xl mx-auto leading-relaxed opacity-90">
              Discover a curated selection of world-class hair treatments. 
              From precision tailoring to avant-garde protective styles, 
              we redefine the standard of salon excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Client Section */}
      <ServicesPageClient services={services} categories={categories as any} />

      <BookingCTA />
    </main>
  );
}