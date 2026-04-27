"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { PortfolioUpload, type PortfolioItem } from "@/components/shared/PortfolioUpload";
import { toast } from "sonner";
import { ArrowLeft, Save, Layout, Grid } from "lucide-react";
import { BUCKETS } from "@/lib/supabase/storage";
import Image from "next/image";

export default function StylistImagesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [stylistName, setStylistName] = useState("");
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    async function fetchStylist() {
      try {
        const res = await fetch(`/api/admin/stylists/${id}`);
        const data = await res.json();
        if (data.stylist) {
          setStylistName(data.stylist.profile.fullName);
          setHeroUrl(data.stylist.heroImageUrl);
          setPortfolio((data.stylist.portfolioImages ?? []) as PortfolioItem[]);
        }
      } catch (e) {
        toast.error("Failed to load stylist");
      } finally {
        setLoading(false);
      }
    }
    fetchStylist();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/stylists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroImageUrl: heroUrl,
          portfolioImages: portfolio,
        }),
      });

      if (res.ok) {
        toast.success("Images updated successfully");
        router.refresh();
      } else {
        toast.error("Failed to save images");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-mist">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/stylists/${id}/edit`)}>
          <ArrowLeft className="h-4 w-4" />
          Back to Edit
        </Button>
      </div>

      <PageHeader
        eyebrow="Portfolio & Media"
        title={`Visual Branding: ${stylistName}`}
        description="Manage the hero banner and professional portfolio for this stylist."
        actions={
          <Button onClick={handleSave} loading={isSaving}>
            <Save className="h-4 w-4" />
            Save Visuals
          </Button>
        }
      />

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-8">
          {/* Hero Banner Section */}
          <Card variant="elevated" className="overflow-hidden p-0">
            <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-2">
              <Layout className="h-4 w-4 text-gold" />
              <h3 className="font-heading text-base text-white">Profile Hero Banner</h3>
            </div>
            <div className="p-6">
              <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-smoke border border-white/[0.05] mb-4">
                {heroUrl ? (
                  <Image src={heroUrl} alt="Hero preview" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-ash gap-2">
                    <Layout className="h-10 w-10 opacity-20" />
                    <p className="font-body text-xs italic">No hero image set</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <ImageUpload
                  bucket={BUCKETS.PORTFOLIOS}
                  uploadPath={`${id}/hero`}
                  onChange={url => setHeroUrl(url)}
                  label={heroUrl ? "Replace Hero Image" : "Upload Hero Image"}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </Card>

          {/* Portfolio Grid Section */}
          <Card variant="elevated" className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-2">
              <Grid className="h-4 w-4 text-gold" />
              <h3 className="font-heading text-base text-white">Work Portfolio</h3>
            </div>
            <div className="p-6">
              <PortfolioUpload
                stylistId={id}
                items={portfolio}
                onChange={setPortfolio}
                maxItems={12}
              />
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card variant="default">
            <h4 className="font-heading text-sm text-white mb-4">Image Guidelines</h4>
            <ul className="space-y-3 font-body text-xs text-mist">
              <li className="flex gap-2">
                <span className="text-gold">•</span>
                <span><strong>Hero Image:</strong> Recommended 1920x800px. This appears at the top of the stylist's public profile.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold">•</span>
                <span><strong>Portfolio:</strong> Upload high-quality photos of finished hairstyles. Show off diversity and precision.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold">•</span>
                <span><strong>File Size:</strong> Keep images under 5MB for optimal loading speeds.</span>
              </li>
            </ul>
          </Card>

          <div className="p-5 rounded-2xl bg-graphite border border-white/[0.05] text-center">
            <p className="font-body text-sm text-pearl mb-4">Preview changes on live profile</p>
            <Button 
              variant="outline-gold" 
              className="w-full"
              onClick={() => window.open(`/stylists/${id}`, "_blank")}
            >
              Live Preview
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
