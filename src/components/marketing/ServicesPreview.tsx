import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { IMAGES } from "@/lib/utils/images";

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    take: 6,
  });
}

export async function ServicesPreview() {
  const services = await getServices();

  const serviceSlugs: Record<string, string> = {
    HAIR_CUT: "haircut", HAIR_COLOR: "color", BRAIDING: "braiding",
    NATURAL_HAIR: "natural", TREATMENT: "treatment", BEARD: "beard",
  };

  return (
    <section className="bg-charcoal py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white/[0.02]" />
        <div className="absolute left-[75%] top-0 bottom-0 w-px bg-white/[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">Our Services</p>
          <h2 className="font-display text-5xl text-white mb-4">Hair & Beauty</h2>
          <p className="font-body text-mist max-w-xl">
            Expert styling for every hair type. From precision cuts to vibrant color,
            protective braids to luxury treatments.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const slug = serviceSlugs[s.category] ?? "services";
            const tag = i === 0 ? "Most Booked" : i === 1 ? "Trending" : null;
            const img = (IMAGES.services as Record<string, string>)[s.category.toLowerCase()] ?? IMAGES.services.haircut;

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/${slug}`}
                  className="group block bg-graphite border border-ash/30 rounded-2xl overflow-hidden hover:border-gold/30 transition-all"
                >
                  <div className="relative h-48">
                    <Image src={img} alt={s.name} fill className="object-cover" />
                    {tag && (
                      <span className="absolute top-4 left-4 px-2 py-1 rounded-md bg-gold/20 border border-gold/30 text-gold-light font-body text-2xs uppercase tracking-widest">
                        {tag}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="font-heading text-lg text-white mb-1 group-hover:text-gold transition-colors">
                      {s.name}
                    </p>
                    <p className="font-body text-xs text-mist mb-3 line-clamp-2">
                      {s.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-gold-light">
                        From £{(Number(s.price) / 100).toFixed(0)}
                      </span>
                      <span className="font-body text-xs text-ash flex items-center gap-1">
                        <Clock className="h-3 w-3" />{s.durationMin} min
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="secondary">
            <Link href="/services">
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}