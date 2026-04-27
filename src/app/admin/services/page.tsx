"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Clock, Tag } from "lucide-react";
import type { ServiceCategory } from "@/types";

const CAT_LABELS: Record<ServiceCategory, string> = {
  HAIR_CUT: "Hair Cut", HAIR_COLOR: "Colour", BRAIDING: "Braiding", NATURAL_HAIR: "Natural Hair",
  RELAXER: "Relaxer", TREATMENT: "Treatment", STYLING: "Styling", BEARD: "Beard", KIDS: "Kids", OTHER: "Other",
};
const CAT_EMOJI: Record<ServiceCategory, string> = {
  HAIR_CUT: "✂️", HAIR_COLOR: "🎨", BRAIDING: "🫶", NATURAL_HAIR: "🌿", RELAXER: "💆",
  TREATMENT: "✨", STYLING: "💇", BEARD: "🪒", KIDS: "🧒", OTHER: "💅",
};

interface Svc {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMin: number;
  price: number;
  isActive: boolean;
  description: string;
}

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Svc[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch (e) {
      console.error("Failed to load services:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleActive = async (s: Svc) => {
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !s.isActive }),
      });
      if (res.ok) {
        toast.success(`Service ${!s.isActive ? "activated" : "deactivated"}`);
        setServices(services.map(i => i.id === s.id ? { ...i, isActive: !s.isActive } : i));
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader eyebrow="Management" title="Services" />
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
        title="Services"
        description={`${services.length} active services`}
        actions={
          <Button size="sm" onClick={() => router.push("/admin/services/new")}>
            <Plus className="h-4 w-4" /> 
            Add Service
          </Button>
        }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => (
          <Card key={s.id} variant="elevated" className="flex flex-col group p-0 overflow-hidden h-full">
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CAT_EMOJI[s.category]}</span>
                    <p className="font-heading text-base text-white line-clamp-1">{s.name}</p>
                  </div>
                  <Badge variant="default" className="bg-white/5 text-[10px] uppercase tracking-wider h-5">
                    {CAT_LABELS[s.category]}
                  </Badge>
                </div>
                <Switch 
                  checked={s.isActive} 
                  onCheckedChange={() => handleToggleActive(s)}
                />
              </div>
              
              <p className="font-body text-xs text-mist line-clamp-2 mb-4 min-h-[32px]">
                {s.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                <div className="flex flex-col">
                  <span className="font-body text-[10px] text-ash uppercase tracking-widest mb-0.5">Price</span>
                  <span className="font-display text-lg text-gold-light font-medium">£{s.price / 100}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-body text-[10px] text-ash uppercase tracking-widest mb-0.5">Time</span>
                  <span className="font-body text-xs text-silver flex items-center gap-1.5 font-medium">
                    <Clock className="h-3 w-3 text-gold/60" />
                    {s.durationMin} min
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-smoke/30 border-t border-white/[0.04] flex items-center justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-ash hover:text-white"
                onClick={() => router.push(`/admin/services/${s.id}/edit`)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-graphite rounded-2xl border border-dashed border-white/10">
          <Tag className="h-10 w-10 text-ash mb-4 opacity-20" />
          <p className="text-mist text-sm">No services created yet.</p>
          <Button variant="ghost" className="text-gold mt-2 hover:underline" onClick={() => router.push("/admin/services/new")}>
            Create your first service
          </Button>
        </div>
      )}
    </div>
  );
}