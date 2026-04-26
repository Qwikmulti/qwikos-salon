import { format, parseISO, addMinutes, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";

export const formatDate    = (d: Date | string) => format(typeof d === "string" ? parseISO(d) : d, "MMMM d, yyyy");
export const formatTime    = (d: Date | string) => format(typeof d === "string" ? parseISO(d) : d, "h:mm a");
export const formatDateTime = (d: Date | string) => format(typeof d === "string" ? parseISO(d) : d, "MMM d, yyyy 'at' h:mm a");
export const addMins       = (d: Date, mins: number) => addMinutes(d, mins);
export const dayStart      = (d: Date) => startOfDay(d);
export const dayEnd        = (d: Date) => endOfDay(d);
export const isBeforeNow   = (d: Date) => isBefore(d, new Date());
export const isAfterNow    = (d: Date) => isAfter(d, new Date());

/** Generate 30-min time slots between start and end */
export function generateTimeSlots(start: string, end: string, intervalMins = 30): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let current = sh * 60 + sm;
  const endMins = eh * 60 + em;
  while (current < endMins) {
    const h = Math.floor(current / 60).toString().padStart(2, "0");
    const m = (current % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    current += intervalMins;
  }
  return slots;
}
