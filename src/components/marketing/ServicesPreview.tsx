"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { IMAGES } from "@/lib/utils/images";

const services = [
  { slug:"haircut",   name:"Precision Cuts",      short:"From £25",  duration:"30–60 min", img: IMAGES.services.haircut,   tag:"Most Booked",  desc:"Tailored for every face shape and texture" },
  { slug:"braiding",  name:"Braiding & Locs",      short:"From £45", duration:"2–6 hrs",   img: IMAGES.services.braiding,  tag:"Speciality",   desc:"Knotless, cornrows, faux locs, and more" },
  { slug:"color",     name:"Color & Highlights",   short:"From £95", duration:"2–4 hrs",   img: IMAGES.services.color,     tag:"Trending",     desc:"Balayage, full color, and creative toning" },
  { slug:"natural",   name:"Natural Hair",         short:"From £40", duration:"1–3 hrs",   img: IMAGES.services.natural,   tag:null,           desc:"Wash, style, twist-outs, and loc care" },
  { slug:"treatment", name:"Treatments",           short:"From £35",  duration:"45–3 hrs",  img: IMAGES.services.treatment, tag:"Premium",      desc:"Keratin, deep conditioning, scalp therapy" },
  { slug:"beard",     name:"Beard Grooming",       short:"From £25",  duration:"30–45 min", img: IMAGES.services.beard,     tag:null,           desc:"Shape-ups, lineups, and hot towel shaves" },
];

export function ServicesPreview() {
  return (
    <section className="bg-charcoal py-28 relative overflow-hidden">
      {/* Vertical rhythm lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white/[0.02]" />
        <div className="absolute left-[75%] top-0 bottom-0 w-px bg-white/[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header — asymmetric */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8 items-end mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-12 bg-gold" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">What We Offer</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light text-white leading-[1.0]">
              Every Service.<br /><em className="text-gold-gradient not-italic">Expertly Done.</em>
            </h2>
          </div>
          <div className="flex flex-col gap-4 lg:items-end lg:text-right">
            <p className="font-body text-base text-mist max-w-sm">
              From precision cuts to full color transformations — each service is delivered with care, skill, and intention.
            </p>
            <Button variant="outline-gold" size="sm" asChild>
              <Link href="/services" className="group">
                See full price list <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Services grid — bento-style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.55, ease: "easeOut" }}
            >
              <Link href={`/services#${svc.slug}`} className="group block relative rounded-3xl overflow-hidden aspect-[4/5] bg-graphite">
                {/* Photo */}
                <Image
                  src={svc.img} alt={svc.name} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                {/* Tag */}
                {svc.tag && (
                  <div className="absolute top-4 left-4">
                    <span className="font-body text-2xs px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light backdrop-blur-sm uppercase tracking-widest">
                      {svc.tag}
                    </span>
                  </div>
                )}

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-body text-xs text-silver/70 mb-1">{svc.desc}</p>
                  <h3 className="font-heading text-xl text-white mb-3">{svc.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-mist">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-body text-xs">{svc.duration}</span>
                    </div>
                    <span className="font-display text-xl text-gold-light">{svc.short}</span>
                  </div>
                  {/* Arrow on hover */}
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="font-body text-xs text-gold">Book this service</span>
                    <ArrowRight className="h-3.5 w-3.5 text-gold" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
