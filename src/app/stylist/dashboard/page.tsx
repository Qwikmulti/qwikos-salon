import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatTime } from "@/lib/utils/dates";
import {
  CalendarDays, Clock, TrendingUp, Users,
  ChevronRight, CheckCircle2, XCircle, Scissors,
} from "lucide-react";

export const metadata: Metadata = { title: "Stylist Dashboard" };

const statusCfg = {
  CONFIRMED: { variant: "success" as const, icon: CheckCircle2, label: "Confirmed" },
  PENDING: { variant: "warning" as const, icon: Clock, label: "Pending" },
  CANCELLED: { variant: "danger" as const, icon: XCircle, label: "Cancelled" },
  COMPLETED: { variant: "info" as const, icon: CheckCircle2, label: "Done" },
  NO_SHOW: { variant: "default" as const, icon: XCircle, label: "No Show" },
};

export default async function StylistDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { stylist: true },
  });

  if (!profile?.stylist) redirect("/");

  const stylistId = profile.stylist.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    todayBookings,
    weekBookings,
    totalClients,
  ] = await Promise.all([
    prisma.booking.findMany({
      where: {
        stylistId,
        startAt: { gte: today, lt: tomorrow },
      },
      include: {
        customer: { select: { fullName: true } },
        service: { select: { name: true, durationMin: true } },
      },
      orderBy: { startAt: "asc" },
    }),
    prisma.booking.count({
      where: {
        stylistId,
        startAt: { gte: today },
      },
    }),
    prisma.booking.count({
      where: {
        stylistId,
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
    }),
  ]);

  const now = new Date();
  const nextBooking = todayBookings.find(b => new Date(b.startAt) > now);

  const upcomingWeek = [
    { day: "Tomorrow", count: 0, revenue: "£0" },
    { day: "Wednesday", count: 0, revenue: "£0" },
    { day: "Thursday", count: 0, revenue: "£0" },
    { day: "Friday", count: 0, revenue: "£0" },
  ];

  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  if (profile.stylist.status !== "APPROVED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
          <Clock className="h-10 w-10 text-gold animate-pulse" />
        </div>
        <h1 className="font-heading text-3xl text-white mb-3">Approval Pending</h1>
        <p className="font-body text-mist max-w-md mb-8">
          Welcome to SalonOS, {profile.fullName}! Your stylist account is currently being reviewed by our administration team.
          You'll be able to manage your bookings and services once your account is approved.
        </p>
        <div className="flex gap-4">
          <Button variant="outline-gold" asChild>
            <Link href="/stylist/profile">Complete your Profile</Link>
          </Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Refresh Status
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow={new Date().toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })}
        title={`${greeting}, ${profile.fullName} ✦`}
        description="Here's your schedule for today"
        actions={
          <Button asChild size="sm" variant="outline-gold">
            <Link href="/stylist/availability">
              <Clock className="h-4 w-4" /> Manage Availability
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Bookings" value={todayBookings.length} change={12} icon={<CalendarDays className="h-5 w-5 text-gold" />} accent />
        <StatCard label="This Week" value={weekBookings} change={8} icon={<TrendingUp className="h-5 w-5 text-mist" />} />
        <StatCard label="Total Clients" value={totalClients} change={5} icon={<Users className="h-5 w-5 text-mist" />} />
        <StatCard label="Avg. Rating" value="4.9 ★" icon={<Scissors className="h-5 w-5 text-mist" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card variant="elevated" className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <CardTitle>Today's Schedule</CardTitle>
              <span className="font-mono text-xs text-mist">{todayBookings.length} appointments</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {todayBookings.length === 0 ? (
                <EmptyState icon={<CalendarDays className="h-6 w-6 text-mist" />} title="No bookings today" description="Enjoy your free day!" />
              ) : (
                todayBookings.map((b, idx) => {
                  const startAt = new Date(b.startAt);
                  const endAt = new Date(b.endAt);
                  const duration = Math.round((endAt.getTime() - startAt.getTime()) / 60000);
                  const cfg = statusCfg[b.status];
                  const isNext = b.id === nextBooking?.id;
                  const isPast = startAt < now;

                  return (
                    <div key={b.id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${isNext ? "bg-gold/[0.04]" : ""} ${isPast ? "opacity-50" : ""}`}>
                      <div className="w-20 shrink-0 text-right">
                        <p className="font-mono text-sm text-silver">{formatTime(startAt)}</p>
                        <p className="font-body text-2xs text-ash">{duration}m</p>
                      </div>
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`h-3 w-3 rounded-full border-2 ${isNext ? "border-gold bg-gold shadow-[0_0_8px_rgba(201,151,59,0.6)]" : isPast ? "border-ash bg-ash" : "border-silver bg-transparent"}`} />
                        {idx < todayBookings.length - 1 && <div className="w-px h-8 bg-ash/30 mt-1" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-body text-sm font-medium text-pearl">{b.customer.fullName}</p>
                          {isNext && <span className="font-body text-2xs px-2 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-gold-light">Next up</span>}
                        </div>
                        <p className="font-body text-xs text-mist">{b.service.name}</p>
                      </div>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {nextBooking && (
            <Card variant="gold">
              <p className="font-body text-xs uppercase tracking-widest text-gold mb-3">Next Appointment</p>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={nextBooking.customer.fullName} size="md" status="online" />
                <div>
                  <p className="font-heading text-base text-white">{nextBooking.customer.fullName}</p>
                  <p className="font-body text-xs text-mist">{nextBooking.service.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-silver font-body">
                  <Clock className="h-3.5 w-3.5 text-gold" />{formatTime(new Date(nextBooking.startAt))}
                </span>
                <span className="font-body text-silver">{nextBooking.service.durationMin} min</span>
              </div>
            </Card>
          )}

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Week Ahead</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingWeek.map(({ day, count, revenue }) => (
                  <div key={day} className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-sm text-pearl">{day}</p>
                      <p className="font-body text-xs text-mist">{count} bookings</p>
                    </div>
                    <span className="font-display text-lg text-gold-light">{revenue}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="p-4">
            <p className="font-body text-xs uppercase tracking-widest text-mist mb-3">Quick Actions</p>
            <div className="space-y-1">
              {[
                { label: "View All Bookings", href: "/stylist/bookings" },
                { label: "Update Availability", href: "/stylist/availability" },
                { label: "Edit Profile", href: "/stylist/profile" },
              ].map(({ label, href }) => (
                <Link key={href} href={href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-smoke transition-colors group">
                  <span className="font-body text-sm text-silver group-hover:text-pearl">{label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-ash group-hover:text-gold transition-colors" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}