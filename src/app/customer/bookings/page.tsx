"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button }     from "@/components/ui/button";
import { Badge }      from "@/components/ui/badge";
import { Avatar }     from "@/components/ui/avatar";
import { Card }       from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader }    from "@/components/ui/page-header";
import { useBooking }    from "@/hooks/useBooking";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { CalendarDays, Clock, Plus, XCircle, Star, CheckCircle2 } from "lucide-react";
import type { BookingStatus } from "@/types";

interface BookingData {
  id: string;
  stylist: { profile: { fullName: string } };
  service: { name: string; price: number };
  startAt: string;
  endAt: string;
  status: BookingStatus;
}

const statusVariant: Record<BookingStatus,"success"|"warning"|"danger"|"info"|"default"> = {
  CONFIRMED:"success", PENDING:"warning", CANCELLED:"danger", COMPLETED:"info", NO_SHOW:"default",
};

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const booked = searchParams.get("booked") === "1";
  const { cancelBooking, loading: cancelLoading } = useBooking();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId,   setCancelId]  = useState<string | null>(null);
  const [rateId,     setRateId]    = useState<string | null>(null);
  const [starRating, setStarRating]= useState(0);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
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

  const upcoming  = bookings.filter(b => ["PENDING","CONFIRMED"].includes(b.status));
  const past      = bookings.filter(b => ["COMPLETED","CANCELLED","NO_SHOW"].includes(b.status));

  const handleCancel = async () => {
    if (!cancelId) return;
    const ok = await cancelBooking(cancelId);
    if (ok) setCancelId(null);
  };

  const BookingRow = ({ b }: { b: BookingData }) => (
    <Card variant="elevated" className="p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Avatar name={b.stylist.profile.fullName} size="md" />
          <div>
            <p className="font-body text-sm font-medium text-pearl">{b.service.name}</p>
            <p className="font-body text-xs text-mist">with {b.stylist.profile.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-lg text-gold-light">£{Number(b.service.price).toLocaleString()}</span>
          <Badge variant={statusVariant[b.status]}>{b.status.toLowerCase()}</Badge>
        </div>
      </div>

      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/[0.05] flex-wrap">
        <span className="flex items-center gap-1.5 font-body text-xs text-silver">
          <CalendarDays className="h-3.5 w-3.5 text-mist" />{formatDate(new Date(b.startAt))}
        </span>
        <span className="flex items-center gap-1.5 font-body text-xs text-silver">
          <Clock className="h-3.5 w-3.5 text-mist" />{formatTime(new Date(b.startAt))} – {formatTime(new Date(b.endAt))}
        </span>

        <div className="ml-auto flex gap-2">
          {b.status === "COMPLETED" && (
            <Button variant="outline-gold" size="sm" onClick={() => setRateId(b.id)}>
              <Star className="h-3.5 w-3.5" /> Rate
            </Button>
          )}
          {["PENDING","CONFIRMED"].includes(b.status) && (
            <Button variant="danger" size="sm" onClick={() => setCancelId(b.id)}>
              <XCircle className="h-3.5 w-3.5" /> Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <PageHeader
        eyebrow="Booking History"
        title="My Bookings"
        actions={
          <Button asChild size="sm">
            <Link href="/book"><Plus className="h-4 w-4" /> New Booking</Link>
          </Button>
        }
        className="mb-8"
      />

      <AnimatePresence>
        {booked && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
            <div>
              <p className="font-body text-sm text-pearl">Booking confirmed!</p>
              <p className="font-body text-xs text-mist">We've sent you a confirmation email.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="h-7 w-7 text-mist" />}
              title="No upcoming bookings"
              description="Book an appointment and it'll appear here."
              action={{ label: "Book Now", onClick: () => window.location.href="/book" }}
            />
          ) : (
            <div className="space-y-4">
              {upcoming.map(b => <BookingRow key={b.id} b={b} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length === 0 ? (
            <EmptyState icon={<Clock className="h-7 w-7 text-mist" />} title="No past bookings yet" />
          ) : (
            <div className="space-y-4">
              {past.map(b => <BookingRow key={b.id} b={b} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel dialog */}
      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={o => !o && setCancelId(null)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        variant="danger"
        loading={cancelLoading}
        onConfirm={handleCancel}
      />

      {/* Rate dialog */}
      {rateId && (
        <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity:0, scale:0.95 }}
            animate={{ opacity:1, scale:1 }}
            className="bg-graphite border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm"
          >
            <h3 className="font-heading text-xl text-white mb-2">Rate Your Experience</h3>
            <p className="font-body text-sm text-mist mb-5">How was your visit?</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setStarRating(n)} className="transition-transform hover:scale-110">
                  <Star className={`h-8 w-8 transition-colors ${n <= starRating ? "fill-gold text-gold" : "text-ash"}`} />
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => setRateId(null)}>Skip</Button>
              <Button 
                size="sm" 
                className="flex-1" 
                disabled={!starRating} 
                onClick={async () => {
                  if (!rateId || !starRating) return;
                  await fetch("/api/reviews", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookingId: rateId, rating: starRating }),
                  });
                  setRateId(null);
                  setStarRating(0);
                }}
              >
                Submit
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
