import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Globe } from "lucide-react";
import { IMAGES } from "@/lib/utils/images";

async function getStylists() {
  return prisma.stylist.findMany({
    where: { isActive: true },
    include: { profile: true },
    orderBy: { yearsExperience: "desc" },
    take: 6,
  });
}

export async function StylistShowcase() {
  const stylists = await getStylists();

  return (
    <section className="bg-obsidian py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="font-body text-xs uppercase tracking-widest text-gold mb-4">Our Team</p>
          <h2 className="font-display text-5xl text-white mb-4">Expert Stylists</h2>
          <p className="font-body text-mist max-w-xl">
            Our team of skilled professionals specialize in every hair type and style.
            Book with your favorite stylist or let us match you with someone great.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stylists.map((stylist, i) => (
            <motion.div
              key={stylist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/stylists/${stylist.id}`}
                className="group block bg-graphite border border-ash/30 rounded-2xl overflow-hidden hover:border-gold/30 transition-all"
              >
                <div className="relative h-64">
                  <Image
                    src={stylist.heroImageUrl ?? IMAGES.hero.braids}
                    alt={stylist.profile.fullName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
                  {stylist.instagramHandle && (
                    <a
                      href={`https://instagram.com/${stylist.instagramHandle.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 p-2 rounded-full bg-obsidian/80 text-silver hover:text-gold transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-heading text-lg text-white mb-1 group-hover:text-gold transition-colors">
                    {stylist.profile.fullName}
                  </p>
                  <p className="font-body text-xs text-mist mb-3 line-clamp-2">
                    {stylist.bio}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {stylist.specialties.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-smoke text-ash font-body text-2xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-body text-xs text-ash">{stylist.yearsExperience}y exp</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="secondary">
            <Link href="/stylists">
              Meet the Team <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}