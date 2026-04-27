"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { BUCKETS } from "@/lib/supabase/storage";

export default function EditStylistPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    specialties: "",
    bio: "",
    instagramHandle: "",
    yearsExperience: "0",
    isActive: true,
    avatarUrl: null as string | null,
  });

  useEffect(() => {
    async function fetchStylist() {
      try {
        const res = await fetch(`/api/admin/stylists/${id}`);
        const data = await res.json();
        if (data.stylist) {
          const s = data.stylist;
          setFormData({
            fullName: s.profile.fullName,
            specialties: s.specialties.join(", "),
            bio: s.bio ?? "",
            instagramHandle: s.instagramHandle ?? "",
            yearsExperience: String(s.yearsExperience),
            isActive: s.isActive,
            avatarUrl: s.profile.avatarUrl,
          });
        }
      } catch (e) {
        toast.error("Failed to load stylist");
      } finally {
        setLoading(false);
      }
    }
    fetchStylist();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/stylists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          specialties: formData.specialties.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        toast.success("Stylist updated successfully");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update stylist");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-mist">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/stylists")}>
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </div>

      <PageHeader
        eyebrow="Management"
        title={`Edit ${formData.fullName}`}
        description="Update stylist information and professional details."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <Card variant="elevated" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="space-y-4">
                  <p className="font-heading text-sm text-white">Profile Photo</p>
                  <div className="flex items-center gap-6">
                    <Avatar name={formData.fullName} size="xl" src={formData.avatarUrl ?? undefined} />
                    <ImageUpload
                      bucket={BUCKETS.AVATARS}
                      uploadPath={`${id}/avatar`}
                      onChange={url => setFormData({ ...formData, avatarUrl: url })}
                      label="Change Photo"
                      className="w-auto"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <Input
                    label="Full Name"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-smoke border border-white/[0.05]">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={v => setFormData({ ...formData, isActive: v })}
                    />
                    <div>
                      <p className="font-body text-sm font-medium text-pearl">Active Status</p>
                      <p className="font-body text-xs text-mist">Visible to clients in search and listings.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="space-y-4">
              <h3 className="font-heading text-lg text-white mb-4">Professional Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Years of Experience"
                  type="number"
                  value={formData.yearsExperience}
                  onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })}
                />
                <Input
                  label="Instagram Handle"
                  placeholder="@stylist_name"
                  value={formData.instagramHandle}
                  onChange={e => setFormData({ ...formData, instagramHandle: e.target.value })}
                />
              </div>
              <Input
                label="Specialties"
                placeholder="Braids, Natural Hair, Silk Press..."
                value={formData.specialties}
                onChange={e => setFormData({ ...formData, specialties: e.target.value })}
                hint="Comma separated list of expertise."
              />
              <Textarea
                label="Professional Bio"
                rows={6}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell clients about your experience and style..."
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="default">
              <h4 className="font-heading text-sm text-white mb-4">Actions</h4>
              <Button type="submit" className="w-full" loading={isSubmitting}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline-gold" 
                className="w-full mt-2" 
                onClick={() => router.push(`/admin/stylists/${id}/images`)}
              >
                Manage Portfolio
              </Button>
            </Card>

            <div className="p-4 rounded-xl border border-white/[0.05] bg-graphite">
              <h5 className="font-body text-xs font-semibold uppercase tracking-widest text-mist mb-2 text-center">Resources</h5>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-ash hover:text-white" onClick={() => router.push(`/stylists/${id}`)}>
                  View Public Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
