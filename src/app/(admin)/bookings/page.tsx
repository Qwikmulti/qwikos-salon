"use client";
import { useState } from "react";
import { PageHeader }  from "@/components/ui/page-header";
import { Card }        from "@/components/ui/card";
import { Badge }       from "@/components/ui/badge";
import { Avatar }      from "@/components/ui/avatar";
import { Button }      from "@/components/ui/button";
import { Input }       from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState }    from "@/components/ui/empty-state";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { Search, CalendarDays, Download, XCircle } from "lucide-react";
import type { BookingStatus } from "@/types";

const statusVariant = {
  CONFIRMED:"success", PENDING:"warning", CANCELLED:"danger", COMPLETED:"info", NO_SHOW:"default",
} as const;

const ALL = [
  { id:"b1",  customer:"Adaeze Okonkwo",  stylist:"Fatima Hassan",   service:"Box Braids",   startAt:new Date(Date.now()+3600000*2),   status:"CONFIRMED" as BookingStatus, price:30000 },
  { id:"b2",  customer:"Chidi Okafor",    stylist:"Emeka Nwachukwu", service:"Fade+Beard",   startAt:new Date(Date.now()+3600000*3),   status:"PENDING"   as BookingStatus, price:9000  },
  { id:"b3",  customer:"Ngozi Eze",       stylist:"Amara Diallo",    service:"Balayage",     startAt:new Date(Date.now()+3600000*5),   status:"CONFIRMED" as BookingStatus, price:35000 },
  { id:"b4",  customer:"Tunde Adesanya",  stylist:"Fatima Hassan",   service:"Keratin",      startAt:new Date(Date.now()+3600000*8),   status:"CONFIRMED" as BookingStatus, price:45000 },
  { id:"b5",  customer:"Funke Bello",     stylist:"Amara Diallo",    service:"Full Color",   startAt:new Date(Date.now()-3600000*2),   status:"COMPLETED" as BookingStatus, price:25000 },
  { id:"b6",  customer:"Ifeoma Chukwu",   stylist:"Fatima Hassan",   service:"Box Braids",   startAt:new Date(Date.now()-3600000*26),  status:"COMPLETED" as BookingStatus, price:30000 },
  { id:"b7",  customer:"Bayo Adeyemi",    stylist:"Emeka Nwachukwu", service:"Shape-Up",     startAt:new Date(Date.now()-3600000*28),  status:"NO_SHOW"   as BookingStatus, price:4000  },
  { id:"b8",  customer:"Sola Adekunle",   stylist:"Amara Diallo",    service:"Deep Cond.",   startAt:new Date(Date.now()-3600000*50),  status:"CANCELLED" as BookingStatus, price:8000  },
];

export default function AdminBookingsPage() {
  const [query,     setQuery]     = useState("");
  const [statusF,   setStatusF]   = useState("ALL");
  const [stylistF,  setStylistF]  = useState("ALL");
  const [cancelId,  setCancelId]  = useState<string|null>(null);
  const [cancelling,setCancelling]= useState(false);

  const filtered = ALL.filter(b => {
    const q = query.toLowerCase();
    return (
      (statusF  === "ALL" || b.status  === statusF)  &&
      (stylistF === "ALL" || b.stylist === stylistF) &&
      (b.customer.toLowerCase().includes(q) || b.service.toLowerCase().includes(q) || b.stylist.toLowerCase().includes(q))
    );
  });

  const stylists = [...new Set(ALL.map(b => b.stylist))];
  const totalRevenue = filtered.filter(b => b.status === "COMPLETED").reduce((a,b) => a+b.price, 0);

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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-52">
          <Input placeholder="Search client, service, stylist…" icon={<Search className="h-4 w-4"/>}
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {["CONFIRMED","PENDING","COMPLETED","CANCELLED","NO_SHOW"].map(s =>
              <SelectItem key={s} value={s}>{s.charAt(0)+s.slice(1).toLowerCase()}</SelectItem>)}
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

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={<CalendarDays className="h-6 w-6 text-mist"/>} title="No bookings match your filters" />
      ) : (
        <Card variant="elevated" className="p-0 overflow-hidden">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_100px_120px_80px_80px] gap-4 px-6 py-3 border-b border-white/[0.06]">
            {["Client","Service","Stylist","Date","Time","Price","Status"].map(h =>
              <span key={h} className="font-body text-2xs uppercase tracking-widest text-mist">{h}</span>)}
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(b => (
              <div key={b.id} className="grid md:grid-cols-[1fr_1fr_1fr_100px_120px_80px_80px] gap-4 px-6 py-3.5 items-center hover:bg-smoke/30 transition-colors group">
                <div className="flex items-center gap-2.5">
                  <Avatar name={b.customer} size="sm" />
                  <span className="font-body text-sm text-pearl truncate">{b.customer}</span>
                </div>
                <span className="font-body text-sm text-silver truncate">{b.service}</span>
                <span className="font-body text-sm text-silver truncate">{b.stylist}</span>
                <span className="font-mono text-xs text-silver">{formatDate(b.startAt)}</span>
                <span className="font-mono text-xs text-silver">{formatTime(b.startAt)}</span>
                <span className="font-display text-base text-gold-light">£{(b.price/1000).toFixed(0)}k</span>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[b.status]}>{b.status.charAt(0)+b.status.slice(1).toLowerCase()}</Badge>
                  {["PENDING","CONFIRMED"].includes(b.status) && (
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
        onConfirm={async () => { setCancelling(true); await new Promise(r=>setTimeout(r,800)); setCancelling(false); setCancelId(null); }} />
    </div>
  );
}
