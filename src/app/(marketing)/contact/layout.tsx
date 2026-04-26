import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMeta({
  title: "Contact Us — Book, Enquire or Visit",
  description: "Contact SalonOS in Notting Hill, London. Book an appointment, ask a question, or find our location. Call +44 20 7946 0958 or email hello@salonos.co.uk.",
  path: "/contact",
  keywords: ["contact salon London","SalonOS address","book hair appointment London","salon Notting Hill phone number"],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
