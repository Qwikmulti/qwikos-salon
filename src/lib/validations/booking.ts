import { z } from "zod";

export const createBookingSchema = z.object({
  stylistId: z.string().min(1, "Invalid stylist"),
  serviceId: z.string().min(1, "Invalid service"),
  startAt:   z.string().datetime("Invalid date/time"),
  notes:     z.string().max(500).optional(),
});

export const cancelBookingSchema = z.object({
  bookingId:    z.string().uuid(),
  cancelReason: z.string().max(300).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
