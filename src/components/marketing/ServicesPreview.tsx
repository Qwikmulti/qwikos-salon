import { prisma } from "@/lib/prisma/client";
import { ServicesPreviewClient } from "./ServicesPreviewClient";

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    take: 6,
  });
}

export async function ServicesPreview() {
  const services = await getServices();
  return <ServicesPreviewClient services={services} />;
}