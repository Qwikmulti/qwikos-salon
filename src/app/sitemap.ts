import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://salonos.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: BASE,           priority: 1.0,  changeFrequency: "weekly"  as const },
    { url: `${BASE}/services`, priority: 0.9,  changeFrequency: "weekly"  as const },
    { url: `${BASE}/stylists`, priority: 0.9,  changeFrequency: "weekly"  as const },
    { url: `${BASE}/about`,    priority: 0.7,  changeFrequency: "monthly" as const },
    { url: `${BASE}/blog`,     priority: 0.8,  changeFrequency: "weekly"  as const },
    { url: `${BASE}/contact`,  priority: 0.7,  changeFrequency: "monthly" as const },
    { url: `${BASE}/book`,     priority: 0.95, changeFrequency: "daily"   as const },
  ];

  const blogPosts = [
    "how-to-maintain-box-braids",
    "balayage-vs-highlights",
    "scalp-health-guide",
    "mens-grooming-routine-2026",
    "keratin-treatment-faq",
    "natural-hair-porosity",
  ].map(slug => ({
    url: `${BASE}/blog/${slug}`,
    priority: 0.7 as const,
    changeFrequency: "monthly" as const,
    lastModified: now,
  }));

  return [
    ...staticPages.map(p => ({ ...p, lastModified: now })),
    ...blogPosts,
  ];
}
