"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { PortfolioUpload } from "@/components/shared/PortfolioUpload";
import { toast } from "sonner";
import { BUCKETS } from "@/lib/supabase/storage";
import { Save, Plus, X, Loader2 } from "lucide-react";
import type { PortfolioItem } from "@/components/shared/PortfolioUpload";

const SPECIALTIES_OPTIONS = [
  "Braiding", "Natural Hair", "Locs", "Colour", "Balayage", "Keratin",
  "Treatments", "Fades", "Beard", "Cornrows", "Weave", "Relaxer", "Creative Colour",
];

interface StylistProfile {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  instagramHandle?: string;
  yearsExperience?: number;
  isActive?: boolean;
  specialties?: string[];
  heroImageUrl?: string;
  portfolioImages?: PortfolioItem[];
}

export default function StylistProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [heroPath, setHeroPath] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    bio: "",
    instagram: "",
    experience: "",
    isActive: true,
  });
  const [specialties, setSpecialties] = useState<string[]>([]);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stylists?me=true");
      if (!res.ok) throw new Error("Failed to fetch profile");
      
      const data = await res.json();
      const stylist = data.stylist;
      const profile = data.profile;

      if (stylist) {
        setForm({
          fullName: profile?.fullName || "",
          phone: profile?.phone || "",
          bio: stylist.bio || "",
          instagram: stylist.instagramHandle || "",
          experience: stylist.yearsExperience?.toString() || "",
          isActive: stylist.isActive ?? true,
        });
        setSpecialties(stylist.specialties || []);
        setAvatarUrl(profile?.avatarUrl || null);
        setHeroUrl(stylist.heroImageUrl || null);
        
        if (stylist.portfolioImages && Array.isArray(stylist.portfolioImages)) {
          setPortfolio(stylist.portfolioImages as PortfolioItem[]);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleSpecialty = (s: string) =>
    setSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        bio: form.bio,
        instagramHandle: form.instagram,
        yearsExperience: form.experience ? parseInt(form.experience) : 0,
        specialties,
        isActive: form.isActive,
        avatarUrl: avatarUrl,
        heroImageUrl: heroUrl,
        portfolioImages: portfolio.map((p) => ({
          id: p.id,
          url: p.url,
          path: p.path,
          caption: p.caption,
        })),
      };

      const res = await fetch("/api/stylists", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      toast.success("Profile updated!", { description: "Your changes are now live." });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile", { description: error.message });
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
        eyebrow="Account"
        title="My Profile"
        actions={
          <Button size="sm" loading={saving} onClick={handleSave}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        }
      />

      <Card variant="elevated" className="space-y-6">
        <h3 className="font-heading text-lg text-white">Photos</h3>

        <div className="grid sm:grid-cols-2 gap-6">
          <ImageUpload
            label="Profile Photo"
            hint="JPG or PNG · Max 2MB · Shown on booking page"
            value={avatarUrl}
            onChange={(url, path) => {
              setAvatarUrl(url);
              setAvatarPath(path);
            }}
            onRemove={() => {
              setAvatarUrl(null);
              setAvatarPath(null);
            }}
            bucket={BUCKETS.AVATARS}
            uploadPath={`profile/avatar-${Date.now()}.jpg`}
            shape="circle"
            aspectRatio="square"
          />
          <ImageUpload
            label="Hero / Featured Image"
            hint="JPG or PNG · Max 5MB · Shown at top of your public profile"
            value={heroUrl}
            onChange={(url, path) => {
              setHeroUrl(url);
              setHeroPath(path);
            }}
            onRemove={() => {
              setHeroUrl(null);
              setHeroPath(null);
            }}
            bucket={BUCKETS.STYLIST_PHOTOS}
            uploadPath={`profile/hero-${Date.now()}.jpg`}
            shape="square"
            aspectRatio="landscape"
          />
        </div>

        <p className="font-body text-xs text-mist">
          Images are stored securely in Supabase Storage and served via CDN.
        </p>
      </Card>

      <Card variant="elevated">
        <h3 className="font-heading text-lg text-white mb-5">Personal Information</h3>
        <div className="space-y-4">
          <Input label="Full Name" value={form.fullName} onChange={set("fullName")} />
          <Input label="Phone Number" value={form.phone} onChange={set("phone")} type="tel" />
          <Input label="Instagram Handle" value={form.instagram} onChange={set("instagram")}
            icon={<span className="text-mist text-sm">@</span>} />
          <Input label="Years of Experience" value={form.experience} onChange={set("experience")} type="number" />
          <Textarea
            label="Bio"
            value={form.bio}
            onChange={set("bio")}
            rows={4}
            hint="Tell clients about your style, approach, and what makes you unique."
          />
        </div>

        <Separator className="my-5" />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm font-medium text-pearl">Available for Bookings</p>
            <p className="font-body text-xs text-mist">Toggle off to pause new bookings</p>
          </div>
          <Switch
            checked={form.isActive}
            onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
          />
        </div>
      </Card>

      <Card variant="elevated">
        <h3 className="font-heading text-lg text-white mb-2">Specialities</h3>
        <p className="font-body text-xs text-mist mb-5">
          Select everything you specialise in — shown on your public profile
        </p>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES_OPTIONS.map((s) => {
            const active = specialties.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSpecialty(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-body text-xs transition-all ${
                  active
                    ? "bg-gold/10 border-gold/30 text-gold-light"
                    : "bg-smoke border-ash/50 text-silver hover:border-gold/20"
                }`}
              >
                {active ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                {s}
              </button>
            );
          })}
        </div>
      </Card>

      <Card variant="elevated">
        <h3 className="font-heading text-lg text-white mb-2">Portfolio Gallery</h3>
        <p className="font-body text-xs text-mist mb-5">
          Showcase your best work — displayed on your public stylist page. All images stored in Supabase Storage.
        </p>
        <PortfolioUpload
          stylistId="profile"
          items={portfolio}
          onChange={setPortfolio}
          maxItems={20}
        />
      </Card>

      <div className="flex justify-end pt-2">
        <Button size="lg" loading={saving} onClick={handleSave}>
          <Save className="h-4 w-4" /> Save All Changes
        </Button>
      </div>
    </div>
  );
}