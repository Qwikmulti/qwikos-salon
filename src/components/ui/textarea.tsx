"use client";
import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?:  string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="font-body text-xs font-medium tracking-widest uppercase text-silver">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={cn(
            "w-full bg-graphite border rounded-lg font-body text-sm text-pearl placeholder:text-ash",
            "px-4 py-3 resize-none transition-all duration-200 outline-none",
            "focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,151,59,0.12)]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error ? "border-danger" : "border-ash hover:border-smoke",
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <p className={cn("font-body text-xs", error ? "text-danger-text" : "text-mist")}>{error || hint}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
export { Textarea };
