"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHeader }      from "@/components/ui/page-header";
import { Card }            from "@/components/ui/card";
import { Badge }           from "@/components/ui/badge";
import { Avatar }          from "@/components/ui/avatar";
import { Button }          from "@/components/ui/button";
import { Switch }          from "@/components/ui/switch";
import { Input }           from "@/components/ui/input";
import { Textarea }        from "@/components/ui/textarea";
import { Separator }       from "@/components/ui/separator";
import { ConfirmDialog }   from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload }     from "@/components/shared/ImageUpload";
import { PortfolioUpload } from "@/components/shared/PortfolioUpload";
import { toast }           from "sonner";
import { BUCKETS }         from "@/lib/supabase/storage";
import { IMAGES }          from "@/lib/utils/images";
import { Search, Plus, Pencil, Trash2, Star, X } from "lucide-react";
import type { PortfolioItem } from "@/components/shared/PortfolioUpload";

interface StylistRow {
  id:           string;
  name:         string;
  role:         string;
  specialties:  string[];
  exp:          number;
  rating:       number;
  bookings:     number;
  isActive:     boolean;
  avatarUrl:    string | null;
  heroUrl:      string | null;
  portfolio:    PortfolioItem[];
  phone:        string;
  instagram:    string;
  bio:          string;
}

const INIT: StylistRow[] = [
  { id:"st1", name:"Fatima Hassan",   role:"Lead Braiding Specialist",      specialties:["Braiding","Natural Hair","Locs"],  exp:7, rating:4.9, bookings:856,  isActive:true,  avatarUrl:IMAGES.stylists.fatima, heroUrl:IMAGES.hero.braids,    portfolio:[], phone:"+44 7700 900111", instagram:"fatima.styles", bio:"Specialist in all protective styles." },
  { id:"st2", name:"Emeka Nwachukwu", role:"Master Barber & Colourist",     specialties:["Fades","Beard","Colour"],          exp:5, rating:4.8, bookings:641,  isActive:true,  avatarUrl:IMAGES.stylists.emeka,  heroUrl:IMAGES.services.beard, portfolio:[], phone:"+44 7700 900222", instagram:"emeka.cuts",    bio:"Master barber and colour specialist." },
  { id:"st3", name:"Amara Diallo",    role:"Senior Colourist & Treatments", specialties:["Balayage","Keratin","Treatments"], exp:9, rating:5.0, bookings:1204, isActive:true,  avatarUrl:IMAGES.stylists.amara,  heroUrl:IMAGES.services.color, portfolio:[], phone:"+44 7700 900333", instagram:"amara.colour",  bio:"Award-winning colourist." },
  { id:"st4", name:"Kemi Adeleke",    role:"Natural Hair & Styling Expert", specialties:["Natural Hair","Relaxer","Styling"],exp:4, rating:4.7, bookings:312,  isActive:true,  avatarUrl:null,                   heroUrl:null,                  portfolio:[], phone:"+44 7700 900444", instagram:"kemi.hair",     bio:"Natural hair specialist." },
  { id:"st5", name:"James Obi",       role:"Barber & Loc Specialist",       specialties:["Fades","Locs","Braids"],           exp:3, rating:4.6, bookings:198,  isActive:false, avatarUrl:null,                   heroUrl:null,                  portfolio:[], phone:"+44 7700 900555", instagram:"james.cuts",    bio:"Barber and loc specialist." },
];

const EMPTY_STYLIST: Omit<StylistRow,"id"> = {
  name:"", role:"", specialties:[], exp:0, rating:0, bookings:0,
  isActive:true, avatarUrl:null, heroUrl:null, portfolio:[],
  phone:"", instagram:"", bio:"",
};

const SPECIALTY_OPTIONS = [
  "Braiding","Natural Hair","Locs","Colour","Balayage","Keratin",
  "Treatments","Fades","Beard","Cornrows","Creative Colour","Relaxer",
];

export default function AdminStylistsPage() {
  const [stylists, setStylists] = useState<StylistRow[]>(INIT);
  const [query,    setQuery]    = useState("");
  const [open,     setOpen]     = useState(false);
  const [editing,  setEditing]  = useState<StylistRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState<Omit<StylistRow,"id">>(EMPTY_STYLIST);

  const setF = (k: keyof typeof EMPTY_STYLIST) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: k === "exp" ? Number(e.target.value) : e.target.value }));

  const toggleSpec = (s: string) =>
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter(x => x !== s)
        : [...f.specialties, s],
    }));

  const openCreate = () => { setEditing(null); setForm(EMPTY_STYLIST); setOpen(true); };
  const openEdit   = (s: StylistRow) => {
    setEditing(s);
    setForm({ name:s.name, role:s.role, specialties:s.specialties, exp:s.exp, rating:s.rating,
      bookings:s.bookings, isActive:s.isActive, avatarUrl:s.avatarUrl, heroUrl:s.heroUrl,
      portfolio:s.portfolio, phone:s.phone, instagram:s.instagram, bio:s.bio });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    if (editing) {
      setStylists(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s));
      toast.success("Stylist updated");
    } else {
      setStylists(prev => [...prev, { ...form, id: `st-${Date.now()}` }]);
      toast.success("Stylist added");
    }
    setSaving(false);
    setOpen(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise(r => setTimeout(r, 700));
    setStylists(prev => prev.filter(s => s.id !== deleteId));
    setDeleting(false);
    setDeleteId(null);
    toast.success("Stylist removed");
  };

  const toggleActive = (id: string) => {
    setStylists(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    const stylist = stylists.find(s => s.id === id);
    toast.success(`${stylist?.name} ${stylist?.isActive ? "deactivated" : "activated"}`);
  };

  const filtered = stylists.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.specialties.some(sp => sp.toLowerCase().includes(query.toLowerCase())),
  );

  const active   = stylists.filter(s => s.isActive).length;
  const inactive = stylists.length - active;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Team"
        title="Stylists"
        description={`${active} active · ${inactive} inactive · ${stylists.length} total`}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Stylist
          </Button>
        }
      />

      <Input placeholder="Search stylists or specialties…" icon={<Search className="h-4 w-4" />}
        value={query} onChange={e => setQuery(e.target.value)} />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(s => (
          <Card key={s.id} variant="elevated"
            className="p-0 overflow-hidden group hover:border-gold/20 hover:shadow-gold transition-all duration-300">

            {/* Hero image strip */}
            <div className="relative h-28 overflow-hidden bg-smoke">
              {s.heroUrl ? (
                <Image src={s.heroUrl} alt={s.name} fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="400px" />
              ) : (
                <div className="absolute inset-0 bg-card-gradient" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 to-transparent" />

              {/* Active toggle in top-right */}
              <div className="absolute top-3 right-3">
                <Switch checked={s.isActive} onCheckedChange={() => toggleActive(s.id)} />
              </div>
            </div>

            <div className="px-5 pb-5">
              {/* Avatar overlapping hero */}
              <div className="flex items-end gap-3 -mt-8 mb-3">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden ring-3 ring-graphite border border-white/10 shrink-0 bg-graphite">
                  {s.avatarUrl ? (
                    <Image src={s.avatarUrl} alt={s.name} fill
                      className="object-cover object-top" sizes="64px" />
                  ) : (
                    <Avatar name={s.name} size="lg" className="h-full w-full rounded-none" />
                  )}
                </div>
                <div className="pb-1 min-w-0">
                  <p className="font-heading text-base text-white truncate">{s.name}</p>
                  <p className="font-body text-xs text-mist truncate">{s.role}</p>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {s.specialties.slice(0,3).map(sp => (
                  <span key={sp} className="font-body text-2xs px-2 py-0.5 rounded-full bg-smoke border border-ash/40 text-silver uppercase tracking-wide">{sp}</span>
                ))}
                {s.specialties.length > 3 && (
                  <span className="font-body text-2xs px-2 py-0.5 rounded-full bg-smoke border border-ash/40 text-mist">+{s.specialties.length - 3}</span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-px bg-ash/20 rounded-xl overflow-hidden mb-4">
                {[
                  { label:"Rating",   value:`${s.rating}★` },
                  { label:"Clients",  value: s.bookings > 999 ? `${(s.bookings/1000).toFixed(1)}k` : String(s.bookings) },
                  { label:"Status",   value: s.isActive ? "Active" : "Off" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center py-2.5 bg-smoke">
                    <span className="font-display text-base text-gold-light leading-none">{value}</span>
                    <span className="font-body text-2xs text-mist uppercase tracking-wider mt-0.5">{label}</span>
                  </div>
                ))}
              </div>

              {/* Portfolio preview */}
              {s.portfolio.length > 0 && (
                <div className="flex gap-1.5 mb-4">
                  {s.portfolio.slice(0,4).map((p, i) => (
                    <div key={p.id} className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={p.url} alt={p.caption ?? "Portfolio"} fill
                        className="object-cover" sizes="48px" />
                      {i === 3 && s.portfolio.length > 4 && (
                        <div className="absolute inset-0 bg-obsidian/70 flex items-center justify-center">
                          <span className="font-mono text-xs text-white">+{s.portfolio.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEdit(s)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/stylists/${s.id}`} target="_blank">
                    <Star className="h-3.5 w-3.5" /> Profile
                  </Link>
                </Button>
                <button
                  onClick={() => setDeleteId(s.id)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center border border-ash/50 text-ash hover:border-danger/40 hover:text-danger-text hover:bg-danger-bg transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit — ${editing.name}` : "Add New Stylist"}</DialogTitle>
          </DialogHeader>

          <DialogBody className="max-h-[70vh] overflow-y-auto space-y-6">

            {/* Photos */}
            <div>
              <h4 className="font-heading text-base text-white mb-4">Photos</h4>
              <div className="grid sm:grid-cols-2 gap-5">
                <ImageUpload
                  label="Profile Photo"
                  hint="Shown on booking & public profile · Max 2MB"
                  value={form.avatarUrl}
                  onChange={(url, path) => setForm(f => ({ ...f, avatarUrl: url }))}
                  onRemove={() => setForm(f => ({ ...f, avatarUrl: null }))}
                  bucket={BUCKETS.AVATARS}
                  uploadPath={`${editing?.id ?? "new"}/avatar-${Date.now()}.jpg`}
                  shape="circle"
                  aspectRatio="square"
                />
                <ImageUpload
                  label="Hero / Featured Image"
                  hint="Shown on stylist card & profile page · Max 5MB"
                  value={form.heroUrl}
                  onChange={(url, path) => setForm(f => ({ ...f, heroUrl: url }))}
                  onRemove={() => setForm(f => ({ ...f, heroUrl: null }))}
                  bucket={BUCKETS.STYLIST_PHOTOS}
                  uploadPath={`${editing?.id ?? "new"}/hero-${Date.now()}.jpg`}
                  shape="square"
                  aspectRatio="landscape"
                />
              </div>
            </div>

            <Separator />

            {/* Basic info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name"  placeholder="Fatima Hassan"          value={form.name}      onChange={setF("name")} />
              <Input label="Job Title"  placeholder="Lead Braiding Specialist" value={form.role}    onChange={setF("role")} />
              <Input label="Phone"      placeholder="+44 7700 900 000"       value={form.phone}     onChange={setF("phone")} type="tel" />
              <Input label="Instagram"  placeholder="handle (no @)"          value={form.instagram} onChange={setF("instagram")}
                icon={<span className="text-mist text-sm">@</span>} />
              <Input label="Years Exp." placeholder="5"                      value={String(form.exp)} onChange={setF("exp")} type="number" />
              <div className="flex items-center gap-3 mt-auto pb-1">
                <Switch checked={form.isActive}
                  onCheckedChange={v => setForm(f => ({ ...f, isActive: v }))} />
                <span className="font-body text-sm text-silver">Active / accepting bookings</span>
              </div>
            </div>

            <Textarea label="Bio" placeholder="Tell clients about their style, approach, and experience…"
              rows={3} value={form.bio} onChange={setF("bio")} />

            <Separator />

            {/* Specialties */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-silver mb-3">Specialities</p>
              <div className="flex flex-wrap gap-2">
                {SPECIALTY_OPTIONS.map(sp => {
                  const active = form.specialties.includes(sp);
                  return (
                    <button key={sp} type="button" onClick={() => toggleSpec(sp)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-body text-xs transition-all ${
                        active ? "bg-gold/10 border-gold/30 text-gold-light" : "bg-smoke border-ash/50 text-silver hover:border-gold/20"
                      }`}>
                      {active ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                      {sp}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Portfolio */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-silver mb-3">Portfolio Gallery</p>
              <PortfolioUpload
                stylistId={editing?.id ?? "new"}
                items={form.portfolio}
                onChange={items => setForm(f => ({ ...f, portfolio: items }))}
                maxItems={20}
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" loading={saving} disabled={!form.name} onClick={handleSave}>
              {editing ? "Save Changes" : "Add Stylist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}
        title="Remove Stylist"
        description="This will permanently remove the stylist, their portfolio images, and all associated data. This cannot be undone."
        confirmLabel="Remove Stylist" variant="danger"
        loading={deleting} onConfirm={handleDelete}
      />
    </div>
  );
}
