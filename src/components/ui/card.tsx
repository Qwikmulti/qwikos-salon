import { cn } from "@/lib/utils/cn";

type CardVariant = "default" | "elevated" | "gold" | "glass";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { variant?: CardVariant; }

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 relative overflow-hidden",
        variant === "default"  && "bg-graphite border border-white/[0.06] shadow-sm",
        variant === "elevated" && "bg-smoke border border-white/[0.08] shadow-md",
        variant === "gold"     && "bg-card-gradient border border-gold/25 shadow-gold",
        variant === "glass"    && "glass",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-heading text-lg text-white", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}
