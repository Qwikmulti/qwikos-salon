"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, Image as ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BUCKETS } from "@/lib/supabase/storage";
import type { ServiceCategory } from "@/types";
import Image from "next/image";

const CAT_LABELS: Record<ServiceCategory, string> = {
  HAIR_CUT: "Hair Cut", HAIR_COLOR: "Colour", BRAIDING: "Braiding", NATURAL_HAIR: "Natural Hair",
  RELAXER: "Relaxer", TREATMENT: "Treatment", STYLING: "Styling", BEARD: "Beard", KIDS: "Kids", OTHER: "Other",
};

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "HAIR_CUT" as ServiceCategory,
    durationMin: "60",
    price: "0",
    description: "",
    isActive: true,
    imageUrl: null as string | null,
  });

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/admin/services/${id}`);
        const data = await res.json();
        if (data.service) {
          const s = data.service;
          setFormData({
            name: s.name,
            category: s.category,
            durationMin: String(s.durationMin),
            price: String(s.price / 100),
            description: s.description ?? "",
            isActive: s.isActive,
            imageUrl: s.imageUrl,
          });
        }
      } catch (e) {
        toast.error("Failed to load service");
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          durationMin: Number(formData.durationMin),
          price: Number(formData.price),
        }),
      });

      if (res.ok) {
        toast.success("Service updated successfully");
        router.push("/admin/services");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update service");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Service deleted");
        router.push("/admin/services");
      } else {
        toast.error("Failed to delete service");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-mist">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/services")}>
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </div>

      <PageHeader
        eyebrow="Management"
        title={`Edit ${formData.name}`}
        description="Update service pricing, duration, and visual representation."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <Card variant="elevated" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 space-y-3">
                  <p className="font-heading text-xs font-semibold uppercase tracking-wider text-mist">Cover Image</p>
                  <div className="relative aspect-square rounded-xl bg-smoke border border-white/[0.05] overflow-hidden group">
                    {formData.imageUrl ? (
                      <Image src={formData.imageUrl} alt="Service" fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-ash gap-2">
                        <ImageIcon className="h-8 w-8 opacity-20" />
                        <span className="text-[10px]">No image</span>
                      </div>
                    )}
                  </div>
                  <ImageUpload
                    bucket={BUCKETS.SERVICES}
                    uploadPath={`${id}/cover`}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    label={formData.imageUrl ? "Change Image" : "Upload Image"}
                    className="w-full"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Service Name"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <div className="space-y-1.5">
                      <label className="font-body text-xs font-semibold uppercase tracking-wider text-mist">Category</label>
                      <Select 
                        value={formData.category} 
                        onValueChange={v => setFormData({ ...formData, category: v as ServiceCategory })}
                      >
                        <SelectTrigger className="bg-smoke border-white/[0.05]">
                          <SelectValue />
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
                    />
                    <Input
                      label="Duration (minutes)"
                      type="number"
                      required
                      value={formData.durationMin}
                      onChange={e => setFormData({ ...formData, durationMin: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Textarea
                label="Description"
                rows={5}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="default">
              <h4 className="font-heading text-sm text-white mb-4">Settings</h4>
              <div className="flex items-center justify-between p-3 rounded-xl bg-smoke border border-white/[0.05] mb-6">
                <div className="space-y-0.5">
                  <p className="font-body text-sm font-medium text-pearl">Active</p>
                  <p className="font-body text-[10px] text-mist">Visible in bookings</p>
                </div>
                <Switch 
                  checked={formData.isActive}
                  onCheckedChange={v => setFormData({ ...formData, isActive: v })}
                />
              </div>
              
              <div className="space-y-2">
                <Button type="submit" className="w-full" loading={isSubmitting}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Separator className="bg-white/5 my-2" />
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-ash hover:text-danger-text" 
                  onClick={handleDelete}
                  loading={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Service
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
