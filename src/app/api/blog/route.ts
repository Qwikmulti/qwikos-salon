import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().optional(),
  coverImageUrl: z.string().nullable().optional(),
  coverImagePath: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const all = searchParams.get("all");

  const posts = await prisma.blogPost.findMany({
    where: all === "true" ? {} : { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile || profile.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { title, slug, excerpt, content, tags, published, coverImageUrl, coverImagePath } = parsed.data;
  const tagArray = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt: excerpt ?? "",
      content: content ?? "",
      tags: tagArray,
      published: published ?? false,
      publishedAt: published ? new Date() : null,
      authorId: user.id,
      coverImageUrl,
      coverImagePath,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile || profile.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = postSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { id, tags, published, ...data } = parsed.data;
  const tagArray = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : undefined;

  const updateData: Record<string, unknown> = { ...data };
  if (tagArray !== undefined) updateData.tags = tagArray;
  if (published !== undefined) updateData.published = published;
  if (published === true) updateData.publishedAt = new Date();

  const post = await prisma.blogPost.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ post });
}