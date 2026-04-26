"use client";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import type { TimeSlot } from "@/types";

interface UseAvailableSlotsParams {
  stylistId:       string | null;
  date:            Date | null;
  serviceDuration: number;
}

interface UseAvailableSlotsResult {
  slots:    TimeSlot[];
  loading:  boolean;
  error:    string | null;
  refetch:  () => void;
}

export function useAvailableSlots({
  stylistId, date, serviceDuration,
}: UseAvailableSlotsParams): UseAvailableSlotsResult {
  const [slots,   setSlots]   = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    if (!stylistId || !date) { setSlots([]); return; }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        stylistId,
        date:     format(date, "yyyy-MM-dd"),
        duration: String(serviceDuration),
      });
      const res  = await fetch(`/api/availability?${params}`);
      if (!res.ok) throw new Error("Failed to load availability");
      const data = await res.json();
      setSlots(data.slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [stylistId, date, serviceDuration]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  return { slots, loading, error, refetch: fetchSlots };
}
