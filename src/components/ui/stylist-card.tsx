"use client";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { Star, Scissors, Globe } from "lucide-react";

interface StylistCardProps {
  id:              string;
  name:            string;
  avatarUrl?:      string | null;
  bio?:            string | null;
  specialties:     string[];
  yearsExperience: number;
  rating?:         number;
  reviewCount?:    number;
  totalBookings?:  number;
  isActive?:       boolean;
  instagramHandle?: string;
  onBook?:         (id: string) => void;
  onView?:         (id: string) => void;
  className?:      string;
  variant?:        "default" | "compact";
}

export function StylistCard({
  id, name, avatarUrl, bio, specialties, yearsExperience, rating,
  reviewCount, totalBookings, isActive = true, instagramHandle,
  onBook, onView, className, variant = "default",
}: StylistCardProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-xl bg-graphite border border-white/[0.06]",
          "transition-all duration-200 hover:border-gold/20 hover:bg-smoke cursor-pointer",
          !isActive && "opacity-50",
          className
        )}
        onClick={() => onView?.(id)}
      >
        <Avatar name={name} src={avatarUrl} size="md" status={isActive ? "online" : "offline"} />
        <div className="flex-1 min-w-0">
          <p className="font-body text-sm font-medium text-pearl truncate">{name}</p>
          <p className="font-body text-xs text-mist truncate">{specialties.slice(0, 2).join(" · ")}</p>
        </div>
        {rating && (
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-gold text-gold" />
            <span className="font-mono text-xs text-silver">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-graphite border border-white/[0.06] rounded-2xl overflow-hidden",
      "transition-all duration-300 hover:-translate-y-1 hover:shadow-gold hover:border-gold/20",
      !isActive && "opacity-60",
      className
    )}>
      {/* Cover strip */}
      <div className="relative h-20 bg-gradient-to-br from-obsidian via-smoke to-graphite overflow-hidden">
        <div className="absolute inset-0 bg-card-gradient" />
        <div className="absolute inset-0 noise-overlay" />
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold-gradient opacity-30" />
      </div>

      <div className="px-5 pb-5">
        {/* Avatar — overlaps cover */}
        <div className="flex items-end justify-between -mt-7 mb-3">
          <Avatar
            name={name}
            src={avatarUrl}
            size="lg"
            status={isActive ? "online" : "offline"}
            className="ring-3 ring-graphite"
          />
          {instagramHandle && (
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mist hover:text-gold transition-colors p-1"
              onClick={e => e.stopPropagation()}
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Name + status */}
        <div className="mb-1 flex items-center gap-2">
          <h3 className="font-heading text-lg text-white">{name}</h3>
          {!isActive && <Badge variant="default">Inactive</Badge>}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {specialties.slice(0, 3).map(s => (
            <span
              key={s}
              className="font-body text-2xs px-2 py-0.5 rounded-full bg-smoke border border-ash/50 text-silver uppercase tracking-wide"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bio */}
        {bio && (
          <p className="font-body text-xs text-mist line-clamp-2 mb-4">{bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-ash/20 rounded-xl overflow-hidden mb-4">
          {[
            { label: "Rating",    value: rating ? rating.toFixed(1) : "—",    sub: reviewCount ? `${reviewCount} reviews` : "" },
            { label: "Exp.",      value: `${yearsExperience}y`,                sub: "experience" },
            { label: "Clients",   value: totalBookings ? totalBookings : "—",  sub: "served" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="flex flex-col items-center py-3 bg-smoke gap-0.5">
              <span className="font-display text-xl font-light text-gold-light leading-none">{value}</span>
              <span className="font-body text-2xs uppercase tracking-widest text-mist">{label}</span>
              {sub && <span className="font-body text-2xs text-ash/70">{sub}</span>}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onView && (
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => onView(id)}>
              View Profile
            </Button>
          )}
          {onBook && isActive && (
            <Button variant="primary" size="sm" className="flex-1" onClick={() => onBook(id)}>
              <Scissors className="h-3.5 w-3.5" />
              Book
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
