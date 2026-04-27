import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pageMeta, JSON_LD, BASE_URL } from "@/lib/seo/metadata";
import { IMAGES } from "@/lib/utils/images";
import { Star, Clock, Scissors, ArrowLeft, ArrowRight, CalendarDays, Globe } from "lucide-react";

import { prisma } from "@/lib/prisma/client";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = await prisma.stylist.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!s) return { title: "Stylist Not Found" };
  
  return pageMeta({
    title: `${s.profile.fullName} — Stylist`,
    description: s.bio || "Professional stylist at SalonOS London.",
    path: `/stylists/${id}`,
    image: s.heroImageUrl || IMAGES.hero.braids,
  });
}

export default async function StylistPage({ params }: Props) {
  const { id } = await params;
  
  const s = await prisma.stylist.findUnique({
    where: { id },
    include: { 
      profile: true,
      services: {
        include: { service: true }
      }
    },
  });

  if (!s) notFound();

  const personJsonLD = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: s.profile.fullName,
    image: s.profile.avatarUrl,
    url: `${BASE_URL}/stylists/${id}`,
    sameAs: s.instagramHandle ? [`https://instagram.com/${s.instagramHandle}`] : [],
    worksFor: { "@type": "Organization", name: "SalonOS", url: BASE_URL },
    knowsAbout: s.specialties,
    description: s.bio,
  };

  const services = s.services.map(ss => ss.service);

  return (
    <>
      <Script id="schema-person" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLD) }} />
      <Script id="schema-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.breadcrumb([
          { name:"Home", url: BASE_URL },
          { name:"Stylists", url: `${BASE_URL}/stylists` },
          { name: s.profile.fullName, url: `${BASE_URL}/stylists/${id}` },
        ])) }} />

      {/* ── Hero ── */}
      <section className="relative h-[70vh] min-h-[520px] flex items-end overflow-hidden bg-obsidian">
        <Image src={s.heroImageUrl || IMAGES.hero.braids} alt={`${s.profile.fullName} work`} fill priority
          className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/60 to-obsidian/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <Button variant="ghost" size="sm" asChild className="mb-8 text-silver/70 hover:text-pearl -ml-1">
            <Link href="/stylists"><ArrowLeft className="h-4 w-4" /> All Stylists</Link>
          </Button>

          <div className="flex items-end gap-6 flex-wrap">
            {/* Avatar */}
            <div className="relative h-28 w-28 md:h-36 md:w-36 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0">
              <Image src={s.profile.avatarUrl || IMAGES.stylists.fatima} alt={s.profile.fullName} fill className="object-cover object-top" sizes="144px" />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                {s.isActive
                  ? <Badge variant="success">Taking bookings</Badge>
                  : <Badge variant="default">Unavailable</Badge>}
                {s.instagramHandle && (
                  <a href={`https://instagram.com/${s.instagramHandle}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-body text-xs text-mist hover:text-gold transition-colors">
                    <Globe className="h-3.5 w-3.5" /> @{s.instagramHandle}
                  </a>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-light text-white leading-tight mb-1">{s.profile.fullName}</h1>
              <p className="font-body text-base text-silver/80 mb-4">{s.specialties[0] || "Stylist"}</p>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-mono text-sm text-silver ml-1">4.9</span>
                  <span className="font-body text-xs text-mist">(200+ reviews)</span>
                </div>
                <span className="font-body text-xs text-mist">{s.yearsExperience} years experience</span>
              </div>
            </div>

            {s.isActive && (
              <Button size="lg" asChild className="ml-auto hidden md:flex shrink-0">
                <Link href={`/book?stylist=${id}`}>
                  <CalendarDays className="h-4 w-4" /> Book with {s.profile.fullName.split(" ")[0]}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-charcoal py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">

          {/* Left — bio + services + testimonials */}
          <div className="lg:col-span-2 space-y-12">

            {/* Bio */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-gold" />
                <h2 className="font-heading text-xl text-white">About {s.profile.fullName.split(" ")[0]}</h2>
              </div>
              <p className="font-body text-base text-silver leading-[1.8]">{s.bio || "No bio available."}</p>
            </div>

            {/* Specialties */}
            <div>
              <h2 className="font-heading text-xl text-white mb-4">Specialities</h2>
              <div className="flex flex-wrap gap-2">
                {s.specialties.map(sp => (
                  <span key={sp} className="font-body text-sm px-4 py-2 rounded-xl bg-graphite border border-ash/50 text-pearl hover:border-gold/30 transition-colors">
                    {sp}
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="font-heading text-xl text-white mb-5">Services & Pricing</h2>
              <div className="flex flex-col gap-2">
                {services.map(svc => (
                  <div key={svc.id}
                    className="flex items-center justify-between gap-4 px-5 py-4 bg-graphite border border-white/[0.06] rounded-xl hover:border-gold/25 hover:bg-smoke transition-all group">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-pearl">{svc.name}</p>
                      <p className="flex items-center gap-1 font-body text-xs text-mist mt-0.5">
                        <Clock className="h-3 w-3" />{svc.durationMin} min
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-display text-xl text-gold-light">£{(Number(svc.price) / 100).toFixed(0)}</span>
                      <Button size="sm" variant="ghost" asChild
                        className="opacity-0 group-hover:opacity-100 transition-all">
                        <Link href={`/book?stylist=${id}`}>
                          Book <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <h2 className="font-heading text-xl text-white mb-5">Portfolio</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {s.portfolioUrls.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                    <Image src={img} alt={`${s.profile.fullName} portfolio ${i + 1}`} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:640px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Book CTA */}
            <div className="bg-card-gradient border border-gold/20 rounded-2xl p-6">
              <p className="font-body text-xs uppercase tracking-widest text-gold mb-3">Book with {s.profile.fullName.split(" ")[0]}</p>
              <p className="font-display text-2xl text-white mb-2">Ready for your transformation?</p>
              <p className="font-body text-xs text-mist mb-5 leading-relaxed">
                Select a service below and choose your preferred date and time.
              </p>
              {s.isActive ? (
                <Button size="lg" className="w-full" asChild>
                  <Link href={`/book?stylist=${id}`}>
                    <Scissors className="h-4 w-4" /> Book Appointment
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="w-full" variant="secondary" disabled>
                  Currently Unavailable
                </Button>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-graphite border border-white/[0.06] rounded-2xl p-5 space-y-4">
              {[
                { label:"Rating",   value:"4.9 / 5.0" },
                { label:"Experience", value:`${s.yearsExperience} years`  },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="font-body text-xs text-mist uppercase tracking-widest">{label}</span>
                  <span className="font-display text-base text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile book CTA */}
      {s.isActive && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-charcoal/95 backdrop-blur-xl border-t border-white/[0.06] z-50">
          <Button size="lg" className="w-full" asChild>
            <Link href={`/book?stylist=${id}`}>
              <Scissors className="h-4 w-4" /> Book with {s.profile.fullName.split(" ")[0]}
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
