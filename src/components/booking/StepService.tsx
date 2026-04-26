"use client";
import { useState, useEffect } from "react";
import { ServiceCard } from "@/components/ui/service-card";
import { Input } from "@/components/ui/input";
import type { Service, ServiceCategory } from "@/types";
import { Search } from "lucide-react";

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  HAIR_CUT: "Hair Cuts", HAIR_COLOR: "Color", BRAIDING: "Braiding",
  NATURAL_HAIR: "Natural Hair", RELAXER: "Relaxer", TREATMENT: "Treatments",
  STYLING: "Styling", BEARD: "Beard", KIDS: "Kids", OTHER: "Other",
};

interface Props {
  selected: Service | null;
  onSelect: (service: Service) => void;
}

export function StepService({ selected, onSelect }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ServiceCategory | "ALL">("ALL");

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.services) setServices(data.services);
      } catch (e) {
        console.error("Failed to load services:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filtered = services.filter(s => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase());
    const matchC = category === "ALL" || s.category === category;
    return matchQ && matchC;
  });

  const categories = ["ALL", ...Array.from(new Set(services.map(s => s.category)))] as Array<ServiceCategory | "ALL">;

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-3xl font-light text-white mb-2">Choose a Service</h2>
        <p className="font-body text-sm text-mist">What would you like done today?</p>
      </div>

      <Input
        placeholder="Search services…"
        icon={<Search className="h-4 w-4" />}
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full font-body text-xs transition-all ${
              category === c
                ? "bg-gold/20 border border-gold/40 text-gold-light"
                : "bg-smoke border border-ash/40 text-silver hover:border-gold/20"
            }`}
          >
            {c === "ALL" ? "All" : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-10 text-mist">Loading services...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-mist">No services found</div>
        ) : (
          filtered.map(s => (
            <ServiceCard
              key={s.id}
              {...s}
              selected={selected?.id === s.id}
              onSelect={() => onSelect(s)}
            />
          ))
        )}
      </div>
    </div>
  );
}