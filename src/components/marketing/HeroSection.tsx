"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Play, ChevronDown } from "lucide-react";
import { IMAGES } from "@/lib/utils/images";
import { cn } from "@/lib/utils/cn";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const floatingAnimation = {
  y: [0, -12, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-end overflow-hidden bg-obsidian pb-0"
    >
      {/* Full-bleed background with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
        <Image
          src={IMAGES.hero.main}
          alt="SalonOS luxury salon interior"
          fill
          priority
          quality={100}
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        {/* Darkening overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/85 to-obsidian/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
          }}
        />
      </motion.div>

      {/* Floating image collage — desktop */}
      <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden xl:block z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
          transition={{
            opacity: { delay: 0.8, duration: 1 },
            x: { delay: 0.8, duration: 1 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-24 right-16 w-56 h-72 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <Image
            src={IMAGES.hero.portrait1}
            alt="Stylist at work"
            fill
            className="object-cover"
            sizes="224px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40, y: 40 }}
          animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1.1, duration: 1 },
            x: { delay: 1.1, duration: 1 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
          className="absolute top-64 right-[280px] w-44 h-56 rounded-3xl overflow-hidden border border-white/10 shadow-xl"
        >
          <Image
            src={IMAGES.hero.braids}
            alt="Box braids"
            fill
            className="object-cover object-top"
            sizes="176px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 1.4, duration: 1 },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
          className="absolute bottom-32 right-12 w-64 h-44 rounded-3xl overflow-hidden border border-white/10 shadow-xl"
        >
          <Image
            src={IMAGES.hero.barber}
            alt="Barber fade"
            fill
            className="object-cover object-top"
            sizes="256px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="font-body text-2xs px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light backdrop-blur-sm uppercase tracking-widest">
              Premium Fade
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: 1.6, duration: 1.5 }}
          className="absolute top-48 right-48 w-32 h-32 rounded-full border border-gold/20 blur-sm"
        />
      </div>

      {/* Floating review chip */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { delay: 1.8, duration: 0.8 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-32 right-8 xl:right-[44%] hidden md:flex items-center gap-3 glass rounded-2xl px-5 py-3.5 border border-white/10 z-20"
      >
        <div className="flex -space-x-2">
          {[IMAGES.stylists.fatima, IMAGES.stylists.amara, IMAGES.stylists.emeka].map(
            (src, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-charcoal overflow-hidden"
              >
                <Image
                  src={src}
                  alt="Stylist"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            )
          )}
        </div>
        <div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className="h-3 w-3 fill-gold text-gold" />
            ))}
          </div>
          <p className="font-body text-xs text-silver">4.9 · 847 reviews</p>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-20 max-w-7xl mx-auto px-6 w-full pb-20 pt-32"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="max-w-3xl"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-gold" />
            <span className="font-body text-xs font-semibold tracking-[0.22em] uppercase text-gold">
              Notting Hill · Chelsea · London
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display leading-[0.95] tracking-[-0.03em] mb-8"
            style={{ fontSize: "clamp(56px, 9vw, 120px)", fontWeight: 300 }}
          >
            <span className="text-white block">Where Every</span>
            <span className="text-white block">Head Tells a</span>
            <em className="block not-italic text-gold-shimmer">Story.</em>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-body text-lg md:text-xl font-light text-silver/80 leading-relaxed mb-10 max-w-xl"
          >
            London's most trusted unisex salon — 12 expert stylists, every texture, every
            identity. Book your experience online in under 2 minutes.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-16">
            <Button size="lg" asChild>
              <Link href="/book" className="group">
                Book Appointment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <button className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-gold/50 transition-colors backdrop-blur-sm">
                <Play className="h-4 w-4 text-white fill-white ml-0.5" />
              </div>
              <span className="font-body text-sm text-silver group-hover:text-pearl transition-colors">
                Watch our story
              </span>
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-10">
            {[
              { value: "3.2k+", label: "Happy clients" },
              { value: "12", label: "Expert stylists" },
              { value: "4.9★", label: "Average rating" },
              { value: "7yr", label: "In business" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-display text-3xl font-light text-white leading-none">
                  {value}
                </span>
                <span className="font-body text-xs text-mist uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-ash/60">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-gold/60" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal to-transparent z-20" />
    </section>
  );
}
