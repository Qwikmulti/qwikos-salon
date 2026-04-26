import type { NextConfig } from "next";

const SUPABASE_PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0]
  : "";

const nextConfig: NextConfig = {
  images: {
    // Use Supabase's built-in image transformation for Supabase-hosted images
    loader: "custom",
    loaderFile: "./src/lib/supabase/image-loader.ts",
    remotePatterns: [
      // Supabase Storage — covers any project
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/render/image/public/**",
      },
      // Unsplash (used as placeholder until real photos uploaded)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
