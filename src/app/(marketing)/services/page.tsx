import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { Button }            from "@/components/ui/button";
import { BookingCTA }        from "@/components/marketing/BookingCTA";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES }            from "@/lib/utils/images";
import { Clock, ArrowRight } from "lucide-react";
import type { ServiceCategory } from "@/types";

export const metadata: Metadata = pageMeta({
  title: "Hair & Beauty Services — Prices & Durations",
  description: "Browse all SalonOS services with transparent pricing. Box braids from £12,000, balayage from £25,000, precision cuts from £4,000. Book online today.",
  path: "/services",
  keywords: ["salon services London prices","box braids price London","balayage price London","keratin treatment London","beard trim London"],
});

const categories = [
  { key:"HAIR_CUT",     label:"Hair Cuts",     emoji:"✂️", img: IMAGES.services.haircut,   desc:"Shape, style, and refine — from classic cuts to creative transformations." },
  { key:"HAIR_COLOR",   label:"Color",         emoji:"🎨", img: IMAGES.services.color,     desc:"Balayage, highlights, full color, and creative toning by expert colorists." },
  { key:"BRAIDING",     label:"Braiding",      emoji:"🫶", img: IMAGES.services.braiding,  desc:"Knotless braids, cornrows, faux locs, and protective styles done right." },
  { key:"NATURAL_HAIR", label:"Natural Hair",  emoji:"🌿", img: IMAGES.services.natural,   desc:"Wash, style, twist-outs, and specialist care for natural textures." },
  { key:"TREATMENT",    label:"Treatments",    emoji:"✨", img: IMAGES.services.treatment, desc:"Keratin, deep conditioning, scalp therapy, and strengthening masks." },
  { key:"BEARD",        label:"Beard",         emoji:"🪒", img: IMAGES.services.beard,     desc:"Shape-ups, lineups, hot towel shaves, and full beard grooming." },
] as const;

const allServices: Array<{ id:string; name:string; description:string; category:ServiceCategory; durationMin:number; price:number }> = [
  { id:"s1",  name:"Precision Cut",          description:"Tailored cut for every face shape and hair type.",            category:"HAIR_CUT",     durationMin:60,  price:8000  },
  { id:"s2",  name:"Shape-Up & Lineup",       description:"Clean edges, temple taper, and sharp finish.",               category:"HAIR_CUT",     durationMin:30,  price:4000  },
  { id:"s3",  name:"Balayage",               description:"Hand-painted sun-kissed highlights with a natural blend.",    category:"HAIR_COLOR",   durationMin:180, price:35000 },
  { id:"s4",  name:"Full Color",             description:"Vibrant all-over color with professional-grade pigments.",    category:"HAIR_COLOR",   durationMin:120, price:25000 },
  { id:"s5",  name:"Highlights & Lowlights", description:"Dimensional tones using foil or babylights technique.",      category:"HAIR_COLOR",   durationMin:150, price:28000 },
  { id:"s6",  name:"Knotless Box Braids",    description:"Feed-in technique, lightweight and scalp-friendly.",          category:"BRAIDING",     durationMin:300, price:30000 },
  { id:"s7",  name:"Cornrows",               description:"Classic, stitch, or Ghana braids in any pattern.",           category:"BRAIDING",     durationMin:120, price:12000 },
  { id:"s8",  name:"Faux Locs",              description:"Full distressed or soft locs for a natural look.",           category:"BRAIDING",     durationMin:360, price:45000 },
  { id:"s9",  name:"Wash & Style",           description:"Shampoo, deep conditioning, blow-dry and style.",            category:"NATURAL_HAIR", durationMin:90,  price:10000 },
  { id:"s10", name:"Twist-Out Set",          description:"Two-strand twists with defined curl-out finish.",            category:"NATURAL_HAIR", durationMin:120, price:14000 },
  { id:"s11", name:"Loc Retwist",            description:"Palm rolling and interlocking for all loc stages.",          category:"NATURAL_HAIR", durationMin:90,  price:12000 },
  { id:"s12", name:"Keratin Treatment",      description:"Smoothing treatment for frizz-free hair up to 4 months.",   category:"TREATMENT",    durationMin:180, price:45000 },
  { id:"s13", name:"Deep Conditioning",      description:"Intensive moisture and protein repair mask.",                category:"TREATMENT",    durationMin:60,  price:8000  },
  { id:"s14", name:"Scalp Treatment",        description:"Targeted therapy for dandruff, dryness, or buildup.",       category:"TREATMENT",    durationMin:45,  price:7000  },
  { id:"s15", name:"Beard Shape & Lineup",   description:"Precision beard sculpting and crisp edge definition.",      category:"BEARD",        durationMin:30,  price:5000  },
  { id:"s16", name:"Hot Towel Shave",        description:"Classic straight-razor wet shave with hot towel finish.",   category:"BEARD",        durationMin:45,  price:7000  },
];

const serviceListJsonLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "SalonOS Services",
  itemListElement: allServices.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.name,
      description: s.description,
      offers: { "@type": "Offer", price: s.price, priceCurrency: "GBP" },
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <Script id="schema-services" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListJsonLD) }} />
      <Script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.breadcrumb([{ name:"Home", url:"https://salonos.co.uk" },{ name:"Services", url:"https://salonos.co.uk/services" }])) }} />

      {/* Hero — full bleed image */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end overflow-hidden bg-obsidian">
        <Image src={IMAGES.hero.wash} alt="SalonOS services" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-gold" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">What We Offer</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.0]">
            Our <em className="not-italic text-gold-gradient">Services</em>
          </h1>
          <p className="font-body text-base text-silver/80 mt-4 max-w-lg">Transparent pricing. Expert hands. Results you'll love.</p>
        </div>
      </section>

      {/* Category visual strip */}
      <section className="bg-charcoal py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
            {categories.map(cat => (
              <a key={cat.key} href={`#${cat.key.toLowerCase()}`}
                className="group flex flex-col gap-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image src={cat.img} alt={cat.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="200px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="text-xl">{cat.emoji}</span>
                  </div>
                </div>
                <p className="font-body text-xs text-center text-silver group-hover:text-gold transition-colors uppercase tracking-widest">{cat.label}</p>
              </a>
            ))}
          </div>

          {/* Services by category */}
          <div className="space-y-20">
            {categories.map(cat => {
              const svcs = allServices.filter(s => s.category === cat.key);
              return (
                <div key={cat.key} id={cat.key.toLowerCase()}>
                  {/* Category header with photo */}
                  <div className="flex items-center gap-5 mb-8">
                    <div className="relative h-14 w-14 rounded-2xl overflow-hidden shrink-0">
                      <Image src={cat.img} alt={cat.label} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-heading text-2xl text-white">{cat.emoji} {cat.label}</h2>
                      <p className="font-body text-sm text-mist">{cat.desc}</p>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-ash/40 to-transparent hidden md:block" />
                    <span className="font-mono text-xs text-mist shrink-0">{svcs.length} services</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {svcs.map(svc => {
                      const hrs = Math.floor(svc.durationMin / 60);
                      const mins = svc.durationMin % 60;
                      const dur  = hrs > 0 ? `${hrs}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;
                      return (
                        <div key={svc.id}
                          className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-graphite border border-white/[0.05] hover:border-gold/25 hover:bg-smoke transition-all duration-200"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-medium text-pearl">{svc.name}</p>
                            <p className="font-body text-xs text-mist mt-0.5">{svc.description}</p>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="flex items-center gap-1.5 font-body text-xs text-silver">
                              <Clock className="h-3.5 w-3.5 text-mist" />{dur}
                            </span>
                            <span className="font-display text-xl text-gold-light">£{svc.price.toLocaleString()}</span>
                            <Link href={`/book?service=${svc.id}`}
                              className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 font-body text-xs text-gold transition-all">
                              Book <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BookingCTA />
    </>
  );
}
