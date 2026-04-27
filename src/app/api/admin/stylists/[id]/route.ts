import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await prisma.profile.findUnique({ where: { id: user.id } });
    if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const stylist = await prisma.stylist.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!stylist) return NextResponse.json({ error: "Stylist not found" }, { status: 404 });

    return NextResponse.json({ stylist });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await prisma.profile.findUnique({ where: { id: user.id } });
    if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { 
      fullName, 
      bio, 
      specialties, 
      instagramHandle, 
      yearsExperience, 
      isActive, 
      heroImageUrl, 
      portfolioImages, 
      avatarUrl 
    } = body;

    const stylist = await prisma.stylist.update({
      where: { id },
      data: {
        bio,
        specialties,
        instagramHandle,
        yearsExperience: yearsExperience !== undefined ? Number(yearsExperience) : undefined,
        isActive,
        heroImageUrl,
        portfolioImages,
        profile: {
          update: {
            fullName,
            avatarUrl
          }
        }
      },
      include: { profile: true }
    });

    return NextResponse.json({ stylist });
  } catch (err: any) {
    console.error("[admin stylist PATCH]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
