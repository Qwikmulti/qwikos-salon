"use client";
import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  hint?:     string;
  error?:    string;
  icon?:     React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, icon, iconRight, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-xs font-medium tracking-widest uppercase text-silver peer-focus:text-gold-light transition-colors"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ash group-focus-within:text-gold transition-colors pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-graphite border rounded-lg font-body text-sm text-pearl placeholder:text-ash",
              "transition-all duration-200 outline-none",
              "focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,151,59,0.12)]",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              error ? "border-danger" : "border-ash hover:border-smoke",
              icon       ? "pl-10 pr-4 py-2.5" : "px-4 py-2.5",
              iconRight  ? "pr-10" : "",
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ash group-focus-within:text-gold transition-colors pointer-events-none">
              {iconRight}
            </span>
          )}
        </div>
        {(error || hint) && (
          <p className={cn("font-body text-xs", error ? "text-danger-text" : "text-mist")}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
export { Input };
