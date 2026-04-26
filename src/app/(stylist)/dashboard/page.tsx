import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader }  from "@/components/ui/page-header";
import { StatCard }    from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge }       from "@/components/ui/badge";
import { Avatar }      from "@/components/ui/avatar";
import { Button }      from "@/components/ui/button";
import { EmptyState }  from "@/components/ui/empty-state";
import { formatTime }  from "@/lib/utils/dates";
import {
  CalendarDays, Clock, TrendingUp, Users,
  ChevronRight, CheckCircle2, XCircle, Scissors,
} from "lucide-react";

export const metadata: Metadata = { title: "Stylist Dashboard" };

const todayBookings = [
  { id:"b1", customer:"Adaeze Okonkwo",  service:"Box Braids",       time: new Date(new Date().setHours(9,0)),  duration:180, status:"CONFIRMED" as const },
  { id:"b2", customer:"Ngozi Eze",       service:"Loc Retwist",      time: new Date(new Date().setHours(13,0)), duration:90,  status:"CONFIRMED" as const },
  { id:"b3", customer:"Chisom Madu",     service:"Wash & Style",     time: new Date(new Date().setHours(15,0)), duration:90,  status:"PENDING"   as const },
  { id:"b4", customer:"Blessing Okafor", service:"Knotless Braids",  time: new Date(new Date().setHours(17,0)), duration:240, status:"CONFIRMED" as const },
];

const upcomingWeek = [
  { day:"Tomorrow",    count:5, revenue:"£1,400" },
  { day:"Wednesday",   count:6, revenue:"£1,700" },
  { day:"Thursday",    count:3, revenue:"£800" },
  { day:"Friday",      count:7, revenue:"£1,800" },
];

const statusCfg = {
  CONFIRMED: { variant:"success" as const,  icon: CheckCircle2, label:"Confirmed" },
  PENDING:   { variant:"warning" as const,  icon: Clock,        label:"Pending"   },
  CANCELLED: { variant:"danger"  as const,  icon: XCircle,      label:"Cancelled" },
  COMPLETED: { variant:"info"    as const,  icon: CheckCircle2, label:"Done"      },
  NO_SHOW:   { variant:"default" as const,  icon: XCircle,      label:"No Show"   },
};

export default function StylistDashboardPage() {
  const now  = new Date();
  const next = todayBookings.find(b => b.time > now);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow={new Date().toLocaleDateString("en-NG", { weekday:"long", month:"long", day:"numeric" })}
        title="Good morning, Fatima ✦"
        description="Here's your schedule for today"
        actions={
          <Button asChild size="sm" variant="outline-gold">
            <Link href="/stylist/availability">
              <Clock className="h-4 w-4" /> Manage Availability
            </Link>
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Bookings" value={todayBookings.length}     change={12}  icon={<CalendarDays className="h-5 w-5 text-gold"/>}  accent />
        <StatCard label="This Week"        value="21"                        change={8}   icon={<TrendingUp   className="h-5 w-5 text-mist"/>} />
        <StatCard label="Total Clients"    value="856"                       change={5}   icon={<Users        className="h-5 w-5 text-mist"/>} />
        <StatCard label="Avg. Rating"      value="4.9 ★"                                  icon={<Scissors     className="h-5 w-5 text-mist"/>} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Today's schedule — timeline view */}
        <div className="lg:col-span-2">
          <Card variant="elevated" className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <CardTitle>Today's Schedule</CardTitle>
              <span className="font-mono text-xs text-mist">{todayBookings.length} appointments</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {todayBookings.length === 0 ? (
                <EmptyState icon={<CalendarDays className="h-6 w-6 text-mist"/>} title="No bookings today" description="Enjoy your free day!" />
              ) : todayBookings.map((b, idx) => {
                const cfg      = statusCfg[b.status];
                const isNext   = b.id === next?.id;
                const endTime  = new Date(b.time.getTime() + b.duration * 60000);
                const isPast   = endTime < now;
                return (
                  <div key={b.id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${isNext ? "bg-gold/[0.04]" : ""} ${isPast ? "opacity-50" : ""}`}>
                    {/* Time column */}
                    <div className="w-20 shrink-0 text-right">
                      <p className="font-mono text-sm text-silver">{formatTime(b.time)}</p>
                      <p className="font-body text-2xs text-ash">{b.duration}m</p>
                    </div>
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`h-3 w-3 rounded-full border-2 ${isNext ? "border-gold bg-gold shadow-[0_0_8px_rgba(201,151,59,0.6)]" : isPast ? "border-ash bg-ash" : "border-silver bg-transparent"}`} />
                      {idx < todayBookings.length - 1 && <div className="w-px h-8 bg-ash/30 mt-1" />}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-body text-sm font-medium text-pearl">{b.customer}</p>
                        {isNext && <span className="font-body text-2xs px-2 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-gold-light">Next up</span>}
                      </div>
                      <p className="font-body text-xs text-mist">{b.service}</p>
                    </div>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Next appointment */}
          {next && (
            <Card variant="gold">
              <p className="font-body text-xs uppercase tracking-widest text-gold mb-3">Next Appointment</p>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={next.customer} size="md" status="online" />
                <div>
                  <p className="font-heading text-base text-white">{next.customer}</p>
                  <p className="font-body text-xs text-mist">{next.service}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-silver font-body">
                  <Clock className="h-3.5 w-3.5 text-gold" />{formatTime(next.time)}
                </span>
                <span className="font-body text-silver">{next.duration} min</span>
              </div>
            </Card>
          )}

          {/* Week ahead */}
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

          {/* Quick links */}
          <Card variant="default" className="p-4">
            <p className="font-body text-xs uppercase tracking-widest text-mist mb-3">Quick Actions</p>
            <div className="space-y-1">
              {[
                { label:"View All Bookings",   href:"/stylist/bookings"     },
                { label:"Update Availability", href:"/stylist/availability" },
                { label:"Edit Profile",        href:"/stylist/profile"      },
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
