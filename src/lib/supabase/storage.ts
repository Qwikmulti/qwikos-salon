/**
 * Supabase Storage utility — bucket definitions, upload helpers,
 * URL builders, and RLS-aware deletion.
 *
 * Buckets (create in Supabase dashboard or via SQL migration):
 *   - avatars        (public)  — customer & stylist profile photos
 *   - stylist-photos (public)  — stylist hero/featured image
 *   - portfolios     (public)  — stylist portfolio/work images
 *   - services       (public)  — service category images
 *   - blog           (public)  — blog post cover images
 */

import { createClient } from "@/lib/supabase/client";

// ─── Bucket names ─────────────────────────────────────────────────────────────
export const BUCKETS = {
  AVATARS:         "avatars",
  STYLIST_PHOTOS:  "stylist-photos",
  PORTFOLIOS:      "portfolios",
  SERVICES:        "services",
  BLOG:            "blog",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

// ─── Max sizes ─────────────────────────────────────────────────────────────────
export const MAX_SIZES: Record<BucketName, number> = {
  [BUCKETS.AVATARS]:        2  * 1024 * 1024,  // 2 MB
  [BUCKETS.STYLIST_PHOTOS]: 5  * 1024 * 1024,  // 5 MB
  [BUCKETS.PORTFOLIOS]:     8  * 1024 * 1024,  // 8 MB
  [BUCKETS.SERVICES]:       4  * 1024 * 1024,  // 4 MB
  [BUCKETS.BLOG]:           5  * 1024 * 1024,  // 5 MB
};

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// ─── Validation ────────────────────────────────────────────────────────────────
export function validateImageFile(file: File, bucket: BucketName): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `File type not supported. Please use JPG, PNG, or WebP.`;
  }
  if (file.size > MAX_SIZES[bucket]) {
    const mb = (MAX_SIZES[bucket] / 1024 / 1024).toFixed(0);
    return `File is too large. Maximum size for this upload is ${mb}MB.`;
  }
  return null;
}

// ─── Path generators ───────────────────────────────────────────────────────────
export function buildStoragePath(bucket: BucketName, userId: string, filename: string): string {
  const ext       = filename.split(".").pop() ?? "jpg";
  const safeName  = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  return `${userId}/${safeName}`;
}

export function buildPortfolioPath(stylistId: string, filename: string): string {
  const ext      = filename.split(".").pop() ?? "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  return `${stylistId}/${safeName}`;
}

// ─── Public URL builder ────────────────────────────────────────────────────────
export function getPublicUrl(bucket: BucketName, path: string): string {
  const supabase  = createClient();
  const { data }  = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ─── Upload helpers ────────────────────────────────────────────────────────────

/** Upload a single image file to a bucket. Returns the public URL on success. */
export async function uploadImage(
  file:   File,
  bucket: BucketName,
  path:   string,
): Promise<{ url: string; path: string } | { error: string }> {
  const validation = validateImageFile(file, bucket);
  if (validation) return { error: validation };

  const supabase = createClient();

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) return { error: uploadError.message };

  const url = getPublicUrl(bucket, path);
  return { url, path };
}

/** Replace an existing file (upsert). */
export async function replaceImage(
  file:   File,
  bucket: BucketName,
  path:   string,
): Promise<{ url: string; path: string } | { error: string }> {
  const validation = validateImageFile(file, bucket);
  if (validation) return { error: validation };

  const supabase = createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (error) return { error: error.message };

  const url = getPublicUrl(bucket, path);
  return { url, path };
}

/** Delete a file from storage. */
export async function deleteStorageFile(bucket: BucketName, path: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return !error;
}

/** Upload multiple portfolio images at once. Returns array of results. */
export async function uploadPortfolioImages(
  files:     File[],
  stylistId: string,
): Promise<Array<{ url: string; path: string } | { error: string }>> {
  return Promise.all(
    files.map(file => {
      const path = buildPortfolioPath(stylistId, file.name);
      return uploadImage(file, BUCKETS.PORTFOLIOS, path);
    })
  );
}
