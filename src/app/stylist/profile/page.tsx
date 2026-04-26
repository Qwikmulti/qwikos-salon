"use client";
import { useState } from "react";
import { PageHeader }       from "@/components/ui/page-header";
import { Card }             from "@/components/ui/card";
import { Input }            from "@/components/ui/input";
import { Textarea }         from "@/components/ui/textarea";
import { Button }           from "@/components/ui/button";
import { Switch }           from "@/components/ui/switch";
import { Separator }        from "@/components/ui/separator";
import { ImageUpload }      from "@/components/shared/ImageUpload";
import { PortfolioUpload }  from "@/components/shared/PortfolioUpload";
import { toast }            from "sonner";
import { BUCKETS }          from "@/lib/supabase/storage";
import { Save, Plus, X }    from "lucide-react";
import type { PortfolioItem } from "@/components/shared/PortfolioUpload";

const SPECIALTIES_OPTIONS = [
  "Braiding","Natural Hair","Locs","Colour","Balayage","Keratin",
  "Treatments","Fades","Beard","Cornrows","Weave","Relaxer","Creative Colour",
];

// In production, load this from DB via server component / route handler
const STYLIST_ID = "stylist-placeholder-id"; // replace with real auth user id

export default function StylistProfilePage() {
  const [saving, setSaving] = useState(false);

  // Image URLs — saved to DB, files stored in Supabase Storage
  const [avatarUrl,    setAvatarUrl]    = useState<string | null>(null);
  const [avatarPath,   setAvatarPath]   = useState<string | null>(null);
  const [heroUrl,      setHeroUrl]      = useState<string | null>(null);
  const [heroPath,     setHeroPath]     = useState<string | null>(null);
  const [portfolio,    setPortfolio]    = useState<PortfolioItem[]>([]);

  const [form, setForm] = useState({
    fullName:   "Fatima Hassan",
    phone:      "+44 7700 900 111",
    bio:        "Specialist in all protective styles with 7 years of dedicated craft. I believe every head of hair tells a story worth protecting and celebrating.",
    instagram:  "fatima.styles",
    experience: "7",
    isActive:   true,
  });
  const [specialties, setSpecialties] = useState(["Braiding","Natural Hair","Locs"]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleSpecialty = (s: string) =>
    setSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSave = async () => {
    setSaving(true);
    // In production: POST /api/stylists/profile with form + avatarUrl + heroUrl + portfolio
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    toast.success("Profile updated!", { description: "Your changes are now live." });
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in pb-10">
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        actions={
          <Button size="sm" loading={saving} onClick={handleSave}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        }
      />

      {/* ── Profile Photo & Hero Image ── */}
      <Card variant="elevated" className="space-y-6">
        <h3 className="font-heading text-lg text-white">Photos</h3>

        <div className="grid sm:grid-cols-2 gap-6">
          <ImageUpload
            label="Profile Photo"
            hint="JPG or PNG · Max 2MB · Shown on booking page"
            value={avatarUrl}
            onChange={(url, path) => { setAvatarUrl(url); setAvatarPath(path); }}
            onRemove={() => { setAvatarUrl(null); setAvatarPath(null); }}
            bucket={BUCKETS.AVATARS}
            uploadPath={`${STYLIST_ID}/avatar-${Date.now()}.jpg`}
            shape="circle"
            aspectRatio="square"
          />
          <ImageUpload
            label="Hero / Featured Image"
            hint="JPG or PNG · Max 5MB · Shown at top of your public profile"
            value={heroUrl}
            onChange={(url, path) => { setHeroUrl(url); setHeroPath(path); }}
            onRemove={() => { setHeroUrl(null); setHeroPath(null); }}
            bucket={BUCKETS.STYLIST_PHOTOS}
            uploadPath={`${STYLIST_ID}/hero-${Date.now()}.jpg`}
            shape="square"
            aspectRatio="landscape"
          />
        </div>

        <p className="font-body text-xs text-mist">
          Images are stored securely in Supabase Storage and served via CDN.
        </p>
      </Card>

      {/* ── Personal Information ── */}
      <Card variant="elevated">
        <h3 className="font-heading text-lg text-white mb-5">Personal Information</h3>
        <div className="space-y-4">
          <Input label="Full Name"             value={form.fullName}   onChange={set("fullName")} />
          <Input label="Phone Number"          value={form.phone}      onChange={set("phone")} type="tel" />
          <Input label="Instagram Handle"      value={form.instagram}  onChange={set("instagram")}
            icon={<span className="text-mist text-sm">@</span>} />
          <Input label="Years of Experience"   value={form.experience} onChange={set("experience")} type="number" />
          <Textarea label="Bio"
            value={form.bio} onChange={set("bio")} rows={4}
            hint="Tell clients about your style, approach, and what makes you unique." />
        </div>

        <Separator className="my-5" />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm font-medium text-pearl">Available for Bookings</p>
            <p className="font-body text-xs text-mist">Toggle off to pause new bookings</p>
          </div>
          <Switch checked={form.isActive}
            onCheckedChange={v => setForm(f => ({ ...f, isActive: v }))} />
        </div>
      </Card>

      {/* ── Specialties ── */}
      <Card variant="elevated">
        <h3 className="font-heading text-lg text-white mb-2">Specialities</h3>
        <p className="font-body text-xs text-mist mb-5">Select everything you specialise in — shown on your public profile</p>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES_OPTIONS.map(s => {
            const active = specialties.includes(s);
            return (
              <button key={s} type="button" onClick={() => toggleSpecialty(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-body text-xs transition-all ${
                  active
                    ? "bg-gold/10 border-gold/30 text-gold-light"
                    : "bg-smoke border-ash/50 text-silver hover:border-gold/20"
                }`}>
                {active ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                {s}
              </button>
            );
          })}
        </div>
      </Card>

      {/* ── Portfolio Gallery ── */}
      <Card variant="elevated">
        <h3 className="font-heading text-lg text-white mb-2">Portfolio Gallery</h3>
        <p className="font-body text-xs text-mist mb-5">
          Showcase your best work — displayed on your public stylist page. All images stored in Supabase Storage.
        </p>
        <PortfolioUpload
          stylistId={STYLIST_ID}
          items={portfolio}
          onChange={setPortfolio}
          maxItems={20}
        />
      </Card>

      {/* Save button — bottom */}
      <div className="flex justify-end pt-2">
        <Button size="lg" loading={saving} onClick={handleSave}>
          <Save className="h-4 w-4" /> Save All Changes
        </Button>
      </div>
    </div>
  );
}
