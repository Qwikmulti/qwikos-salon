"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "@/components/ui/step-indicator";
import { useBooking } from "@/hooks/useBooking";
import type { Service, ServiceCategory } from "@/types";

// Steps
import { StepService }  from "./StepService";
import { StepStylist }  from "./StepStylist";
import { StepDateTime } from "./StepDateTime";
import { StepConfirm }  from "./StepConfirm";

export interface BookingState {
  service:   (Service & { stylistId?: string }) | null;
  stylistId: string | null;
  stylistName: string | null;
  date:      Date | null;
  time:      string | null;      // "09:30"
  notes:     string;
}

const STEPS = [
  { label: "Service",  description: "Choose what you need" },
  { label: "Stylist",  description: "Pick your expert"     },
  { label: "Schedule", description: "Date & time"          },
  { label: "Confirm",  description: "Review & book"        },
];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center:               ({ opacity: 1, x: 0 }),
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export function BookingWizard({ initialServiceId, initialStylistId }: { initialServiceId?: string, initialStylistId?: string }) {
  const router = useRouter();
  const { createBooking, loading: bookingLoading } = useBooking();

  const [step,      setStep]      = useState(0);
  const [direction, setDirection] = useState(1);
  const [state,     setState]     = useState<BookingState>({
    service: null, stylistId: initialStylistId || null, stylistName: null,
    date: null, time: null, notes: "",
  });

  const go = useCallback((nextStep: number) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  }, [step]);

  const next = () => go(step + 1);
  const back = () => go(step - 1);

  const patch = (updates: Partial<BookingState>) =>
    setState(s => ({ ...s, ...updates }));

  const handleConfirm = async () => {
    if (!state.service || !state.stylistId || !state.date || !state.time) return;

    const [h, m] = state.time.split(":").map(Number);
    const startAt = new Date(state.date);
    startAt.setHours(h, m, 0, 0);

    const ok = await createBooking({
      serviceId: state.service.id,
      stylistId: state.stylistId,
      startAt:   startAt.toISOString(),
      notes:     state.notes || undefined,
    });

    if (ok) router.push("/customer/bookings?booked=1");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Step indicator */}
      <div className="mb-12">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      {/* Animated step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 && (
            <StepService
              selected={state.service}
              initialServiceId={initialServiceId}
              onSelect={service => { patch({ service, date: null, time: null }); next(); }}
            />
          )}
          {step === 1 && (
            <StepStylist
              serviceId={state.service?.id ?? ""}
              selected={state.stylistId}
              onSelect={(id, name) => { patch({ stylistId: id, stylistName: name, date: null, time: null }); next(); }}
              onBack={back}
            />
          )}
          {step === 2 && (
            <StepDateTime
              stylistId={state.stylistId ?? ""}
              serviceDuration={state.service?.durationMin ?? 60}
              selectedDate={state.date}
              selectedTime={state.time}
              onSelect={(date, time) => { patch({ date, time }); next(); }}
              onBack={back}
            />
          )}
          {step === 3 && (
            <StepConfirm
              state={state}
              loading={bookingLoading}
              onConfirm={handleConfirm}
              onBack={back}
              onEdit={go}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
