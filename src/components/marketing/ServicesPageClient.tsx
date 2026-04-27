"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Search, Scissors, Star, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
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
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    },
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
      const offset = 120;
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
    <div className="bg-charcoal min-h-screen pb-32">
      {/* Search & Filter Bar - Sticky */}
      <div className={cn(
        "sticky top-[64px] z-40 transition-all duration-500",
        isScrolled 
          ? "bg-obsidian/80 backdrop-blur-2xl border-b border-white/[0.08] py-4 shadow-2xl" 
          : "bg-transparent py-8"
      )}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="relative w-full lg:w-[400px] group">
              <div className="absolute inset-0 bg-gold/5 rounded-full blur-xl group-focus-within:bg-gold/10 transition-colors" />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-ash group-focus-within:text-gold transition-all duration-300" />
              <input 
                type="text"
                placeholder="Find a treatment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative w-full bg-graphite/40 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-sm text-pearl placeholder:text-ash/60 focus:outline-none focus:border-gold/40 focus:bg-graphite/60 transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar scroll-smooth">
              <button
                onClick={() => setActiveCategory("ALL")}
                className={cn(
                  "relative whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-body tracking-widest uppercase transition-all duration-300",
                  activeCategory === "ALL" 
                    ? "bg-gold text-obsidian font-bold shadow-gold" 
                    : "bg-white/5 text-silver hover:bg-white/10 border border-white/5 hover:border-white/20"
                )}
              >
                All
                {activeCategory === "ALL" && (
                  <motion.div layoutId="activeCat" className="absolute inset-0 bg-gold rounded-full -z-10" />
                )}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    if (activeCategory === "ALL") {
                       setTimeout(() => scrollToCategory(cat.key), 100);
                    }
                  }}
                  className={cn(
                    "relative whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-body tracking-widest uppercase transition-all duration-300",
                    activeCategory === cat.key 
                      ? "text-obsidian font-bold" 
                      : "bg-white/5 text-silver hover:bg-white/10 border border-white/5 hover:border-white/20"
                  )}
                >
                  <span className="relative z-10">{cat.label}</span>
                  {activeCategory === cat.key && (
                    <motion.div layoutId="activeCat" className="absolute inset-0 bg-gold rounded-full shadow-gold" />
                  )}
                </button>
              ))}
            </div>
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
              className="space-y-32 pt-20"
            >
              {categories.map((cat, idx) => {
                const catServices = servicesByCategory[cat.key]?.filter(s => 
                  s.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if (!catServices?.length) return null;

                return (
                  <section key={cat.key} id={cat.key} className="scroll-mt-40 group/section">
                    <div className="flex flex-col lg:flex-row gap-16">
                      <div className="lg:w-2/5">
                        <div className="sticky top-48">
                          <div className="relative w-full aspect-[16/10] lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl group-hover/section:shadow-gold/5 transition-all duration-700">
                            <Image 
                              src={cat.img} 
                              alt={cat.label} 
                              fill 
                              className="object-cover transition-transform duration-1000 group-hover/section:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10">
                              <div className="flex items-center gap-3 mb-4">
                                <span className="h-px w-12 bg-gold" />
                                <span className="text-gold font-body text-xs uppercase tracking-[0.3em] font-bold">Category</span>
                              </div>
                              <h2 className="font-display text-5xl lg:text-6xl text-white mb-6 leading-tight">{cat.label}</h2>
                              <p className="font-body text-mist text-lg leading-relaxed opacity-80">{cat.desc}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-3/5">
                        <motion.div 
                          variants={containerVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: "-100px" }}
                          className="grid gap-6"
                        >
                          {catServices.map((s) => (
                            <ServiceListItem key={s.id} service={s} />
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
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="pt-20"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-16">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="h-5 w-5 text-gold animate-pulse" />
                    <span className="text-gold font-body text-xs uppercase tracking-[0.3em] font-bold">Selected Category</span>
                  </div>
                  <h2 className="font-display text-6xl md:text-8xl text-white mb-6 tracking-tight">
                    {categories.find(c => c.key === activeCategory)?.label}
                  </h2>
                  <p className="font-body text-mist text-xl leading-relaxed">
                    {categories.find(c => c.key === activeCategory)?.desc}
                  </p>
                </div>
                <div className="text-mist font-body text-sm bg-white/5 px-6 py-3 rounded-2xl border border-white/5 italic">
                  {filteredServices.length} Treatments Available
                </div>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredServices.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </motion.div>

              {filteredServices.length === 0 && (
                <div className="py-40 text-center">
                  <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                    <Search className="h-10 w-10 text-ash" />
                  </div>
                  <p className="font-display text-2xl text-pearl mb-2">No results found</p>
                  <p className="font-body text-ash">Try adjusting your search query or filter.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ServiceListItem({ service }: { service: Service }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex items-center gap-6 p-8 bg-smoke/30 backdrop-blur-sm border border-white/[0.04] rounded-[2rem] hover:border-gold/30 hover:bg-smoke/50 transition-all duration-500"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <h3 className="font-display text-2xl text-white group-hover:text-gold transition-colors duration-300">
            {service.name}
          </h3>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 font-body text-[10px] uppercase tracking-wider text-ash">
            <Clock className="h-3 w-3" /> {service.durationMin} min
          </span>
        </div>
        <p className="font-body text-sm text-mist leading-relaxed line-clamp-2 max-w-xl group-hover:text-silver transition-colors">
          {service.description}
        </p>
      </div>

      <div className="text-right shrink-0 flex flex-col items-end gap-6">
        <span className="font-display text-3xl text-gold-light">
          £{(Number(service.price) / 100).toFixed(0)}
        </span>
        <div className="flex gap-2">
           <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-full border border-white/5 hover:border-gold/30 group-hover:bg-gold/10" asChild title="View Details">
            <Link href={`/services/${service.id}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="sm" className="h-10 px-6 rounded-full font-bold group-hover:bg-gold group-hover:text-obsidian transition-all" asChild>
            <Link href={`/book?service=${service.id}`}>
              Book
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-r from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className="group relative bg-graphite/40 backdrop-blur-md border border-white/[0.06] rounded-[2.5rem] p-8 hover:border-gold/30 hover:bg-graphite/60 transition-all duration-500 shadow-xl"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500">
            <Scissors className="h-5 w-5" />
          </div>
          <h3 className="font-display text-3xl text-white group-hover:text-gold transition-colors leading-tight">
            {service.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-ash font-medium">
              <Clock className="h-3.5 w-3.5" /> {service.durationMin} min
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="font-display text-4xl text-gold-light tracking-tighter">
            £{(Number(service.price) / 100).toFixed(0)}
          </span>
        </div>
      </div>

      <p className="font-body text-base text-mist leading-relaxed mb-10 line-clamp-3 group-hover:text-silver transition-colors">
        {service.description}
      </p>

      <div className="flex gap-3">
        <Button size="lg" className="flex-1 rounded-[1.25rem] font-bold text-base h-14 group-hover:bg-gold group-hover:text-obsidian shadow-lg shadow-gold/5" asChild>
          <Link href={`/book?service=${service.id}`}>
            Book Appointment
          </Link>
        </Button>
        <Button size="lg" variant="ghost" className="h-14 w-14 p-0 rounded-[1.25rem] border border-white/5 hover:border-gold/30 hover:bg-gold/10 transition-all" asChild>
          <Link href={`/services/${service.id}`}>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="absolute -inset-px rounded-[2.5rem] bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
        <Sparkles className="h-6 w-6 text-gold/30" />
      </div>
    </motion.div>
  );
}
