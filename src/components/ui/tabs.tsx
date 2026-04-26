"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";

const Tabs      = TabsPrimitive.Root;
const TabsContent = TabsPrimitive.Content;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "pill" | "underline" | "card";
  }
>(({ className, variant = "pill", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex items-center",
      variant === "pill"      && "gap-1 bg-graphite border border-white/[0.06] rounded-xl p-1",
      variant === "underline" && "gap-1 border-b border-ash",
      variant === "card"      && "gap-2",
      className
    )}
    data-variant={variant}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "font-body text-sm font-medium transition-all duration-200 outline-none cursor-pointer",
      "disabled:opacity-40 disabled:cursor-not-allowed",
      // pill variant (default)
      "group-data-[variant=pill]:px-4 group-data-[variant=pill]:py-2 group-data-[variant=pill]:rounded-lg",
      "group-data-[variant=pill]:text-silver",
      "group-data-[variant=pill]:data-[state=active]:bg-smoke group-data-[variant=pill]:data-[state=active]:text-pearl group-data-[variant=pill]:data-[state=active]:shadow-sm",
      // underline variant
      "group-data-[variant=underline]:px-4 group-data-[variant=underline]:py-2.5",
      "group-data-[variant=underline]:text-silver group-data-[variant=underline]:border-b-2 group-data-[variant=underline]:border-transparent",
      "group-data-[variant=underline]:data-[state=active]:text-gold-light group-data-[variant=underline]:data-[state=active]:border-gold",
      // fallback for plain use
      "data-[state=inactive]:text-silver data-[state=active]:text-gold-light",
      "px-4 py-2 rounded-lg",
      "data-[state=active]:bg-gold/10 data-[state=active]:border data-[state=active]:border-gold/25",
      "hover:text-pearl",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
