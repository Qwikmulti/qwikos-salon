"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Search, Scissors, Star, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Service } from "@prisma/client";

interface ServicesPageClientProps {
  services: Service[];
  categories: any[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ServicesPageClient({ services, categories }: ServicesPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = activeCategory === "ALL" || s.category === activeCategory;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, Service[]> = {};
    categories.forEach(cat => {
      grouped[cat.key] = services.filter(s => s.category === cat.key);
    });
    return grouped;
  }, [services, categories]);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-charcoal min-h-screen pb-20">
      {/* Search & Filter Bar - Sticky */}
      <div className={cn(
        "sticky top-16 z-40 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-obsidian/80 backdrop-blur-xl border-white/[0.08] py-3 shadow-xl" 
          : "bg-transparent border-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash group-focus-within:text-gold transition-colors" />
            <input 
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-graphite/50 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-pearl placeholder:text-ash focus:outline-none focus:border-gold/50 focus:bg-graphite transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-body transition-all",
                activeCategory === "ALL" 
                  ? "bg-gold text-obsidian font-semibold" 
                  : "bg-white/5 text-silver hover:bg-white/10"
              )}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  if (activeCategory === "ALL") {
                     // If switching from ALL, scroll to the section
                     setTimeout(() => scrollToCategory(cat.key), 100);
                  }
                }}
                className={cn(
                  "whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-body transition-all",
                  activeCategory === cat.key 
                    ? "bg-gold text-obsidian font-semibold" 
                    : "bg-white/5 text-silver hover:bg-white/10"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeCategory === "ALL" ? (
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24 pt-12"
            >
              {categories.map((cat, idx) => {
                const catServices = servicesByCategory[cat.key]?.filter(s => 
                  s.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if (!catServices?.length) return null;

                return (
                  <section key={cat.key} id={cat.key} className="scroll-mt-32">
                    <div className="flex flex-col lg:flex-row gap-12">
                      <div className="lg:w-1/3">
                        <div className="sticky top-40">
                          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-2xl">
                            <Image src={cat.img} alt={cat.label} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6">
                              <span className="text-3xl mb-2 block">{cat.emoji}</span>
                              <h2 className="font-display text-4xl text-white">{cat.label}</h2>
                            </div>
                          </div>
                          <p className="font-body text-mist leading-relaxed">{cat.desc}</p>
                        </div>
                      </div>

                      <div className="lg:w-2/3">
                        <motion.div 
                          variants={containerVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="grid sm:grid-cols-2 gap-4"
                        >
                          {catServices.map((s) => (
                            <ServiceCard key={s.id} service={s} />
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="filtered"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="pt-12"
            >
              <div className="mb-12">
                <h2 className="font-display text-5xl text-white mb-4">
                  {categories.find(c => c.key === activeCategory)?.label}
                </h2>
                <p className="font-body text-mist max-w-2xl">
                  {categories.find(c => c.key === activeCategory)?.desc}
                </p>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredServices.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </motion.div>

              {filteredServices.length === 0 && (
                <div className="py-20 text-center">
                  <p className="font-body text-ash text-lg">No services found matching your search.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="group relative bg-graphite/40 backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 hover:border-gold/30 hover:bg-graphite/60 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-heading text-lg text-white group-hover:text-gold transition-colors mb-1">
            {service.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-body text-[10px] uppercase tracking-wider text-ash">
              <Clock className="h-3 w-3" /> {service.durationMin} min
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="font-display text-2xl text-gold-light">
            £{(Number(service.price) / 100).toFixed(0)}
          </span>
        </div>
      </div>

      <p className="font-body text-xs text-mist leading-relaxed mb-6 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
        {service.description}
      </p>

      <div className="flex gap-2">
        <Button size="sm" className="flex-1 rounded-xl group-hover:bg-gold group-hover:text-obsidian" asChild>
          <Link href={`/book?service=${service.id}`}>
            Book Now
          </Link>
        </Button>
        <Button size="sm" variant="ghost" className="px-3 rounded-xl border border-white/5 hover:border-gold/30">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Subtle glow on hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
