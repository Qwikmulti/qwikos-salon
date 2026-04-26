import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const active = searchParams.get("active");

  const where: Record<string, unknown> = {};
  
  if (category) where.category = category;
  if (active !== null) where.isActive = active === "true";

  const services = await prisma.service.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ services });
}