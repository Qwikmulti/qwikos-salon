import { NextRequest, NextResponse } from "next/server";
import { createClient }  from "@/lib/supabase/server";
import { prisma }        from "@/lib/prisma/client";
import { z }             from "zod";

const statusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  // Verify user is admin
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (profile?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = statusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const stylist = await prisma.stylist.update({
    where: { id },
    data: { status: parsed.data.status },
    include: { profile: { select: { fullName: true, email: true } } },
  });

  return NextResponse.json({ stylist });
}
