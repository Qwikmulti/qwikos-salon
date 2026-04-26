"use client";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils/cn";
import { format, isBefore, startOfDay } from "date-fns";

interface CalendarPickerProps {
  selected?:      Date | null;
  onSelect?:      (date: Date | null) => void;
  disabledDates?: Date[];
  minDate?:       Date;
  maxDate?:       Date;
  className?:     string;
}

export function CalendarPicker({ selected, onSelect, disabledDates = [], minDate, maxDate, className }: CalendarPickerProps) {
  const today = startOfDay(new Date());

  const isDisabled = (date: Date) => {
    if (isBefore(date, minDate ?? today)) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(d => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
  };

  return (
    <div className={cn("bg-graphite border border-white/[0.06] rounded-2xl p-4 w-fit", className)}>
      <DayPicker
        mode="single"
        selected={selected ?? undefined}
        onSelect={day => onSelect?.(day ?? null)}
        disabled={isDisabled}
        showOutsideDays
        classNames={{
          root:          "font-body",
          months:        "flex gap-4",
          month:         "space-y-3",
          month_caption: "flex items-center justify-between px-1 mb-1",
          caption_label: "font-heading text-base text-white",
          nav:           "flex items-center gap-1",
          button_previous: cn("h-7 w-7 rounded-lg flex items-center justify-center text-mist hover:text-pearl hover:bg-smoke transition-colors"),
          button_next:   cn("h-7 w-7 rounded-lg flex items-center justify-center text-mist hover:text-pearl hover:bg-smoke transition-colors"),
          month_grid:    "w-full border-collapse",
          weekdays:      "flex mb-1",
          weekday:       "w-9 text-center font-body text-2xs tracking-widest uppercase text-mist",
          weeks:         "",
          week:          "flex w-full mt-1",
          day:           "relative p-0 text-center",
          day_button:    cn(
            "h-9 w-9 rounded-lg font-body text-sm transition-all duration-150",
            "hover:bg-smoke hover:text-pearl text-silver",
            "focus:outline-none focus:ring-2 focus:ring-gold",
          ),
          selected:      "[&>button]:!bg-gold [&>button]:!text-obsidian [&>button]:font-medium [&>button]:shadow-gold",
          today:         "[&>button]:text-gold-light [&>button]:font-medium [&>button]:border [&>button]:border-gold/30",
          outside:       "[&>button]:text-ash/40 [&>button]:opacity-50",
          disabled:      "[&>button]:text-ash/30 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent",
          hidden:        "invisible",
        }}
      />
    </div>
  );
}
