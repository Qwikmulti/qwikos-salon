"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Clock, Shield } from "lucide-react";
import { IMAGES } from "@/lib/utils/images";

const perks = [
  { icon: CalendarDays, text: "Book in under 2 minutes" },
  { icon: Clock,        text: "Cancel up to 2hrs before" },
  { icon: Shield,       text: "No deposit required" },
];

export function BookingCTA() {
  return (
    <section className="relative py-0 overflow-hidden bg-obsidian">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 min-h-[520px]">

          {/* Left — image */}
          <div className="relative hidden lg:block">
            <Image
              src={IMAGES.hero.salon}
              alt="Book your SalonOS appointment"
              fill className="object-cover object-center"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-obsidian" />
            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-12 left-8 glass rounded-2xl px-6 py-4 border border-white/10"
            >
              <p className="font-body text-xs text-mist mb-1 uppercase tracking-widest">Next available</p>
              <p className="font-display text-2xl text-white">Today · 3:00 PM</p>
              <p className="font-body text-xs text-gold mt-1">2 slots remaining</p>
            </motion.div>
          </div>

          {/* Right — CTA content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col justify-center px-8 md:px-16 py-20 bg-obsidian"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">Ready?</span>
            </div>

            <h2 className="font-display text-5xl md:text-6xl font-light text-white leading-[1.0] mb-6">
              Your Next<br />
              <em className="not-italic text-gold-gradient">Look Awaits.</em>
            </h2>

            <p className="font-body text-base text-mist mb-8 max-w-sm leading-relaxed">
              Join 3,200+ clients who trust SalonOS for their hair, beard, and style needs. Book your appointment online — it takes less than 2 minutes.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {perks.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-gold" />
                  </div>
                  <span className="font-body text-sm text-silver">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/book" className="group">
                  Book Appointment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/contact">Call Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
