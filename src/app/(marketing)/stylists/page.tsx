import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { prisma } from "@/lib/prisma/client";
import { Button } from "@/components/ui/button";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES } from "@/lib/utils/images";
import { Star, ArrowRight, Scissors } from "lucide-react";

export const metadata: Metadata = pageMeta({
  title: "Our Stylists — Expert Hair Artists in London",
  description: "Meet the SalonOS team — 12 expert stylists in Notting Hill & Chelsea, London. Specialists in braiding, colour, natural hair, fades, and treatments. Book your stylist online.",
  path: "/stylists",
  keywords: ["hair stylists London","braiding specialist London","hair colourist Notting Hill","barber Chelsea London","natural hair stylist London"],
});

async function getStylists() {
  return prisma.stylist.findMany({
    where: { isActive: true },
    include: { profile: true },
    orderBy: { yearsExperience: "desc" },
  });
}

export default async function StylistsPage() {
  const stylists = await getStylists();

  const stylistsJsonLD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SalonOS Stylists",
    itemListElement: stylists.map((s, i) => ({
      "@type": "ListItem", position: i + 1,
      item: {
        "@type": "Person",
        name: s.profile.fullName,
        jobTitle: s.specialties[0] ?? "Stylist",
        url: `https://salonos.co.uk/stylists/${s.id}`,
      },
    })),
  };

  return (
    <main className="bg-charcoal min-h-screen">
      <Script strategy="afterInteractive" id="json-ld" dangerouslySetInnerHTML={{ __html: JSON.stringify(stylistsJsonLD) }} />

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
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">Our Team</p>
          <h1 className="font-display text-6xl text-white mb-4">Expert Stylists</h1>
          <p className="font-body text-lg text-mist max-w-2xl">
            Meet our team of skilled professionals. Each stylist brings their unique expertise
            and artistic vision to every appointment.
          </p>
        </div>
      </section>

      {/* Stylists grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stylists.map((stylist, i) => (
              <Link
                key={stylist.id}
                href={`/stylists/${stylist.id}`}
                className="group block bg-graphite border border-white/[0.06] rounded-2xl overflow-hidden hover:border-gold/30 transition-all"
              >
                <div className="relative h-72">
                  <Image
                    src={stylist.heroImageUrl ?? IMAGES.hero.braids}
                    alt={stylist.profile.fullName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
                  {stylist.isActive && (
                    <span className="absolute top-4 left-4 px-2 py-1 rounded-md bg-success/20 border border-success/30 text-success-text font-body text-xs">
                      Available
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl text-white mb-1 group-hover:text-gold transition-colors">
                    {stylist.profile.fullName}
                  </h3>
                  <p className="font-body text-xs text-mist mb-3 line-clamp-2">{stylist.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {stylist.specialties.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-smoke border border-ash/50 text-silver font-body text-2xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      <span className="font-mono text-xs text-silver">4.9</span>
                    </div>
                    <span className="font-body text-xs text-ash">{stylist.yearsExperience} years exp</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}