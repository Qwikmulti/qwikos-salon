"use client";
import { useState } from "react";
import Image from "next/image";
import { PageHeader }  from "@/components/ui/page-header";
import { Card }        from "@/components/ui/card";
import { Button }      from "@/components/ui/button";
import { Switch }      from "@/components/ui/switch";
import { Input }       from "@/components/ui/input";
import { Textarea }    from "@/components/ui/textarea";
import { Separator }   from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { toast }       from "sonner";
import { BUCKETS }     from "@/lib/supabase/storage";
import { IMAGES }      from "@/lib/utils/images";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import type { ServiceCategory } from "@/types";

const CAT_LABELS: Record<ServiceCategory, string> = {
  HAIR_CUT:"Hair Cut", HAIR_COLOR:"Colour", BRAIDING:"Braiding", NATURAL_HAIR:"Natural Hair",
  RELAXER:"Relaxer", TREATMENT:"Treatment", STYLING:"Styling", BEARD:"Beard", KIDS:"Kids", OTHER:"Other",
};
const CAT_EMOJI: Record<ServiceCategory, string> = {
  HAIR_CUT:"✂️", HAIR_COLOR:"🎨", BRAIDING:"🫶", NATURAL_HAIR:"🌿", RELAXER:"💆",
  TREATMENT:"✨", STYLING:"💇", BEARD:"🪒", KIDS:"🧒", OTHER:"💅",
};

interface Svc {
  id:string; name:string; category:ServiceCategory; durationMin:number;
  price:number; isActive:boolean; description:string; imageUrl:string|null; imagePath:string|null;
}

const INIT: Svc[] = [
  { id:"s1", name:"Precision Cut",       category:"HAIR_CUT",     durationMin:60,  price:45,  isActive:true,  description:"Tailored cut for every face shape.", imageUrl:IMAGES.services.haircut,   imagePath:null },
  { id:"s2", name:"Balayage",            category:"HAIR_COLOR",   durationMin:180, price:120, isActive:true,  description:"Hand-painted highlights.",           imageUrl:IMAGES.services.color,     imagePath:null },
  { id:"s3", name:"Knotless Box Braids", category:"BRAIDING",     durationMin:300, price:95,  isActive:true,  description:"Feed-in, scalp-friendly style.",     imageUrl:IMAGES.services.braiding,  imagePath:null },
  { id:"s4", name:"Keratin Treatment",   category:"TREATMENT",    durationMin:180, price:150, isActive:true,  description:"Smoothing up to 4 months.",          imageUrl:IMAGES.services.treatment, imagePath:null },
  { id:"s5", name:"Beard Shape",         category:"BEARD",        durationMin:30,  price:25,  isActive:true,  description:"Precision sculpting and lineup.",    imageUrl:IMAGES.services.beard,     imagePath:null },
  { id:"s6", name:"Twist-Out Set",       category:"NATURAL_HAIR", durationMin:120, price:55,  isActive:false, description:"Two-strand twist definition.",       imageUrl:IMAGES.services.natural,   imagePath:null },
];

const EMPTY: Omit<Svc,"id"> = { name:"", category:"HAIR_CUT", durationMin:60, price:0, isActive:true, description:"", imageUrl:null, imagePath:null };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Svc[]>(INIT);
  const [open,     setOpen]     = useState(false);
  const [editing,  setEditing]  = useState<Svc | null>(null);
  const [form,     setForm]     = useState<Omit<Svc,"id">>(EMPTY);
  const [saving,   setSaving]   = useState(false);

  const setF = (k: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: k === "price" || k === "durationMin" ? Number(e.target.value) : e.target.value }));

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit   = (s: Svc) => { setEditing(s); setForm({ name:s.name, category:s.category, durationMin:s.durationMin, price:s.price, isActive:s.isActive, description:s.description, imageUrl:s.imageUrl, imagePath:s.imagePath }); setOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    if (editing) {
      setServices(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s));
      toast.success("Service updated");
    } else {
      setServices(prev => [...prev, { ...form, id:`s-${Date.now()}` }]);
      toast.success("Service created");
    }
    setSaving(false);
    setOpen(false);
  };

  const toggleActive = (id: string) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    toast.success("Service deleted");
  };

  const byCategory = services.reduce<Record<string, Svc[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Catalog"
        title="Services"
        description={`${services.filter(s=>s.isActive).length} active · ${services.filter(s=>!s.isActive).length} inactive`}
        actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> New Service</Button>}
      />

      {Object.entries(byCategory).map(([cat, svcs]) => (
        <div key={cat}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">{CAT_EMOJI[cat as ServiceCategory]}</span>
            <h2 className="font-heading text-lg text-white">{CAT_LABELS[cat as ServiceCategory]}</h2>
            <div className="flex-1 h-px bg-ash/20" />
          </div>
          <Card variant="elevated" className="p-0 overflow-hidden">
            <div className="divide-y divide-white/[0.04]">
              {svcs.map(s => (
                <div key={s.id}
                  className={`flex items-center gap-4 px-5 py-3.5 group hover:bg-smoke/30 transition-colors ${!s.isActive ? "opacity-50" : ""}`}>
                  {/* Service image thumbnail */}
                  <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-smoke border border-ash/40">
                    {s.imageUrl ? (
                      <Image src={s.imageUrl} alt={s.name} width={48} height={48}
                        className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xl">
                        {CAT_EMOJI[s.category]}
                      </div>
                    )}
                  </div>
                  <Switch checked={s.isActive} onCheckedChange={() => toggleActive(s.id)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-pearl">{s.name}</p>
                    <span className="flex items-center gap-1 font-body text-xs text-mist">
                      <Clock className="h-3 w-3" />
                      {Math.floor(s.durationMin/60)}h{s.durationMin%60>0?` ${s.durationMin%60}m`:""}
                    </span>
                  </div>
                  <span className="font-display text-xl text-gold-light shrink-0">£{s.price}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                    <button onClick={() => openEdit(s)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-mist hover:text-gold hover:bg-gold/10 transition-all">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => deleteService(s.id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-ash hover:text-danger-text hover:bg-danger-bg transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ))}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-5 max-h-[65vh] overflow-y-auto">
            {/* Service image */}
            <ImageUpload
              label="Service Image"
              hint="Shown on service cards and booking page · JPG or PNG · Max 4MB"
              value={form.imageUrl}
              onChange={(url, path) => setForm(f => ({ ...f, imageUrl: url, imagePath: path }))}
              onRemove={() => setForm(f => ({ ...f, imageUrl: null, imagePath: null }))}
              bucket={BUCKETS.SERVICES}
              uploadPath={`${editing?.id ?? "new"}-${Date.now()}.jpg`}
              shape="square"
              aspectRatio="landscape"
            />
            <Separator />
            <Input label="Service Name" placeholder="e.g. Knotless Box Braids" value={form.name} onChange={setF("name")} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs uppercase tracking-widest text-silver">Category</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as ServiceCategory }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CAT_LABELS).map(([k,v]) => (
                      <SelectItem key={k} value={k}>{CAT_EMOJI[k as ServiceCategory]} {v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input label="Duration (minutes)" type="number" value={form.durationMin} onChange={setF("durationMin")} />
            </div>
            <Input label="Price (£)" type="number" placeholder="45" value={form.price || ""} onChange={setF("price")} />
            <Textarea label="Description" placeholder="Brief description of the service…"
              value={form.description} onChange={setF("description")} rows={3} />
            <Switch label="Active — show on booking page"
              checked={form.isActive} onCheckedChange={v => setForm(f => ({ ...f, isActive: v }))} />
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" loading={saving} disabled={!form.name || !form.price} onClick={handleSave}>
              {editing ? "Save Changes" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
