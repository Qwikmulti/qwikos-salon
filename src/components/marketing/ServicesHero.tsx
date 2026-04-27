"use client";

import { motion } from "framer-motion";

export function ServicesHero() {
  return (
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
  );
}
