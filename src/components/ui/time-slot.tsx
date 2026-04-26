"use client";
import { cn } from "@/lib/utils/cn";
import type { SlotStatus } from "@/types";

interface TimeSlotProps {
  time:       string;
  status:     SlotStatus;
  selected?:  boolean;
  onSelect?:  (time: string) => void;
}

const statusConfig: Record<SlotStatus, { container: string; label?: string; interactive: boolean }> = {
  available: {
    container:   "bg-graphite border-ash text-pearl cursor-pointer hover:border-gold/40 hover:bg-smoke",
    interactive: true,
  },
  selected: {
    container:   "bg-gold/15 border-gold text-gold-light cursor-pointer shadow-[0_0_0_3px_rgba(201,151,59,0.15)]",
    interactive: true,
  },
  booked: {
    container:   "bg-danger-bg/60 border-danger/40 text-mist cursor-not-allowed",
    label:       "Booked",
    interactive: false,
  },
  blocked: {
    container:   "bg-smoke/40 border-transparent text-ash/60 cursor-not-allowed",
    label:       "Blocked",
    interactive: false,
  },
};

export function TimeSlot({ time, status, selected, onSelect }: TimeSlotProps) {
  const cfg       = statusConfig[selected ? "selected" : status];
  const isActive  = status === "available";

  // Format time for display: "09:00" → "9:00 AM"
  const [h, m]    = time.split(":").map(Number);
  const period    = h >= 12 ? "PM" : "AM";
  const display   = `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${m.toString().padStart(2, "0")}`;

  return (
    <button
      type="button"
      disabled={!isActive}
      onClick={() => isActive && onSelect?.(time)}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border px-2 py-2 transition-all duration-150",
        "font-mono text-xs",
        cfg.container
      )}
    >
      <span className="font-medium">{display}</span>
      <span className="text-[10px] opacity-70">{cfg.label ?? period}</span>
    </button>
  );
}

// Full slot grid
interface TimeSlotGridProps {
  slots:       Array<{ time: string; status: SlotStatus }>;
  selected?:   string | null;
  onSelect?:   (time: string) => void;
  className?:  string;
}

export function TimeSlotGrid({ slots, selected, onSelect, className }: TimeSlotGridProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-12 text-mist font-body text-sm">
        No availability for this date
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2", className)}>
      {slots.map(slot => (
        <TimeSlot
          key={slot.time}
          time={slot.time}
          status={slot.status}
          selected={selected === slot.time}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

// Legend for the slot grid
export function SlotLegend() {
  const items: Array<{ status: SlotStatus; label: string }> = [
    { status: "available", label: "Available" },
    { status: "selected",  label: "Selected"  },
    { status: "booked",    label: "Booked"    },
    { status: "blocked",   label: "Blocked"   },
  ];
  return (
    <div className="flex flex-wrap gap-4">
      {items.map(({ status, label }) => {
        const cfg = statusConfig[status];
        return (
          <div key={status} className="flex items-center gap-2">
            <div className={cn("h-4 w-7 rounded border", cfg.container, "pointer-events-none")} />
            <span className="font-body text-xs text-silver">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
