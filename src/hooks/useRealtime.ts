"use client";
import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UseRealtimeBookingsParams {
  stylistId: string;
  onUpdate:  () => void;
}

/** Subscribes to real-time booking changes for a stylist.
 *  Calls onUpdate() whenever a booking is inserted/updated/deleted. */
export function useRealtimeBookings({ stylistId, onUpdate }: UseRealtimeBookingsParams) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel  = supabase
      .channel(`bookings:${stylistId}`)
      .on(
        "postgres_changes",
        {
          event:  "*",
          schema: "public",
          table:  "bookings",
          filter: `stylist_id=eq.${stylistId}`,
        },
        () => onUpdate()
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [stylistId, onUpdate]);
}
