"use client";
import { useState } from "react";
import { toast } from "sonner";
import type { CreateBookingInput } from "@/lib/validations/booking";

interface UseBookingResult {
  createBooking: (data: CreateBookingInput) => Promise<boolean>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<boolean>;
  loading:       boolean;
}

export function useBooking(): UseBookingResult {
  const [loading, setLoading] = useState(false);

  const createBooking = async (data: CreateBookingInput): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Booking failed");
      }
      toast.success("Booking confirmed!", {
        description: "Check your email for confirmation details.",
      });
      return true;
    } catch (err) {
      toast.error("Booking failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string, reason?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: "CANCELLED", cancelReason: reason }),
      });
      if (!res.ok) throw new Error("Cancellation failed");
      toast.success("Booking cancelled");
      return true;
    } catch (err) {
      toast.error("Failed to cancel booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, cancelBooking, loading };
}
