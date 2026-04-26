import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { computeAvailableSlots } from "@/lib/utils/slots";
import { parseISO, format } from "date-fns";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const stylistId = searchParams.get("stylistId");
  const dateStr   = searchParams.get("date");
  const duration  = Number(searchParams.get("duration") ?? 60);

  if (!stylistId || !dateStr) {
    return NextResponse.json({ error: "Missing stylistId or date" }, { status: 400 });
  }

  try {
    const date    = parseISO(dateStr);
    const dayName = format(date, "EEEE").toUpperCase() as
      "MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY";

    // 1. Get recurring hours for this day
    const recurring = await prisma.recurringHours.findFirst({
      where: { stylistId, dayOfWeek: dayName, isActive: true },
    });

    // 2. Check for one-off availability slot override
    const oneOff = await prisma.availabilitySlot.findFirst({
      where: { stylistId, date },
    });

    const workStart = oneOff?.startTime ?? recurring?.startTime;
    const workEnd   = oneOff?.endTime   ?? recurring?.endTime;

    if (!workStart || !workEnd) {
      return NextResponse.json({ slots: [] });
    }

    // 3. Get existing bookings for this day
    const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
    const dayEnd   = new Date(date); dayEnd.setHours(23, 59, 59, 999);

    const [bookings, blockedTimes] = await Promise.all([
      prisma.booking.findMany({
        where: {
          stylistId,
          startAt:  { gte: dayStart },
          endAt:    { lte: dayEnd },
          status:   { in: ["PENDING", "CONFIRMED"] },
        },
        select: { startAt: true, endAt: true },
      }),
      prisma.blockedTime.findMany({
        where: {
          stylistId,
          startAt: { gte: dayStart },
          endAt:   { lte: dayEnd },
        },
        select: { startAt: true, endAt: true },
      }),
    ]);

    const slots = computeAvailableSlots({
      date, workStart, workEnd, bookings, blockedTimes, serviceDuration: duration,
    });

    return NextResponse.json({ slots });
  } catch (err) {
    console.error("[availability]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
