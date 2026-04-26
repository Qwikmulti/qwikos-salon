"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { BUCKETS } from "@/lib/supabase/storage";
import { IMAGES } from "@/lib/utils/images";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
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
  imageUrl: string | null;
  imagePath: string | null;
}

const EMPTY: Omit<Svc, "id"> = {
  name: "", category: "HAIR_CUT", durationMin: 60, price: 0, isActive: true, description: "", imageUrl: null, imagePath: null
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Svc[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Svc | null>(null);
  const [form, setForm] = useState<Omit<Svc, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.services) {
          setServices(data.services.map((s: any) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            durationMin: s.durationMin,
            price: Number(s.price),
            isActive: s.isActive,
            description: s.description ?? "",
            imageUrl: s.imageUrl,
            imagePath: s.imagePath,
          })));
        }
      } catch (e) {
        console.error("Failed to load services:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const setF = (k: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: k === "price" || k === "durationMin" ? Number(e.target.value) : e.target.value }));

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (s: Svc) => {
    setEditing(s);
    setForm({
      name: s.name, category: s.category, durationMin: s.durationMin, price: s.price,
      isActive: s.isActive, description: s.description, imageUrl: s.imageUrl, imagePath: s.imagePath
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      toast.success(editing ? "Service updated" : "Service created");
      setOpen(false);
    } catch (e) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast.success("Service deleted");
    setServices(services.filter(s => s.id !== id));
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
        description={`${services.length} services`}
        actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> Add Service</Button>}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => (
          <Card key={s.id} variant="elevated" className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-heading text-base text-white">{s.name}</p>
                <p className="font-body text-xs text-mist">{CAT_EMOJI[s.category]} {CAT_LABELS[s.category]}</p>
              </div>
              <Switch checked={s.isActive} />
            </div>
            <p className="font-body text-xs text-mist line-clamp-2 mb-3">{s.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-display text-gold-light">£{s.price}</span>
              <span className="font-body text-xs text-ash flex items-center gap-1">
                <Clock className="h-3 w-3" />{s.durationMin} min
              </span>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="h-3 w-3" /></Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <Input label="Name" value={form.name} onChange={setF("name")} placeholder="Service name" />
            <Select value={form.category} onValueChange={v => setForm({ ...form, category: v as ServiceCategory })}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {Object.entries(CAT_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (pence)" type="number" value={form.price} onChange={setF("price")} />
              <Input label="Duration (min)" type="number" value={form.durationMin} onChange={setF("durationMin")} />
            </div>
            <Textarea label="Description" value={form.description} onChange={setF("description")} rows={3} />
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
              <span className="font-body text-sm text-silver">Active</span>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}