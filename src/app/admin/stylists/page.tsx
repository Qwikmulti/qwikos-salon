"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Plus, Pencil, ImageIcon } from "lucide-react";

interface StylistRow {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  exp: number;
  isActive: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  avatarUrl: string | null;
}

export default function AdminStylistsPage() {
  const router = useRouter();
  const [stylists, setStylists] = useState<StylistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchStylists = async () => {
    try {
      const res = await fetch("/api/stylists?all=true");
      const data = await res.json();
      if (data.stylists) {
        setStylists(data.stylists.map((s: any) => ({
          id: s.id,
          name: s.profile.fullName,
          role: s.specialties[0] ?? "Stylist",
          specialties: s.specialties,
          exp: s.yearsExperience,
          isActive: s.isActive,
          status: s.status,
          avatarUrl: s.profile.avatarUrl,
        })));
      }
    } catch (e) {
      console.error("Failed to load stylists:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStylists();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/stylists/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Stylist ${newStatus.toLowerCase()} successfully`);
        fetchStylists();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const filtered = stylists.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.specialties.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const statusCfg = {
    PENDING:  { variant: "warning" as const, label: "Pending" },
    APPROVED: { variant: "success" as const, label: "Approved" },
    REJECTED: { variant: "danger" as const, label: "Rejected" },
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader eyebrow="Management" title="Stylists" />
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
        title="Stylists"
        description={`${stylists.length} registered stylists`}
        actions={
          <Button onClick={() => router.push("/admin/stylists/new")}>
            <Plus className="h-4 w-4" />
            Add Stylist
          </Button>
        }
      />

      <Input 
        placeholder="Search stylists…" 
        icon={<Search className="h-4 w-4" />} 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
      />

      <Card variant="elevated" className="p-0 overflow-hidden">
        <div className="divide-y divide-white/[0.04]">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-mist">No stylists found</div>
          ) : (
            filtered.map(s => (
              <div key={s.id} className="flex flex-col md:flex-row md:items-center gap-4 px-6 py-5 hover:bg-smoke/40 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar name={s.name} size="md" src={s.avatarUrl ?? undefined} />
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium text-pearl">{s.name}</p>
                    <p className="font-body text-xs text-mist">{s.specialties.join(", ")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-12 md:ml-0">
                  <Badge variant={statusCfg[s.status].variant}>{statusCfg[s.status].label}</Badge>
                  <Separator orientation="vertical" className="h-4 bg-white/10 hidden md:block" />
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/stylists/${s.id}/edit`)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/stylists/${s.id}/images`)}>
                      <ImageIcon className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-4 bg-white/10 hidden md:block" />

                  {s.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline-gold" onClick={() => handleStatusUpdate(s.id, "APPROVED")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" className="text-ash hover:text-danger-text" onClick={() => handleStatusUpdate(s.id, "REJECTED")}>
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" className="text-ash hover:text-white" onClick={() => handleStatusUpdate(s.id, "PENDING")}>
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}