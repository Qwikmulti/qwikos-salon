import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { CalendarDays, Clock, Scissors, Plus, ArrowRight, Star } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils/dates";

export const metadata: Metadata = { title: "My Dashboard" };

const statusVariant = { CONFIRMED: "success", PENDING: "warning", CANCELLED: "danger", COMPLETED: "info", NO_SHOW: "default" } as const;

export default async function CustomerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) redirect("/onboarding");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = await prisma.booking.findMany({
    where: {
      customerId: user.id,
      startAt: { gte: today },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    include: {
      stylist: { include: { profile: { select: { fullName: true } } } },
      service: { select: { name: true } },
    },
    orderBy: { startAt: "asc" },
    take: 5,
  });

  const nextAvailable = null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Welcome back"
        title={`Hi, ${profile.fullName.split(" ")[0]}`}
        description="Manage your appointments and booking history"
        actions={
          <Button asChild>
            <Link href="/book">
              <Plus className="h-4 w-4" /> Book Appointment
            </Link>
          </Button>
        }
        className="mb-10"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-heading text-xl text-white">Upcoming Appointments</h2>

          {upcoming.length === 0 ? (
            <Card>
              <EmptyState
                icon={<CalendarDays className="h-7 w-7 text-mist" />}
                title="No upcoming bookings"
                description="Book your next appointment and it'll appear here."
                action={{ label: "Book Now", onClick: () => {} }}
              />
            </Card>
          ) : (
            upcoming.map((b) => (
              <Card key={b.id} variant="elevated" className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={b.stylist.profile.fullName} size="md" status="online" />
                    <div>
                      <p className="font-body text-sm font-medium text-pearl">{b.service.name}</p>
                      <p className="font-body text-xs text-mist">with {b.stylist.profile.fullName}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[b.status]}>{b.status.toLowerCase()}</Badge>
                </div>
                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/[0.05]">
                  <span className="flex items-center gap-1.5 font-body text-xs text-silver">
                    <CalendarDays className="h-3.5 w-3.5 text-mist" />{formatDate(new Date(b.startAt))}
                  </span>
                  <span className="flex items-center gap-1.5 font-body text-xs text-silver">
                    <Clock className="h-3.5 w-3.5 text-mist" />{formatTime(new Date(b.startAt))} – {formatTime(new Date(b.endAt))}
                  </span>
                </div>
              </Card>
            ))
          )}

          <Link href="/bookings" className="flex items-center gap-1.5 font-body text-sm text-gold hover:text-gold-light transition-colors group">
            View all bookings <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {nextAvailable && (
            <Card variant="gold">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center">
                  <Scissors className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-heading text-base text-white">Quick Book</p>
                  <p className="font-body text-xs text-mist">Next slot available today</p>
                </div>
              </div>
              <p className="font-display text-2xl text-gold-light mb-4">Today, 3:00 PM</p>
              <Button size="sm" className="w-full" asChild>
                <Link href="/book">Book this slot</Link>
              </Button>
            </Card>
          )}

          <Card variant="elevated">
            <p className="font-body text-xs uppercase tracking-widest text-mist mb-4">Quick Book</p>
            <p className="font-body text-sm text-mist mb-4">
              Ready for your next appointment? Browse available times and book instantly.
            </p>
            <Button size="sm" className="w-full" asChild>
              <Link href="/book">Browse Services</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}