"use client";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const Select        = SelectPrimitive.Root;
const SelectGroup   = SelectPrimitive.Group;
const SelectValue   = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { error?: boolean }
>(({ className, children, error, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between gap-2",
      "bg-graphite border rounded-lg px-4 py-2.5",
      "font-body text-sm text-pearl placeholder:text-ash",
      "transition-all duration-200 outline-none cursor-pointer",
      "focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,151,59,0.12)]",
      "data-[placeholder]:text-ash",
      "disabled:opacity-40 disabled:cursor-not-allowed",
      error ? "border-danger" : "border-ash hover:border-smoke",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-mist shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={6}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden",
        "bg-smoke border border-ash/60 rounded-xl shadow-lg",
        "data-[state=open]:animate-scale-in",
        position === "popper" && "w-[var(--radix-select-trigger-width)]",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 font-body text-xs font-medium tracking-widest uppercase text-mist", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer",
      "font-body text-sm text-silver select-none outline-none",
      "transition-colors duration-150",
      "focus:bg-graphite focus:text-pearl",
      "data-[state=checked]:text-gold-light",
      "data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="ml-auto">
      <Check className="h-3.5 w-3.5 text-gold" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("my-1 h-px bg-ash/40", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// Wrapper with label + error
interface SelectFieldProps {
  label?:       string;
  error?:       string;
  hint?:        string;
  children:     React.ReactNode;
  className?:   string;
}
function SelectField({ label, error, hint, children, className }: SelectFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && <label className="font-body text-xs font-medium tracking-widest uppercase text-silver">{label}</label>}
      {children}
      {(error || hint) && (
        <p className={cn("font-body text-xs", error ? "text-danger-text" : "text-mist")}>{error || hint}</p>
      )}
    </div>
  );
}

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectField };
