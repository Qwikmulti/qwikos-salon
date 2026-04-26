import { cn } from "@/lib/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "circle" | "rect";
}

export function Skeleton({ className, variant = "rect", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-smoke via-ash/20 to-smoke bg-[length:200%_100%]",
        "[background-position:200%_0] animate-[shimmer_1.5s_ease-in-out_infinite]",
        variant === "circle" && "rounded-full",
        variant === "line"   && "rounded-full h-4",
        variant === "rect"   && "rounded-lg",
        className
      )}
      style={{ backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite" }}
      {...props}
    />
  );
}

// Compound skeletons for common patterns
export function SkeletonCard() {
  return (
    <div className="bg-graphite border border-white/[0.06] rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="line" className="w-1/2 h-3.5" />
          <Skeleton variant="line" className="w-1/3 h-3" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton variant="line" className="w-20 h-8" />
        <Skeleton variant="line" className="w-20 h-8" />
      </div>
    </div>
  );
}

export function SkeletonBookingRow() {
  return (
    <div className="flex items-center gap-3 p-4 bg-graphite rounded-xl border border-white/[0.05]">
      <Skeleton variant="circle" className="h-11 w-11 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="line" className="w-40 h-3.5" />
        <Skeleton variant="line" className="w-56 h-3" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton variant="line" className="w-16 h-3" />
        <Skeleton variant="line" className="w-20 h-5 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonStylistCard() {
  return (
    <div className="bg-graphite border border-white/[0.06] rounded-2xl overflow-hidden">
      <Skeleton className="h-24 w-full rounded-none" />
      <div className="p-5 space-y-3 -mt-6">
        <Skeleton variant="circle" className="h-14 w-14" />
        <Skeleton variant="line" className="w-36 h-4" />
        <Skeleton variant="line" className="w-48 h-3" />
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-graphite border border-white/[0.06] rounded-2xl p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <Skeleton variant="line" className="w-24 h-3" />
          <Skeleton variant="line" className="w-20 h-8" />
          <Skeleton variant="line" className="w-28 h-3" />
        </div>
        <Skeleton variant="rect" className="h-10 w-10" />
      </div>
    </div>
  );
}
