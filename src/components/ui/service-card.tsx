"use client";
import { cn } from "@/lib/utils/cn";
import { Clock, ChevronRight } from "lucide-react";
import { Button } from "./button";
import type { ServiceCategory } from "@/types";

const categoryEmoji: Record<ServiceCategory, string> = {
  HAIR_CUT:     "✂️",
  HAIR_COLOR:   "🎨",
  BRAIDING:     "🫶",
  NATURAL_HAIR: "🌿",
  RELAXER:      "💆",
  TREATMENT:    "✨",
  STYLING:      "💇",
  BEARD:        "🪒",
  KIDS:         "🧒",
  OTHER:        "💅",
};

const categoryLabel: Record<ServiceCategory, string> = {
  HAIR_CUT:     "Hair Cut",
  HAIR_COLOR:   "Color",
  BRAIDING:     "Braiding",
  NATURAL_HAIR: "Natural Hair",
  RELAXER:      "Relaxer",
  TREATMENT:    "Treatment",
  STYLING:      "Styling",
  BEARD:        "Beard",
  KIDS:         "Kids",
  OTHER:        "Other",
};

interface ServiceCardProps {
  id:           string;
  name:         string;
  description?: string | null;
  category:     ServiceCategory;
  durationMin:  number;
  price:        number;
  imageUrl?:    string | null;
  onBook?:      (id: string) => void;
  onView?:      (id: string) => void;
  className?:   string;
  variant?:     "default" | "list";
}

export function ServiceCard({
  id, name, description, category, durationMin, price,
  imageUrl, onBook, onView, className, variant = "default",
}: ServiceCardProps) {
  const emoji = categoryEmoji[category];
  const label = categoryLabel[category];
  const hrs   = Math.floor(durationMin / 60);
  const mins  = durationMin % 60;
  const durStr = hrs > 0 ? `${hrs}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;

  if (variant === "list") {
    return (
      <div className={cn(
        "flex items-center gap-4 px-4 py-3.5 rounded-xl",
        "bg-graphite border border-white/[0.05]",
        "transition-all duration-200 hover:border-gold/20 hover:bg-smoke",
        "cursor-pointer group",
        className
      )}
        onClick={() => onView?.(id)}
      >
        <div className="h-10 w-10 rounded-lg bg-smoke border border-ash/50 flex items-center justify-center text-lg shrink-0">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body text-sm font-medium text-pearl truncate">{name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-body text-xs text-mist uppercase tracking-wide">{label}</span>
            <span className="text-ash">·</span>
            <span className="flex items-center gap-1 font-body text-xs text-mist">
              <Clock className="h-3 w-3" />{durStr}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-display text-lg text-gold-light">
            £{price.toLocaleString()}
          </span>
          <ChevronRight className="h-4 w-4 text-ash group-hover:text-gold transition-colors" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-graphite border border-white/[0.06] rounded-2xl overflow-hidden",
      "transition-all duration-300 hover:-translate-y-1 hover:shadow-gold hover:border-gold/20",
      className
    )}>
      {/* Image or gradient header */}
      <div className="relative h-32 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="h-full bg-gradient-to-br from-obsidian via-smoke to-graphite flex items-center justify-center">
            <div className="absolute inset-0 bg-card-gradient" />
            <span className="text-5xl relative z-10 opacity-40">{emoji}</span>
          </div>
        )}
        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1.5 font-body text-2xs px-2 py-1 rounded-full bg-obsidian/70 backdrop-blur-sm border border-white/10 text-silver uppercase tracking-wider">
            {emoji} {label}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg text-white mb-1">{name}</h3>
        {description && (
          <p className="font-body text-xs text-mist line-clamp-2 mb-3">{description}</p>
        )}

        {/* Duration + Price row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-silver">
            <Clock className="h-3.5 w-3.5 text-mist" />
            <span className="font-body text-sm">{durStr}</span>
          </div>
          <span className="font-display text-2xl font-light text-gold-light">
            £{price.toLocaleString()}
          </span>
        </div>

        {onBook && (
          <Button variant="primary" size="sm" className="w-full" onClick={() => onBook(id)}>
            Book This Service
          </Button>
        )}
      </div>
    </div>
  );
}
