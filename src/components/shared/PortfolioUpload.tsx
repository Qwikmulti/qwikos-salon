"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { validateImageFile, BUCKETS } from "@/lib/supabase/storage";
import { Plus, X, Loader2, GripVertical, AlertCircle } from "lucide-react";

export interface PortfolioItem {
  id:       string;
  url:      string;
  path:     string;
  caption?: string;
}

interface PortfolioUploadProps {
  stylistId:   string;
  items:       PortfolioItem[];
  onChange:    (items: PortfolioItem[]) => void;
  maxItems?:   number;
  className?:  string;
}

export function PortfolioUpload({
  stylistId, items, onChange, maxItems = 20, className,
}: PortfolioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = maxItems - items.length;
    const toUpload  = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const results = await Promise.all(
        toUpload.map(async file => {
          const err = validateImageFile(file, BUCKETS.PORTFOLIOS);
          if (err) throw new Error(err);

          const formData = new FormData();
          formData.append("file", file);
          formData.append("bucket", BUCKETS.PORTFOLIOS);
          formData.append("path", `${stylistId}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${file.name.split(".").pop()}`);

          const res  = await fetch("/api/storage/upload", { method:"POST", body: formData });
          const data = await res.json();
          if (!res.ok || data.error) throw new Error(data.error ?? "Upload failed");
          return { id: `pi-${Date.now()}-${Math.random()}`, url: data.url, path: data.path, caption: "" };
        })
      );
      onChange([...items, ...results]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeItem = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    // Fire-and-forget delete from storage
    fetch("/api/storage/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket: BUCKETS.PORTFOLIOS, path: item.path }),
    });
    onChange(items.filter(i => i.id !== id));
  };

  const updateCaption = (id: string, caption: string) =>
    onChange(items.map(i => i.id === id ? { ...i, caption } : i));

  const canAdd = items.length < maxItems;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="font-body text-xs uppercase tracking-widest text-silver">
          Portfolio Gallery
        </span>
        <span className="font-mono text-xs text-mist">{items.length}/{maxItems} photos</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Existing items */}
        {items.map(item => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-square bg-graphite border border-ash/40">
            <Image src={item.url} alt={item.caption ?? "Portfolio"} fill
              className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="200px" />
            <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/60 transition-all" />

            {/* Caption edit */}
            <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
              <input
                type="text"
                placeholder="Add caption…"
                value={item.caption ?? ""}
                onChange={e => updateCaption(item.id, e.target.value)}
                onClick={e => e.stopPropagation()}
                className="w-full bg-obsidian/80 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1 font-body text-xs text-pearl outline-none focus:border-gold/50"
              />
            </div>

            {/* Remove */}
            <button type="button" onClick={() => removeItem(item.id)}
              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-danger flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10">
              <X className="h-3 w-3 text-white" />
            </button>

            {/* Drag handle (visual only) */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-60 transition-all cursor-grab">
              <GripVertical className="h-4 w-4 text-white" />
            </div>
          </div>
        ))}

        {/* Upload cell */}
        {canAdd && (
          <label className={cn(
            "relative flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-ash/60 hover:border-gold/50 hover:bg-smoke transition-all cursor-pointer",
            uploading && "opacity-60 pointer-events-none"
          )}>
            {uploading
              ? <Loader2 className="h-7 w-7 text-gold animate-spin" />
              : <>
                  <Plus className="h-7 w-7 text-mist mb-1" />
                  <span className="font-body text-xs text-mist">Add photos</span>
                </>
            }
            <input type="file" multiple accept="image/jpeg,image/png,image/webp"
              onChange={e => handleFiles(e.target.files)} className="hidden" />
          </label>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger-text">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="font-body text-xs">{error}</span>
        </div>
      )}

      <p className="font-body text-xs text-mist">
        Upload up to {maxItems} photos. JPG, PNG, or WebP · Max 8MB each. Click a photo to add a caption.
      </p>
    </div>
  );
}
