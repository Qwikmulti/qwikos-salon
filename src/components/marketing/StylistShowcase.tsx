import { prisma } from "@/lib/prisma/client";
import { StylistShowcaseClient } from "./StylistShowcaseClient";

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
  // @ts-ignore - Prisma types with include can be tricky, but this matches what the client component expects
  return <StylistShowcaseClient stylists={stylists} />;
}