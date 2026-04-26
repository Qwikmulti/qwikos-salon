import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { createBookingSchema } from "@/lib/validations/booking";
import { sendBookingConfirmation, sendStylistNotification } from "@/lib/email";
import { addMinutes } from "date-fns";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  const profile = await prisma.profile.findUnique({ 
    where: { id: user.id },
    include: { stylist: true }
  });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const where: Record<string, unknown> = {};

  if (profile.role === "CUSTOMER") {
    where.customerId = user.id;
  } else if (profile.role === "STYLIST" && profile.stylist) {
    where.stylistId = profile.stylist.id;
  }

  if (status) {
    where.status = status;
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        stylist: { include: { profile: { select: { fullName: true, avatarUrl: true } } } },
        service: true,
        customer: { select: { fullName: true, email: true } },
      },
      orderBy: { startAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({ bookings, total, page, limit });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { stylistId, serviceId, startAt: startAtStr, notes } = parsed.data;
  const startAt = new Date(startAtStr);

  try {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const endAt = addMinutes(startAt, service.durationMin);

    // Conflict check — prevent double booking
    const conflict = await prisma.booking.findFirst({
      where: {
        stylistId,
        status: { in: ["PENDING", "CONFIRMED"] },
        AND: [{ startAt: { lt: endAt } }, { endAt: { gt: startAt } }],
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "This time slot is no longer available" }, { status: 409 });
    }

    // Get or create customer profile
    const profile = await prisma.profile.upsert({
      where:  { id: user.id },
      update: {},
      create: { id: user.id, email: user.email!, fullName: user.user_metadata?.full_name ?? "Customer" },
    });

    const booking = await prisma.booking.create({
      data: { customerId: profile.id, stylistId, serviceId, startAt, endAt, notes, status: "PENDING" },
      include: { stylist: { include: { profile: true } }, service: true, customer: true },
    });

    sendBookingConfirmation({
      customerEmail: profile.email,
      customerName: profile.fullName,
      stylistName: booking.stylist.profile.fullName,
      serviceName: booking.service.name,
      startAt: booking.startAt,
      endAt: booking.endAt,
      price: Number(booking.service.price),
      bookingId: booking.id,
    }).catch(console.error);

    sendStylistNotification({
      customerEmail: booking.stylist.profile.email,
      customerName: profile.fullName,
      stylistName: booking.stylist.profile.fullName,
      serviceName: booking.service.name,
      startAt: booking.startAt,
      endAt: booking.endAt,
      price: Number(booking.service.price),
      bookingId: booking.id,
    }).catch(console.error);

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error("[bookings POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
