import type { Metadata } from "next";
import Script from "next/script";
import { HeroSection }         from "@/components/marketing/HeroSection";
import { ServicesPreview }     from "@/components/marketing/ServicesPreview";
import { StylistShowcase }     from "@/components/marketing/StylistShowcase";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { BookingCTA }          from "@/components/marketing/BookingCTA";
import { pageMeta, JSON_LD, BASE_URL }   from "@/lib/seo/metadata";

export const metadata: Metadata = pageMeta({
  title: "SalonOS — London' Premier Luxury Unisex Salon",
  description: "Book your next appointment at SalonOS — London' most trusted luxury unisex salon in Notting Hill & Chelsea. Expert stylists for every hair type, texture, and identity.",
  path: "/",
  image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=85",
  keywords: ["luxury salon London","unisex salon Notting Hill","book salon London","box braids London","balayage London","best hair salon United Kingdom"],
});

export default function HomePage() {
  return (
    <>
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.localBusiness) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD.faqPage([
          { q: "Where is SalonOS located?",           a: "SalonOS is located at 14 Portobello Road, Notting Hill, London W11 2DH, United Kingdom." },
          { q: "How do I book an appointment?",        a: `You can book online in under 2 minutes at ${BASE_URL}/book, or call us on +44 20 7946 0958.` },
          { q: "Do you offer services for all hair types?", a: "Yes — SalonOS is a unisex salon serving all hair types, textures, and identities including natural hair, relaxed hair, locs, and more." },
          { q: "What is your cancellation policy?",    a: "Bookings can be cancelled up to 2 hours before the appointment at no charge. No deposit is required when booking." },
          { q: "Do you offer braiding services?",      a: "Yes — we specialize in knotless box braids, cornrows, faux locs, and all protective styles." },
        ])) }}
      />
      <HeroSection />
      <ServicesPreview />
      <StylistShowcase />
      <TestimonialsSection />
      <BookingCTA />
    </>
  );
}
