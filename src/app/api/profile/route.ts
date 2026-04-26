import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

const schema = z.object({
  role:     z.enum(["CUSTOMER","STYLIST","ADMIN"]),
  fullName: z.string().optional(),
  phone:    z.string().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { role, fullName, phone } = parsed.data;

  const profile = await prisma.profile.upsert({
    where:  { id: user.id },
    update: { role, ...(fullName && { fullName }), ...(phone && { phone }) },
    create: {
      id:       user.id,
      email:    user.email!,
      fullName: fullName ?? user.user_metadata?.full_name ?? "User",
      role,
      phone:    phone ?? null,
    },
  });

  // Auto-create Stylist record if role is STYLIST
  if (role === "STYLIST") {
    await prisma.stylist.upsert({
      where:  { profileId: profile.id },
      update: {},
      create: { profileId: profile.id, specialties: [], yearsExperience: 0 },
    });
  }

  return NextResponse.json({ profile }, { status: 200 });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  return NextResponse.json({ profile });
}
