/**
 * Core availability computation logic
 * Computes free slots for a stylist on a given date by:
 *   1. Getting their recurring hours for that day
 *   2. Applying one-off availability slots
 *   3. Subtracting existing bookings
 *   4. Subtracting blocked times
 */

export type SlotStatus = "available" | "booked" | "blocked";

export interface TimeSlot {
  time: string;      // "09:00"
  status: SlotStatus;
}

interface Booking {
  startAt: Date;
  endAt:   Date;
}

interface BlockedTime {
  startAt: Date;
  endAt:   Date;
}

function timeToMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minsToTime(m: number): string {
  return `${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`;
}

export function computeAvailableSlots({
  date,
  workStart,
  workEnd,
  bookings,
  blockedTimes,
  serviceDuration,
  intervalMins = 30,
}: {
  date:            Date;
  workStart:       string;   // "09:00"
  workEnd:         string;   // "17:00"
  bookings:        Booking[];
  blockedTimes:    BlockedTime[];
  serviceDuration: number;   // minutes
  intervalMins?:   number;
}): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const start = timeToMins(workStart);
  const end   = timeToMins(workEnd);

  for (let mins = start; mins + serviceDuration <= end; mins += intervalMins) {
    const slotStart = new Date(date);
    slotStart.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + serviceDuration);

    // Check against bookings
    const isBooked = bookings.some(
      b => slotStart < b.endAt && slotEnd > b.startAt
    );
    if (isBooked) { slots.push({ time: minsToTime(mins), status: "booked" }); continue; }

    // Check against blocked times
    const isBlocked = blockedTimes.some(
      b => slotStart < b.endAt && slotEnd > b.startAt
    );
    if (isBlocked) { slots.push({ time: minsToTime(mins), status: "blocked" }); continue; }

    slots.push({ time: minsToTime(mins), status: "available" });
  }

  return slots;
}
