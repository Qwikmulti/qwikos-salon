"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils/dates";
import { Search, Users, Phone, Star } from "lucide-react";

interface CustomerData {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: Date;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profiles) setCustomers(data.profiles);
      } catch (e) {
        console.error("Failed to load customers:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  const totalCustomers = customers.length;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader eyebrow="Management" title="Customers" />
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
        title="Customers"
        description={`${totalCustomers} registered customers`}
      />

      <Input placeholder="Search by name or email…" icon={<Search className="h-4 w-4" />} value={query} onChange={e => setQuery(e.target.value)} />

      {filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-6 w-6 text-mist" />} title="No customers found" />
      ) : (
        <Card variant="elevated" className="p-0 overflow-hidden">
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(c => (
              <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-smoke/40 transition-colors">
                <Avatar name={c.fullName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-pearl">{c.fullName}</p>
                  <p className="font-body text-xs text-mist">{c.email}</p>
                </div>
                {c.phone && (
                  <span className="font-body text-xs text-ash flex items-center gap-1">
                    <Phone className="h-3 w-3" />{c.phone}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}