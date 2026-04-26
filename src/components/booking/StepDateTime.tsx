"use client";
import { useState } from "react";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import { TimeSlotGrid, SlotLegend } from "@/components/ui/time-slot";
import { Button }   from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { formatDate } from "@/lib/utils/dates";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { addDays } from "date-fns";

interface Props {
  stylistId:       string;
  serviceDuration: number;
  selectedDate:    Date | null;
  selectedTime:    string | null;
  onSelect:        (date: Date, time: string) => void;
  onBack:          () => void;
}

export function StepDateTime({ stylistId, serviceDuration, selectedDate, selectedTime, onSelect, onBack }: Props) {
  const [date, setDate] = useState<Date | null>(selectedDate);
  const [time, setTime] = useState<string | null>(selectedTime);

  const { slots, loading, error } = useAvailableSlots({
    stylistId: stylistId === "any" ? null : stylistId,
    date,
    serviceDuration,
  });

  const canContinue = !!date && !!time;

  const handleNext = () => {
    if (date && time) onSelect(date, time);
  };

  const handleDateSelect = (d: Date | null) => {
    setDate(d);
    setTime(null); // reset time when date changes
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="h-9 w-9 rounded-xl border border-ash flex items-center justify-center text-mist hover:text-pearl hover:border-gold/30 transition-all">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="font-display text-3xl font-light text-white leading-tight">Pick a Date & Time</h2>
          <p className="font-body text-sm text-mist">Choose when works best for you</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[auto_1fr] gap-8">
        {/* Calendar */}
        <div>
          <CalendarPicker
            selected={date}
            onSelect={handleDateSelect}
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
          />
        </div>

        {/* Time slots */}
        <div>
          {!date ? (
            <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-ash/40 gap-3">
              <Calendar className="h-8 w-8 text-ash" />
              <p className="font-body text-sm text-mist">Select a date to see available times</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-lg text-white">{formatDate(date)}</h3>
                  <p className="font-body text-xs text-mist">{slots.filter(s => s.status === "available").length} slots available</p>
                </div>
                {time && (
                  <span className="font-mono text-sm px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/25 text-gold-light">
                    {(() => { const [h,m]=time.split(":").map(Number); const p=h>=12?"PM":"AM"; return `${h===0?12:h>12?h-12:h}:${m.toString().padStart(2,"0")} ${p}`; })()}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <SlotLegend />
              </div>

              {loading ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {Array.from({length:16}).map((_,i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
                </div>
              ) : error ? (
                <div className="text-center py-10 text-danger-text font-body text-sm">
                  Failed to load availability. Please try again.
                </div>
              ) : (
                <TimeSlotGrid
                  slots={slots}
                  selected={time}
                  onSelect={setTime}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer nav */}
      <div className="mt-10 flex justify-end">
        <Button size="lg" disabled={!canContinue} onClick={handleNext}>
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
