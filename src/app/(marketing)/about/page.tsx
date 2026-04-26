import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { Button }            from "@/components/ui/button";
import { BookingCTA }        from "@/components/marketing/BookingCTA";
import { pageMeta, JSON_LD } from "@/lib/seo/metadata";
import { IMAGES }            from "@/lib/utils/images";
import { Award, Heart, Users, Leaf } from "lucide-react";

export const metadata: Metadata = pageMeta({
  title: "About SalonOS — Our Story, Values & Team",
  description: "Founded in Notting Hill in 2018, SalonOS has grown to become London' most trusted unisex salon. Meet our team and discover our story.",
  path: "/about",
  image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1200&q=85",
  keywords: ["about SalonOS","London salon history","unisex salon Notting Hill","best hair salon London story"],
});

const values = [
  { icon: Award,  title: "Excellence",   desc: "We hold ourselves to the highest standard in every cut, color, and style." },
  { icon: Heart,  title: "Inclusivity",  desc: "Our salon is a safe, welcoming space for every identity, texture, and expression." },
  { icon: Users,  title: "Community",    desc: "We invest in our stylists and give back to the neighbourhoods we serve." },
  { icon: Leaf,   title: "Integrity",    desc: "Honest pricing, honest results. No upsells, no pressure — just great service." },
];

const milestones = [
  { year:"2018", event:"Founded in Notting Hill with 2 chairs and a vision to create an inclusive space." },
  { year:"2019", event:"Expanded to a full 8-stylist team and launched our first online booking system." },
  { year:"2021", event:"Opened our second location in Chelsea to serve the entire London mainland." },
  { year:"2023", event:"Built and launched SalonOS — our own booking & management platform." },
  { year:"2024", event:"Surpassed 10,000 happy clients and 500+ 5-star reviews across platforms." },
  { year:"2026", event:"12 stylists, 2 locations, and growing. The journey continues." },
];

export default function AboutPage() {
  return (
    <>
      <Script id="schema-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.breadcrumb([
          { name:"Home", url:"https://salonos.co.uk" },
          { name:"About", url:"https://salonos.co.uk/about" },
        ])) }}
      />

      {/* Hero — full bleed split */}
      <section className="relative min-h-[90vh] flex items-center bg-obsidian overflow-hidden pt-16">
        {/* Right half — photo */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2">
          <Image src={IMAGES.about.interior1} alt="SalonOS salon interior" fill
            className="object-cover object-center" priority sizes="(max-width:1024px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent lg:bg-gradient-to-r lg:from-obsidian lg:via-obsidian/20 lg:to-transparent" />
          <div className="absolute inset-0 lg:hidden bg-obsidian/70" />
        </div>

        {/* Left half — copy */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">Our Story</span>
            </div>
            <h1 className="font-display text-6xl md:text-7xl font-light text-white leading-[1.0] mb-6">
              More Than<br />a Haircut.
            </h1>
            <p className="font-body text-lg text-silver/80 leading-relaxed mb-5">
              SalonOS was born from a simple belief: every person deserves to feel seen, valued, and beautiful — regardless of their hair type, gender, or background.
            </p>
            <p className="font-body text-base text-mist leading-relaxed mb-10">
              Founded in Notting Hill in 2018, we've grown from a two-chair studio into London' most trusted unisex salon. We built our own technology platform so that booking feels as seamless as the service itself.
            </p>
            <div className="flex gap-8 mb-10">
              {[["10k+","Clients served"],["12","Expert stylists"],["7yr","In business"]].map(([v,l]) => (
                <div key={l}>
                  <p className="font-display text-3xl text-white">{v}</p>
                  <p className="font-body text-xs text-mist uppercase tracking-widest">{l}</p>
                </div>
              ))}
            </div>
            <Button asChild>
              <Link href="/book">Book Your Experience</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-charcoal py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-12 bg-gold" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">What Drives Us</span>
              <span className="h-px w-12 bg-gold" />
            </div>
            <h2 className="font-display text-5xl font-light text-white">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-graphite border border-white/[0.06] rounded-2xl p-6 hover:border-gold/25 hover:shadow-gold transition-all duration-300 group">
                <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold/15 transition-colors">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-heading text-xl text-white mb-2">{title}</h3>
                <p className="font-body text-sm text-mist leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interior photo break */}
      <section className="relative h-72 overflow-hidden">
        <Image src={IMAGES.about.interior2} alt="SalonOS interior" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-obsidian/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-4xl md:text-6xl italic text-white/90 text-center px-6">
            "Crafted for every identity."
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-obsidian py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-12 bg-gold" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">The Journey</span>
              <span className="h-px w-12 bg-gold" />
            </div>
            <h2 className="font-display text-5xl font-light text-white">How We Got Here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[76px] top-3 bottom-3 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent" />
            <div className="space-y-10">
              {milestones.map(({ year, event }) => (
                <div key={year} className="flex items-start gap-8">
                  <div className="w-20 shrink-0">
                    <span className="font-mono text-sm text-gold bg-gold/10 border border-gold/25 rounded-lg px-2.5 py-1.5 block text-center">{year}</span>
                  </div>
                  <div className="relative pt-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-gold absolute -left-[26px] top-2 shadow-[0_0_8px_rgba(201,151,59,0.5)]" />
                    <p className="font-body text-base text-pearl leading-relaxed">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team photo strip */}
      <section className="bg-charcoal py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden h-72 md:h-96">
            <Image src={IMAGES.about.team} alt="SalonOS team" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 to-transparent" />
            <div className="absolute inset-0 flex items-center px-10 md:px-16">
              <div className="max-w-lg">
                <p className="font-display text-3xl md:text-5xl italic text-white/90 mb-4">Our team is our strength.</p>
                <p className="font-body text-base text-silver/80">12 passionate stylists committed to making every client feel extraordinary.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingCTA />
    </>
  );
}
