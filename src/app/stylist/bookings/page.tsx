"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { Search, CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { BookingStatus } from "@/types";

const statusCfg = {
  CONFIRMED: { variant: "success" as const, label: "Confirmed" },
  PENDING: { variant: "warning" as const, label: "Pending" },
  CANCELLED: { variant: "danger" as const, label: "Cancelled" },
  COMPLETED: { variant: "info" as const, label: "Completed" },
  NO_SHOW: { variant: "default" as const, label: "No Show" },
};

interface BookingData {
  id: string;
  customer: { fullName: string; phone: string | null };
  service: { name: string; price: number };
  startAt: Date;
  endAt: Date;
  status: BookingStatus;
}

export default function StylistBookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings?limit=50");
        const data = await res.json();
        if (data.bookings) setBookings(data.bookings);
      } catch (e) {
        console.error("Failed to load bookings:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const upcoming = bookings.filter(b => ["PENDING", "CONFIRMED"].includes(b.status));
  const past = bookings.filter(b => ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(b.status));

  const filter = (list: BookingData[]) =>
    list.filter(b => b.customer.fullName.toLowerCase().includes(query.toLowerCase()) ||
      b.service.name.toLowerCase().includes(query.toLowerCase()));

  const handleConfirm = async () => {
    if (!confirmId) return;
    setLoadingId(confirmId);
    try {
      await fetch(`/api/bookings/${confirmId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });
      setBookings(bookings.map(b =>
        b.id === confirmId ? { ...b, status: "CONFIRMED" as BookingStatus } : b
      ));
    } catch (e) {
      console.error("Failed to confirm:", e);
    } finally {
      setLoadingId(null);
      setConfirmId(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    setLoadingId(cancelId);
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
      setLoadingId(null);
      setCancelId(null);
    }
  };

  const BookingRow = ({ b }: { b: BookingData }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-smoke/40 transition-colors">
      <Avatar name={b.customer.fullName} size="md" className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-pearl">{b.customer.fullName}</p>
        <p className="font-body text-xs text-mist">{b.service.name}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 font-body text-2xs text-ash">
            <CalendarDays className="h-3 w-3" />{formatDate(new Date(b.startAt))}
          </span>
          <span className="flex items-center gap-1 font-body text-2xs text-ash">
            <Clock className="h-3 w-3" />{formatTime(new Date(b.startAt))} – {formatTime(new Date(b.endAt))}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        <span className="font-display text-lg text-gold-light">£{(Number(b.service.price) / 100).toLocaleString()}</span>
        <Badge variant={statusCfg[b.status].variant}>{statusCfg[b.status].label}</Badge>
        {b.status === "PENDING" && (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setConfirmId(b.id)} loading={loadingId === b.id}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Confirm
            </Button>
            <Button size="sm" variant="danger" onClick={() => setCancelId(b.id)}>
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        {b.status === "CONFIRMED" && (
          <Button size="sm" variant="ghost" onClick={() => setCancelId(b.id)}>
            <XCircle className="h-3.5 w-3.5" /> Cancel
          </Button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader eyebrow="Appointments" title="My Bookings" />
        <div className="h-96 flex items-center justify-center">
          <p className="text-mist">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader eyebrow="Appointments" title="My Bookings" />

      <Input placeholder="Search by client or service…" icon={<Search className="h-4 w-4" />} value={query} onChange={e => setQuery(e.target.value)} />

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        {(["upcoming", "past"] as const).map(tab => (
          <TabsContent key={tab} value={tab}>
            {filter(tab === "upcoming" ? upcoming : past).length === 0 ? (
              <EmptyState icon={<CalendarDays className="h-6 w-6 text-mist" />} title="No bookings found" />
            ) : (
              <Card variant="elevated" className="p-0 overflow-hidden">
                <div className="divide-y divide-white/[0.04]">
                  {filter(tab === "upcoming" ? upcoming : past).map(b => <BookingRow key={b.id} b={b} />)}
                </div>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <ConfirmDialog open={!!confirmId} onOpenChange={o => !o && setConfirmId(null)}
        title="Confirm Booking" description="Mark this appointment as confirmed?"
        confirmLabel="Confirm" variant="default" loading={!!loadingId} onConfirm={handleConfirm} />

      <ConfirmDialog open={!!cancelId} onOpenChange={o => !o && setCancelId(null)}
        title="Cancel Booking" description="This will cancel the appointment and notify the client."
        confirmLabel="Cancel Booking" variant="danger" loading={!!loadingId} onConfirm={handleCancel} />
    </div>
  );
}