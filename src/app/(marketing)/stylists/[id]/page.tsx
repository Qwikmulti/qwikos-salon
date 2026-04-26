import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES } from "@/lib/utils/images";
import { Star, Clock, Scissors, ArrowLeft, ArrowRight, CalendarDays, Globe } from "lucide-react";

// In production this data comes from Prisma + Supabase Storage URLs
const STYLISTS: Record<string, {
  name:string; role:string; exp:number; rating:number; reviews:number; bookings:number;
  bio:string; longBio:string; specialties:string[]; img:string; heroImg:string;
  portfolioImgs:string[]; instagram:string; available:boolean;
  services:Array<{name:string; duration:string; price:string}>;
  testimonials:Array<{name:string; text:string; rating:number; service:string}>;
}> = {
  "fatima-hassan": {
    name:"Fatima Hassan", role:"Lead Braiding Specialist", exp:7, rating:4.9, reviews:214, bookings:856,
    bio:"Specialist in all protective styles with 7 years of dedicated craft.",
    longBio:"Fatima has been creating intricate, long-lasting protective styles for over seven years. Born in West London and trained in both European and West African braiding traditions, she brings a unique cross-cultural expertise to every client. Fatima is known for her gentle touch with natural hair, her obsession with keeping scalps healthy, and her patience working with all hair types and lengths. She speaks fluent French and is passionate about the cultural significance of braided hairstyles.",
    specialties:["Knotless Box Braids","Cornrows","Faux Locs","Senegalese Twists","Natural Hair","Loc Retwist"],
    img:IMAGES.stylists.fatima, heroImg:IMAGES.hero.braids, instagram:"fatima.styles", available:true,
    portfolioImgs:[IMAGES.hero.braids, IMAGES.services.braiding, IMAGES.hero.portrait1, IMAGES.services.natural, IMAGES.hero.wash, IMAGES.hero.portrait2],
    services:[
      {name:"Knotless Box Braids",   duration:"4–6 hrs", price:"From £95"},
      {name:"Cornrows",              duration:"1.5–3 hrs",price:"From £45"},
      {name:"Faux Locs",             duration:"5–7 hrs", price:"From £140"},
      {name:"Loc Retwist",           duration:"1.5–2 hrs",price:"From £55"},
      {name:"Senegalese Twists",     duration:"3–5 hrs", price:"From £85"},
      {name:"Natural Hair Styling",  duration:"1–2 hrs", price:"From £40"},
    ],
    testimonials:[
      {name:"Adaeze O.", rating:5, service:"Knotless Box Braids", text:"Fatima is an absolute artist. My knotless braids lasted 8 weeks and looked salon-fresh to the last day. She's so gentle and really cares about scalp health."},
      {name:"Chisom M.", rating:5, service:"Loc Retwist",        text:"I've been going to Fatima for 2 years. My locs have never looked healthier. She understands natural hair at a completely different level."},
      {name:"Adaora P.", rating:5, service:"Cornrows",           text:"Fast, neat, and painless. She did the most intricate pattern and it held perfectly for weeks. Absolutely recommend."},
    ],
  },
  "amara-diallo": {
    name:"Amara Diallo", role:"Senior Colourist & Treatments Specialist", exp:9, rating:5.0, reviews:312, bookings:1204,
    bio:"Award-winning colourist with 9 years transforming hair with precision and artistry.",
    longBio:"Amara trained at the London School of Beauty & Make-Up before spending three years with a prestigious Mayfair colour house. She specialises in blonding, balayage, and creative colour for all hair types — including Type 4 natural hair. Her keratin and treatment expertise means clients leave not only looking incredible but with noticeably healthier hair. Amara is known for her meticulous consultations, always setting honest expectations and delivering results that exceed them.",
    specialties:["Balayage","Full Colour","Highlights & Lowlights","Colour Correction","Keratin Treatment","Deep Conditioning"],
    img:IMAGES.stylists.amara, heroImg:IMAGES.services.color, instagram:"amara.colour", available:true,
    portfolioImgs:[IMAGES.services.color, IMAGES.hero.color, IMAGES.services.treatment, IMAGES.hero.portrait2, IMAGES.hero.wash, IMAGES.about.team],
    services:[
      {name:"Balayage",              duration:"2.5–4 hrs", price:"From £120"},
      {name:"Full Colour",           duration:"2–3 hrs",   price:"From £85"},
      {name:"Highlights & Lowlights",duration:"2.5–4 hrs", price:"From £95"},
      {name:"Colour Correction",     duration:"3–6 hrs",   price:"From £180"},
      {name:"Keratin Treatment",     duration:"2.5–3 hrs", price:"From £150"},
      {name:"Deep Conditioning",     duration:"45–60 min", price:"From £35"},
    ],
    testimonials:[
      {name:"Ngozi E.",  rating:5, service:"Balayage",         text:"Amara completely transformed my hair. The consultation alone gave me so much confidence. The result was exactly — actually better — than what I'd shown her."},
      {name:"Bola K.",  rating:5, service:"Keratin Treatment", text:"The keratin treatment changed my morning routine completely. Four months of silk-smooth hair. Amara explained every step and my hair is healthier than ever."},
      {name:"Claire W.",rating:5, service:"Colour Correction", text:"I came in with a DIY disaster and left with the most beautiful honey blonde. Amara is a magician. Worth every penny."},
    ],
  },
  "emeka-nwachukwu": {
    name:"Emeka Nwachukwu", role:"Master Barber & Colourist", exp:5, rating:4.8, reviews:178, bookings:641,
    bio:"Master barber blending precision fades with creative colour work and loc expertise.",
    longBio:"Emeka grew up watching his father barbering in Peckham before training at the prestigious Savile Row Barbering College. He brings a rare combination of old-school barber discipline and modern colour expertise, meaning he's as comfortable doing a skin fade as he is colour-correcting Type 3 curls. He holds certifications in both barbering and creative colouring, and has built a devoted following across South and West London. Emeka also specialises in loc installation and maintenance for men and women.",
    specialties:["Skin Fades","Beard Design","Colour","Locs","Shape-Ups","Lineups"],
    img:IMAGES.stylists.emeka, heroImg:IMAGES.services.beard, instagram:"emeka.cuts", available:true,
    portfolioImgs:[IMAGES.services.beard, IMAGES.hero.barber, IMAGES.services.color, IMAGES.hero.portrait1, IMAGES.hero.salon, IMAGES.about.interior2],
    services:[
      {name:"Skin Fade",            duration:"45–60 min", price:"From £35"},
      {name:"Fade + Beard Design",  duration:"60–75 min", price:"From £50"},
      {name:"Shape-Up & Lineup",    duration:"30 min",    price:"From £20"},
      {name:"Hot Towel Shave",      duration:"45 min",    price:"From £40"},
      {name:"Colour (Barber)",      duration:"1–2 hrs",   price:"From £55"},
      {name:"Loc Retwist (Men)",    duration:"1.5–2 hrs", price:"From £50"},
    ],
    testimonials:[
      {name:"Tunde A.", rating:5, service:"Skin Fade + Beard", text:"Emeka is the best barber I've ever had. The attention to detail is unmatched. My beard has never looked this crisp. Already booked my next appointment."},
      {name:"Kofi M.",  rating:5, service:"Fade + Colour",     text:"Came in for a fade and ended up getting a subtle colour treatment too. Emeka's eye for what would suit me was spot on."},
      {name:"Marcus J.",rating:5, service:"Shape-Up",          text:"Quick, clean, exactly what I asked for. One of those barbers who really listens. Will be a regular."},
    ],
  },
};

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return Object.keys(STYLISTS).map(id => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = STYLISTS[id];
  if (!s) return { title: "Stylist Not Found" };
  return pageMeta({
    title: `${s.name} — ${s.role}`,
    description: `Book with ${s.name}, ${s.role} at SalonOS London. ${s.specialties.slice(0,3).join(", ")} specialist with ${s.exp} years experience and ${s.reviews} 5-star reviews.`,
    path: `/stylists/${id}`,
    image: s.heroImg,
    keywords: [`${s.name} hairstylist London`, ...s.specialties.map(sp => `${sp} London`)],
  });
}

export default async function StylistPage({ params }: Props) {
  const { id } = await params;
  const s = STYLISTS[id];
  if (!s) notFound();

  const personJsonLD = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: s.name, jobTitle: s.role,
    image: s.img,
    url: `https://salonos.co.uk/stylists/${id}`,
    sameAs: [`https://instagram.com/${s.instagram}`],
    worksFor: { "@type": "Organization", name: "SalonOS", url: "https://salonos.co.uk" },
    knowsAbout: s.specialties,
    description: s.longBio,
  };

  return (
    <>
      <Script id="schema-person" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLD) }} />
      <Script id="schema-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.breadcrumb([
          { name:"Home", url:"https://salonos.co.uk" },
          { name:"Stylists", url:"https://salonos.co.uk/stylists" },
          { name: s.name, url: `https://salonos.co.uk/stylists/${id}` },
        ])) }} />

      {/* ── Hero ── */}
      <section className="relative h-[70vh] min-h-[520px] flex items-end overflow-hidden bg-obsidian">
        <Image src={s.heroImg} alt={`${s.name} work`} fill priority
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
              <Image src={s.img} alt={s.name} fill className="object-cover object-top" sizes="144px" />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                {s.available
                  ? <Badge variant="success">Taking bookings</Badge>
                  : <Badge variant="default">Unavailable</Badge>}
                <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-body text-xs text-mist hover:text-gold transition-colors">
                  <Globe className="h-3.5 w-3.5" /> @{s.instagram}
                </a>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-light text-white leading-tight mb-1">{s.name}</h1>
              <p className="font-body text-base text-silver/80 mb-4">{s.role}</p>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(n => <Star key={n} className={`h-4 w-4 ${n <= Math.floor(s.rating) ? "fill-gold text-gold" : "text-ash"}`} />)}
                  <span className="font-mono text-sm text-silver ml-1">{s.rating}</span>
                  <span className="font-body text-xs text-mist">({s.reviews} reviews)</span>
                </div>
                <span className="font-body text-xs text-mist">{s.exp} years experience</span>
                <span className="font-body text-xs text-mist">{s.bookings.toLocaleString()} clients served</span>
              </div>
            </div>

            {s.available && (
              <Button size="lg" asChild className="ml-auto hidden md:flex shrink-0">
                <Link href={`/book?stylist=${id}`}>
                  <CalendarDays className="h-4 w-4" /> Book with {s.name.split(" ")[0]}
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
                <h2 className="font-heading text-xl text-white">About {s.name.split(" ")[0]}</h2>
              </div>
              <p className="font-body text-base text-silver leading-[1.8]">{s.longBio}</p>
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
                {s.services.map(svc => (
                  <div key={svc.name}
                    className="flex items-center justify-between gap-4 px-5 py-4 bg-graphite border border-white/[0.06] rounded-xl hover:border-gold/25 hover:bg-smoke transition-all group">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-pearl">{svc.name}</p>
                      <p className="flex items-center gap-1 font-body text-xs text-mist mt-0.5">
                        <Clock className="h-3 w-3" />{svc.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-display text-xl text-gold-light">{svc.price}</span>
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
                {s.portfolioImgs.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                    <Image src={img} alt={`${s.name} portfolio ${i + 1}`} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:640px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-all" />
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-mist mt-3 text-center">
                Portfolio photos managed via Supabase Storage
              </p>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="font-heading text-xl text-white mb-5">Client Reviews</h2>
              <div className="space-y-4">
                {s.testimonials.map((t, i) => (
                  <div key={i} className="bg-graphite border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-xl bg-gold-gradient flex items-center justify-center font-display text-base text-obsidian shrink-0">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium text-pearl">{t.name}</p>
                        <p className="font-body text-xs text-gold">{t.service}</p>
                      </div>
                      <div className="flex items-center gap-0.5 ml-auto">
                        {[1,2,3,4,5].map(n => <Star key={n} className={`h-3.5 w-3.5 ${n<=t.rating?"fill-gold text-gold":"text-ash"}`} />)}
                      </div>
                    </div>
                    <p className="font-body text-sm text-silver leading-relaxed">"{t.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Book CTA */}
            <div className="bg-card-gradient border border-gold/20 rounded-2xl p-6">
              <p className="font-body text-xs uppercase tracking-widest text-gold mb-3">Book with {s.name.split(" ")[0]}</p>
              <p className="font-display text-2xl text-white mb-2">Ready for your transformation?</p>
              <p className="font-body text-xs text-mist mb-5 leading-relaxed">
                Select a service below and choose your preferred date and time.
              </p>
              {s.available ? (
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
                { label:"Rating",   value:`${s.rating} / 5.0` },
                { label:"Reviews",  value:String(s.reviews)   },
                { label:"Clients",  value:s.bookings.toLocaleString() },
                { label:"Experience", value:`${s.exp} years`  },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="font-body text-xs text-mist uppercase tracking-widest">{label}</span>
                  <span className="font-display text-base text-white">{value}</span>
                </div>
              ))}
            </div>

            {/* Availability note */}
            <div className="bg-smoke border border-ash/30 rounded-2xl p-5">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-silver mb-2">📍 Location</p>
              <p className="font-body text-sm text-mist">14 Portobello Road, Notting Hill, London W11 2DH</p>
              <p className="font-body text-xs text-ash mt-2">Also available at Chelsea location by request.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile book CTA */}
      {s.available && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-charcoal/95 backdrop-blur-xl border-t border-white/[0.06] z-50">
          <Button size="lg" className="w-full" asChild>
            <Link href={`/book?stylist=${id}`}>
              <Scissors className="h-4 w-4" /> Book with {s.name.split(" ")[0]}
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
