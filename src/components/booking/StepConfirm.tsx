"use client";
import { useState } from "react";
import { Button }   from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card }     from "@/components/ui/card";
import type { BookingState } from "./BookingWizard";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { addMinutes } from "date-fns";
import { CalendarDays, Clock, Scissors, User, Pencil, CheckCircle2, ArrowLeft } from "lucide-react";

interface Props {
  state:      BookingState;
  loading:    boolean;
  onConfirm:  () => void;
  onBack:     () => void;
  onEdit:     (step: number) => void;
}

export function StepConfirm({ state, loading, onConfirm, onBack, onEdit }: Props) {
  const [notes, setNotes] = useState(state.notes);
  const [agreed, setAgreed] = useState(false);

  if (!state.service || !state.date || !state.time) return null;

  const [h, m] = state.time.split(":").map(Number);
  const startAt = new Date(state.date);
  startAt.setHours(h, m, 0, 0);
  const endAt = addMinutes(startAt, state.service.durationMin);

  const hrs  = Math.floor(state.service.durationMin / 60);
  const mins = state.service.durationMin % 60;
  const dur  = hrs > 0 ? `${hrs}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;

  const details = [
    { icon: Scissors,     label: "Service",  value: state.service.name,  step: 0 },
    { icon: User,         label: "Stylist",  value: state.stylistName ?? "Any available", step: 1 },
    { icon: CalendarDays, label: "Date",     value: formatDate(state.date), step: 2 },
    { icon: Clock,        label: "Time",     value: `${formatTime(startAt)} – ${formatTime(endAt)}`, step: 2 },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="h-9 w-9 rounded-xl border border-ash flex items-center justify-center text-mist hover:text-pearl hover:border-gold/30 transition-all">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="font-display text-3xl font-light text-white leading-tight">Confirm Booking</h2>
          <p className="font-body text-sm text-mist">Review your appointment details</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Left — summary */}
        <div className="space-y-4">
          {/* Details card */}
          <Card variant="elevated">
            <h3 className="font-heading text-lg text-white mb-5">Appointment Summary</h3>
            <div className="space-y-4">
              {details.map(({ icon: Icon, label, value, step }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-xl bg-smoke border border-ash/50 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-mist" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-2xs uppercase tracking-widest text-mist">{label}</p>
                    <p className="font-body text-sm text-pearl font-medium truncate">{value}</p>
                  </div>
                  <button
                    onClick={() => onEdit(step)}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-ash hover:text-gold hover:bg-gold/10 transition-all shrink-0"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card variant="default">
            <Textarea
              label="Special Notes (optional)"
              placeholder="Any allergies, preferences, or requests for your stylist…"
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </Card>
        </div>

        {/* Right — price + CTA */}
        <div className="space-y-4">
          <Card variant="gold">
            <h3 className="font-heading text-lg text-gold-light mb-5">Price Summary</h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between font-body text-sm">
                <span className="text-silver">{state.service.name}</span>
                <span className="text-pearl">£{state.service.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-silver">Duration</span>
                <span className="text-pearl">{dur}</span>
              </div>
              <div className="h-px bg-gold/20" />
              <div className="flex justify-between">
                <span className="font-body text-sm font-medium text-silver">Total</span>
                <span className="font-display text-2xl text-gold-light">£{state.service.price.toLocaleString()}</span>
              </div>
            </div>
            <p className="font-body text-xs text-mist">Payment collected at the salon. No deposit required.</p>
          </Card>

          {/* Policy */}
          <div
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => setAgreed(a => !a)}
          >
            <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              agreed ? "border-gold bg-gold" : "border-ash"
            }`}>
              {agreed && <CheckCircle2 className="h-3.5 w-3.5 text-obsidian" />}
            </div>
            <p className="font-body text-xs text-mist leading-relaxed">
              I understand the <span className="text-gold underline underline-offset-2">cancellation policy</span>: bookings must be cancelled at least 2 hours before the appointment.
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!agreed}
            onClick={() => { state.notes = notes; onConfirm(); }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
