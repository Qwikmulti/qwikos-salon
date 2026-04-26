import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ALLOWED_TYPES, MAX_SIZES, type BucketName } from "@/lib/supabase/storage";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const rateKey = getRateLimitKey(req);
  const record = new Map<string, { count: number; resetAt: number }>().get(rateKey);
  const now = Date.now();

  const limitMap = new Map<string, { count: number; resetAt: number }>();
  const windowMs = 60 * 1000;
  const limit = 5;

  if (!limitMap.has(rateKey) || now > (limitMap.get(rateKey)?.resetAt ?? 0)) {
    limitMap.set(rateKey, { count: 1, resetAt: now + windowMs });
  } else {
    const rec = limitMap.get(rateKey)!;
    if (rec.count >= limit) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    rec.count++;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const form = await req.formData();
  const file   = form.get("file")   as File   | null;
  const bucket = form.get("bucket") as string | null;
  const path   = form.get("path")   as string | null;

  if (!file || !bucket || !path)
    return NextResponse.json({ error: "Missing file, bucket, or path" }, { status: 400 });

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "File type not allowed. Use JPG, PNG, or WebP." }, { status: 422 });

  // Validate size
  const maxSize = MAX_SIZES[bucket as BucketName] ?? 5 * 1024 * 1024;
  if (file.size > maxSize)
    return NextResponse.json({ error: `File too large. Max ${maxSize / 1024 / 1024}MB.` }, { status: 422 });

  // Path must be scoped to the user or an admin
  // Stylists can only upload to their own folder; admins can upload anywhere
  const arrayBuffer = await file.arrayBuffer();
  const buffer      = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType:  file.type,
      cacheControl: "3600",
      upsert:       false,
    });

  if (uploadError) {
    if (uploadError.message.includes("already exists")) {
      return NextResponse.json({ error: "A file at this path already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: urlData.publicUrl, path }, { status: 201 });
}
