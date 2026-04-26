"use client";
import { useState } from "react";
import { PageHeader }  from "@/components/ui/page-header";
import { Card }        from "@/components/ui/card";
import { Avatar }      from "@/components/ui/avatar";
import { Badge }       from "@/components/ui/badge";
import { Button }      from "@/components/ui/button";
import { Input }       from "@/components/ui/input";
import { EmptyState }  from "@/components/ui/empty-state";
import { formatDate }  from "@/lib/utils/dates";
import { Search, Users, Phone, Star } from "lucide-react";

const CUSTOMERS = [
  { id:"c1", name:"Adaeze Okonkwo",  email:"adaeze@email.com",  phone:"+44 7700 900111", totalBookings:12, totalSpent:180000, lastVisit:new Date(Date.now()-86400000*3),   topService:"Box Braids",   rating:5 },
  { id:"c2", name:"Chidi Okafor",    email:"chidi@email.com",   phone:"+44 7700 900222", totalBookings:8,  totalSpent:72000,  lastVisit:new Date(Date.now()-86400000*7),   topService:"Fade + Beard", rating:5 },
  { id:"c3", name:"Ngozi Eze",       email:"ngozi@email.com",   phone:"+44 7700 900333", totalBookings:6,  totalSpent:140000, lastVisit:new Date(Date.now()-86400000*14),  topService:"Balayage",     rating:5 },
  { id:"c4", name:"Tunde Adesanya",  email:"tunde@email.com",   phone:"+44 7700 900444", totalBookings:4,  totalSpent:116000, lastVisit:new Date(Date.now()-86400000*21),  topService:"Keratin",      rating:4 },
  { id:"c5", name:"Funke Bello",     email:"funke@email.com",   phone:"+44 7700 900555", totalBookings:9,  totalSpent:95000,  lastVisit:new Date(Date.now()-86400000*2),   topService:"Color",        rating:5 },
  { id:"c6", name:"Ifeoma Chukwu",   email:"ifeoma@email.com",  phone:"+44 7700 900666", totalBookings:3,  totalSpent:42000,  lastVisit:new Date(Date.now()-86400000*30),  topService:"Box Braids",   rating:4 },
];

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");

  const filtered = CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  const totalRevenue = CUSTOMERS.reduce((a,c) => a+c.totalSpent, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="CRM"
        title="Customers"
        description={`${CUSTOMERS.length} total clients · £${(totalRevenue/1000000).toFixed(1)}M lifetime revenue`}
      />

      <Input placeholder="Search by name or email…" icon={<Search className="h-4 w-4"/>}
        value={query} onChange={e => setQuery(e.target.value)} />

      {filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-6 w-6 text-mist"/>} title="No customers found" />
      ) : (
        <Card variant="elevated" className="p-0 overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_120px_100px_120px_80px] gap-4 px-6 py-3 border-b border-white/[0.06]">
            {["Client","Bookings","Spent","Last Visit","Top Service"].map(h =>
              <span key={h} className="font-body text-2xs uppercase tracking-widest text-mist">{h}</span>)}
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(c => (
              <div key={c.id} className="grid md:grid-cols-[1fr_120px_100px_120px_80px] gap-4 px-6 py-4 items-center hover:bg-smoke/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} size="md" />
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium text-pearl truncate">{c.name}</p>
                    <p className="font-body text-2xs text-mist truncate">{c.email}</p>
                  </div>
                </div>
                <div>
                  <p className="font-display text-lg text-white">{c.totalBookings}</p>
                  <p className="font-body text-2xs text-mist">visits</p>
                </div>
                <span className="font-display text-base text-gold-light">£{(c.totalSpent/1000).toFixed(0)}k</span>
                <span className="font-body text-xs text-silver">{formatDate(c.lastVisit)}</span>
                <Badge variant="default">{c.topService}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
