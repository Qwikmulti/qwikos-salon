import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pageMeta, JSON_LD, BASE_URL } from "@/lib/seo/metadata";
import { IMAGES } from "@/lib/utils/images";
import { prisma } from "@/lib/prisma/client";
import { Clock, Scissors, ArrowLeft, Star, CheckCircle2, Calendar } from "lucide-react";
import { BookingCTA } from "@/components/marketing/BookingCTA";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = await prisma.service.findUnique({
    where: { id },
  });

  if (!s) return { title: "Service Not Found" };
  
  return pageMeta({
    title: `${s.name} — SalonOS Services`,
    description: s.description || `Luxury ${s.name} service at SalonOS London. Book your appointment online today.`,
    path: `/services/${id}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { id } = await params;
  
  const s = await prisma.service.findUnique({
    where: { id },
    include: {
      stylists: {
        include: {
          stylist: {
            include: { profile: true }
          }
        }
      }
    }
  });

  if (!s) notFound();

  const serviceJsonLD = {
    "@context": "https://schema.org/",
    "@type": "Service",
    "serviceType": s.name,
    "provider": {
      "@type": "HairSalon",
      "name": "SalonOS",
      "url": BASE_URL
    },
    "description": s.description,
    "offers": {
      "@type": "Offer",
      "price": Number(s.price),
      "priceCurrency": "GBP"
    }
  };

  const specialists = s.stylists.map(ss => ss.stylist);

  return (
    <main className="bg-charcoal min-h-screen">
      <Script id="schema-service" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLD) }} />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 noise-overlay opacity-30" />
        <div className="absolute inset-0 bg-card-gradient opacity-40" />
        
        <div className="max-w-7xl mx-auto relative">
          <Button variant="ghost" size="sm" asChild className="mb-12 text-silver/70 hover:text-pearl -ml-1">
            <Link href="/services"><ArrowLeft className="h-4 w-4" /> All Services</Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-gold mb-6">Service Detail</p>
              <h1 className="font-display text-5xl md:text-7xl text-white mb-6 tracking-tight leading-tight">
                {s.name}
              </h1>
              <p className="font-body text-lg text-mist max-w-xl mb-10 leading-relaxed">
                {s.description || "Experience the pinnacle of luxury hair care with our signature service, tailored to your unique style and hair needs."}
              </p>

              <div className="flex flex-wrap gap-8 items-center py-8 border-y border-white/5 mb-10">
                <div className="space-y-1">
                  <p className="font-body text-2xs uppercase tracking-widest text-ash">Duration</p>
                  <p className="font-display text-2xl text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gold" /> {s.durationMin} mins
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-body text-2xs uppercase tracking-widest text-ash">Investment</p>
                  <p className="font-display text-2xl text-gold-light">
                    £{Number(s.price).toFixed(0)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-body text-2xs uppercase tracking-widest text-ash">Experience</p>
                  <p className="font-display text-2xl text-white">5-Star</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="shadow-gold h-14 px-8 text-base">
                  <Link href={`/book?service=${id}`}>
                    <Calendar className="h-5 w-5" /> Book This Service
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild className="h-14 px-8 text-base border-white/10 hover:border-white/20">
                  <Link href="/contact">Inquire Now</Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src={IMAGES.services[s.category.toLowerCase() as keyof typeof IMAGES.services] || IMAGES.hero.braids} 
                alt={s.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Details & Specialists ── */}
      <section className="py-24 px-6 bg-graphite/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-2 space-y-16">
            {/* Why Choose Us */}
            <div>
              <h2 className="font-display text-3xl text-white mb-8">What to Expect</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "Expert consultation to understand your goals",
                  "Premium products selected for your hair type",
                  "Specialized techniques by industry leaders",
                  "Luxury atmosphere and refreshments",
                  "Professional aftercare advice",
                  "Long-lasting, head-turning results"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl bg-smoke/50 border border-white/[0.03]">
                    <CheckCircle2 className="h-6 w-6 text-gold shrink-0" />
                    <p className="font-body text-silver text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Specialists */}
            <div>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="font-display text-3xl text-white mb-2">Service Specialists</h2>
                  <p className="font-body text-sm text-mist">Our top stylists for this specific treatment</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {specialists.length > 0 ? specialists.map((stylist) => (
                  <Link 
                    key={stylist.id} 
                    href={`/stylists/${stylist.id}`}
                    className="group flex items-center gap-5 p-5 rounded-2xl bg-graphite border border-white/[0.05] hover:border-gold/30 hover:bg-smoke transition-all duration-300"
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <Image 
                        src={stylist.profile.avatarUrl || IMAGES.stylists.fatima} 
                        alt={stylist.profile.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl text-white group-hover:text-gold transition-colors truncate">
                        {stylist.profile.fullName}
                      </h3>
                      <p className="font-body text-xs text-mist mb-2">{stylist.yearsExperience}+ Years Experience</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        <span className="font-mono text-xs text-silver">4.9</span>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="col-span-2 py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="font-body text-mist">All our stylists are qualified for this service.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:sticky lg:top-32 self-start space-y-6">
            <div className="p-8 rounded-[2rem] bg-card-gradient border border-gold/20 shadow-gold">
              <h3 className="font-display text-2xl text-white mb-4">Book Appointment</h3>
              <p className="font-body text-sm text-mist mb-8 leading-relaxed">
                Secure your spot in under 2 minutes. No deposit required for this service.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-mist">Base Price</span>
                  <span className="text-white">£{Number(s.price).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mist">Duration</span>
                  <span className="text-white">{s.durationMin} mins</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between">
                  <span className="text-gold font-medium uppercase tracking-widest text-xs">Total</span>
                  <span className="text-gold-light font-display text-xl">From £{Number(s.price).toFixed(0)}</span>
                </div>
              </div>

              <Button size="lg" className="w-full h-14" asChild>
                <Link href={`/book?service=${id}`}>
                  <Scissors className="h-5 w-5" /> Book Now
                </Link>
              </Button>
            </div>

            <div className="p-8 rounded-[2rem] bg-smoke/30 border border-white/5">
              <p className="font-body text-xs uppercase tracking-widest text-ash mb-4">Need Help?</p>
              <p className="font-body text-sm text-mist mb-6">
                Not sure if this service is right for you? Our concierge team is here to help.
              </p>
              <Button variant="ghost" className="w-full justify-start hover:text-gold" asChild>
                <Link href="/contact">Message Us &rarr;</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BookingCTA />
    </main>
  );
}
