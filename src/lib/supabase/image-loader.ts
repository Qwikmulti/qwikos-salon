/**
 * Custom Next.js image loader that routes:
 *  - Supabase Storage URLs → Supabase Image Transformation API (resize, format, quality)
 *  - Everything else     → standard Next.js optimisation
 */

interface LoaderParams {
  src:     string;
  width:   number;
  quality?: number;
}

export default function supabaseImageLoader({ src, width, quality }: LoaderParams): string {
  // If it's already a Supabase storage URL, use their transformation endpoint
  if (src.includes(".supabase.co/storage/v1/object/public/")) {
    const url = new URL(src);
    const projectBase = `${url.protocol}//${url.host}`;
    // Convert /object/public/ path to /render/image/public/
    const path = url.pathname.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
    return `${projectBase}${path}?width=${width}&quality=${quality ?? 80}&resize=contain`;
  }

  // Unsplash or other remote images — pass through with width
  if (src.includes("images.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 80));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }

  // Local images — standard path
  return src;
}
