import { cn } from "@/lib/utils/cn";
import { Card } from "./card";

interface StatCardProps {
  label:      string;
  value:      string | number;
  change?:    number;
  icon:       React.ReactNode;
  accent?:    boolean;
  className?: string;
}

export function StatCard({ label, value, change, icon, accent, className }: StatCardProps) {
  return (
    <Card variant={accent ? "gold" : "default"} className={cn("", className)}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-body text-xs font-medium tracking-widest uppercase text-mist">{label}</span>
          <span className={cn(
            "font-display text-4xl font-light leading-none",
            accent ? "text-gold-light" : "text-white"
          )}>
            {value}
          </span>
          {change !== undefined && (
            <span className={cn(
              "font-body text-xs flex items-center gap-1",
              change > 0 ? "text-success-text" : change < 0 ? "text-danger-text" : "text-mist"
            )}>
              {change > 0 ? "↑" : change < 0 ? "↓" : "—"}
              {change !== 0 ? `${Math.abs(change)}% this month` : "No change"}
            </span>
          )}
        </div>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center text-lg shrink-0",
          accent ? "bg-gold/15" : "bg-smoke"
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
