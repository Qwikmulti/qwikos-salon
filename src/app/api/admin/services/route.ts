import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await prisma.profile.findUnique({ where: { id: user.id } });
  if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, category, durationMin, price, description, isActive, imageUrl, imagePath } = body;

    const service = await prisma.service.create({
      data: {
        name,
        category,
        durationMin: Number(durationMin),
        price: Number(price) * 100,
        description,
        isActive: isActive ?? true,
        imageUrl,
        imagePath
      }
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (err: any) {
    console.error("[admin services POST]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
