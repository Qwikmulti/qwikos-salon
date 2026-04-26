import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
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

const STYLISTS = [
  { id:"fatima-hassan",   name:"Fatima Hassan",    role:"Lead Braiding Specialist",         exp:7,  rating:4.9, reviews:214, bookings:856,  specialties:["Braiding","Natural Hair","Locs","Cornrows"],            img: IMAGES.stylists.fatima,  heroImg: IMAGES.hero.braids,    available:true  },
  { id:"amara-diallo",    name:"Amara Diallo",     role:"Senior Colourist & Treatments",    exp:9,  rating:5.0, reviews:312, bookings:1204, specialties:["Balayage","Colour","Keratin","Treatments"],              img: IMAGES.stylists.amara,   heroImg: IMAGES.services.color, available:true  },
  { id:"emeka-nwachukwu", name:"Emeka Nwachukwu",  role:"Master Barber & Colourist",        exp:5,  rating:4.8, reviews:178, bookings:641,  specialties:["Fades","Beard","Locs","Colour"],                         img: IMAGES.stylists.emeka,   heroImg: IMAGES.services.beard, available:true  },
  { id:"kemi-adeleke",    name:"Kemi Adeleke",     role:"Natural Hair & Styling Expert",    exp:4,  rating:4.7, reviews:98,  bookings:312,  specialties:["Natural Hair","Relaxer","Styling","Wash & Go"],          img: IMAGES.stylists.fatima,  heroImg: IMAGES.services.natural,available:true },
  { id:"sophia-chen",     name:"Sophia Chen",      role:"Colour & Creative Specialist",     exp:6,  rating:4.9, reviews:156, bookings:490,  specialties:["Balayage","Creative Colour","Bleach & Tone","Ombre"],    img: IMAGES.stylists.amara,   heroImg: IMAGES.services.color, available:true  },
  { id:"james-obi",       name:"James Obi",        role:"Barber & Loc Specialist",          exp:3,  rating:4.6, reviews:72,  bookings:198,  specialties:["Fades","Shape-Ups","Locs","Braids"],                     img: IMAGES.stylists.emeka,   heroImg: IMAGES.services.beard, available:false },
];

const stylistsJsonLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "SalonOS Stylists",
  itemListElement: STYLISTS.map((s, i) => ({
    "@type": "ListItem", position: i + 1,
    item: {
      "@type": "Person",
      name: s.name, jobTitle: s.role,
      url: `https://salonos.co.uk/stylists/${s.id}`,
      worksFor: { "@type": "Organization", name: "SalonOS" },
    },
  })),
};

export default function StylistsPage() {
  return (
    <>
      <Script id="schema-stylists" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stylistsJsonLD) }} />
      <Script id="schema-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.breadcrumb([
          { name:"Home", url:"https://salonos.co.uk" },
          { name:"Stylists", url:"https://salonos.co.uk/stylists" },
        ])) }} />

      {/* Hero */}
      <section className="relative h-[52vh] min-h-[380px] flex items-end overflow-hidden bg-obsidian">
        <Image src={IMAGES.about.team} alt="SalonOS stylist team" fill priority
          className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/55 to-obsidian/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-gold" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">The Team</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.0]">
            Meet Our <em className="not-italic text-gold-gradient">Stylists</em>
          </h1>
          <p className="font-body text-base text-silver/80 mt-4 max-w-lg">
            12 expert artists across Notting Hill and Chelsea — each one hand-picked for skill, passion, and dedication to their craft.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-charcoal py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STYLISTS.map(s => (
              <Link key={s.id} href={`/stylists/${s.id}`} className="group block">
                <article className={`bg-graphite border rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold ${s.available ? "border-white/[0.07] hover:border-gold/25" : "border-white/[0.04] opacity-70"}`}>
                  {/* Hero image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image src={s.heroImg} alt={`${s.name} work`} fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/10 to-transparent" />
                    {!s.available && (
                      <div className="absolute top-4 right-4 font-body text-2xs px-3 py-1 rounded-full bg-obsidian/80 border border-ash/40 text-mist uppercase tracking-widest backdrop-blur-sm">
                        Currently unavailable
                      </div>
                    )}
                  </div>

                  {/* Profile */}
                  <div className="px-5 pb-5">
                    <div className="flex items-end gap-3 -mt-8 mb-4">
                      <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-3 border-graphite shadow-lg ring-2 ring-graphite shrink-0">
                        <Image src={s.img} alt={s.name} fill className="object-cover object-top" sizes="64px" />
                      </div>
                      <div className="mb-1">
                        <h2 className="font-heading text-lg text-white leading-tight">{s.name}</h2>
                        <p className="font-body text-xs text-mist">{s.role}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {s.specialties.slice(0,3).map(sp => (
                        <span key={sp} className="font-body text-2xs px-2.5 py-1 rounded-full bg-smoke border border-ash/40 text-silver uppercase tracking-wide">{sp}</span>
                      ))}
                      {s.specialties.length > 3 && (
                        <span className="font-body text-2xs px-2.5 py-1 rounded-full bg-smoke border border-ash/40 text-mist">+{s.specialties.length - 3}</span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 divide-x divide-ash/20 bg-smoke rounded-xl overflow-hidden mb-4">
                      {[
                        { label:"Rating", value:`${s.rating}★` },
                        { label:"Exp", value:`${s.exp}y` },
                        { label:"Clients", value: s.bookings > 999 ? `${(s.bookings/1000).toFixed(1)}k` : String(s.bookings) },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col items-center py-2.5">
                          <span className="font-display text-base text-gold-light leading-none">{value}</span>
                          <span className="font-body text-2xs text-mist uppercase tracking-wider mt-0.5">{label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1">View Profile</Button>
                      {s.available && (
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/book?stylist=${s.id}`} onClick={e => e.stopPropagation()}>
                            <Scissors className="h-3.5 w-3.5" /> Book
                          </Link>
                        </Button>
                      )}
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
