"use client";
import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils/cn";

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?:       string;
  description?: string;
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const switchId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const inner = (
      <SwitchPrimitive.Root
        ref={ref}
        id={switchId}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
          "transition-colors duration-200 outline-none",
          "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "bg-ash data-[state=checked]:bg-gold",
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm",
            "transition-transform duration-200",
            "translate-x-0.5 data-[state=checked]:translate-x-[22px]"
          )}
        />
      </SwitchPrimitive.Root>
    );

    if (!label) return inner;

    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <label htmlFor={switchId} className="font-body text-sm text-pearl cursor-pointer">{label}</label>
          {description && <p className="font-body text-xs text-mist">{description}</p>}
        </div>
        {inner}
      </div>
    );
  }
);
Switch.displayName = SwitchPrimitive.Root.displayName;
export { Switch };
