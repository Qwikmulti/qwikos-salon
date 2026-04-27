"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, Plus, Pencil, Trash2, Loader2, ArrowRight } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  durationMin: number;
  price: number;
  isOffered: boolean;
  priceOverride: number | null;
  durationOverride: number | null;
  isCustom: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  BRAIDING: "Braiding",
  NATURAL_HAIR: "Natural Hair",
  HAIR_CUT: "Hair Cut",
  HAIR_COLOR: "Hair Color",
  TREATMENT: "Treatment",
  STYLING: "Styling",
  BEARD: "Beard",
  RELAXER: "Relaxer",
  KIDS: "Kids",
  OTHER: "Other",
};

export default function StylistServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stylists/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices((data.services || []).map((s: any) => ({
        ...s,
        price: s.price / 100,
        priceOverride: s.priceOverride ? s.priceOverride / 100 : null,
      })));
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isOffered: !s.isOffered } : s))
    );
  };

  const setPriceOverride = (id: string, value: string) => {
    const numValue = value ? parseFloat(value) : null;
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              priceOverride: numValue,
              isOffered: numValue !== null ? s.isOffered : s.isOffered,
            }
          : s
      )
    );
  };

  const setDurationOverride = (id: string, value: string) => {
    const numValue = value ? parseInt(value) : null;
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              durationOverride: numValue,
              isOffered: numValue !== null ? s.isOffered : s.isOffered,
            }
          : s
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        services: services.map((s) => ({
          serviceId: s.isCustom ? undefined : s.id,
          customName: s.isCustom ? s.name : undefined,
          customDescription: s.isCustom ? s.description : undefined,
          category: s.isCustom ? s.category : undefined,
          priceOverride: s.priceOverride,
          durationOverride: s.durationOverride,
          isOffered: s.isOffered,
          isCustom: s.isCustom,
        })),
      };

      const res = await fetch("/api/stylists/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      toast.success("Services updated!", { description: "Your service offerings have been saved." });
    } catch (error: any) {
      console.error("Error saving services:", error);
      toast.error("Failed to save services", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomService = async (service: Service) => {
    try {
      const updatedServices = services.filter((s) => s.id !== service.id);
      
      const payload = {
        services: updatedServices.map((s) => ({
          serviceId: s.isCustom ? undefined : s.id,
          customName: s.isCustom ? s.name : undefined,
          customDescription: s.isCustom ? s.description : undefined,
          category: s.isCustom ? s.category : undefined,
          priceOverride: s.priceOverride,
          durationOverride: s.durationOverride,
          isOffered: s.isOffered,
          isCustom: s.isCustom,
        })),
      };

      const res = await fetch("/api/stylists/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to delete");

      setServices(updatedServices);
      toast.success("Service deleted");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    }
  };

  const offeredCount = services.filter((s) => s.isOffered).length;

  const groupedServices = services.reduce(
    (acc, service) => {
      const category = service.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
    },
    {} as Record<string, Service[]>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Services"
        title="My Services"
        description={`You offer ${offeredCount} of ${services.length} services`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline-gold" size="sm" onClick={() => router.push("/stylist/services/add")}>
              <Plus className="h-4 w-4" /> Add Custom
            </Button>
            <Button size="sm" loading={saving} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        }
      />

      {Object.entries(groupedServices)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, categoryServices]) => (
          <Card key={category} variant="elevated" className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] bg-smoke/50">
              <h3 className="font-heading text-sm text-gold-light">
                {CATEGORY_LABELS[category] || category}
              </h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {categoryServices.map((service) => (
                <div
                  key={service.id}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                    !service.isOffered ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {service.isCustom && (
                      <>
                        <button
                          onClick={() => router.push(`/stylist/services/${service.id}/edit`)}
                          className="p-1.5 text-mist hover:text-gold transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomService(service)}
                          className="p-1.5 text-mist hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  <Switch
                    checked={service.isOffered}
                    onCheckedChange={() => toggleService(service.id)}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-pearl">
                      {service.name}
                    </p>
                    {service.description && (
                      <p className="font-body text-xs text-mist mt-0.5 truncate">
                        {service.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 font-body text-2xs text-mist">
                        <Clock className="h-3 w-3" />
                        {Math.floor((service.durationOverride || service.durationMin) / 60)}h
                        {(service.durationOverride || service.durationMin) % 60 > 0
                          ? ` ${(service.durationOverride || service.durationMin) % 60}m`
                          : ""}
                      </span>
                      <span className="font-body text-2xs text-mist">
                        Base: £{service.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {service.isOffered && (
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-24">
                        <Input
                          placeholder={`£${service.price.toFixed(2)}`}
                          value={service.priceOverride ?? ""}
                          onChange={(e) => setPriceOverride(service.id, e.target.value)}
                          icon={<span className="text-mist text-xs">£</span>}
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          placeholder={`${service.durationMin}m`}
                          value={service.durationOverride ?? ""}
                          onChange={(e) => setDurationOverride(service.id, e.target.value)}
                          icon={<Clock className="h-3 w-3 text-mist" />}
                        />
                      </div>
                    </div>
                  )}
                  {service.priceOverride && service.priceOverride !== service.price && (
                    <Badge variant="gold">Custom price</Badge>
                  )}
                  {service.isCustom && <Badge variant="default">Custom</Badge>}
                </div>
              ))}
            </div>
          </Card>
        ))}

      <p className="font-body text-xs text-mist px-1">
        Leave price/duration blank to use the salon's base values. Custom services are only visible on your profile.
      </p>
    </div>
  );
}