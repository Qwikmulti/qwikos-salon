"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export default function NewStylistPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    specialties: "",
    bio: "",
    instagramHandle: "",
    yearsExperience: "0"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/stylists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          specialties: formData.specialties.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        toast.success("Stylist created successfully");
        router.push("/admin/stylists");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create stylist");
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
        title="Add New Stylist"
        description="Create a new stylist account and professional profile."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <Card variant="elevated" className="space-y-4">
              <h3 className="font-heading text-lg text-white mb-4">Personal & Login Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <Input
                label="Temporary Password"
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                hint="The stylist will use this to log in for the first time."
              />
            </Card>

            <Card variant="elevated" className="space-y-4">
              <h3 className="font-heading text-lg text-white mb-4">Professional Profile</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Years of Experience"
                  type="number"
                  value={formData.yearsExperience}
                  onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })}
                />
                <Input
                  label="Instagram Handle (optional)"
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
                Create Account
              </Button>
              <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => router.back()}>
                Cancel
              </Button>
            </Card>
            
            <div className="p-4 rounded-xl bg-gold/5 border border-gold/10">
              <p className="font-body text-xs text-gold-light leading-relaxed">
                After creation, you will be able to upload a profile photo, hero image, and portfolio items for this stylist.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
