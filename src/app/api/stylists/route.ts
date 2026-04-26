import { NextRequest, NextResponse } from "next/server";
import { createClient }  from "@/lib/supabase/server";
import { prisma }        from "@/lib/prisma/client";
import { z }             from "zod";

const updateSchema = z.object({
  fullName:        z.string().min(2).optional(),
  phone:           z.string().optional(),
  bio:             z.string().max(800).optional(),
  instagramHandle: z.string().optional(),
  yearsExperience: z.number().int().min(0).max(50).optional(),
  specialties:     z.array(z.string()).optional(),
  isActive:        z.boolean().optional(),
  // Storage URLs — set after upload via /api/storage/upload
  avatarUrl:       z.string().url().nullable().optional(),
  heroImageUrl:    z.string().url().nullable().optional(),
  portfolioImages: z.array(z.object({
    id:      z.string(),
    url:     z.string().url(),
    path:    z.string(),
    caption: z.string().optional(),
  })).optional(),
});

/** GET /api/stylists — list all active stylists (public) */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const serviceId = searchParams.get("serviceId");

  const stylists = await prisma.stylist.findMany({
    where: {
      isActive: true,
      ...(serviceId ? { services: { some: { serviceId } } } : {}),
    },
    include: { profile: { select: { fullName: true, email: true, avatarUrl: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ stylists });
}

/** PATCH /api/stylists — update own stylist profile */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body   = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { fullName, phone, avatarUrl, heroImageUrl, portfolioImages, ...stylistData } = parsed.data;

  // Update profile fields
  if (fullName || phone || avatarUrl !== undefined) {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        ...(fullName    ? { fullName }    : {}),
        ...(phone       ? { phone }       : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      },
    });
  }

  // Update stylist-specific fields
  const stylist = await prisma.stylist.update({
    where:   { profileId: user.id },
    data: {
      ...stylistData,
      ...(heroImageUrl !== undefined ? { heroImageUrl } : {}),
      ...(portfolioImages             ? { portfolioUrls: portfolioImages.map(p => p.url) } : {}),
    },
    include: { profile: true },
  });

  return NextResponse.json({ stylist });
}
