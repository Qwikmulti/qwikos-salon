import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";
import { sendBookingCancellation } from "@/lib/email";

const updateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
  cancelReason: z.string().optional(),
  notes: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      stylist: { include: { profile: true } },
      service: true,
      customer: true,
      review: true,
    },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

   const isCustomer = profile.role === "CUSTOMER" && booking.customerId === user.id;
   const isStylist = profile.role === "STYLIST" && booking.stylistId === profile.id; // profile.id is the profileId for stylist
   const isAdmin = profile.role === "ADMIN";

   if (!isCustomer && !isStylist && !isAdmin) {
     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
   }

  return NextResponse.json({ booking });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { status, cancelReason, notes } = parsed.data;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { stylist: { include: { profile: true } }, customer: true },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

   const isCustomer = profile.role === "CUSTOMER" && booking.customerId === user.id;
   const isStylist = profile.role === "STYLIST" && booking.stylistId === profile.id;
   const isAdmin = profile.role === "ADMIN";

  if (!isCustomer && !isStylist && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (isCustomer && status === "CANCELLED") {
    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED", cancelledAt: new Date(), cancelReason: cancelReason ?? null },
      include: { stylist: { include: { profile: true } }, service: true, customer: true },
    });

    sendBookingCancellation({
      customerEmail: updated.customer.email,
      customerName: updated.customer.fullName,
      stylistName: updated.stylist.profile.fullName,
      serviceName: updated.service.name,
      startAt: updated.startAt,
      endAt: updated.endAt,
      price: Number(updated.service.price),
      bookingId: updated.id,
      reason: cancelReason,
    }).catch(console.error);

    return NextResponse.json({ booking: updated });
  }

  if (isStylist || isAdmin || (status && ["CONFIRMED", "PENDING", "COMPLETED", "NO_SHOW"].includes(status))) {
    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (cancelReason) data.cancelReason = cancelReason;
    if (notes !== undefined) data.notes = notes;
    if (status === "CANCELLED") data.cancelledAt = new Date();

    const updated = await prisma.booking.update({
      where: { id },
      data,
      include: { stylist: { include: { profile: true } }, service: true, customer: true },
    });
    return NextResponse.json({ booking: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile || profile.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.booking.delete({ where: { id } }).catch(() => {});

  return NextResponse.json({ success: true });
}