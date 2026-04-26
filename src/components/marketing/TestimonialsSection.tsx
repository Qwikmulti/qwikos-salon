"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { IMAGES } from "@/lib/utils/images";

const testimonials = [
  { name:"Adaeze O.", location:"Notting Hill, London",   service:"Knotless Box Braids", stylist:"Fatima Hassan",    rating:5, img:IMAGES.stylists.fatima, text:"Fatima is an absolute artist. My knotless braids lasted 8 weeks and looked fresh until the last day. The salon atmosphere is so luxurious — I felt like royalty from the moment I walked in." },
  { name:"Ngozi E.",  location:"Chelsea, London",       service:"Balayage Color",      stylist:"Amara Diallo",     rating:5, img:IMAGES.stylists.amara,  text:"I was nervous about bleaching my hair but Amara walked me through everything. The result was breathtaking — exactly the sun-kissed look I wanted. My hair actually feels healthier than before!" },
  { name:"Tunde A.",  location:"Kensington, London",    service:"Skin Fade + Beard",   stylist:"Emeka Nwachukwu",  rating:5, img:IMAGES.stylists.emeka,  text:"Emeka transformed my look completely. The attention to detail on my fade and beard lineup is unmatched in London. I get compliments every single week. Already booked my next appointment." },
  { name:"Chike M.",  location:"Notting Hill",   service:"Loc Retwist",         stylist:"Fatima Hassan",    rating:5, img:IMAGES.stylists.fatima, text:"Professional, punctual, and incredibly skilled. Fatima knows natural hair like no one else. My locs have never looked this healthy. The online booking was seamless too." },
  { name:"Bola K.",   location:"Brixton, London",     service:"Keratin Treatment",   stylist:"Amara Diallo",     rating:5, img:IMAGES.stylists.amara,  text:"The keratin treatment completely changed my life. No more 2-hour morning routines. Amara explained every step and my hair has been silk-smooth for 4 months. Worth every kobo." },
];

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const t = testimonials[idx];

  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [auto]);

  return (
    <section className="relative py-28 overflow-hidden bg-charcoal">
      {/* Background image — blurred salon */}
      <div className="absolute inset-0">
        <Image src={IMAGES.about.interior1} alt="" fill className="object-cover opacity-[0.06] blur-sm" sizes="100vw" />
        <div className="absolute inset-0 bg-charcoal/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-12 bg-gold" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">Client Stories</span>
            <span className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-5xl font-light text-white">
            What Our Clients <em className="not-italic text-gold-gradient">Say</em>
          </h2>
        </motion.div>

        {/* Main testimonial */}
        <div className="relative" onClick={() => setAuto(false)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-graphite/60 backdrop-blur-md border border-white/[0.08] rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              {/* Background quote mark */}
              <Quote className="absolute -top-2 -right-2 h-32 w-32 text-gold/[0.05]" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="font-display text-2xl md:text-3xl font-light text-white leading-relaxed mb-10 max-w-3xl">
                "{t.text}"
              </blockquote>

              {/* Attribution with photo */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                  <Image src={t.img} alt={t.stylist} width={56} height={56} className="object-cover object-top" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-pearl">{t.name}</p>
                  <p className="font-body text-xs text-mist">{t.location}</p>
                  <p className="font-body text-xs text-gold mt-0.5">{t.service} · {t.stylist}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => { setIdx(i); setAuto(false); }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? "bg-gold w-10" : "bg-ash/60 w-4 hover:bg-silver"}`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setIdx(i => (i - 1 + testimonials.length) % testimonials.length); setAuto(false); }}
                className="h-10 w-10 rounded-xl border border-ash/60 flex items-center justify-center text-silver hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all font-body">
                ←
              </button>
              <button onClick={() => { setIdx(i => (i + 1) % testimonials.length); setAuto(false); }}
                className="h-10 w-10 rounded-xl border border-ash/60 flex items-center justify-center text-silver hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all font-body">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
