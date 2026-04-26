import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "gold" | "success" | "warning" | "danger" | "info";

interface BadgeProps { children: React.ReactNode; variant?: BadgeVariant; className?: string; }

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-graphite border-ash text-silver",
  gold:    "bg-gold/10 border-gold/30 text-gold-light",
  success: "bg-success-bg border-success text-success-text",
  warning: "bg-warning-bg border-warning/50 text-warning-text",
  danger:  "bg-danger-bg border-danger text-danger-text",
  info:    "bg-info-bg border-info text-info-text",
};

const dotClasses: Record<BadgeVariant, string> = {
  default: "bg-silver",  gold: "bg-gold-light",    success: "bg-success-text",
  warning: "bg-warning-text", danger: "bg-danger-text", info: "bg-info-text",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-body text-xs font-medium tracking-wide uppercase",
      variantClasses[variant], className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotClasses[variant])} />
      {children}
    </span>
  );
}
