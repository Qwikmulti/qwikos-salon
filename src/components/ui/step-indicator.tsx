import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

interface Step {
  label:       string;
  description?: string;
}

interface StepIndicatorProps {
  steps:      Step[];
  current:    number;   // 0-indexed
  className?: string;
}

export function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center w-full", className)}>
      {steps.map((step, idx) => {
        const done   = idx < current;
        const active = idx === current;
        const last   = idx === steps.length - 1;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-body text-sm font-medium",
                done   && "bg-gold border-gold text-obsidian",
                active && "bg-transparent border-gold text-gold shadow-[0_0_0_4px_rgba(201,151,59,0.15)]",
                !done && !active && "bg-transparent border-ash text-ash",
              )}>
                {done ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <div className="text-center">
                <p className={cn(
                  "font-body text-xs font-medium whitespace-nowrap",
                  active ? "text-pearl" : done ? "text-silver" : "text-ash"
                )}>{step.label}</p>
                {step.description && (
                  <p className="font-body text-2xs text-mist hidden sm:block">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector line */}
            {!last && (
              <div className={cn(
                "h-px flex-1 mx-3 mt-[-18px] transition-all duration-500",
                idx < current ? "bg-gold" : "bg-ash/40"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
