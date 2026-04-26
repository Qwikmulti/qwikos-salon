"use client";
import { useState } from "react";
import { ServiceCard } from "@/components/ui/service-card";
import { Input }       from "@/components/ui/input";
import type { Service, ServiceCategory } from "@/types";
import { Search } from "lucide-react";

// Static mock data — replace with real DB fetch via server component
const SERVICES: Service[] = [
  { id:"svc-1",  name:"Precision Cut",        description:"Tailored cut for every face shape and hair type.",         category:"HAIR_CUT",     durationMin:60,  price:8000,  imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"svc-2",  name:"Shape-Up & Lineup",     description:"Clean edges, temple taper, and sharp finish.",            category:"HAIR_CUT",     durationMin:30,  price:4000,  imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"svc-3",  name:"Balayage",              description:"Hand-painted sun-kissed highlights with a natural blend.", category:"HAIR_COLOR",   durationMin:180, price:35000, imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"svc-4",  name:"Full Color",            description:"Vibrant all-over color with professional-grade pigments.", category:"HAIR_COLOR",   durationMin:120, price:25000, imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"svc-5",  name:"Knotless Box Braids",   description:"Feed-in technique, lightweight and scalp-friendly.",      category:"BRAIDING",     durationMin:300, price:30000, imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"svc-6",  name:"Cornrows",              description:"Classic, stitch, or Ghana braids in any pattern.",        category:"BRAIDING",     durationMin:120, price:12000, imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"svc-7",  name:"Wash & Style",          description:"Shampoo, deep conditioning, blow-dry and style.",         category:"NATURAL_HAIR", durationMin:90,  price:10000, imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"svc-8",  name:"Keratin Treatment",     description:"Smoothing treatment for frizz-free hair up to 4 months.",category:"TREATMENT",    durationMin:180, price:45000, imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"svc-9",  name:"Deep Conditioning",     description:"Intensive moisture and protein repair mask.",             category:"TREATMENT",    durationMin:60,  price:8000,  imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
  { id:"svc-10", name:"Beard Shape & Lineup",  description:"Precision beard sculpting and crisp edge definition.",   category:"BEARD",        durationMin:30,  price:5000,  imageUrl:null, isActive:true, createdAt:new Date(), updatedAt:new Date() },
];

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  HAIR_CUT:"Hair Cuts", HAIR_COLOR:"Color", BRAIDING:"Braiding",
  NATURAL_HAIR:"Natural Hair", RELAXER:"Relaxer", TREATMENT:"Treatments",
  STYLING:"Styling", BEARD:"Beard", KIDS:"Kids", OTHER:"Other",
};

interface Props {
  selected:  Service | null;
  onSelect:  (service: Service) => void;
}

export function StepService({ selected, onSelect }: Props) {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState<ServiceCategory | "ALL">("ALL");

  const filtered = SERVICES.filter(s => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase());
    const matchC = category === "ALL" || s.category === category;
    return matchQ && matchC;
  });

  const categories = ["ALL", ...Array.from(new Set(SERVICES.map(s => s.category)))] as Array<ServiceCategory | "ALL">;

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-3xl font-light text-white mb-2">Choose a Service</h2>
        <p className="font-body text-sm text-mist">What would you like done today?</p>
      </div>

      {/* Search */}
      <div className="mb-5">
        <Input placeholder="Search services…" icon={<Search className="h-4 w-4" />} value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`font-body text-xs px-3 py-1.5 rounded-full border transition-all ${
              category === cat
                ? "bg-gold/10 border-gold/30 text-gold-light"
                : "bg-graphite border-ash/50 text-silver hover:border-gold/20 hover:text-pearl"
            }`}
          >
            {cat === "ALL" ? "All Services" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Service list */}
      <div className="flex flex-col gap-3">
        {filtered.map(svc => (
          <div
            key={svc.id}
            onClick={() => onSelect(svc)}
            className={`cursor-pointer rounded-xl border transition-all duration-200 ${
              selected?.id === svc.id
                ? "border-gold/40 bg-gold/5 shadow-gold"
                : "border-transparent hover:border-gold/20"
            }`}
          >
            <ServiceCard {...svc} variant="list" />
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-12 font-body text-sm text-mist">No services found for "{query}"</p>
        )}
      </div>
    </div>
  );
}
