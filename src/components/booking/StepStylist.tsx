"use client";
import { useState, useEffect } from "react";
import { StylistCard } from "@/components/ui/stylist-card";
import { Button }      from "@/components/ui/button";
import { SkeletonStylistCard } from "@/components/ui/skeleton";
import { ArrowLeft }   from "lucide-react";

interface StylistData {
  id: string;
  profile: { fullName: string; avatarUrl: string | null };
  bio: string | null;
  specialties: string[];
  yearsExperience: number;
  isActive: boolean;
}

interface Props {
  serviceId: string;
  selected:  string | null;
  onSelect:  (id: string, name: string) => void;
  onBack:    () => void;
}

export function StepStylist({ serviceId, selected, onSelect, onBack }: Props) {
  const [stylists, setStylists] = useState<StylistData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStylists() {
      setLoading(true);
      try {
        const res = await fetch(`/api/stylists?serviceId=${serviceId}`);
        const data = await res.json();
        if (data.stylists) setStylists(data.stylists);
      } catch (e) {
        console.error("Failed to load stylists:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStylists();
  }, [serviceId]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="h-9 w-9 rounded-xl border border-ash flex items-center justify-center text-mist hover:text-pearl hover:border-gold/30 transition-all">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="font-display text-3xl font-light text-white leading-tight">Choose a Stylist</h2>
          <p className="font-body text-sm text-mist">All stylists below offer this service</p>
        </div>
      </div>

      {/* "Any stylist" option */}
      <div
        onClick={() => onSelect("any", "Any Available Stylist")}
        className={`flex items-center gap-4 p-4 rounded-xl border mb-6 cursor-pointer transition-all duration-200 ${
          selected === "any"
            ? "border-gold/40 bg-gold/5 shadow-gold"
            : "border-ash/40 bg-graphite hover:border-gold/20"
        }`}
      >
        <div className="h-11 w-11 rounded-xl bg-smoke border border-ash flex items-center justify-center text-2xl shrink-0">✨</div>
        <div className="flex-1">
          <p className="font-body text-sm font-medium text-pearl">Any Available Stylist</p>
          <p className="font-body text-xs text-mist">Match me with whoever's free at my chosen time</p>
        </div>
        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${selected === "any" ? "border-gold bg-gold" : "border-ash"}`}>
          {selected === "any" && <div className="h-2 w-2 rounded-full bg-obsidian" />}
        </div>
      </div>

      {/* Stylist grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {[1,2,3].map(i => <SkeletonStylistCard key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {stylists.map(s => (
            <div
              key={s.id}
              className={`cursor-pointer rounded-2xl transition-all duration-200 ${
                selected === s.id ? "ring-2 ring-gold ring-offset-2 ring-offset-charcoal" : ""
              }`}
              onClick={() => onSelect(s.id, s.profile.fullName)}
            >
              <StylistCard
                id={s.id}
                name={s.profile.fullName}
                bio={s.bio ?? undefined}
                specialties={s.specialties}
                yearsExperience={s.yearsExperience}
                isActive={s.isActive}
                avatarUrl={s.profile.avatarUrl}
                onBook={id => onSelect(id, s.profile.fullName)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
