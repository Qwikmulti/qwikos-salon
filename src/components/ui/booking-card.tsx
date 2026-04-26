import { cn } from "@/lib/utils/cn";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import type { BookingStatus } from "@/types";
import { formatTime, formatDate } from "@/lib/utils/dates";
import { Calendar, Clock, Scissors } from "lucide-react";

const statusVariant: Record<BookingStatus, "success" | "warning" | "danger" | "default" | "info"> = {
  CONFIRMED:  "success",
  PENDING:    "warning",
  CANCELLED:  "danger",
  COMPLETED:  "info",
  NO_SHOW:    "default",
};

const statusLabel: Record<BookingStatus, string> = {
  CONFIRMED: "Confirmed",
  PENDING:   "Pending",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NO_SHOW:   "No Show",
};

interface BookingCardProps {
  customerName:  string;
  customerAvatar?: string;
  serviceName:   string;
  stylistName:   string;
  startAt:       Date;
  endAt:         Date;
  status:        BookingStatus;
  className?:    string;
  onClick?:      () => void;
}

export function BookingCard({
  customerName, customerAvatar, serviceName, stylistName,
  startAt, endAt, status, className, onClick,
}: BookingCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 px-4 py-3.5 rounded-xl",
        "bg-graphite border border-white/[0.05]",
        "transition-all duration-200",
        onClick && "cursor-pointer hover:border-gold/20 hover:bg-smoke",
        className
      )}
    >
      <Avatar name={customerName} src={customerAvatar} size="md" status="online" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-pearl truncate">{customerName}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 font-body text-xs text-mist">
            <Scissors className="h-3 w-3" /> {serviceName}
          </span>
          <span className="text-ash">·</span>
          <span className="font-body text-xs text-mist truncate">{stylistName}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1 font-mono text-xs text-silver">
          <Clock className="h-3 w-3 text-mist" />
          {formatTime(startAt)}
        </div>
        <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
      </div>
    </div>
  );
}
