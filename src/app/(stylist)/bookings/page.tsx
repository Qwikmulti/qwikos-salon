"use client";
import { useState } from "react";
import { PageHeader }  from "@/components/ui/page-header";
import { Card }        from "@/components/ui/card";
import { Badge }       from "@/components/ui/badge";
import { Avatar }      from "@/components/ui/avatar";
import { Button }      from "@/components/ui/button";
import { Input }       from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState }  from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { Search, CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { BookingStatus } from "@/types";

const statusCfg = {
  CONFIRMED: { variant:"success" as const, label:"Confirmed" },
  PENDING:   { variant:"warning" as const, label:"Pending"   },
  CANCELLED: { variant:"danger"  as const, label:"Cancelled" },
  COMPLETED: { variant:"info"    as const, label:"Completed" },
  NO_SHOW:   { variant:"default" as const, label:"No Show"   },
};

const BOOKINGS = [
  { id:"b1", customer:"Adaeze Okonkwo",  service:"Box Braids",       startAt:new Date(Date.now()+1000*60*60*2),   endAt:new Date(Date.now()+1000*60*60*5),   status:"CONFIRMED" as BookingStatus, price:30000, phone:"+44 7700 900111" },
  { id:"b2", customer:"Ngozi Eze",       service:"Loc Retwist",      startAt:new Date(Date.now()+1000*60*60*6),   endAt:new Date(Date.now()+1000*60*60*7.5), status:"CONFIRMED" as BookingStatus, price:12000, phone:"+44 7700 900222" },
  { id:"b3", customer:"Chisom Madu",     service:"Wash & Style",     startAt:new Date(Date.now()+1000*60*60*26),  endAt:new Date(Date.now()+1000*60*60*27.5),status:"PENDING"   as BookingStatus, price:10000, phone:"+44 7700 900333" },
  { id:"b4", customer:"Blessing Okafor",service:"Knotless Braids",  startAt:new Date(Date.now()+1000*60*60*50),  endAt:new Date(Date.now()+1000*60*60*54),  status:"CONFIRMED" as BookingStatus, price:30000, phone:"+44 7700 900444" },
  { id:"b5", customer:"Temi Adeyemi",    service:"Cornrows",         startAt:new Date(Date.now()-1000*60*60*24),  endAt:new Date(Date.now()-1000*60*60*22),  status:"COMPLETED" as BookingStatus, price:12000, phone:"+44 7700 900555" },
  { id:"b6", customer:"Funke Bello",     service:"Natural Twist-Out",startAt:new Date(Date.now()-1000*60*60*72),  endAt:new Date(Date.now()-1000*60*60*70),  status:"COMPLETED" as BookingStatus, price:14000, phone:"+44 7700 900666" },
  { id:"b7", customer:"Ifeoma Chukwu",   service:"Box Braids",       startAt:new Date(Date.now()-1000*60*60*120), endAt:new Date(Date.now()-1000*60*60*116), status:"CANCELLED" as BookingStatus, price:30000, phone:"+44 7700 900777" },
];

export default function StylistBookingsPage() {
  const [query,     setQuery]     = useState("");
  const [confirmId, setConfirmId] = useState<string|null>(null);
  const [cancelId,  setCancelId]  = useState<string|null>(null);
  const [loadingId, setLoadingId] = useState<string|null>(null);

  const upcoming = BOOKINGS.filter(b => ["PENDING","CONFIRMED"].includes(b.status));
  const past     = BOOKINGS.filter(b => ["COMPLETED","CANCELLED","NO_SHOW"].includes(b.status));

  const filter = (list: typeof BOOKINGS) =>
    list.filter(b => b.customer.toLowerCase().includes(query.toLowerCase()) ||
                     b.service.toLowerCase().includes(query.toLowerCase()));

  const handleConfirm = async () => {
    if (!confirmId) return;
    setLoadingId(confirmId);
    await new Promise(r => setTimeout(r, 800));
    setLoadingId(null);
    setConfirmId(null);
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    setLoadingId(cancelId);
    await new Promise(r => setTimeout(r, 800));
    setLoadingId(null);
    setCancelId(null);
  };

  const BookingRow = ({ b }: { b: typeof BOOKINGS[0] }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-smoke/40 transition-colors">
      <Avatar name={b.customer} size="md" className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-pearl">{b.customer}</p>
        <p className="font-body text-xs text-mist">{b.service}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 font-body text-2xs text-ash">
            <CalendarDays className="h-3 w-3" />{formatDate(b.startAt)}
          </span>
          <span className="flex items-center gap-1 font-body text-2xs text-ash">
            <Clock className="h-3 w-3" />{formatTime(b.startAt)} – {formatTime(b.endAt)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        <span className="font-display text-lg text-gold-light">£{b.price.toLocaleString()}</span>
        <Badge variant={statusCfg[b.status].variant}>{statusCfg[b.status].label}</Badge>
        {b.status === "PENDING" && (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setConfirmId(b.id)}>
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

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader eyebrow="Appointments" title="My Bookings" />

      <Input placeholder="Search by client or service…" icon={<Search className="h-4 w-4"/>} value={query} onChange={e => setQuery(e.target.value)} />

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        {(["upcoming","past"] as const).map(tab => (
          <TabsContent key={tab} value={tab}>
            {filter(tab === "upcoming" ? upcoming : past).length === 0 ? (
              <EmptyState icon={<CalendarDays className="h-6 w-6 text-mist"/>} title="No bookings found" />
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
