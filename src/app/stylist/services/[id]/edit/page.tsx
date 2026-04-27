"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "BRAIDING", label: "Braiding" },
  { value: "NATURAL_HAIR", label: "Natural Hair" },
  { value: "HAIR_CUT", label: "Hair Cut" },
  { value: "HAIR_COLOR", label: "Hair Color" },
  { value: "TREATMENT", label: "Treatment" },
  { value: "STYLING", label: "Styling" },
  { value: "BEARD", label: "Beard" },
  { value: "RELAXER", label: "Relaxer" },
  { value: "KIDS", label: "Kids" },
  { value: "OTHER", label: "Other" },
];

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

export default function EditCustomServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [service, setService] = useState<Service | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "OTHER",
    price: "",
    duration: "60",
  });

  const fetchService = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stylists/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      
      const foundService = (data.services || []).find(
        (s: Service) => s.id === serviceId && s.isCustom
      );
      
      if (!foundService) {
        toast.error("Service not found");
        router.push("/stylist/services");
        return;
      }

      setService(foundService);
      setForm({
        name: foundService.name,
        description: foundService.description || "",
        category: foundService.category,
        price: (foundService.priceOverride || foundService.price).toString(),
        duration: (foundService.durationOverride || foundService.durationMin).toString(),
      });
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to load service");
      router.push("/stylist/services");
    } finally {
      setLoading(false);
    }
  }, [serviceId, router]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/stylists/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      const currentServices = data.services || [];

      const updatedServices = currentServices.map((s: Service) => {
        if (s.id === serviceId && s.isCustom) {
          return {
            ...s,
            name: form.name,
            description: form.description || null,
            category: form.category,
            price: parseFloat(form.price) || 0,
            durationMin: parseInt(form.duration) || 60,
            priceOverride: parseFloat(form.price) || 0,
            durationOverride: parseInt(form.duration) || 60,
          };
        }
        return s;
      });

      const payload = {
        services: updatedServices.map((s: any) => ({
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

      const saveRes = await fetch("/api/stylists/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!saveRes.ok) {
        const error = await saveRes.json();
        throw new Error(error.error || "Failed to update service");
      }

      toast.success("Service updated!", { description: "Your changes have been saved." });
      router.push("/stylist/services");
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in pb-10">
      <PageHeader
        eyebrow="Services"
        title="Edit Custom Service"
        description="Update your custom service details."
        actions={
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <Card variant="elevated" className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Service Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-xs font-medium tracking-widest uppercase text-silver block mb-1.5">Category</label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                label="Duration (minutes)"
                type="number"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                min={15}
                step={15}
              />
            </div>
            <Input
              label="Price (pence)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              icon={<span className="text-mist text-xs">£</span>}
              required
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}