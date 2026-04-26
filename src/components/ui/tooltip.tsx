"use client";
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils/cn";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip         = TooltipPrimitive.Root;
const TooltipTrigger  = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 px-3 py-1.5 rounded-lg",
        "bg-smoke border border-ash/60 shadow-lg",
        "font-body text-xs text-pearl",
        "animate-scale-in",
        className
      )}
      {...props}
    >
      {props.children}
      <TooltipPrimitive.Arrow className="fill-smoke" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Simple convenience wrapper
interface SimpleTooltipProps {
  content:   React.ReactNode;
  children:  React.ReactNode;
  side?:     "top" | "bottom" | "left" | "right";
  delayMs?:  number;
}
function SimpleTooltip({ content, children, side = "top", delayMs = 400 }: SimpleTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayMs}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, SimpleTooltip };
