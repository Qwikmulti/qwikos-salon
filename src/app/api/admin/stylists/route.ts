import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify Admin
  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (profile?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { fullName, email, password, specialties, bio, instagramHandle, yearsExperience } = body;

    const adminClient = createAdminClient();
    
    // 1. Create user in Supabase Auth
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (authError) throw authError;

    // 2. Create Profile and Stylist in Prisma
    const stylist = await prisma.$transaction(async (tx) => {
      const p = await tx.profile.create({
        data: {
          id: authUser.user.id,
          email,
          fullName,
          role: "STYLIST",
        }
      });

      return tx.stylist.create({
        data: {
          profileId: p.id,
          bio,
          specialties: specialties || [],
          instagramHandle,
          yearsExperience: Number(yearsExperience || 0),
          status: "APPROVED",
          isActive: true
        },
        include: { profile: true }
      });
    });

    return NextResponse.json({ stylist }, { status: 201 });
  } catch (err: any) {
    console.error("[admin stylists POST]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
