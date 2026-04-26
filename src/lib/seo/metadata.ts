import type { Metadata } from "next";

const BASE_URL   = process.env.NEXT_PUBLIC_APP_URL ?? "https://salonos.co.uk";
const SALON_NAME = "SalonOS";
const TAGLINE    = "London's Premier Unisex Salon";
const DESC       = "SalonOS is London's most trusted luxury unisex salon in Notting Hill & Chelsea. Expert stylists for every hair type, texture, and identity. Book online in under 2 minutes.";
const OG_IMAGE   = `${BASE_URL}/og-image.jpg`;

export const ROOT_METADATA: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: `${SALON_NAME} — ${TAGLINE}`, template: `%s | ${SALON_NAME}` },
  description: DESC,
  keywords: ["luxury salon London","unisex salon Notting Hill","hair salon Chelsea","box braids London","balayage London","natural hair salon London","beard grooming London","keratin treatment London","best salon West London","book salon online London"],
  authors: [{ name: SALON_NAME, url: BASE_URL }],
  creator: SALON_NAME, publisher: SALON_NAME,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: { type: "website", locale: "en_GB", url: BASE_URL, siteName: SALON_NAME, title: `${SALON_NAME} — ${TAGLINE}`, description: DESC, images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SALON_NAME} — ${TAGLINE}` }] },
  twitter: { card: "summary_large_image", title: `${SALON_NAME} — ${TAGLINE}`, description: DESC, images: [OG_IMAGE], creator: "@salonos_uk" },
  alternates: { canonical: BASE_URL },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export function pageMeta(opts: { title: string; description: string; path: string; image?: string; keywords?: string[] }): Metadata {
  const url   = `${BASE_URL}${opts.path}`;
  const image = opts.image ?? OG_IMAGE;
  return {
    title: opts.title, description: opts.description, keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: { title: `${opts.title} | ${SALON_NAME}`, description: opts.description, url, images: [{ url: image, width: 1200, height: 630, alt: opts.title }] },
    twitter: { card: "summary_large_image", title: `${opts.title} | ${SALON_NAME}`, description: opts.description, images: [image] },
  };
}

export const JSON_LD = {
  localBusiness: {
    "@context": "https://schema.org",
    "@type": ["HairSalon","LocalBusiness"],
    name: SALON_NAME, description: DESC, url: BASE_URL,
    telephone: "+44-20-7946-0958", email: "hello@salonos.co.uk",
    priceRange: "£££", image: OG_IMAGE,
    address: { "@type": "PostalAddress", streetAddress: "14 Portobello Road", addressLocality: "Notting Hill", addressRegion: "London", postalCode: "W11 2DH", addressCountry: "GB" },
    geo: { "@type": "GeoCoordinates", latitude: 51.5152, longitude: -0.2018 },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday"], opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday"], opens: "09:00", closes: "20:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday","Sunday"], opens: "10:00", closes: "16:00" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "847", bestRating: "5" },
    sameAs: ["https://instagram.com/salonos.uk","https://twitter.com/salonos_uk"],
  },
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url })),
  }),
  faqPage: (faqs: Array<{ q: string; a: string }>) => ({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  }),
};
