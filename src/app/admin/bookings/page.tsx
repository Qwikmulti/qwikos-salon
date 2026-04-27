"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { Search, CalendarDays, Download, XCircle } from "lucide-react";
import type { BookingStatus } from "@/types";

const statusVariant = {
  CONFIRMED: "success", PENDING: "warning", CANCELLED: "danger", COMPLETED: "info", NO_SHOW: "default",
} as const;

interface BookingData {
  id: string;
  customer: { fullName: string };
  stylist: { profile: { fullName: string } };
  service: { name: string; price: number };
  startAt: Date;
  endAt: Date;
  status: BookingStatus;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [stylists, setStylists] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusF, setStatusF] = useState("ALL");
  const [stylistF, setStylistF] = useState("ALL");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings?limit=100");
        const data = await res.json();
        if (data.bookings && Array.isArray(data.bookings)) {
          setBookings(data.bookings as BookingData[]);
          const uniqueStylists = Array.from(new Set(
            (data.bookings as BookingData[]).map(b => String(b.stylist.profile.fullName))
          ));
          setStylists(uniqueStylists);
        }
      } catch (e) {
        console.error("Failed to load bookings:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filtered = bookings.filter(b => {
    const q = query.toLowerCase();
    return (
      (statusF === "ALL" || b.status === statusF) &&
      (stylistF === "ALL" || b.stylist.profile.fullName === stylistF) &&
      (b.customer.fullName.toLowerCase().includes(q) ||
        b.service.name.toLowerCase().includes(q) ||
        b.stylist.profile.fullName.toLowerCase().includes(q))
    );
  });

  const totalRevenue = filtered
    .filter(b => b.status === "COMPLETED")
    .reduce((a, b) => a + Number(b.service.price), 0);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await fetch(`/api/bookings/${cancelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      setBookings(bookings.map(b =>
        b.id === cancelId ? { ...b, status: "CANCELLED" as BookingStatus } : b
      ));
    } catch (e) {
      console.error("Failed to cancel:", e);
    } finally {
      setCancelling(false);
      setCancelId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader eyebrow="Management" title="All Bookings" />
        <div className="h-96 flex items-center justify-center">
          <p className="text-mist">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Management"
        title="All Bookings"
        description={`${filtered.length} bookings · £${totalRevenue.toLocaleString()} confirmed revenue`}
        actions={
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-52">
          <Input placeholder="Search client, service, stylist…" icon={<Search className="h-4 w-4" />}
          value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {["CONFIRMED", "PENDING", "COMPLETED", "CANCELLED", "NO_SHOW"].map(s =>
              <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stylistF} onValueChange={setStylistF}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Stylist" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Stylists</SelectItem>
            {stylists.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<CalendarDays className="h-6 w-6 text-mist" />} title="No bookings match your filters" />
      ) : (
        <Card variant="elevated" className="p-0 overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_100px_120px_80px_80px] gap-4 px-6 py-3 border-b border-white/[0.06]">
            {["Client", "Service", "Stylist", "Date", "Time", "Price", "Status"].map(h =>
              <span key={h} className="font-body text-2xs uppercase tracking-widest text-mist">{h}</span>)}
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(b => (
              <div key={b.id} className="grid md:grid-cols-[1fr_1fr_1fr_100px_120px_80px_80px] gap-4 px-6 py-3.5 items-center hover:bg-smoke/30 transition-colors group">
                <div className="flex items-center gap-2.5">
                  <Avatar name={b.customer.fullName} size="sm" />
                  <span className="font-body text-sm text-pearl truncate">{b.customer.fullName}</span>
                </div>
                <span className="font-body text-sm text-silver truncate">{b.service.name}</span>
                <span className="font-body text-sm text-silver truncate">{b.stylist.profile.fullName}</span>
                <span className="font-mono text-xs text-silver">{formatDate(new Date(b.startAt))}</span>
                <span className="font-mono text-xs text-silver">{formatTime(new Date(b.startAt))}</span>
                <span className="font-display text-base text-gold-light">£{(Number(b.service.price) / 1000).toFixed(0)}k</span>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[b.status]}>{b.status.charAt(0) + b.status.slice(1).toLowerCase()}</Badge>
                  {["PENDING", "CONFIRMED"].includes(b.status) && (
                    <button onClick={() => setCancelId(b.id)}
                      className="opacity-0 group-hover:opacity-100 text-ash hover:text-danger-text transition-all">
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ConfirmDialog open={!!cancelId} onOpenChange={o => !o && setCancelId(null)}
        title="Cancel Booking" description="This will cancel the booking and notify the client."
        confirmLabel="Cancel Booking" variant="danger" loading={cancelling}
        onConfirm={handleCancel} />
    </div>
  );
}