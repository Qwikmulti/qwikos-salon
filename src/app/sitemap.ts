import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma/client";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://salonos.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = [
    { url: BASE,           priority: 1.0,  changeFrequency: "weekly"  as const },
    { url: `${BASE}/services`, priority: 0.9,  changeFrequency: "weekly"  as const },
    { url: `${BASE}/stylists`, priority: 0.9,  changeFrequency: "weekly"  as const },
    { url: `${BASE}/about`,    priority: 0.7,  changeFrequency: "monthly" as const },
    { url: `${BASE}/blog`,     priority: 0.8,  changeFrequency: "weekly"  as const },
    { url: `${BASE}/contact`,  priority: 0.7,  changeFrequency: "monthly" as const },
    { url: `${BASE}/book`,     priority: 0.95, changeFrequency: "daily"   as const },
  ].map(p => ({ ...p, lastModified: now }));

  // Dynamic Blog Posts
  const dbPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  });
  
  const blogUrls = dbPosts.map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: p.updatedAt,
  }));

  // Dynamic Services
  const dbServices = await prisma.service.findMany({
    select: { id: true, updatedAt: true }
  });

  const serviceUrls = dbServices.map(s => ({
    url: `${BASE}/services/${s.id}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
    lastModified: s.updatedAt,
  }));

  // Dynamic Stylists
  const dbStylists = await prisma.stylist.findMany({
    where: { status: "APPROVED" },
    select: { id: true, updatedAt: true }
  });

  const stylistUrls = dbStylists.map(s => ({
    url: `${BASE}/stylists/${s.id}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
    lastModified: s.updatedAt,
  }));

  return [
    ...staticPages,
    ...blogUrls,
    ...serviceUrls,
    ...stylistUrls,
  ];
}
