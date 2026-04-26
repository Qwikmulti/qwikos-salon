import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils/cn";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type PresenceStatus = "online" | "away" | "offline" | "busy";

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-2xs",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

const statusSizes: Record<AvatarSize, string> = {
  xs: "h-1.5 w-1.5 bottom-0 right-0",
  sm: "h-2   w-2   bottom-0 right-0",
  md: "h-2.5 w-2.5 bottom-0.5 right-0.5",
  lg: "h-3   w-3   bottom-0.5 right-0.5",
  xl: "h-4   w-4   bottom-1   right-1",
};

const statusColors: Record<PresenceStatus, string> = {
  online:  "bg-success-text",
  away:    "bg-warning-text",
  offline: "bg-ash",
  busy:    "bg-danger-text",
};

interface AvatarProps {
  src?:      string;
  name?:     string;
  size?:     AvatarSize;
  status?:   PresenceStatus;
  className?: string;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export function Avatar({ src, name, size = "md", status, className }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <AvatarPrimitive.Root className={cn("rounded-full overflow-hidden border-2 border-ash", sizeClasses[size])}>
        {src && (
          <AvatarPrimitive.Image src={src} alt={name ?? "avatar"} className="h-full w-full object-cover" />
        )}
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center bg-gold-gradient font-body font-semibold text-obsidian"
        >
          {getInitials(name)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {status && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-charcoal",
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}

// Avatar group — stacked avatars
interface AvatarGroupProps {
  users:   Array<{ src?: string; name?: string }>;
  max?:    number;
  size?:   AvatarSize;
  className?: string;
}

export function AvatarGroup({ users, max = 4, size = "sm", className }: AvatarGroupProps) {
  const visible   = users.slice(0, max);
  const remainder = users.length - max;
  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((u, i) => (
        <Avatar key={i} src={u.src} name={u.name} size={size} className="ring-2 ring-charcoal" />
      ))}
      {remainder > 0 && (
        <div className={cn(
          "rounded-full border-2 border-ash bg-smoke flex items-center justify-center font-body font-medium text-silver ring-2 ring-charcoal",
          sizeClasses[size]
        )}>
          +{remainder}
        </div>
      )}
    </div>
  );
}
