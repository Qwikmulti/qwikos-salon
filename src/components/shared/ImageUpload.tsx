"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { validateImageFile, type BucketName } from "@/lib/supabase/storage";
import { Upload, X, Camera, Loader2, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  value?:       string | null;           // current URL
  onChange:     (url: string, path: string) => void;
  onRemove?:    () => void;
  bucket:       BucketName;
  uploadPath:   string;                  // e.g. "stylist-id/avatar"
  label?:       string;
  hint?:        string;
  shape?:       "square" | "circle";
  aspectRatio?: "square" | "portrait" | "landscape";
  className?:   string;
  disabled?:    boolean;
}

export function ImageUpload({
  value, onChange, onRemove, bucket, uploadPath,
  label, hint, shape = "square", aspectRatio = "square", className, disabled,
}: ImageUploadProps) {
  const inputRef          = useRef<HTMLInputElement>(null);
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);

  const aspectClass = {
    square:    "aspect-square",
    portrait:  "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  }[aspectRatio];

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const validationError = validateImageFile(file, bucket);
    if (validationError) { setError(validationError); return; }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      formData.append("path", uploadPath);

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Upload failed. Please try again.");
        setPreview(null);
        return;
      }
      onChange(data.url, data.path);
    } catch {
      setError("Network error. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [bucket, uploadPath, onChange]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const displaySrc = preview ?? value;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="font-body text-xs font-semibold uppercase tracking-widest text-silver">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative group overflow-hidden border-2 border-dashed transition-all duration-200",
          shape === "circle" ? "rounded-full" : "rounded-2xl",
          aspectClass,
          disabled || uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          dragging    ? "border-gold bg-gold/10 scale-[1.02]" : "border-ash/60 hover:border-gold/50 hover:bg-smoke",
          displaySrc  ? "border-solid border-ash/30" : "",
        )}
      >
        {/* Current / preview image */}
        {displaySrc && (
          <Image src={displaySrc} alt="Upload preview" fill
            className="object-cover" sizes="400px" unoptimized={!!preview} />
        )}

        {/* Overlay */}
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-200",
          displaySrc
            ? "bg-obsidian/0 group-hover:bg-obsidian/60 opacity-0 group-hover:opacity-100"
            : "bg-transparent"
        )}>
          {uploading ? (
            <Loader2 className="h-8 w-8 text-gold animate-spin" />
          ) : displaySrc ? (
            <>
              <Camera className="h-7 w-7 text-white" />
              <span className="font-body text-xs text-white">Change photo</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-mist" />
              <span className="font-body text-sm text-silver text-center px-4">
                {dragging ? "Drop to upload" : "Click or drag to upload"}
              </span>
              {hint && <span className="font-body text-xs text-mist text-center px-4">{hint}</span>}
            </>
          )}
        </div>

        {/* Remove button */}
        {displaySrc && !uploading && onRemove && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onRemove(); setPreview(null); }}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-danger flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg hover:scale-110"
          >
            <X className="h-3.5 w-3.5 text-white" />
          </button>
        )}

        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={onInputChange} className="hidden" disabled={disabled || uploading} />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger-text">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="font-body text-xs">{error}</span>
        </div>
      )}
    </div>
  );
}
