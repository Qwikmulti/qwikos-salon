import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const recurringHoursSchema = z.object({
  dayOfWeek: z.enum(["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]),
  startTime: z.string().regex(timeRegex, "Use HH:MM format"),
  endTime:   z.string().regex(timeRegex, "Use HH:MM format"),
  isActive:  z.boolean().default(true),
});

export const blockTimeSchema = z.object({
  startAt: z.string().datetime(),
  endAt:   z.string().datetime(),
  reason:  z.string().max(200).optional(),
});

export type RecurringHoursInput = z.infer<typeof recurringHoursSchema>;
export type BlockTimeInput      = z.infer<typeof blockTimeSchema>;
