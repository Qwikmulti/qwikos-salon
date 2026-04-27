import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";
import { Button } from "./button";
import Link from "next/link";

interface EmptyStateProps {
  icon?:        ReactNode;
  title:        string;
  description?: string;
  action?:      { label: string; onClick?: () => void; href?: string };
  className?:   string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-6",
      className
    )}>
      {icon && (
        <div className="h-16 w-16 rounded-2xl bg-smoke border border-ash/60 flex items-center justify-center text-3xl mb-5">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-lg text-white mb-2">{title}</h3>
      {description && (
        <p className="font-body text-sm text-mist max-w-xs mb-6">{description}</p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick} asChild={!!action.href}>
          {action.href ? (
            <Link href={action.href}>{action.label}</Link>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}
