"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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
import { CalendarDays, Clock, Plus, XCircle, Star } from "lucide-react";
import type { BookingStatus } from "@/types";

const statusVariant: Record<BookingStatus,"success"|"warning"|"danger"|"info"|"default"> = {
  CONFIRMED:"success", PENDING:"warning", CANCELLED:"danger", COMPLETED:"info", NO_SHOW:"default",
};

// Mock data
const ALL_BOOKINGS = [
  { id:"b1", service:"Box Braids",      stylist:"Fatima Hassan", startAt:new Date(Date.now()+1000*60*60*26), endAt:new Date(Date.now()+1000*60*60*26+180*60000), status:"CONFIRMED" as BookingStatus, price:30000 },
  { id:"b2", service:"Deep Conditioning",stylist:"Amara Diallo",  startAt:new Date(Date.now()+1000*60*60*72), endAt:new Date(Date.now()+1000*60*60*72+60*60000),  status:"PENDING"  as BookingStatus, price:8000  },
  { id:"b3", service:"Precision Cut",   stylist:"Emeka Nwachukwu",startAt:new Date(Date.now()-1000*60*60*48), endAt:new Date(Date.now()-1000*60*60*47),             status:"COMPLETED"as BookingStatus, price:8000  },
  { id:"b4", service:"Balayage",        stylist:"Amara Diallo",  startAt:new Date(Date.now()-1000*60*60*200),endAt:new Date(Date.now()-1000*60*60*197),             status:"COMPLETED"as BookingStatus, price:35000 },
  { id:"b5", service:"Knotless Braids", stylist:"Fatima Hassan", startAt:new Date(Date.now()-1000*60*60*400),endAt:new Date(Date.now()-1000*60*60*394),             status:"CANCELLED"as BookingStatus, price:30000 },
];

export default function BookingsPage() {
  const { cancelBooking, loading } = useBooking();
  const [cancelId,   setCancelId]  = useState<string | null>(null);
  const [rateId,     setRateId]    = useState<string | null>(null);
  const [starRating, setStarRating]= useState(0);

  const upcoming  = ALL_BOOKINGS.filter(b => ["PENDING","CONFIRMED"].includes(b.status));
  const past      = ALL_BOOKINGS.filter(b => ["COMPLETED","CANCELLED","NO_SHOW"].includes(b.status));

  const handleCancel = async () => {
    if (!cancelId) return;
    const ok = await cancelBooking(cancelId);
    if (ok) setCancelId(null);
  };

  const BookingRow = ({ b }: { b: typeof ALL_BOOKINGS[0] }) => (
    <Card variant="elevated" className="p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Avatar name={b.stylist} size="md" />
          <div>
            <p className="font-body text-sm font-medium text-pearl">{b.service}</p>
            <p className="font-body text-xs text-mist">with {b.stylist}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-lg text-gold-light">£{b.price.toLocaleString()}</span>
          <Badge variant={statusVariant[b.status]}>{b.status.toLowerCase()}</Badge>
        </div>
      </div>

      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/[0.05] flex-wrap">
        <span className="flex items-center gap-1.5 font-body text-xs text-silver">
          <CalendarDays className="h-3.5 w-3.5 text-mist" />{formatDate(b.startAt)}
        </span>
        <span className="flex items-center gap-1.5 font-body text-xs text-silver">
          <Clock className="h-3.5 w-3.5 text-mist" />{formatTime(b.startAt)} – {formatTime(b.endAt)}
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
        loading={loading}
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
              <Button size="sm" className="flex-1" disabled={!starRating} onClick={() => setRateId(null)}>Submit</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
