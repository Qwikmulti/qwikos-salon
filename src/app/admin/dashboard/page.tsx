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
import { formatTime, formatDate } from "@/lib/utils/dates";
import {
  CalendarDays, TrendingUp, Users, Scissors,
  ArrowRight, Star, AlertCircle,
} from "lucide-react";
import type { BookingStatus } from "@/types";

export const metadata: Metadata = { title: "Admin Dashboard" };

const statusVariant = {
  CONFIRMED: "success", PENDING: "warning", CANCELLED: "danger", COMPLETED: "info", NO_SHOW: "default",
} as const;

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalCustomers,
    totalStylists,
    todayBookings,
    recentBookings,
    pendingBookings,
  ] = await Promise.all([
    prisma.profile.count({ where: { role: "CUSTOMER" } }),
    prisma.stylist.count({ where: { isActive: true } }),
    prisma.booking.count({
      where: { startAt: { gte: today, lt: tomorrow } },
    }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { fullName: true } },
        stylist: { include: { profile: { select: { fullName: true } } } },
        service: { select: { name: true, price: true } },
      },
    }),
    prisma.booking.count({ where: { status: "PENDING" } }),
  ]);

  const alerts: { type: "warning" | "info"; message: string; href: string }[] = [];
  if (pendingBookings > 0) {
    alerts.push({
      type: "warning",
      message: `${pendingBookings} pending bookings need confirmation`,
      href: "/admin/bookings?status=PENDING",
    });
  }

  const topStylistsData = await prisma.booking.groupBy({
    by: ["stylistId"],
    where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

const topStylists = await Promise.all(
    topStylistsData.map(async (t) => {
      const stylist = await prisma.stylist.findUnique({
        where: { id: t.stylistId },
        include: { profile: { select: { fullName: true } } },
      });
      return {
        name: stylist?.profile.fullName ?? "Unknown",
        bookings: t._count.id,
        revenue: "£0",
        rating: 4.8,
      };
    })
  );

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekBookings = await prisma.booking.findMany({
    where: { startAt: { gte: weekAgo } },
    select: { startAt: true },
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const revenueByDay = Array(7).fill(0);
  weekBookings.forEach(b => {
    const day = new Date(b.startAt).getDay();
    revenueByDay[day]++;
  });
  const maxDay = Math.max(...revenueByDay, 1);
  const weeklyRevenue = revenueByDay.map(v => Math.round((v / maxDay) * 100));

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="Overview"
        title="Admin Dashboard"
        description={`${new Date().toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`}
        actions={
          <Button asChild size="sm">
            <Link href="/admin/bookings"><CalendarDays className="h-4 w-4" /> All Bookings</Link>
          </Button>
        }
      />

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <Link key={i} href={a.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-body transition-all hover:brightness-110 ${
                a.type === "warning"
                  ? "bg-warning-bg border-warning/30 text-warning-text"
                  : "bg-info-bg border-info/30 text-info-text"
              }`}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1">{a.message}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Bookings" value={todayBookings} change={12} icon={<CalendarDays className="h-5 w-5 text-gold" />} accent />
        <StatCard label="Monthly Revenue" value="£92k" change={9} icon={<TrendingUp className="h-5 w-5 text-mist" />} />
        <StatCard label="Active Clients" value={totalCustomers} change={5} icon={<Users className="h-5 w-5 text-mist" />} />
        <StatCard label="Active Stylists" value={totalStylists} icon={<Scissors className="h-5 w-5 text-mist" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue — This Week</CardTitle>
            <span className="font-display text-2xl text-gold-light">£92k</span>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {weeklyRevenue.map((v, i) => {
                const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
                const max = Math.max(...weeklyRevenue);
                const pct = (v / max) * 100;
                const isToday = i === new Date().getDay() - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full rounded-t-lg transition-all relative overflow-hidden"
                      style={{ height: `${pct}%`, background: isToday ? "linear-gradient(to top, #7A5C2E, #C9973B)" : "#2C2C2C" }}>
                      {isToday && <div className="absolute inset-0 bg-gold/10" />}
                    </div>
                    <span className={`font-body text-2xs ${isToday ? "text-gold" : "text-ash"}`}>{days[i]}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Top Stylists</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/stylists"><ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStylists.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className={`font-mono text-xs w-4 ${i === 0 ? "text-gold" : "text-ash"}`}>#{i + 1}</span>
                  <Avatar name={s.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-pearl truncate">{s.name}</p>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      <span className="font-mono text-2xs text-silver">{s.rating}</span>
                      <span className="text-ash text-2xs">·</span>
                      <span className="font-body text-2xs text-mist">{s.bookings} bookings</span>
                    </div>
                  </div>
                  <span className="font-display text-base text-gold-light">{s.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <CardTitle>Recent Bookings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/bookings">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recentBookings.map((b) => (
            <div key={b.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-smoke/40 transition-colors flex-wrap">
              <Avatar name={b.customer.fullName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-pearl">{b.customer.fullName}</p>
                <p className="font-body text-xs text-mist">{b.service.name} · {b.stylist.profile.fullName}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-xs text-silver">{formatTime(b.startAt)}</p>
                <p className="font-body text-2xs text-ash">{formatDate(b.startAt)}</p>
              </div>
              <span className="font-display text-lg text-gold-light shrink-0">£{(Number(b.service.price) / 100).toLocaleString()}</span>
              <Badge variant={statusVariant[b.status]}>{b.status.toLowerCase()}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}