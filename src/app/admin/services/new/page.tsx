"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import type { ServiceCategory } from "@/types";

const CAT_LABELS: Record<ServiceCategory, string> = {
  HAIR_CUT: "Hair Cut", HAIR_COLOR: "Colour", BRAIDING: "Braiding", NATURAL_HAIR: "Natural Hair",
  RELAXER: "Relaxer", TREATMENT: "Treatment", STYLING: "Styling", BEARD: "Beard", KIDS: "Kids", OTHER: "Other",
};

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "HAIR_CUT" as ServiceCategory,
    durationMin: "60",
    price: "0",
    description: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          durationMin: Number(formData.durationMin),
          price: Number(formData.price),
        }),
      });

      if (res.ok) {
        toast.success("Service created successfully");
        router.push("/admin/services");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create service");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <PageHeader
        eyebrow="Management"
        title="Add New Service"
        description="Define a new hair service, price, and duration for your salon."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <Card variant="elevated" className="space-y-4">
              <h3 className="font-heading text-lg text-white mb-4">Service Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Service Name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Precision Cut & Finish"
                />
                <div className="space-y-1.5">
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-mist">Category</label>
                  <Select 
                    value={formData.category} 
                    onValueChange={v => setFormData({ ...formData, category: v as ServiceCategory })}
                  >
                    <SelectTrigger className="bg-smoke border-white/[0.05]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CAT_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Price (£)"
                  type="number"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  hint="Base price in GBP."
                />
                <Input
                  label="Duration (minutes)"
                  type="number"
                  required
                  value={formData.durationMin}
                  onChange={e => setFormData({ ...formData, durationMin: e.target.value })}
                  hint="Average time to complete."
                />
              </div>

              <Textarea
                label="Description"
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what's included in this service..."
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="default">
              <h4 className="font-heading text-sm text-white mb-4">Settings</h4>
              <div className="flex items-center justify-between p-3 rounded-xl bg-smoke border border-white/[0.05] mb-6">
                <div className="space-y-0.5">
                  <p className="font-body text-sm font-medium text-pearl">Available for booking</p>
                  <p className="font-body text-[10px] text-mist">Toggle visibility to clients</p>
                </div>
                <Switch 
                  checked={formData.isActive}
                  onCheckedChange={v => setFormData({ ...formData, isActive: v })}
                />
              </div>
              <Button type="submit" className="w-full" loading={isSubmitting}>
                <Save className="h-4 w-4" />
                Create Service
              </Button>
              <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => router.back()}>
                Cancel
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
