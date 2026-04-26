import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?:    string;
  title:       string;
  subtitle?:   string;
  description?: string;
  actions?:    ReactNode;
  className?:  string;
  size?:       "sm" | "md" | "lg";
}

export function PageHeader({ eyebrow, title, subtitle, description, actions, className, size = "md" }: PageHeaderProps) {
  const sub = subtitle ?? description;
  return (
    <div className={cn("flex items-start justify-between gap-6", className)}>
      <div className="flex flex-col gap-1">
        {eyebrow && (
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold" />
            <span className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-gold">{eyebrow}</span>
          </div>
        )}
        <h1 className={cn("font-heading text-white",
          size === "lg" && "text-4xl",
          size === "md" && "text-3xl",
          size === "sm" && "text-xl",
        )}>{title}</h1>
        {sub && <p className="font-body text-sm text-mist mt-0.5 max-w-lg">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0 mt-1">{actions}</div>}
    </div>
  );
}
