"use client";
import { useState, useCallback } from "react";
import type { BucketName } from "@/lib/supabase/storage";

interface UploadState {
  uploading: boolean;
  error:     string | null;
  url:       string | null;
  path:      string | null;
}

/**
 * Hook for uploading a single image to Supabase Storage via /api/storage/upload.
 * Returns the public URL and storage path on success.
 */
export function useImageUpload(bucket: BucketName) {
  const [state, setState] = useState<UploadState>({
    uploading: false, error: null, url: null, path: null,
  });

  const upload = useCallback(async (file: File, storagePath: string) => {
    setState({ uploading: true, error: null, url: null, path: null });

    const formData = new FormData();
    formData.append("file",   file);
    formData.append("bucket", bucket);
    formData.append("path",   storagePath);

    try {
      const res  = await fetch("/api/storage/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || data.error) {
        setState(s => ({ ...s, uploading: false, error: data.error ?? "Upload failed" }));
        return null;
      }

      setState({ uploading: false, error: null, url: data.url, path: data.path });
      return { url: data.url as string, path: data.path as string };
    } catch {
      setState(s => ({ ...s, uploading: false, error: "Network error. Please try again." }));
      return null;
    }
  }, [bucket]);

  const remove = useCallback(async (path: string) => {
    await fetch("/api/storage/delete", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ bucket, path }),
    });
    setState({ uploading: false, error: null, url: null, path: null });
  }, [bucket]);

  const reset = useCallback(() => {
    setState({ uploading: false, error: null, url: null, path: null });
  }, []);

  return { ...state, upload, remove, reset };
}

/**
 * Hook for uploading multiple portfolio images.
 */
export function usePortfolioUpload(stylistId: string) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const uploadMany = useCallback(async (files: File[]): Promise<Array<{ id:string; url:string; path:string; caption:string }>> => {
    setUploading(true);
    setError(null);

    try {
      const results = await Promise.all(
        files.map(async file => {
          const ext  = file.name.split(".").pop() ?? "jpg";
          const path = `${stylistId}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;

          const form = new FormData();
          form.append("file",   file);
          form.append("bucket", "portfolios");
          form.append("path",   path);

          const res  = await fetch("/api/storage/upload", { method:"POST", body: form });
          const data = await res.json();

          if (!res.ok || data.error) throw new Error(data.error ?? "Upload failed");
          return { id: `pi-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, url: data.url, path: data.path, caption: "" };
        })
      );

      return results;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      setError(msg);
      return [];
    } finally {
      setUploading(false);
    }
  }, [stylistId]);

  return { uploading, error, uploadMany };
}
