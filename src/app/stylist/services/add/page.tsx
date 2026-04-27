"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

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

export default function AddCustomServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "OTHER",
    price: "",
    duration: "60",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);
    try {
      // First fetch current services
      const fetchRes = await fetch("/api/stylists/services");
      if (!fetchRes.ok) throw new Error("Failed to fetch services");
      const data = await fetchRes.json();
      const currentServices = data.services || [];

      // Add new custom service
      const newService = {
        id: `temp-${Date.now()}`,
        name: form.name,
        description: form.description || null,
        category: form.category,
        durationMin: parseInt(form.duration) || 60,
        price: parseFloat(form.price) || 0,
        isOffered: true,
        priceOverride: parseFloat(form.price) || 0,
        durationOverride: parseInt(form.duration) || 60,
        isCustom: true,
      };

      const updatedServices = [...currentServices, newService];

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

      const res = await fetch("/api/stylists/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add service");
      }

      toast.success("Service added!", { description: "Your custom service has been created." });
      router.push("/stylist/services");
    } catch (error: any) {
      console.error("Error adding service:", error);
      toast.error("Failed to add service", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in pb-10">
      <PageHeader
        eyebrow="Services"
        title="Add Custom Service"
        description="Create a custom service that only you offer."
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
              placeholder="e.g., Signature Styling"
              required
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe what's included in this service..."
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
              placeholder="e.g., 5000 for £50.00"
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
            <Save className="h-4 w-4" /> Add Service
          </Button>
        </div>
      </form>
    </div>
  );
}