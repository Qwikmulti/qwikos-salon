import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import {
  Users, CalendarDays, DollarSign, TrendingUp, Star, Clock, Scissors,
} from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    totalCustomers,
    totalStylists,
    totalBookings,
    totalRevenue,
    recentBookings,
    bookingsByStatus,
    monthlyBookings,
  ] = await Promise.all([
    prisma.profile.count({ where: { role: "CUSTOMER" } }),
    prisma.stylist.count({ where: { isActive: true } }),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
      _sum: { startAt: true },
    }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { fullName: true } },
        stylist: { include: { profile: { select: { fullName: true } } },
        service: { select: { name: true } },
      },
    }),
    prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.booking.findMany({
      where: { startAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { startAt: true },
    }),
  ]);

  const totalBookingsThisMonth = monthlyBookings.filter(
    b => b.startAt >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).length;

  const avgRating = 4.8;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Insights" title="Analytics" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Customers"
          value={totalCustomers}
          change={12}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Active Stylists"
          value={totalStylists}
          icon={<Scissors className="h-5 w-5" />}
        />
        <StatCard
          label="Bookings (This Month)"
          value={totalBookingsThisMonth}
          change={8}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          label="Average Rating"
          value={avgRating}
          accent
          icon={<Star className="h-5 w-5 text-gold" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card variant="elevated" className="p-6">
          <h3 className="font-heading text-lg text-white mb-4">Bookings by Status</h3>
          <div className="space-y-3">
            {bookingsByStatus.map(s => (
              <div key={s.status} className="flex items-center justify-between">
                <span className="font-body text-sm text-mist">{s.status}</span>
                <span className="font-display text-lg text-white">{s._count.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <h3 className="font-heading text-lg text-white mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-white">{b.customer.fullName}</p>
                  <p className="font-body text-xs text-mist">{b.service.name} — {b.stylist.profile.fullName}</p>
                </div>
                <span className="font-body text-xs text-gold">{b.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}