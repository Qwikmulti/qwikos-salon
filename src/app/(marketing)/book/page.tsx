import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Book Appointment" };

interface Props { searchParams: Promise<{ service?: string; stylist?: string }> }

export default async function BookPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { service, stylist } = await searchParams;

  if (!user) {
    const params = new URLSearchParams();
    if (service) params.set("service", service);
    if (stylist) params.set("stylist", stylist);
    const qs = params.toString();
    const returnPath = `/book${qs ? `?${qs}` : ''}`;
    redirect(`/login?next=${encodeURIComponent(returnPath)}`);
  }
  return (
    <section className="min-h-screen bg-charcoal py-8">
      {/* Header banner */}
      <div className="bg-obsidian border-b border-white/[0.05] py-8 mb-4">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-8 bg-gold" />
            <span className="font-body text-xs font-semibold tracking-[0.18em] uppercase text-gold">Online Booking</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h1 className="font-display text-4xl font-light text-white">
            Book Your <span className="italic text-gold-gradient">Appointment</span>
          </h1>
        </div>
      </div>
      <BookingWizard initialServiceId={service} initialStylistId={stylist} />
    </section>
  );
}
